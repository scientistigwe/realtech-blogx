import logging
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
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
from django.contrib.auth.decorators import login_required

logger = logging.getLogger(__name__)

User = get_user_model()

class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet for common functionality across all model ViewSets.
    
    Attributes:
        permission_classes (list): List of permission classes for the ViewSet.
        pagination_class (class): Pagination class for the ViewSet.
    """
    permission_classes = [DynamicJwtPermission]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        
        Returns:
            list: List of permission instances.
        """
        logger.debug(f"Getting permissions for action: {self.action}")
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        logger.debug(f"Permission classes: {permission_classes}")
        return [cls() for cls in permission_classes]

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain pair view that includes user data in the response.
    """
    
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
        """
        Handle POST requests to obtain JWT token pair.
        
        Args:
            request (HttpRequest): The HTTP request object.
            
        Returns:
            Response: JWT token pair along with user data.
        """
        logger.info("Received token obtain request")
        response = super().post(request, *args, **kwargs)
        logger.info(f"Token obtain request processed. Status: {response.status_code}")
        if response.status_code == 200:
            logger.debug("User authenticated successfully")
            user_data = self.get_user_from_token(response.data['access'])
            if user_data:
                logger.info("User data retrieved successfully")
                response.data.update({
                    "message": "Login successful",
                    "user": user_data
                })
        return response

    def get_user_from_token(self, access_token):
        """
        Retrieve user data from the access token.
        
        Args:
            access_token (str): The JWT access token.
            
        Returns:
            dict: User data extracted from the token.
        """
        try:
            logger.debug("Attempting to retrieve user data from token")
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = User.objects.get(id=user_id)
            logger.info(f"User retrieved successfully. ID: {user.id}, Username: {user.username}")
            print(user)

            # Create a dictionary with only the attributes that actually exist
            user_data = {
                'id': getattr(user, 'id', None),
                'username': getattr(user, 'username', None),
                'email': getattr(user, 'email', None),
                'first_name': getattr(user, 'first_name', None),
                'last_name': getattr(user, 'last_name', None),
                'bio': getattr(user, 'bio', None),
                'website': getattr(user, 'website', None),
                'location': getattr(user, 'location', None),
                'profile_picture': getattr(user, 'profile_picture', None),
                'social_profiles': getattr(user, 'social_profiles', None),
                'last_active': getattr(user, 'last_active', None),
                'is_author': getattr(user, 'is_author', False),
                'role': getattr(user, 'role', None),
                'is_superuser': getattr(user, 'is_superuser', False),
                'is_staff': getattr(user, 'is_staff', False),
                'is_active': getattr(user, 'is_active', False),
                'is_authenticated': True
            }

            return user_data

        except AttributeError as e:
            logger.warning(f"Missing attribute while retrieving user data: {str(e)}")
            return None

        except Exception as e:
            logger.error(f"Unexpected error retrieving user data: {str(e)}")
            return None

class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view with AllowAny permission.
    """
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
        """
        Handle POST requests to refresh JWT token.
        
        Args:
            request (HttpRequest): The HTTP request object.
            
        Returns:
            Response: Refreshed JWT access token.
        """
        logger.info("Received token refresh request")
        return super().post(request, *args, **kwargs)

class CustomUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CustomUser model operations.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    @extend_schema(
        summary="Get current user",
        description="Retrieve information about the current authenticated user",
        responses={200: CustomUserSerializer}
    )
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Retrieve information about the current authenticated user.
        
        Args:
            request (HttpRequest): The HTTP request object.
            
        Returns:
            Response: Serialized data of the current user.
        """
        logger.info("Retrieving user info for authenticated user")
        logger.debug(f"User info retrieved. Username: {request.user.username}")
        return Response(CustomUserSerializer(request.user).data)

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
        """
        Check if the current user is authenticated.
        
        Args:
            request (HttpRequest): The HTTP request object.
            
        Returns:
            Response: Authentication status and user data if authenticated.
        """
        logger.info("Checking authentication status")
        if request.user.is_authenticated:
            logger.debug("User authenticated")
            user_data = {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'bio': request.user.bio,
                'website': request.user.website,
                'location': request.user.location,
                'profile_picture': request.user.profile_picture,
                'social_profiles': request.user.social_profiles,
                'last_active': request.user.last_active,
                'is_author': request.user.is_author,
                'role': request.user.role,
            }
            logger.info(f"Authentication successful. User data: {user_data}")
            return Response({
                'is_authenticated': True,
                'user': user_data
            })
        logger.warning("User not authenticated")
        return Response({'is_authenticated': False})

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        logger.info("Received logout request")
        try:
            refresh_token = request.data.get('refresh_token')
            logger.debug(f"Attempting to blacklist refresh token: {refresh_token[:20]}...")
            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info("Refresh token blacklisted successfully")
            return Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Check admin status",
        description="Check if a user with given credentials is an admin",
        responses={200: {
            "type": "object",
            "properties": {
                "is_admin": {"type": "boolean"},
                "message": {"type": "string"}
            }
        }},
        parameters=[
            OpenApiParameter(name="username", type=str, required=True),
            OpenApiParameter(name="password", type=str, required=True)
        ]
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def check_admin_status(self, request):
        username = request.GET.get('username')
        password = request.GET.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'is_admin': False, 'message': 'Invalid credentials'})

        # Check if the authenticated user is a superuser
        is_admin = user.is_superuser
        
        if is_admin:
            message = f"{username} is an admin"
        else:
            message = f"{username} is not an admin"

        logger.info(f"Admin status checked for user: {username}")
        logger.debug(f"Admin status: {is_admin}")

        return Response({'is_admin': is_admin, 'message': message})

class TagViewSet(BaseModelViewSet):
    """
    ViewSet for Tag model operations.
    """
    queryset = Tag.objects.all().order_by('id')
    serializer_class = TagSerializer

    @action(detail=False, methods=['get'])
    def most_used(self, request):
        """
        Retrieve the most used tags.
        
        Args:
            request (HttpRequest): The HTTP request object.
            
        Returns:
            Response: Serialized data of the most used tags.
        """
        limit = int(request.query_params.get('limit', 10))
        tags = Tag.objects.annotate(post_count=Count('posts')).order_by('-post_count')[:limit]
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)

class CategoryViewSet(BaseModelViewSet):
    """
    ViewSet for Category model operations.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [DynamicJwtPermission]

    @action(detail=True, methods=['get'])
    def subcategories(self, request, pk=None):
        """
        Retrieve subcategories for a given category.
        
        Args:
            request (HttpRequest): The HTTP request object.
            pk (int): The primary key of the parent category.
            
        Returns:
            Response: Serialized data of the subcategories.
        """
        category = self.get_object()
        logger.info(f"Retrieving subcategories for category: {category.name}")
        subcategories = category.subcategories.all()
        serializer = self.get_serializer(subcategories, many=True)
        return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'tags', 'publication_date', 'author']
    search_fields = ['title', 'content']
    ordering_fields = ['view_count', 'created_at', 'upvotes']

    def get_permissions(self):
        logger.debug(f"Getting permissions for action: {self.action}")
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [DynamicJwtPermission]
        elif self.action == 'publish':
            permission_classes = [IsAdminOrReadOnly]
        else:
            permission_classes = [IsOwnerOrReadOnly]
        logger.debug(f"Permission classes: {permission_classes}")
        return [permission() for permission in permission_classes]

    def check_post_permissions(self, request):
        if self.action == 'create':
            return request.user and request.user.is_authenticated
        elif self.action in ['update', 'partial_update', 'destroy']:
            return request.user and request.user.is_authenticated and (request.user.is_staff or request.user == self.get_object().author)
        elif self.action == 'publish':
            return request.user and request.user.is_staff
        else:
            return True  # For list, retrieve, and other safe methods


    def create(self, request, *args, **kwargs):
        logger.info("Received POST request to create a new post")
        logger.debug(f"Creating post for user: {request.user.username}")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)  # Set the author to the current user
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def publish(self, request, pk=None):
        logger.info(f"Publishing post with ID: {pk}")
        post = self.get_object()
        if post.status == 'draft':
            post.status = 'published'
            post.publication_date = timezone.now().date()
            post.save()
            serializer = self.get_serializer(post)
            logger.info("Post published successfully")
            return Response(serializer.data)
        logger.warning("Attempt to publish already published post")
        return Response({'detail': 'Post is already published'}, status=status.HTTP_400_BAD_REQUEST)

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
        logger.info("Listing posts")
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            logger.debug(f"Paginated queryset size: {len(page)}")
            return self.get_paginated_response(self.get_serializer(page, many=True).data)
        serializer = self.get_serializer(queryset, many=True)
        logger.debug(f"Serialized queryset size: {len(serializer.data)}")
        return Response(serializer.data)

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
            logger.debug("Returning filtered queryset for authenticated author")
            return queryset.filter(Q(is_public=True) | Q(author=self.request.user))
        logger.debug("Returning filtered queryset for public posts")
        return queryset.filter(is_public=True)

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        logger.info(f"Upvoting post with ID: {pk}")
        post = self.get_object()
        post.upvotes += 1
        post.save()
        logger.info("Post upvoted successfully")
        return Response({'status': 'Post upvoted successfully'})

    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        logger.info(f"Downvoting post with ID: {pk}")
        post = self.get_object()
        post.downvotes += 1
        post.save()
        logger.info("Post downvoted successfully")
        return Response({'status': 'Post downvoted successfully'})

    @action(detail=False, methods=['get'])
    def most_viewed(self, request):
        limit = int(request.query_params.get('limit', 10))
        logger.info(f"Retrieving most viewed posts. Limit: {limit}")
        most_viewed = self.get_queryset().order_by('-view_count')[:limit]
        serializer = self.get_serializer(most_viewed, many=True)
        logger.debug(f"Serialized most viewed posts: {serializer.data}")
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def view(self, request, pk=None):
        logger.info(f"Incrementing view count for post with ID: {pk}")
        post = self.get_object()
        post.view_count += 1
        post.save()
        serializer = self.get_serializer(post)
        logger.info("View count incremented successfully")
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        logger.info("Retrieving featured posts")
        queryset = Post.objects.filter(status='published').order_by('-upvotes', '-view_count')[:5]
        serializer = self.get_serializer(queryset, many=True)
        logger.debug(f"Serialized featured posts: {serializer.data}")
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def check_slug(self, request):
        logger.info("Checking slug availability")
        slug = request.data.get('slug')
        if Post.objects.filter(slug=slug).exists():
            logger.error("Slug already exists")
            return Response({'detail': 'Slug already exists'}, status=status.HTTP_400_BAD_REQUEST)
        logger.info("Slug is available")
        return Response({'detail': 'Slug is available'})

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        logger.info("Generating post analytics")
        total_posts = Post.objects.count()
        total_views = Post.objects.aggregate(Sum('view_count'))['view_count__sum'] or 0
        logger.info(f"Total posts: {total_posts}, Total views: {total_views}")
        return Response({'total_posts': total_posts, 'total_views': total_views})

    @action(detail=False, methods=['get'])
    def posts_by_category(self, request):
        logger.info("Retrieving posts by category")
        category_slug = request.query_params.get('slug')
        if not category_slug:
            logger.error("Category slug is required")
            return Response({'error': 'Category slug is required'}, status=status.HTTP_400_BAD_REQUEST)
        posts = self.get_queryset().filter(category__slug=category_slug)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

    @action(detail=False, methods=['get'])
    def posts_by_tag(self, request):
        logger.info("Retrieving posts by tag")
        tag_slug = request.query_params.get('slug')
        if not tag_slug:
            logger.error("Tag slug is required")
            return Response({'error': 'Tag slug is required'}, status=status.HTTP_400_BAD_REQUEST)
        posts = self.get_queryset().filter(tags__slug=tag_slug)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

    @action(detail=False, methods=['get'])
    def posts_by_author(self, request):
        logger.info("Retrieving posts by author")
        username = request.query_params.get('username')
        if not username:
            logger.error("Author username is required")
            return Response({'error': 'Author username is required'}, status=status.HTTP_400_BAD_REQUEST)
        posts = self.get_queryset().filter(author__username=username)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

    @action(detail=False, methods=['get'])
    def posts_by_date_range(self, request):
        logger.info("Retrieving posts by date range")
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if not start_date or not end_date:
            logger.error("Both start_date and end_date are required")
            return Response({'error': 'Both start_date and end_date are required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            posts = self.get_queryset().filter(publication_date__range=[start_date, end_date])
            logger.info(f"Retrieved posts between dates: {start_date} and {end_date}")
        except ValueError:
            logger.error("Invalid date format. Use YYYY-MM-DD.")
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        return self.get_paginated_response(self.get_serializer(posts, many=True).data)

class CommentViewSet(BaseModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [DynamicJwtPermission, IsOwnerOrReadOnly]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        logger.info(f"Approving comment with ID: {pk}")
        comment = self.get_object()
        if comment.approved:
            logger.warning("Comment is already approved")
            return Response({'detail': 'Comment is already approved'}, status=status.HTTP_400_BAD_REQUEST)
        
        comment.approved = True
        comment.save()
        logger.info("Comment approved successfully")
        return Response({'detail': 'Comment approved successfully'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        logger.info(f"Rejecting comment with ID: {pk}")
        comment = self.get_object()
        # Implement rejection logic here
        comment.rejected = True
        comment.save()
        logger.info("Comment rejected successfully")
        return Response({'detail': 'Comment rejected successfully'})

    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        logger.info(f"Reporting comment with ID: {pk}")
        comment = self.get_object()
        if comment.reported:
            logger.warning("Comment has already been reported")
            return Response({'detail': 'Comment has already been reported'}, status=status.HTTP_400_BAD_REQUEST)
        
        comment.reported = True
        comment.save()
        logger.info("Comment reported successfully")
        return Response({'detail': 'Comment reported successfully'})

    @action(detail=True, methods=['post'])
    def delete(self, request, pk=None):
        logger.info(f"Deleting comment with ID: {pk}")
        comment = self.get_object()
        if not comment.author == request.user:
            logger.warning("Only the comment author can delete the comment")
            return Response({'detail': 'You cannot delete someone else\'s comment'}, status=status.HTTP_403_FORBIDDEN)
        
        comment.delete()
        logger.info("Comment deleted successfully")
        return Response({'detail': 'Comment deleted successfully'})

    @action(detail=True, methods=['get'])
    def for_post(self, request, pk=None):
        logger.info(f"Fetching comments for post with ID: {pk}")
        comments = self.get_queryset().filter(post_id=pk)
        serializer = self.get_serializer(comments, many=True)
        logger.debug(f"Serialized comments: {serializer.data}")
        return Response(serializer.data)

class NotificationViewSet(BaseModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [DynamicJwtPermission]

    @action(detail=False, methods=['get'])
    def unread(self, request):
        logger.info("Retrieving unread notifications")
        unread_notifications = self.get_queryset().filter(read=False)
        serializer = self.get_serializer(unread_notifications, many=True)
        logger.debug(f"Serialized unread notifications: {serializer.data}")
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        logger.info("Marking notifications as read")
        notification_ids = request.data.get('ids', [])
        if not notification_ids:
            logger.error("No notification IDs provided")
            return Response({'detail': 'Please provide notification IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        notifications = self.get_queryset().filter(id__in=notification_ids)
        for notification in notifications:
            notification.read = True
            notification.save()
        
        logger.info(f"Marked {len(notifications)} notifications as read")
        return Response({'detail': f'Marked {len(notifications)} notifications as read'})

    @action(detail=False, methods=['post'])
    def clear_all(self, request):
        logger.info("Clearing all notifications")
        Notification.objects.all().delete()
        logger.info("All notifications cleared successfully")
        return Response({'detail': 'All notifications cleared successfully'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        logger.info("Marking all notifications as read")
        notifications = self.get_queryset().filter(read=False)
        notifications.update(read=True)
        logger.info(f"Marked {notifications.count()} notifications as read")
        return Response({'detail': f'Marked {notifications.count()} notifications as read'})

class AuthorViewSet(BaseModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [DynamicJwtPermission]

    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        logger.info(f"Retrieving posts for author with ID: {pk}")
        author = self.get_object()
        posts = Post.objects.filter(author=author).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        logger.debug(f"Serialized posts: {serializer.data}")
        return Response(serializer.data)

class UserActivityViewSet(BaseModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [DynamicJwtPermission]

    @action(detail=True, methods=['get'])
    def activity(self, request, pk=None):
        logger.info(f"Retrieving activity for user with ID: {pk}")
        user = self.get_object()
        activity = Activity.objects.filter(user=user).order_by('-timestamp')
        serializer = self.get_serializer(activity, many=True)
        logger.debug(f"Serialized activity: {serializer.data}")
        return Response(serializer.data)

class SearchViewSet(BaseModelViewSet):
    """
    ViewSet for search functionality.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [DynamicJwtPermission]

    @action(detail=False, methods=['get'])
    def autocomplete(self, request):
        """
        Provide autocomplete suggestions based on the search query.
        
        Args:
            request (HttpRequest): The HTTP request object.
            
        Returns:
            Response: Serialized data of the autocomplete suggestions.
        """
        query = request.query_params.get('q', '')
        logger.info(f"Autocomplete search query: {query}")
        posts = Post.objects.filter(Q(title__icontains=query) | Q(content__icontains=query))
        serializer = self.get_serializer(posts, many=True)
        logger.debug(f"Autocomplete results: {serializer.data}")
        return Response(serializer.data[:10])  # Return only top 10 results
