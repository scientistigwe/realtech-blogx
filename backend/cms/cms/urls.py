from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cms.views.custom_user_view import CustomUserViewSet
from cms.views.post_view import TagViewSet, PostViewSet, PostEngagementViewSet
from cms.views.notification_view import NotificationListView, NotificationUpdateView, NotificationCreateView
from cms.views.search_view import SearchPostsViewSet
from cms.views.moderation_view import PendingContentListView, ApproveContentView, RejectContentView
from cms.views.comment_view import (
    CommentListCreateView, CommentRetrieveUpdateDestroyView, CommentUpvoteView, CommentDownvoteView
)
from cms.views.custom_authentication_view import CustomRegisterView, CustomLoginView
from cms.views.moderation_view import (
    PendingContentListView,
    ApproveContentView,
    RejectContentView
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


# Set up the DRF router
router = DefaultRouter()
router.register(r'tags', TagViewSet, basename= 'tag')
router.register(r'posts', PostViewSet, basename= 'post')
router.register(r'post-engagements', PostEngagementViewSet, basename= 'post-engagement')
router.register(r'users', CustomUserViewSet, basename='user')
router.register(r'search/posts', SearchPostsViewSet, basename='search-posts')

# Define URL patterns
urlpatterns = [

    path('auth/register/', CustomRegisterView.as_view(), name='register'),
    path('auth/login/', CustomLoginView.as_view(), name='custom_login'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Upvote and downvote endpoints for comments
    path('comments/<int:comment_id>/upvote/', CommentUpvoteView.as_view(), name='comment_upvote'),
    path('comments/<int:comment_id>/downvote/', CommentDownvoteView.as_view(), name='comment_downvote'),

    # Comments
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-retrieve-update-destroy'),
    path('comments/<int:pk>/upvote/', CommentUpvoteView.as_view(), name='comment-upvote'),
    path('comments/<int:pk>/downvote/', CommentDownvoteView.as_view(), name='comment-downvote'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', NotificationUpdateView.as_view(), name='notification-update'),
    path('notifications/create/', NotificationCreateView.as_view(), name='notification-create'),

    # Moderation endpoints
    path('moderation/pending-content/', PendingContentListView.as_view(), name='pending-content-list'),
    path('moderation/approve-content/<int:id>/', ApproveContentView.as_view(), name='approve-content'),
    path('moderation/reject-content/<int:id>/', RejectContentView.as_view(), name='reject-content'),

    # Include router URLs
    path('', include(router.urls)),
]
