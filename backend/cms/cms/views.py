from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import JsonResponse
from .models import CustomUser, Category, Tag, Post, Comment, Notification
from .serializers import CustomUserSerializer, CategorySerializer, TagSerializer, PostSerializer, CommentSerializer, NotificationSerializer
from .permissions.permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly, DynamicJwtPermission
from .pagination import StandardResultsSetPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q, Sum, Count
from django.middleware import csrf
from django.conf import settings
from django.utils import timezone

# Custom Token Obtain Pair View
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            csrf.get_token(request)
            response.set_cookie(
                response.data['access'],
                'access_token',
                # access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax' if settings.DEBUG else 'Strict',
                max_age=3600  # 1 hour
            )
            response.set_cookie(
                'refresh_token',
                response.data['refresh'],
                httponly=True,
                samesite='Lax'
            )
            return JsonResponse({"message": "Login successful"}, status=200)
        return response
    
# Custom Token Refresh View
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'No refresh token found'}, status=status.HTTP_400_BAD_REQUEST)

        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        access_token = response.data.get('access')
        if access_token:
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=3600
            )
        response.data = {'detail': 'Token refresh successful'}
        return response

# Check if user is authenticated
@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    if request.user.is_authenticated:
        return Response({'is_authenticated': True, 'username': request.user.username})
    return Response({'is_authenticated': False}, status=status.HTTP_200_OK)

# Custom User ViewSet for User Management
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [DynamicJwtPermission]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        fields = ['username', 'first_name', 'last_name', 'bio', 'website', 'location', 'profile_picture'] \
            if not request.user.is_authenticated else None
        serializer = self.get_serializer(instance, fields=fields)
        return Response(serializer.data)

