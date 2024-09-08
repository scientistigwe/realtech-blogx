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

# view
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
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return render(request, 'accounts/logout.html')

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

        # Return API response if not requesting HTML
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get user details for updating",
        responses={200: CustomUserSerializer()}
    )
    @action(detail=True, methods=['get'])
    def update_user(self, request, pk=None):
        user = get_object_or_404(CustomUser, pk=pk)
        if request.accepted_renderer.format == 'html':
            return render(request, 'authors/update_user.html', {'user': user})

        # Return API response if not requesting HTML
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
        user = get_object_or_404(CustomUser, pk=pk)
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
            user = request.user
            return render(request, 'authors/author_detail.html', {'user': user})

        # Return API response if not requesting HTML
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
        author = get_object_or_404(CustomUser, pk=pk)  # Get the author instance
        serializer = ContactMessageSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data

            # Send email or process the message as needed
            try:
                send_mail(
                    subject=data['title'],
                    message=f"From: {data['name']}\nEmail: {data['email']}\n\n{data['message']}",
                    from_email=data['email'],
                    recipient_list=[author.email],  # Assuming author has an email field
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

    @swagger_auto_schema(
        method='get',
        operation_description="Get the list of categories",
        responses={200: CategorySerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def list_categories(self, request):
        if request.accepted_renderer.format == 'html':
            categories = Category.objects.all()
            return render(request, 'categories/category_list.html', {'categories': categories})

        # Return API response if not requesting HTML
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get category details for updating",
        responses={200: CategorySerializer()}
    )
    @action(detail=True, methods=['get'])
    def update_category(self, request, pk=None):
        category = get_object_or_404(Category, pk=pk)
        if request.accepted_renderer.format == 'html':
            return render(request, 'categories/update_category.html', {'category': category})

        # Return API response if not requesting HTML
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
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'categories/update_category.html', {'category': serializer.instance, 'status': 'Category updated successfully'})
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.accepted_renderer.format == 'html':
            return render(request, 'categories/update_category.html', {'category': category, 'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='get',
        operation_description="Get details of a specific category",
        responses={200: CategorySerializer()}
    )
    @action(detail=True, methods=['get'])
    def category_detail(self, request, pk=None):
        category = get_object_or_404(Category, pk=pk)
        if request.accepted_renderer.format == 'html':
            return render(request, 'categories/read_category.html', {'category': category})

        # Return API response if not requesting HTML
        serializer = self.get_serializer(category)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Create a new category",
        request_body=CategorySerializer,
        responses={201: CategorySerializer(), 400: 'Invalid input'}
    )
    @action(detail=False, methods=['post'])
    def create_category(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'categories/category_form.html', {'category': serializer.instance, 'status': 'Category created successfully'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.accepted_renderer.format == 'html':
            return render(request, 'categories/category_form.html', {'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('id')
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
            tags = Tag.objects.all()
            return render(request, 'tags/tag_list.html', {'tags': tags})

        # Return API response if not requesting HTML
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get details of a specific tag",
        responses={200: TagSerializer()}
    )
    @action(detail=True, methods=['get'])
    def tag_detail(self, request, pk=None):
        tag = get_object_or_404(Tag, pk=pk)
        if request.accepted_renderer.format == 'html':
            return render(request, 'tags/read_tag.html', {'tag': tag})

        # Return API response if not requesting HTML
        serializer = self.get_serializer(tag)
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
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'tags/tag_form.html', {'tag': serializer.instance, 'status': 'Tag created successfully'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.accepted_renderer.format == 'html':
            return render(request, 'tags/tag_form.html', {'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_description="Update an existing tag",
        request_body=TagSerializer,
        responses={200: TagSerializer(), 400: 'Invalid input'}
    )
    @action(detail=True, methods=['post'])
    def update_tag(self, request, pk=None):
        tag = get_object_or_404(Tag, pk=pk)
        serializer = TagSerializer(tag, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'tags/update_tag.html', {'tag': serializer.instance, 'status': 'Tag updated successfully'})
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.accepted_renderer.format == 'html':
            return render(request, 'tags/update_tag.html', {'tag': tag, 'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_description="Delete a tag",
        responses={204: 'Tag deleted successfully', 404: 'Tag not found'}
    )
    @action(detail=True, methods=['post'])
    def delete_tag(self, request, pk=None):
        tag = get_object_or_404(Tag, pk=pk)
        tag.delete()
        if request.accepted_renderer.format == 'html':
            return render(request, 'tags/delete_tag.html', {'status': 'Tag deleted successfully'})
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

    @swagger_auto_schema(
        method='post',
        operation_description="Upvote a post",
        responses={200: openapi.Response('Upvote successful'), 400: 'Bad request'}
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
        responses={200: openapi.Response('Downvote successful'), 400: 'Bad request'}
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
        post_id = request.query_params.get('post_id')
        if post_id:
            post = get_object_or_404(Post, pk=post_id)
        else:
            post = None

        if request.accepted_renderer.format == 'html':
            return render(request, 'posts/update_post.html', {'post': post})

        return Response({'detail': 'Form rendered'}, status=status.HTTP_200_OK)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    pagination_class = StandardResultsSetPagination

    @swagger_auto_schema(
        method='get',
        operation_description="Get the list of comments",
        responses={200: CommentSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def list_comments(self, request):
        if request.accepted_renderer.format == 'html':
            comments = Comment.objects.all()
            return render(request, 'comments/comment_list.html', {'comments': comments})

        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get details of a specific comment",
        responses={200: CommentSerializer()}
    )
    @action(detail=True, methods=['get'])
    def comment_detail(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        if request.accepted_renderer.format == 'html':
            return render(request, 'comments/comment_detail.html', {'comment': comment})

        serializer = self.get_serializer(comment)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Create a new comment",
        request_body=CommentSerializer,
        responses={201: CommentSerializer(), 400: 'Invalid input'}
    )
    @action(detail=False, methods=['post'])
    def create_comment(self, request):
        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'comments/comment_form.html', {'comment': serializer.instance, 'status': 'Comment created successfully'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.accepted_renderer.format == 'html':
            return render(request, 'comments/comment_form.html', {'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_description="Update an existing comment",
        request_body=CommentSerializer,
        responses={200: CommentSerializer(), 400: 'Invalid input'}
    )
    @action(detail=True, methods=['post'])
    def update_comment(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentSerializer(comment, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            if request.accepted_renderer.format == 'html':
                return render(request, 'comments/update_comment.html', {'comment': serializer.instance, 'status': 'Comment updated successfully'})
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.accepted_renderer.format == 'html':
            return render(request, 'comments/update_comment.html', {'comment': comment, 'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_description="Delete a comment",
        responses={204: 'Comment deleted successfully', 404: 'Comment not found'}
    )
    @action(detail=True, methods=['post'])
    def delete_comment(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        comment.delete()
        if request.accepted_renderer.format == 'html':
            return render(request, 'comments/delete_comment.html', {'status': 'Comment deleted successfully'})
        return Response(status=status.HTTP_204_NO_CONTENT)

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
        responses={200: 'Comment moderation status updated'}
    )
    @action(detail=True, methods=['post'], url_path='moderate')
    def moderate(self, request, pk=None):
        comment = self.get_object()
        status = request.data.get('moderation_status', 'pending')
        comment.moderation_status = status
        comment.save()
        return Response({'status': 'Comment moderation status updated'})

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Notification.objects.filter(user=self.request.user)
        return Notification.objects.none()

    @swagger_auto_schema(
        method='get',
        operation_description="Get the list of notifications",
        responses={200: NotificationSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def list_notifications(self, request):
        if request.accepted_renderer.format == 'html':
            notifications = self.get_queryset()
            return render(request, 'notifications/notification_list.html', {'notifications': notifications})

        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_description="Get details of a specific notification",
        responses={200: NotificationSerializer()}
    )
    @action(detail=True, methods=['get'])
    def notification_detail(self, request, pk=None):
        notification = get_object_or_404(self.get_queryset(), pk=pk)
        if request.accepted_renderer.format == 'html':
            return render(request, 'notifications/fetch_notification_by_id.html', {'notification': notification})

        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_description="Mark a notification as read",
        responses={200: 'Notification marked as read', 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication credentials were not provided.'}, status=401)
        
        notification = get_object_or_404(self.get_queryset(), pk=pk)
        notification.is_read = True
        notification.save()
        
        if request.accepted_renderer.format == 'html':
            return render(request, 'notifications/mark_all_as_read.html', {'status': 'Notification marked as read'})
        
        return Response({'status': 'Notification marked as read'})

    @swagger_auto_schema(
        method='post',
        operation_description="Mark multiple notifications as read",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
            },
            required=['ids']
        ),
        responses={200: 'Notifications marked as read'}
    )
    @action(detail=False, methods=['post'])
    def mark_multiple_as_read(self, request):
        notification_ids = request.data.get('ids', [])
        self.get_queryset().filter(id__in=notification_ids).update(is_read=True)
        
        if request.accepted_renderer.format == 'html':
            return render(request, 'notifications/mark_all_as_read.html', {'status': 'Notifications marked as read'})
        
        return Response({'status': 'Notifications marked as read'})

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

class PasswordChangeViewSet(ViewSet):
    @action(detail=False, methods=['get', 'post'], url_path='change-password')
    def change_password(self, request, *args, **kwargs):
        if request.method == 'POST':
            form = PasswordChangeForm(user=request.user, data=request.data)
            if form.is_valid():
                user = form.save()
                update_session_auth_hash(request, user)  # Important for keeping the user logged in
                return redirect('profile')  # Redirect to profile or another page after password change
            return render(request, 'registration/change_password.html', {'form': form})
        else:
            form = PasswordChangeForm(user=request.user)
        return render(request, 'registration/change_password.html', {'form': form})

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

class AccountViewSet(ViewSet):
    @action(detail=False, methods=['get', 'post'], url_path='update-account')
    def update_account(self, request, *args, **kwargs):
        if request.method == 'POST':
            form = UserChangeForm(data=request.data, instance=request.user)
            if form.is_valid():
                form.save()
                return redirect('profile')  # Redirect to profile or another page after updating account info
            return render(request, 'registration/update_account.html', {'form': form})
        else:
            form = UserChangeForm(instance=request.user)
        return render(request, 'registration/update_account.html', {'form': form})
