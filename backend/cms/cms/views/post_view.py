from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from cms.models.post_model import Post, PostEngagement
from cms.models.tag_model import Tag
from cms.serializers.post_serializer import (
    TagSerializer, PostSerializer, PostDetailSerializer, PostAdminSerializer, PostEngagementSerializer
)

class IsAdminOrAuthor(permissions.BasePermission):
    """
    Custom permission to only allow superusers, staff, or authors to create, update, or delete.
    """

    def has_permission(self, request, view):
        # Allow any access for listing or retrieving
        if view.action in ['list', 'retrieve']:
            return True
        # Allow if the user is authenticated and is either staff, author, or superuser
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser or request.user.is_author)

# Tag ViewSet
class TagViewSet(viewsets.ModelViewSet):
    """
    Handle CRUD operations for tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  # Public access for listing and retrieving
        # Custom permission for creating, updating, or deleting
        return [IsAdminOrAuthor()]

    @swagger_auto_schema(
        operation_description="Retrieve a list of tags",
        responses={
            200: openapi.Response('Success', TagSerializer(many=True)),
            404: openapi.Response('Not Found'),
        },
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a single tag",
        responses={
            200: openapi.Response('Success', TagSerializer()),
            404: openapi.Response('Not Found'),
        },
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new tag",
        responses={
            201: openapi.Response('Created', TagSerializer()),
            400: openapi.Response('Bad Request'),
        },
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an existing tag",
        responses={
            200: openapi.Response('Success', TagSerializer()),
            400: openapi.Response('Bad Request'),
            404: openapi.Response('Not Found'),
        },
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partially update an existing tag",
        responses={
            200: openapi.Response('Success', TagSerializer()),
            400: openapi.Response('Bad Request'),
            404: openapi.Response('Not Found'),
        },
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a tag",
        responses={
            204: openapi.Response('No Content'),
            404: openapi.Response('Not Found'),
        },
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

# Post ViewSet
class PostViewSet(viewsets.ModelViewSet):
    """
    Handle CRUD operations for posts.
    """
    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return PostAdminSerializer
            elif self.request.user.is_author:
                return PostDetailSerializer if self.action == 'retrieve' else PostSerializer
        return PostSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  # Public access for listing and retrieving
        return [permissions.IsAuthenticated()]  # Authenticated access for other actions

    @action(detail=True, methods=['get'], url_path='admin-detail')
    @swagger_auto_schema(
        operation_description="Custom action to get detailed post info for admins.",
        responses={
            200: openapi.Response('Success', PostAdminSerializer()),
            404: openapi.Response('Not Found'),
        },
    )
    def admin_detail(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostAdminSerializer(post)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='category/(?P<category>[^/]+)')
    @swagger_auto_schema(
        operation_description="Fetch posts by category.",
        responses={
            200: openapi.Response('Success', PostSerializer(many=True)),
            404: openapi.Response('Not Found'),
        },
    )
    def by_category(self, request, category=None):
        posts = Post.objects.filter(primary_category=category)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='subcategory/(?P<subcategory>[^/]+)')
    @swagger_auto_schema(
        operation_description="Fetch posts by subcategory.",
        responses={
            200: openapi.Response('Success', PostSerializer(many=True)),
            404: openapi.Response('Not Found'),
        },
    )
    def by_subcategory(self, request, subcategory=None):
        posts = Post.objects.filter(subcategory=subcategory)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/]+)')
    @swagger_auto_schema(
        operation_description="Fetch posts by user.",
        responses={
            200: openapi.Response('Success', PostSerializer(many=True)),
            404: openapi.Response('Not Found'),
        },
    )
    def by_user(self, request, user_id=None):
        posts = Post.objects.filter(author_id=user_id)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='upvote')
    @swagger_auto_schema(
        operation_description="Upvote a post.",
        responses={
            200: openapi.Response('Success', openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'status': openapi.Schema(type=openapi.TYPE_STRING)
            })),
            404: openapi.Response('Not Found'),
        },
    )
    def post_upvote(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        post.upvote()  # Ensure `upvote` method exists in your model
        return Response({'status': 'post upvoted'})

    @action(detail=True, methods=['post'], url_path='downvote')
    @swagger_auto_schema(
        operation_description="Downvote a post.",
        responses={
            200: openapi.Response('Success', openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'status': openapi.Schema(type=openapi.TYPE_STRING)
            })),
            404: openapi.Response('Not Found'),
        },
    )
    def post_downvote(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        post.downvote()  # Ensure `downvote` method exists in your model
        return Response({'status': 'post downvoted'})

# Post Engagement ViewSet
class PostEngagementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Handle CRUD operations for post engagements.
    """
    queryset = PostEngagement.objects.all()
    serializer_class = PostEngagementSerializer

    @swagger_auto_schema(
        operation_description="Retrieve a list of post engagements",
        responses={
            200: openapi.Response('Success', PostEngagementSerializer(many=True)),
            404: openapi.Response('Not Found'),
        },
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a single post engagement",
        responses={
            200: openapi.Response('Success', PostEngagementSerializer()),
            404: openapi.Response('Not Found'),
        },
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
