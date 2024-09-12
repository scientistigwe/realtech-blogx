from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CustomUser, Category, Tag, Post, Comment, Notification
from .serializers import CustomUserSerializer, CategorySerializer, TagSerializer, PostSerializer, CommentSerializer, NotificationSerializer, ContactMessageSerializer
from .permissions.permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly
from .pagination import StandardResultsSetPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.core.mail import send_mail
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import CustomUser
from .serializers import CustomUserSerializer, ContactMessageSerializer
from rest_framework.exceptions import PermissionDenied

# views.py (or a similar file where JWTs are handled)
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware.csrf import get_token

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from rest_framework.decorators import api_view

@api_view(['GET'])
def check_auth(request):
    # This view will check if the user is authenticated based on the HTTP-only cookie
    if request.user and request.user.is_authenticated:
        return Response({'is_authenticated': True})
    return Response({'is_authenticated': False})

def create_jwt_token(request):
    user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = JsonResponse({'detail': 'Token issued'})
        response.set_cookie(
            'jwt',
            access_token,
            httponly=True,
            secure=True,  # Use True if running on HTTPS
            samesite='Lax'  # Adjust according to your requirements
        )
        return response
    return JsonResponse({'detail': 'Invalid credentials'}, status=401)

def refresh_jwt_token(request):
    # Since we're using cookies, the token is already available in the request cookies
    token = request.COOKIES.get('jwt')
    if token:
        try:
            # Decode the token to refresh
            refresh = RefreshToken(token)
            new_access_token = str(refresh.access_token)

            response = JsonResponse({'detail': 'Token refreshed'})
            response.set_cookie(
                'jwt',
                new_access_token,
                httponly=True,
                secure=True,
                samesite='Lax'
            )
            return response
        except Exception as e:
            return JsonResponse({'detail': 'Invalid token'}, status=401)
    return JsonResponse({'detail': 'No token provided'}, status=401)

