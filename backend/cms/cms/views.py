from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.db.models import Q, Sum, Count
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import CustomUser, Category, Tag, Post, Comment, Notification
from .serializers import (
    CustomUserSerializer, CategorySerializer, TagSerializer,
    PostSerializer, CommentSerializer, NotificationSerializer
)
from cms.permissions.permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly, DynamicJwtPermission
from .pagination import StandardResultsSetPagination

User = get_user_model()

class BaseModelViewSet(viewsets.ModelViewSet):
    permission_classes = [DynamicJwtPermission]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class CustomTokenObtainPairView(TokenObtainPairView):
    @extend_schema(
        summary="Obtain JWT token pair",
        description="Authenticate user and return JWT token pair along with user data",
        responses={200: {
            "type": "object",
            "properties": {
                "access": {"type": "string"},
                "refresh": {"type": "string"},
                "user": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "username": {"type": "string"},
                        "email": {"type": "string"},
                        "is_authenticated": {"type": "boolean"}
                    }
                }
            }
        }}
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user_data = self.get_user_from_token(response.data['access'])
            if user_data:
                response.data.update({
                    "message": "Login successful",
                    "user": user_data
                })
        return response

    def get_user_from_token(self, access_token):
        try:
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = User.objects.get(id=user_id)
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'is_authenticated': True
            }
        except Exception:
            return None

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Refresh JWT token",
        description="Refresh JWT access token using refresh token",
        responses={200: {
            "type": "object",
            "properties": {
                "access": {"type": "string"}
            }
        }}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class CustomUserViewSet(BaseModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    @extend_schema(
        summary="Get current user",
        description="Retrieve information about the current authenticated user",
        responses={200: CustomUserSerializer}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @extend_schema(
        summary="Check authentication status",
        description="Check if the current user is authenticated",
        responses={200: {
            "type": "object",
            "properties": {
                "is_authenticated": {"type": "boolean"},
                "user": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "username": {"type": "string"},
                        "email": {"type": "string"}
                    }
                }
            }
        }}
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def check_auth(self, request):
        if request.user.is_authenticated:
            user_data = {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
            }
            return Response({
                'is_authenticated': True,
                'user': user_data
            })
        return Response({'is_authenticated': False})

    @extend_schema(
        summary="Logout user",
        description="Blacklist the user's refresh token to logout",
        responses={200: {
            "type": "object",
            "properties": {
                "detail": {"type": "string"}
            }
        }}
    )
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(BaseModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @action(detail=True, methods=['get'])
    def subcategories(self, request, pk=None):
        category = self.get_object()
        subcategories = category.subcategories.all()
        serializer = self.get_serializer(subcategories, many=True)
        return Response(serializer.data)

class TagViewSet(BaseModelViewSet):
    queryset = Tag.objects.all().order_by('id')
    serializer_class = TagSerializer

    @action(detail=False, methods=['get'])
    def most_used(self, request):
        limit = int(request.query_params.get('limit', 10))
        tags = Tag.objects.annotate(post_count=Count('posts')).order_by('-post_count')[:limit]
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)

class PostViewSet(BaseModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [DynamicJwtPermission, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'tags', 'publication_date', 'author']
    search_fields = ['title', 'content']
    ordering_fields = ['view_count', 'created_at', 'upvotes']

    @extend_schema(
        summary="List posts",
        description="Retrieve a list of posts with optional filtering",
        parameters=[
            OpenApiParameter(name="category", description="Filter by category slug", type=OpenApiTypes.STR),
            OpenApiParameter(name="tag", description="Filter by tag slug", type=OpenApiTypes.STR),
            OpenApiParameter(name="search", description="Search in title and content", type=OpenApiTypes.STR),
            OpenApiParameter(name="is_public", description="Filter by public status", type=OpenApiTypes.BOOL),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

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

        if self.request.user.is_authenticated and self.request.user.is_author:
            return queryset.filter(Q(is_public=True) | Q(author=self.request.user))
        return queryset.filter(is_public=True)

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        post = self.get_object()
        post.upvotes += 1
        post.save()
        return Response({'status': 'Post upvoted successfully'})

    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        post = self.get_object()
        post.downvotes += 1
        post.save()
        return Response({'status': 'Post downvoted successfully'})

    @action(detail=False, methods=['get'])
    def most_viewed(self, request):
        limit = int(request.query_params.get('limit', 10))
        most_viewed = self.get_queryset().order_by('-view_count')[:limit]
        serializer = self.get_serializer(most_viewed, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def view(self, request, pk=None):
        post = self.get_object()
        post.view_count += 1
        post.save()
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        queryset = Post.objects.filter(status='published').order_by('-upvotes', '-view_count')[:5]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def check_slug(self, request):
        slug = request.data.get('slug')
        if Post.objects.filter(slug=slug).exists():
            return Response({'detail': 'Slug already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Slug is available'})

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        total_posts = Post.objects.count()
        total_views = Post.objects.aggregate(Sum('view_count'))['view_count__sum'] or 0
        return Response({'total_posts': total_posts, 'total_views': total_views})

    @action(detail=False, methods=['get'])
    def posts_by_category(self, request):
        category_slug = request.query_params.get('slug')
        if not category_slug:
            return Response({'error': 'Category slug is required'}, status=status.HTTP_400_BAD_REQUEST)
        posts = self.get_queryset().filter(category__slug=category_slug)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

    @action(detail=False, methods=['get'])
    def posts_by_tag(self, request):
        tag_slug = request.query_params.get('slug')
        if not tag_slug:
            return Response({'error': 'Tag slug is required'}, status=status.HTTP_400_BAD_REQUEST)
        posts = self.get_queryset().filter(tags__slug=tag_slug)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

    @action(detail=False, methods=['get'])
    def posts_by_author(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response({'error': 'Author username is required'}, status=status.HTTP_400_BAD_REQUEST)
        posts = self.get_queryset().filter(author__username=username)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

    @action(detail=False, methods=['get'])
    def posts_by_date_range(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if not start_date or not end_date:
            return Response({'error': 'Both start_date and end_date are required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            posts = self.get_queryset().filter(publication_date__range=[start_date, end_date])
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

    @extend_schema(
        summary="Publish post",
        description="Publish a draft post",
        responses={200: PostSerializer, 400: OpenApiTypes.OBJECT}
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        post = self.get_object()
        if post.status == 'draft':
            post.status = 'published'
            post.publication_date = timezone.now().date()
            post.save()
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        return Response({'detail': 'Post is already published'}, status=status.HTTP_400_BAD_REQUEST)

# ... (previous code remains the same)

class CommentViewSet(BaseModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [DynamicJwtPermission, IsOwnerOrReadOnly]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        comment = self.get_object()
        comment.moderation_status = 'approved'
        comment.save()
        serializer = self.get_serializer(comment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        comment = self.get_object()
        comment.moderation_status = 'rejected'
        comment.save()
        serializer = self.get_serializer(comment)
        return Response(serializer.data)

    @extend_schema(
        summary="List comments for a post",
        description="Retrieve a list of comments for a specific post",
        parameters=[
            OpenApiParameter(name="post_id", description="ID of the post", required=True, type=OpenApiTypes.INT),
        ]
    )
    @action(detail=False, methods=['get'])
    def for_post(self, request):
        post_id = request.query_params.get('post_id')
        if not post_id:
            return Response({'error': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        comments = self.get_queryset().filter(post_id=post_id)
        serializer = self.get_serializer(comments, many=True)
        return Response(serializer.data)

class NotificationViewSet(BaseModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'detail': 'All notifications marked as read'})

    @extend_schema(
        summary="List unread notifications",
        description="Retrieve a list of unread notifications for the current user"
    )
    @action(detail=False, methods=['get'])
    def unread(self, request):
        unread_notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)