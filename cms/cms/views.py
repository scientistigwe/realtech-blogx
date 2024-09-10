from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CustomUser, Category, Tag, Post, Comment, Notification
from .serializers import (
    CustomUserSerializer, CategorySerializer, TagSerializer, PostSerializer,
    CommentSerializer, NotificationSerializer, ContactMessageSerializer
)
from .permissions import IsAuthorOrReadOnly, IsOwnerOrReadOnly
from .pagination import StandardResultsSetPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.core.mail import send_mail
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import render, redirect
from rest_framework.viewsets import ViewSet
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm, UserChangeForm
from rest_framework.decorators import api_view
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.views.generic import TemplateView

class IndexViewSet(TemplateView):
    template_name = 'index.html'

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Register a new user",
        request_body=CustomUserSerializer,
        responses={
            201: openapi.Response('User registered successfully', CustomUserSerializer),
            400: 'Invalid input',
        }
    )
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({
                'user': serializer.data,
                'access_token': access_token,
                'refresh_token': refresh_token,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return render(request, 'accounts/register.html')

class LogoutView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Log out by blacklisting the refresh token",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh_token': openapi.Schema(type=openapi.TYPE_STRING, description='JWT refresh token'),
            },
            required=['refresh_token'],
        ),
        responses={
            200: 'Successfully logged out',
            400: 'Invalid token',
        }
    )
    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    @swagger_auto_schema(
        method='get',
        operation_description="Get the list of users",
        responses={200: CustomUserSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def list_users(self, request):
        if request.accepted_renderer.format == 'html':
            users = CustomUser.objects.all()
            return render(request, 'authors/list_users.html', {'users': users})
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get user details for updating",
        responses={200: CustomUserSerializer()}
    )
    @action(detail=True, methods=['get'])
    def update_user(self, request, pk=None):
        user = self.get_object()
        if request.accepted_renderer.format == 'html':
            return render(request, 'authors/update_user.html', {'user': user})
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Update a user",
        request_body=CustomUserSerializer,
        responses={200: CustomUserSerializer(), 400: 'Invalid input'}
    )
    @action(detail=True, methods=['post'])
    def update_user_post(self, request, pk=None):
        user = self.get_object()
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'authors/update_user.html', {'user': serializer.instance, 'status': 'User updated successfully'})
            return Response(serializer.data, status=status.HTTP_200_OK)
        if request.accepted_renderer.format == 'html':
            return render(request, 'authors/update_user.html', {'user': user, 'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='get',
        operation_description="Get the current user's profile",
        responses={200: CustomUserSerializer()}
    )
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.accepted_renderer.format == 'html':
            return render(request, 'authors/author_detail.html', {'user': request.user})
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Send a contact message to the author",
        request_body=ContactMessageSerializer,
        responses={200: 'Message sent successfully', 400: 'Invalid input', 500: 'Internal Server Error'}
    )
    @action(detail=True, methods=['post'])
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
                if request.accepted_renderer.format == 'html':
                    return render(request, 'authors/contact_author.html', {'status': 'Message sent successfully'})
                return Response({'status': 'Message sent successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                if request.accepted_renderer.format == 'html':
                    return render(request, 'authors/contact_author.html', {'error': str(e)})
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if request.accepted_renderer.format == 'html':
            return render(request, 'authors/contact_author.html', {'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_navbar_context(self):
        categories = Category.objects.filter(parent=None).prefetch_related('subcategories')
        tags = Tag.objects.all()[:10]
        context = {
            'categories': categories,
            'tags': tags,
            'categories_count': categories.count(),
            'debug_categories': list(categories.values('id', 'name'))
        }
        return context

    @swagger_auto_schema(
        method='get',
        operation_description="Get the list of categories",
        responses={200: CategorySerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def list_categories(self, request):
        if request.accepted_renderer.format == 'html':
            context = self.get_navbar_context()
            context['categories_list'] = self.get_queryset()
            return render(request, 'categories/category_list.html', context)
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get the navbar context data (categories and tags)",
        responses={200: 'Navbar context data including categories and tags'}
    )
    @action(detail=False, methods=['get'])
    def navbar_data(self, request):
        """Custom action to return navbar categories and tags as JSON."""
        context = self.get_navbar_context()
        
        # Serialize the categories and tags
        categories_data = CategorySerializer(context['categories'], many=True).data
        tags_data = TagSerializer(context['tags'], many=True).data

        return Response({
            'categories': categories_data,
            'tags': tags_data,
            'categories_count': context['categories_count'],
            'debug_categories': context['debug_categories']
        }, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='get',
        operation_description="Get category details for updating",
        responses={200: CategorySerializer()}
    )
    @action(detail=True, methods=['get'])
    def update_category(self, request, pk=None):
        category = self.get_object()
        if request.accepted_renderer.format == 'html':
            context = self.get_navbar_context()
            context['category'] = category
            return render(request, 'categories/update_category.html', context)
        serializer = self.get_serializer(category)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Update a category",
        request_body=CategorySerializer,
        responses={200: CategorySerializer(), 400: 'Invalid input'}
    )
    @action(detail=True, methods=['post'])
    def update_category_post(self, request, pk=None):
        category = self.get_object()
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'categories/update_category.html', {'category': serializer.instance, 'status': 'Category updated successfully'})
            return Response(serializer.data, status=status.HTTP_200_OK)
        if request.accepted_renderer.format == 'html':
            return render(request, 'categories/update_category.html', {'category': category, 'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    @swagger_auto_schema(
        method='get',
        operation_description="Get the list of tags",
        responses={200: TagSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def list_tags(self, request):
        if request.accepted_renderer.format == 'html':
            tags = self.get_queryset()
            return render(request, 'tags/tag_list.html', {'tags': tags})
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Create a new tag",
        request_body=TagSerializer,
        responses={201: TagSerializer(), 400: 'Invalid input'}
    )
    @action(detail=False, methods=['post'])
    def create_tag(self, request):
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            tag = serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'tags/tag_detail.html', {'tag': tag, 'status': 'Tag created successfully'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        if request.accepted_renderer.format == 'html':
            return render(request, 'tags/tag_create.html', {'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_description="Update an existing tag",
        request_body=TagSerializer,
        responses={200: TagSerializer(), 400: 'Invalid input'}
    )
    @action(detail=True, methods=['post'])
    def update_tag(self, request, pk=None):
        tag = self.get_object()
        serializer = TagSerializer(tag, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'tags/tag_detail.html', {'tag': serializer.instance, 'status': 'Tag updated successfully'})
            return Response(serializer.data, status=status.HTTP_200_OK)
        if request.accepted_renderer.format == 'html':
            return render(request, 'tags/tag_detail.html', {'tag': tag, 'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_description="Delete a tag",
        responses={204: 'Tag deleted successfully', 404: 'Tag not found'}
    )
    @action(detail=True, methods=['post'])
    def delete_tag(self, request, pk=None):
        tag = self.get_object()
        tag.delete()
        if request.accepted_renderer.format == 'html':
            return render(request, 'tags/tag_list.html', {'status': 'Tag deleted successfully'})
        return Response(status=status.HTTP_204_NO_CONTENT)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'tags', 'publication_date', 'author']
    search_fields = ['title', 'content']
    ordering_fields = ['view_count', 'created_at', 'upvotes']

    def get_queryset(self):
        """
        Customize queryset based on request parameters for filtering by category, tags, or search.
        """
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

        return queryset

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(
        method='post',
        operation_description="Upvote a post",
        responses={200: 'Upvote successful', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        """
        Upvote the post.
        """
        post = self.get_object()
        post.upvotes += 1
        post.save()
        return Response({'status': 'Post upvoted successfully'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        operation_description="Downvote a post",
        responses={200: 'Downvote successful', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        """
        Downvote the post.
        """
        post = self.get_object()
        post.downvotes += 1
        post.save()
        return Response({'status': 'Post downvoted successfully'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='get',
        operation_description="Search posts by title and content",
        manual_parameters=[
            openapi.Parameter('search', openapi.IN_QUERY, description="Search posts by title or content", type=openapi.TYPE_STRING)
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request, *args, **kwargs):
        """
        Search posts based on title and content using query params.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_search.html', {'posts': serializer.data})
        return Response(serializer.data)

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
        """
        List the most viewed posts.
        """
        limit = request.query_params.get('limit', 10)
        most_viewed = self.get_queryset().order_by('-view_count')[:int(limit)]
        serializer = self.get_serializer(most_viewed, many=True)
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_list.html', {'posts': serializer.data})
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="List posts by category",
        manual_parameters=[
            openapi.Parameter('category', openapi.IN_QUERY, description="Category slug to filter posts", type=openapi.TYPE_STRING)
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-category')
    def posts_by_category(self, request):
        """
        List posts by category.
        """
        category_slug = request.query_params.get('category')
        if not category_slug:
            return Response({"detail": "Category slug is required."}, status=status.HTTP_400_BAD_REQUEST)

        posts = self.get_queryset().filter(category__slug=category_slug)
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_by_category.html', {'posts': posts})

        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="List posts by tag",
        manual_parameters=[
            openapi.Parameter('tag', openapi.IN_QUERY, description="Tag slug to filter posts", type=openapi.TYPE_STRING)
        ],
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-tag')
    def posts_by_tag(self, request):
        """
        List posts by tag.
        """
        tag_slug = request.query_params.get('tag')
        if not tag_slug:
            return Response({"detail": "Tag slug is required."}, status=status.HTTP_400_BAD_REQUEST)

        posts = self.get_queryset().filter(tags__slug=tag_slug)
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_by_tag.html', {'posts': posts})

        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Increment post view count.",
        responses={200: PostSerializer()}
    )
    @action(detail=True, methods=['get'])
    def view(self, request, pk=None):
        """
        Increment view count for a post.
        """
        post = self.get_object()
        post.view_count += 1
        post.save()
        serializer = self.get_serializer(post)
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_detail.html', {'post': serializer.data})
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Engage with a post (upvote, downvote, or view).",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={'action': openapi.Schema(type=openapi.TYPE_STRING)},
            required=['action']
        ),
        responses={200: PostSerializer()}
    )
    @action(detail=True, methods=['post'])
    def engage(self, request, pk=None):
        """
        Engage with a post (upvote, downvote, or view).
        """
        post = self.get_object()
        action = request.data.get('action')
        if action == 'upvote':
            post.upvotes += 1
        elif action == 'downvote':
            post.downvotes += 1
        elif action == 'view':
            post.view_count += 1
        post.save()
        serializer = self.get_serializer(post)
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_engagement.html', {'post': serializer.data})
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get featured posts based on upvotes or view count.",
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured posts based on upvotes or view count.
        """
        queryset = Post.objects.filter(status='published').order_by('-upvotes', '-view_count')[:5]
        serializer = self.get_serializer(queryset, many=True)
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_list.html', {'posts': serializer.data})
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
        """
        Check if a post slug is unique.
        """
        slug = request.data.get('slug')
        if Post.objects.filter(slug=slug).exists():
            return Response({'detail': 'Slug already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Slug is available'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='get',
        operation_description="Retrieve a form for creating or updating posts.",
        responses={200: 'Form rendered'}
    )
    @action(detail=False, methods=['get'], url_path='form')
    def form(self, request):
        """
        Render a form for creating or updating a post.
        """
        post_id = request.query_params.get('id')
        if post_id:
            post = get_object_or_404(Post, pk=post_id)
        else:
            post = None
        context = {'post': post}
        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/post_form.html', context)
        return Response(context)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['post', 'author', 'created_at']
    ordering_fields = ['created_at', 'upvotes']

    @swagger_auto_schema(
        method='post',
        operation_description="Upvote a comment",
        responses={200: 'Upvote successful', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        """
        Upvote a comment.
        """
        comment = self.get_object()
        comment.upvotes += 1
        comment.save()
        return Response({'status': 'Comment upvoted successfully'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        operation_description="Downvote a comment",
        responses={200: 'Downvote successful', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        """
        Downvote a comment.
        """
        comment = self.get_object()
        comment.downvotes += 1
        comment.save()
        return Response({'status': 'Comment downvoted successfully'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        operation_description="Moderate a comment",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={'action': openapi.Schema(type=openapi.TYPE_STRING)},
            required=['action']
        ),
        responses={200: 'Moderation successful', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        """
        Moderate a comment (e.g., approve or reject).
        """
        comment = self.get_object()
        action = request.data.get('action')
        if action == 'approve':
            comment.status = 'approved'
        elif action == 'reject':
            comment.status = 'rejected'
        comment.save()
        return Response({'status': 'Comment moderated successfully'}, status=status.HTTP_200_OK)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['user', 'is_read']
    ordering_fields = ['created_at']

    @swagger_auto_schema(
        method='post',
        operation_description="Mark a notification as read",
        responses={200: 'Notification marked as read', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Mark a notification as read.
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'Notification marked as read'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        operation_description="Mark multiple notifications as read",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={'ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))},
            required=['ids']
        ),
        responses={200: 'Notifications marked as read', 400: 'Bad request'}
    )
    @action(detail=False, methods=['post'], url_path='mark-multiple-as-read')
    def mark_multiple_as_read(self, request):
        """
        Mark multiple notifications as read.
        """
        ids = request.data.get('ids')
        if not ids:
            return Response({"detail": "IDs list is required."}, status=status.HTTP_400_BAD_REQUEST)
        notifications = Notification.objects.filter(id__in=ids)
        notifications.update(is_read=True)
        return Response({'status': 'Notifications marked as read'}, status=status.HTTP_200_OK)

class PasswordResetConfirmViewSet(ViewSet):
    @action(detail=False, methods=['get', 'post'], url_path='confirm-reset')
    def confirm_reset(self, request, *args, **kwargs):
        if request.method == 'POST':
            token = request.data.get('token')
            new_password = request.data.get('new_password')
            uid = urlsafe_base64_encode(force_bytes(CustomUser.pk))  # Ensure you retrieve the correct UID

            try:
                user = CustomUser.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

            if not default_token_generator.check_token(user, token):
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return redirect('login')  # Redirect to login page after successful password reset
        return render(request, 'registration/confirm_password_reset.html')
    
class PasswordChangeViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        method='post',
        operation_description="Change the user's password.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'old_password': openapi.Schema(type=openapi.TYPE_STRING),
                'new_password1': openapi.Schema(type=openapi.TYPE_STRING),
                'new_password2': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['old_password', 'new_password1', 'new_password2']
        ),
        responses={
            200: 'Password changed successfully.',
            400: 'Invalid data.',
        }
    )
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request, *args, **kwargs):
        form = PasswordChangeForm(user=request.user, data=request.data)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important for keeping the user logged in
            return Response({'status': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='get',
        operation_description="Get the form for changing the user's password.",
        responses={200: 'Form rendered'}
    )
    @action(detail=False, methods=['get'], url_path='change-password')
    def get_change_password_form(self, request, *args, **kwargs):
        form = PasswordChangeForm(user=request.user)
        return render(request, 'registration/change_password.html', {'form': form})

class AccountViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        method='post',
        operation_description="Update the user's account information.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'first_name': openapi.Schema(type=openapi.TYPE_STRING),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING),
                'bio': openapi.Schema(type=openapi.TYPE_STRING),
                'website': openapi.Schema(type=openapi.TYPE_STRING),
                'location': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['username', 'email']
        ),
        responses={
            200: 'Account updated successfully.',
            400: 'Invalid data.',
        }
    )
    @action(detail=False, methods=['post'], url_path='update-account')
    def update_account(self, request, *args, **kwargs):
        form = UserChangeForm(data=request.data, instance=request.user)
        if form.is_valid():
            form.save()
            return Response({'status': 'Account updated successfully'}, status=status.HTTP_200_OK)
        return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='get',
        operation_description="Get the form for updating the user's account information.",
        responses={200: 'Form rendered'}
    )
    @action(detail=False, methods=['get'], url_path='update-account')
    def get_update_account_form(self, request, *args, **kwargs):
        form = UserChangeForm(instance=request.user)
        return render(request, 'registration/update_account.html', {'form': form})

@swagger_auto_schema(
    method='post',
    operation_description="Request a password reset.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['email']
    ),
    responses={
        200: 'Password reset email sent.',
        400: 'User with this email does not exist.',
    }
)
@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    context = {
        'email': email,
        'protocol': request.scheme,
        'domain': request.get_host(),
        'uid': uid,
        'token': token,
    }
    
    subject = "Password Reset Request"
    message = render_to_string('registration/password_reset_email.html', context)
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
    
    return Response({'message': 'Password reset email has been sent'}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='post',
    operation_description="Request a password reset.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['email']
    ),
    responses={
        200: 'Password reset email sent.',
        400: 'User with this email does not exist.',
    }
)
@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    context = {
        'email': email,
        'protocol': request.scheme,
        'domain': request.get_host(),
        'uid': uid,
        'token': token,
    }
    
    subject = "Password Reset Request"
    message = render_to_string('registration/password_reset_email.html', context)
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
    
    return Response({'message': 'Password reset email has been sent'}, status=status.HTTP_200_OK)
