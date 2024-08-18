from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from cms.views.auth_view import (
    RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView, 
    CheckAuthenticationView
)
from cms.views.profile_view import (
    UserProfileDetailView, ProfileUpdateView, PasswordResetView, 
    DeleteAccountView, CurrentUserProfileView
)
from cms.views.post_view import (
    PostViewSet, PostCreateView, PostDetailView, PostUpdateView, PostDeleteView, 
    PostEngagementViewSet, most_viewed_posts,
)
from cms.views.comment_view import (
    CommentViewSet, CommentCreateView, CommentUpvoteView, CommentDownvoteView
)
from cms.views.author_view import (
    AuthorViewSet, AuthorDetailView, ContactAuthorView, AuthorPostViewSet
)
from cms.views.notification_view import (
    NotificationListView, NotificationUpdateView, NotificationCreateView
)
from cms.views.media_upload_view import (
    MediaUploadViewSet, upload_profile_picture, upload_post_thumbnail
)
from cms.views.moderation_view import (
    PendingContentListView,
    ApproveContentView,
    RejectContentView
)
from cms.views.search_view import SearchPostsView
from cms.views.tag_view import TagViewSet
from cms.views.custom_user_view import CustomUserViewSet

# Set up the DRF router
router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'post-engagements', PostEngagementViewSet, basename='post-engagement')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'media-uploads', MediaUploadViewSet, basename='media-upload')
router.register(r'users', CustomUserViewSet, basename='user')

# Swagger/OpenAPI schema view
schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="API for managing blog posts, media uploads, user profiles, and more.",
        terms_of_service="https://www.example.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Define URL patterns
urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/check-authentication/', CheckAuthenticationView.as_view(), name='check_authentication'),

    # User profile endpoints
    path('users/me/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('users/<int:id>/profile/', UserProfileDetailView.as_view(), name='user_profile_detail'),
    path('users/<int:id>/profile/update/', ProfileUpdateView.as_view(), name='profile_update'),
    path('users/<int:id>/profile/reset-password/', PasswordResetView.as_view(), name='password_reset'),
    path('users/<int:id>/profile/delete-account/', DeleteAccountView.as_view(), name='delete_account'),
    path('upload/profile-picture/', upload_profile_picture, name='upload_profile_picture'),

    # Post endpoints
    path('posts/create/', PostCreateView.as_view(), name='post_create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/<int:pk>/update/', PostUpdateView.as_view(), name='post_update'),
    path('posts/<int:pk>/delete/', PostDeleteView.as_view(), name='post_delete'),
    path('posts/most-viewed/', most_viewed_posts, name='most_viewed_posts'),

    # Fetch posts by category and subcategory
    path('posts/category/<slug:category>/', PostViewSet.as_view({'get': 'by_category'}), name='posts_by_category'),
    path('posts/subcategory/<slug:subcategory>/', PostViewSet.as_view({'get': 'by_subcategory'}), name='posts_by_subcategory'),

    # Fetch posts by user
    path('posts/user/<int:user_id>/', PostViewSet.as_view({'get': 'by_user'}), name='posts_by_user'),

    # Upvote and downvote endpoints for posts
    path('posts/<int:post_id>/upvote/', PostViewSet.as_view({'get': 'post_upvote'}), name='post_upvote'),
    path('posts/<int:post_id>/downvote/', PostViewSet.as_view({'get': 'post_downvote'}), name='post_downvote'),

    # Upvote and downvote endpoints for comments
    path('comments/<int:comment_id>/upvote/', CommentUpvoteView.as_view(), name='comment_upvote'),
    path('comments/<int:comment_id>/downvote/', CommentDownvoteView.as_view(), name='comment_downvote'),

    # Comments endpoint
    path('posts/<int:post_id>/comments/', CommentCreateView.as_view(), name='comment_create'),

    # Author endpoints
    path('authors/<str:username>/', AuthorDetailView.as_view(), name='author_detail'),
    path('authors/<int:author_id>/contact/', ContactAuthorView.as_view(), name='contact_author'),
    path('posts/author-posts/', AuthorPostViewSet.as_view({'get': 'list_all'}), name='author-posts-all'),
    path('posts/author-posts/<int:author_id>/', AuthorPostViewSet.as_view({'get': 'posts_by_author'}), name='author-posts-by-author'),

    # Search endpoint
    path('search/posts/', SearchPostsView.as_view(), name='search_posts'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', NotificationUpdateView.as_view(), name='notification-read'),
    path('notifications/create/', NotificationCreateView.as_view(), name='notification-create'),

    # Image upload endpoints
    path('upload/post-thumbnail/', upload_post_thumbnail, name='upload_post_thumbnail'),

    # Moderation endpoints
    path('moderation/pending-content/', PendingContentListView.as_view(), name='pending_content'),
    path('moderation/approve-content/<int:id>/', ApproveContentView.as_view(), name='approve_content'),
    path('moderation/reject-content/<int:id>/', RejectContentView.as_view(), name='reject_content'),

    # Swagger/OpenAPI schema endpoints
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Include router URLs
    path('', include(router.urls)),
]
