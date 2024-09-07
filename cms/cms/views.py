from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CustomUser, Category, Tag, Post, Comment, Notification
from .serializers import (
    CustomUserSerializer, CategorySerializer, TagSerializer, PostSerializer, CommentSerializer, NotificationSerializer, ContactMessageSerializer,
    PasswordResetRequestSerializer, 
    PasswordResetConfirmSerializer, 
    ChangePasswordSerializer
)
from .permissions import IsAuthorOrReadOnly, IsOwnerOrReadOnly
from .pagination import StandardResultsSetPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.core.mail import send_mail
from django.db.models import Q
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

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
        
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    @swagger_auto_schema(
        method='get',
        operation_description="Get the current user's profile",
        responses={200: CustomUserSerializer()}
    )
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def contact(self, request, pk=None):
        author = self.get_object()  # Get the author instance
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
                return Response({'status': 'Message sent successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('id')
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

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
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    # Filter posts for current user (authors can see their drafts)
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            if self.request.user.is_author:
                return queryset.filter(Q(is_public=True) | Q(author=self.request.user))
        return queryset.filter(is_public=True)

    # Search for posts
    @swagger_auto_schema(
        method='get',
        operation_description="Search posts by title or content.",
        responses={200: PostSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def search(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Increment view count
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

    # Engage with post (upvote, downvote, view)
    @swagger_auto_schema(
        method='post',
        operation_description="Engage with a post (upvote, downvote, or view).",
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
        return Response(serializer.data)

    # Featured posts based on upvotes or view count
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

    # Slug validation
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
    
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    pagination_class = StandardResultsSetPagination

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

    # Moderation for comments (e.g., approve, reject)
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
        else:
            # Return an empty queryset for anonymous users
            return Notification.objects.none()

    @swagger_auto_schema(
        method='post',
        operation_description="Mark a notification as read",
        responses={200: openapi.Response('Notification marked as read'), 400: 'Bad request'}
    )
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication credentials were not provided.'}, status=401)
        
        try:
            notification = Notification.objects.get(id=pk, user=request.user)
        except Notification.DoesNotExist:
            raise NotFound('Notification not found or does not belong to the user.')
        
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'}) 
    

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    # Mark notifications as read
    @swagger_auto_schema(
        method='post',
        operation_description="Mark multiple notifications as read.",
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
    def mark_as_read(self, request):
        notification_ids = request.data.get('ids', [])
        Notification.objects.filter(id__in=notification_ids, user=request.user).update(is_read=True)
        return Response({'status': 'Notifications marked as read'})
    
    class RequestPasswordReset(APIView):
        @swagger_auto_schema(
        request_body=PasswordResetRequestSerializer,
        responses={200: 'Password reset email sent.', 400: 'Bad request.'}
    )
        def post(self, request):
            serializer = PasswordResetRequestSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data['email']
                user = get_object_or_404(CustomUser, email=email)
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_link = f'http://yourdomain.com/reset-password/{uid}/{token}/'
                send_mail(
                    'Password Reset Request',
                    f'Click the link to reset your password: {reset_link}',
                    'noreply@yourdomain.com',
                    [email],
                    fail_silently=False,
                )
                return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        method='post',
        operation_description="Request a password reset link for the provided email.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='The email address to send the password reset link to.')
            },
            required=['email']
        ),
        responses={
            200: 'Password reset link sent',
            400: 'Invalid email address or user does not exist',
        }
    )
    @action(detail=False, methods=['post'])
    def request_reset(self, request):
        email = request.data.get('email')
        # Handle sending password reset email
        return Response({'status': 'Password reset link sent'})

class PasswordResetConfirmViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        method='post',
        operation_description="Confirm the password reset with a token and new password.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING, description='The token received in the password reset email.'),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description='The new password.')
            },
            required=['token', 'new_password']
        ),
        responses={
            200: 'Password reset confirmed',
            400: 'Invalid token or new password does not meet criteria',
        }
    )
    @action(detail=False, methods=['post'])
    def confirm_reset(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        # Handle password reset confirmation
        return Response({'status': 'Password reset confirmed'})

class PasswordChangeViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        method='post',
        operation_description="Change the current user's password.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'old_password': openapi.Schema(type=openapi.TYPE_STRING, description='The current password.'),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description='The new password.')
            },
            required=['old_password', 'new_password']
        ),
        responses={
            200: 'Password changed successfully',
            400: 'Invalid old password or new password does not meet criteria',
        }
    )
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        user = request.user
        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=400)
        if not self._is_valid_password(new_password):
            return Response({'error': 'New password does not meet criteria'}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'status': 'Password changed successfully'})
    
    def _is_valid_password(self, password):
        # Implement password validation logic here
        return True

class AccountViewSet(viewsets.ViewSet):
    
    @swagger_auto_schema(
        method='put',
        operation_description="Update the current user's account information.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='The new email address.'),
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='The new first name.'),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='The new last name.'),
                'bio': openapi.Schema(type=openapi.TYPE_STRING, description='A short bio for the user.'),
                'website': openapi.Schema(type=openapi.TYPE_STRING, description='The user’s personal website.'),
                'location': openapi.Schema(type=openapi.TYPE_STRING, description='The user’s location.')
            },
            required=[]
        ),
        responses={
            200: 'Account information updated successfully',
            400: 'Invalid input data',
        }
    )
    @action(detail=False, methods=['put'])
    def update_account(self, request):
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        bio = request.data.get('bio')
        website = request.data.get('website')
        location = request.data.get('location')
        
        user = request.user
        user.email = email or user.email
        user.first_name = first_name or user.first_name
        user.last_name = last_name or user.last_name
        user.bio = bio or user.bio
        user.website = website or user.website
        user.location = location or user.location
        
        user.save()
        return Response({'status': 'Account information updated successfully'})