def verify_jwt_token(request):
    token = request.COOKIES.get('jwt')
    if token:
        try:
            # Verify the token
            refresh = RefreshToken(token)
            return JsonResponse({'detail': 'Token valid'})
        except Exception as e:
            return JsonResponse({'detail': 'Invalid token'}, status=401)
    return JsonResponse({'detail': 'No token provided'}, status=401)

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action in ['list', 'create']:
            permission_classes = [AllowAny]
        elif self.action == 'retrieve':
            permission_classes = [IsAuthenticatedOrReadOnly]
        else:
            permission_classes = [IsAuthenticated]

        if self.request.user.is_authenticated and self.request.user.is_staff:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def me(self, request):
        user = self.request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        
        if not request.user.is_authenticated:
            public_data = {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'bio': user.bio,
                'website': user.website,
                'location': user.location,
                'profile_picture': user.profile_picture
            }
            return Response(public_data)
        
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='contact')
    @swagger_auto_schema(
        request_body=ContactMessageSerializer,
        responses={200: openapi.Response(description="Message sent successfully")}
    )
    def contact(self, request, pk=None):
        author = self.get_object()
        serializer = ContactMessageSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data
            try:
                send_mail(
                    subject=data['title'],
                    message=f"From: {data['name']}\nEmail: {data['email']}\n\n{data['message']}",
                    from_email=data['email'],
                    recipient_list=[author.email],
                    fail_silently=False,
                )
                return Response({'status': 'Message sent successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

    def perform_update(self, serializer):
        if self.request.user.is_authenticated:
            if self.request.user.is_staff or self.request.user == self.get_object():
                serializer.save()
            else:
                raise PermissionDenied("You do not have permission to update this resource.")

    def perform_destroy(self, instance):
        if self.request.user.is_authenticated:
            if self.request.user.is_staff or self.request.user == instance:
                instance.delete()
            else:
                raise PermissionDenied("You do not have permission to delete this resource.")

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('id')
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrReadOnly]
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
        manual_parameters=[
            openapi.Parameter('limit', openapi.IN_QUERY, description="Number of posts to retrieve", type=openapi.TYPE_INTEGER)
        ],
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
        method='get',
        operation_description="Search posts by title or content.",
        manual_parameters=[
            openapi.Parameter('search', openapi.IN_QUERY, description="Search query", type=openapi.TYPE_STRING)
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='search')
    def search_posts(self, request):
        search = request.query_params.get('search', '')
        queryset = self.get_queryset().filter(Q(title__icontains=search) | Q(content__icontains=search))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get posts by a specific tag.",
        manual_parameters=[
            openapi.Parameter('tag', openapi.IN_QUERY, description="Tag slug", type=openapi.TYPE_STRING)
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-tag')
    def get_posts_by_tag(self, request):
        tag = request.query_params.get('tag')
        if not tag:
            return Response({'detail': 'Tag parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = self.get_queryset().filter(tags__slug=tag)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get posts by a specific category.",
        manual_parameters=[
            openapi.Parameter('category', openapi.IN_QUERY, description="Category slug", type=openapi.TYPE_STRING)
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-category')
    def get_posts_by_category(self, request):
        category = request.query_params.get('category')
        if not category:
            return Response({'detail': 'Category parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = self.get_queryset().filter(category__slug=category)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Track post view count.",
        responses={200: PostSerializer()}
    )
    @action(detail=True, methods=['post'], url_path='track-view')
    def track_post_view(self, request, pk=None):
        post = self.get_object()
        post.view_count += 1
        post.save()
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Engage with a post (upvote/downvote).",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'action': openapi.Schema(type=openapi.TYPE_STRING, enum=['upvote', 'downvote'])
            },
            required=['action']
        ),
        responses={200: 'Post engagement successful', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'], url_path='engage')
    def engage_post(self, request, pk=None):
        post = self.get_object()
        action = request.data.get('action')

        if action == 'upvote':
            post.upvotes += 1
        elif action == 'downvote':
            post.downvotes += 1
        else:
            return Response({'detail': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        post.save()
        return Response({'status': f'Post {action} successful'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='get',
        operation_description="Get analytics data for posts (views, upvotes, downvotes).",
        responses={200: openapi.Response(description="Post analytics data", examples={
            'application/json': {
                'total_posts': 100,
                'total_views': 5000,
                'total_upvotes': 1200,
                'total_downvotes': 300
            }
        })}
    )
    @action(detail=False, methods=['get'], url_path='analytics', permission_classes=[permissions.IsAdminUser])
    def analytics(self, request):
        # Aggregate post engagement data
        analytics_data = Post.objects.aggregate(
            total_posts=Count('id'),
            total_views=Sum('view_count'),
            total_upvotes=Sum('upvotes'),
            total_downvotes=Sum('downvotes')
        )
        
        # Return the analytics data
        return Response(analytics_data, status=status.HTTP_200_OK)
    
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        method='post',
        operation_description="Upvote a comment",
        responses={200: openapi.Response('Upvote successful'), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        comment = self.get_object()
        comment.upvotes += 1
        comment.save()
        return Response({'status': 'comment upvoted'})

    @swagger_auto_schema(
        method='post',
        operation_description="Downvote a comment",
        responses={200: openapi.Response('Downvote successful'), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        comment = self.get_object()
        comment.downvotes += 1
        comment.save()
        return Response({'status': 'comment downvoted'})

    @swagger_auto_schema(
        method='post',
        operation_description="Moderate a comment (approve or reject).",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'moderation_status': openapi.Schema(type=openapi.TYPE_STRING, enum=['approved', 'rejected'])
            },
            required=['moderation_status']
        ),
        responses={200: 'Comment moderation status updated', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        comment = self.get_object()
        moderation_status = request.data.get('moderation_status')
        if moderation_status in ['approved', 'rejected']:
            comment.moderation_status = moderation_status
            comment.save()
            return Response({'status': 'Comment moderation status updated'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