# Logout View
@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    response = Response({'detail': 'Successfully logged out.'})
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [DynamicJwtPermission]

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        method='get',
        operation_description="Get all subcategories for a given category",
        responses={200: CategorySerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def subcategories(self, request, pk=None):
        category = self.get_object()
        subcategories = category.subcategories.all()
        serializer = self.get_serializer(subcategories, many=True)
        return Response(serializer.data)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('id')
    serializer_class = TagSerializer
    permission_classes = [DynamicJwtPermission]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        method='get',
        operation_description="Get most used tags",
        manual_parameters=[openapi.Parameter('limit', openapi.IN_QUERY, description="Number of tags to retrieve", type=openapi.TYPE_INTEGER)],
        responses={200: TagSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def most_used(self, request):
        limit = int(request.query_params.get('limit', 10))
        tags = Tag.objects.annotate(post_count=Count('posts')).order_by('-post_count')[:limit]
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)
    
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [DynamicJwtPermission, IsAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'tags', 'publication_date', 'author']
    search_fields = ['title', 'content']
    ordering_fields = ['view_count', 'created_at', 'upvotes']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        tag = self.request.query_params.get('tag')
        search = self.request.query_params.get('search')
        is_public = self.request.query_params.get('is_public')

        if category:
            queryset = queryset.filter(category__slug=category)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(content__icontains=search))
        if is_public is not None:
            queryset = queryset.filter(is_public=is_public)

        if self.request.user.is_authenticated:
            if self.request.user.is_author:
                return queryset.filter(Q(is_public=True) | Q(author=self.request.user))
        return queryset.filter(is_public=True)

    @swagger_auto_schema(
        method='post',
        operation_description="Upvote a post",
        responses={200: openapi.Response('Upvote successful'), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        post = self.get_object()
        post.upvotes += 1
        post.save()
        return Response({'status': 'Post upvoted successfully'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        operation_description="Downvote a post",
        responses={200: openapi.Response('Downvote successful'), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        post = self.get_object()
        post.downvotes += 1
        post.save()
        return Response({'status': 'Post downvoted successfully'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='get',
        operation_description="List the most viewed posts",
        manual_parameters=[openapi.Parameter('limit', openapi.IN_QUERY, description="Number of posts to retrieve", type=openapi.TYPE_INTEGER)],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='most-viewed')
    def most_viewed(self, request):
        limit = request.query_params.get('limit', 10)
        most_viewed = self.get_queryset().order_by('-view_count')[:int(limit)]
        serializer = self.get_serializer(most_viewed, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Increment post view count.",
        responses={200: PostSerializer()}
    )
    @action(detail=True, methods=['get'])
    def view(self, request, pk=None):
        post = self.get_object()
        post.view_count += 1
        post.save()
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get featured posts based on upvotes or view count.",
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def featured(self, request):
        queryset = Post.objects.filter(status='published').order_by('-upvotes', '-view_count')[:5]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Check if a post slug is unique.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={'slug': openapi.Schema(type=openapi.TYPE_STRING)},
            required=['slug']
        ),
        responses={200: 'Slug is available', 400: 'Slug already exists'}
    )
    @action(detail=False, methods=['post'])
    def check_slug(self, request):
        slug = request.data.get('slug')
        if Post.objects.filter(slug=slug).exists():
            return Response({'detail': 'Slug already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Slug is available'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        operation_description="Get analytics data for posts.",
        responses={200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'total_posts': openapi.Schema(type=openapi.TYPE_INTEGER), 'total_views': openapi.Schema(type=openapi.TYPE_INTEGER)})}
    )
    @action(detail=False, methods=['post'])
    def analytics(self, request):
        total_posts = Post.objects.count()
        total_views = Post.objects.aggregate(Sum('view_count'))['view_count__sum'] or 0
        return Response({'total_posts': total_posts, 'total_views': total_views}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='get',
        operation_description="Get posts by category",
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description="Category slug", type=openapi.TYPE_STRING),
            openapi.Parameter('category', openapi.IN_QUERY, description="Category ID or slug", type=openapi.TYPE_STRING),
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-category')
    def posts_by_category(self, request):
        category_slug = request.query_params.get('slug') or request.query_params.get('category')
        if not category_slug:
            return Response({'error': 'Category slug or ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # First, try to filter by slug
            posts = self.get_queryset().filter(category__slug=category_slug)
            if not posts.exists():
                # If no posts found, try to filter by ID
                category_id = int(category_slug)
                posts = self.get_queryset().filter(category__id=category_id)
        except ValueError:
            # If category_slug is not a valid integer, just use the slug filter
            pass

        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get posts by tag",
        manual_parameters=[
            openapi.Parameter('slug', openapi.IN_QUERY, description="Tag slug", type=openapi.TYPE_STRING, required=True),
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-tag')
    def posts_by_tag(self, request):
        tag_slug = request.query_params.get('slug')
        if not tag_slug:
            return Response({'error': 'Tag slug is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        posts = self.get_queryset().filter(tags__slug=tag_slug)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get posts by author",
        manual_parameters=[
            openapi.Parameter('username', openapi.IN_QUERY, description="Author's username", type=openapi.TYPE_STRING, required=True),
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-author')
    def posts_by_author(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response({'error': 'Author username is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        posts = self.get_queryset().filter(author__username=username)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get posts by date range",
        manual_parameters=[
            openapi.Parameter('start_date', openapi.IN_QUERY, description="Start date (YYYY-MM-DD)", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('end_date', openapi.IN_QUERY, description="End date (YYYY-MM-DD)", type=openapi.TYPE_STRING, required=True),
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-date-range')
    def posts_by_date_range(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response({'error': 'Both start_date and end_date are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            posts = self.get_queryset().filter(publication_date__range=[start_date, end_date])
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Publish a draft post.",
        responses={200: PostSerializer(), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        post = self.get_object()
        if post.status == 'draft':
            post.status = 'published'
            post.publication_date = timezone.now().date()
            post.save()
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        return Response({'detail': 'Post is already published'}, status=status.HTTP_400_BAD_REQUEST)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [DynamicJwtPermission, IsOwnerOrReadOnly]

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        method='post',
        operation_description="Approve a comment",
        responses={200: CommentSerializer(), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        comment = self.get_object()
        comment.moderation_status = 'approved'
        comment.save()
        serializer = self.get_serializer(comment)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Reject a comment",
        responses={200: CommentSerializer(), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        comment = self.get_object()
        comment.moderation_status = 'rejected'
        comment.save()
        serializer = self.get_serializer(comment)
        return Response(serializer.data)
    
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [DynamicJwtPermission]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        method='post',
        operation_description="Mark a notification as read",
        responses={200: NotificationSerializer(), 400: 'Bad request'}
    )

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Mark all notifications as read",
        responses={200: 'All notifications marked as read'}
    )

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'detail': 'All notifications marked as read'}, status=status.HTTP_200_OK)
