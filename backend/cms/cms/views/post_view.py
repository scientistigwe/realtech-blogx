from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from cms.models.post_model import Post, PostEngagement
from cms.serializers.post_serializer import PostSerializer, PostCreateSerializer, PostCreateUpdateSerializer, PostEngagementSerializer
from cms.views.permission_view import IsAuthorOrReadOnly
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.views.decorators.http import require_GET
from django.http import JsonResponse
from django.core.cache import cache

class PostViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for posts.
    URL: /posts/
    """
    queryset = Post.objects.all()
    permission_classes = [permissions.AllowAny, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'primary_category', 'subcategory', 'tags', 'status']
    search_fields = ['title', 'content', 'meta_keywords']
    ordering_fields = ['publication_date', 'title']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PostCreateUpdateSerializer
        return PostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list' and not self.request.user.is_authenticated:
            return queryset.filter(is_public=True, status='published')
        return queryset

    @swagger_auto_schema(
        operation_description="List all posts",
        responses={200: PostSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new post",
        request_body=PostCreateUpdateSerializer,
        responses={201: PostSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a specific post",
        responses={200: PostSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update a post",
        request_body=PostCreateUpdateSerializer,
        responses={200: PostSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partially update a post",
        request_body=PostCreateUpdateSerializer,
        responses={200: PostSerializer()}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a post",
        responses={204: "No content"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="List posts by category",
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path=r'category/(?P<category>[\w-]+)')
    def by_category(self, request, category=None):
        posts = self.get_queryset().filter(primary_category=category)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="List posts by subcategory",
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path=r'subcategory/(?P<subcategory>[\w-]+)')
    def by_subcategory(self, request, subcategory=None):
        posts = self.get_queryset().filter(subcategory=subcategory)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get posts by user",
        manual_parameters=[
            openapi.Parameter('user_id', openapi.IN_PATH, description="User ID", type=openapi.TYPE_INTEGER)
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path=r'user/(?P<user_id>\d+)')
    def by_user(self, request, user_id=None):
        posts = self.get_queryset().filter(author_id=user_id)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Upvote a post",
        responses={200: PostSerializer()}
    )
    @action(detail=True, methods=['post'], url_path='upvote')
    def upvote(self, request, pk=None):
        post = self.get_object()
        post.upvotes += 1
        post.save()
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Downvote a post",
        responses={200: PostSerializer()}
    )
    @action(detail=True, methods=['post'], url_path='downvote')
    def downvote(self, request, pk=None):
        post = self.get_object()
        post.downvotes += 1
        post.save()
        serializer = self.get_serializer(post)
        return Response(serializer.data)
    
@require_GET
def most_viewed_posts(request):
    try:
        # Define a cache key for the most viewed posts
        cache_key = 'most_viewed_posts'
        
        # Try to get data from cache
        data = cache.get(cache_key)
        
        if not data:
            # If data is not in cache, fetch from the database
            posts = Post.objects.filter(is_public=True).order_by('-view_count')[:10]
            data = list(posts.values('id', 'title', 'content', 'view_count', 'upvotes', 'downvotes', 'slug'))
            
            # Store the data in cache with a timeout of 24 hours (86400 seconds)
            cache.set(cache_key, data, timeout=86400)
        
        return JsonResponse(data, safe=False)
    except Exception as e:
        # Log error and return appropriate response
        return JsonResponse({'error': str(e)}, status=500)
    
class PostCreateView(generics.CreateAPIView):
    """
    Handles creating a post.
    URL: /posts/create/
    """
    serializer_class = PostCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetailView(generics.RetrieveAPIView):
    """
    Retrieves detailed information about a specific post.
    URL: /posts/<int:id>/
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Post.objects.all()
        return Post.objects.filter(is_public=True)


class PostUpdateView(generics.UpdateAPIView):
    """
    Handles updating a post.
    URL: /posts/<int:id>/update/
    """
    queryset = Post.objects.all()
    serializer_class = PostCreateSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_object(self):
        post = super().get_object()
        if self.request.user != post.author and not post.is_public:
            raise PermissionDenied("You do not have permission to edit this post.")
        return post

class PostDeleteView(generics.DestroyAPIView):
    """
    Handles deleting a post.
    URL: /posts/<int:id>/delete/
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]

# Fetch posts by user
class PostsByUserView(generics.ListAPIView):
    """
    Fetch posts by user.
    URL: /posts/user/<int:user_id>/
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(author_id=user_id)

class PostEngagementViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for post engagement metrics.
    URL: /post-engagements/
    """
    queryset = PostEngagement.objects.all()
    serializer_class = PostEngagementSerializer

    @swagger_auto_schema(
        method='post',
        operation_description="Increment the clicks for a PostEngagement instance.",
        responses={200: openapi.Response('Clicks incremented successfully')}
    )
    @action(detail=True, methods=['post'])
    def increment_clicks(self, request, pk=None):
        """
        Custom action to increment the clicks for a PostEngagement instance.
        """
        engagement = self.get_object()
        engagement.increment_clicks()
        return Response({'status': 'clicks incremented'})

    @swagger_auto_schema(
        operation_description="List all PostEngagement instances.",
        responses={200: PostEngagementSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new PostEngagement instance.",
        request_body=PostEngagementSerializer,
        responses={201: PostEngagementSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a PostEngagement instance.",
        responses={200: PostEngagementSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update a PostEngagement instance.",
        request_body=PostEngagementSerializer,
        responses={200: PostEngagementSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a PostEngagement instance.",
        responses={204: "No content"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
