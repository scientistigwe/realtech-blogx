from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomUserViewSet,
    CategoryViewSet,
    TagViewSet,
    PostViewSet,
    CommentViewSet,
    NotificationViewSet
)

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    # JWT Authentication endpoints
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/token/check_auth/', CustomTokenObtainPairView.as_view(), name='check_auth'),
    path('auth/token/logout/', CustomTokenObtainPairView.as_view(), name='token_logout'),

    # API documentation endpoints
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Include all router-generated URLs
    path('cms-api/v1/', include(router.urls)),
]

# Custom action URLs
urlpatterns += [
    path('cms-api/v1/users/me/', CustomUserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('cms-api/v1/categories/<int:pk>/subcategories/', CategoryViewSet.as_view({'get': 'subcategories'}), name='category-subcategories'),
    path('cms-api/v1/tags/most_used/', TagViewSet.as_view({'get': 'most_used'}), name='tag-most-used'),
    path('cms-api/v1/posts/most_viewed/', PostViewSet.as_view({'get': 'most_viewed'}), name='post-most-viewed'),
    path('cms-api/v1/posts/featured/', PostViewSet.as_view({'get': 'featured'}), name='post-featured'),
    path('cms-api/v1/posts/check_slug/', PostViewSet.as_view({'post': 'check_slug'}), name='post-check-slug'),
    path('cms-api/v1/posts/analytics/', PostViewSet.as_view({'post': 'analytics'}), name='post-analytics'),
    path('cms-api/v1/posts/by_category/', PostViewSet.as_view({'get': 'posts_by_category'}), name='posts-by-category'),
    path('cms-api/v1/posts/by_tag/', PostViewSet.as_view({'get': 'posts_by_tag'}), name='posts-by-tag'),
    path('cms-api/v1/posts/by_author/', PostViewSet.as_view({'get': 'posts_by_author'}), name='posts-by-author'),
    path('cms-api/v1/posts/by_date_range/', PostViewSet.as_view({'get': 'posts_by_date_range'}), name='posts-by-date-range'),
    path('cms-api/v1/posts/<int:pk>/publish/', PostViewSet.as_view({'post': 'publish'}), name='post-publish'),
    path('cms-api/v1/posts/<int:pk>/upvote/', PostViewSet.as_view({'post': 'upvote'}), name='post-upvote'),
    path('cms-api/v1/posts/<int:pk>/downvote/', PostViewSet.as_view({'post': 'downvote'}), name='post-downvote'),
    path('cms-api/v1/comments/<int:pk>/approve/', CommentViewSet.as_view({'post': 'approve'}), name='comment-approve'),
    path('cms-api/v1/comments/<int:pk>/reject/', CommentViewSet.as_view({'post': 'reject'}), name='comment-reject'),
    path('comments/for-post/', CommentViewSet.as_view({'get': 'for_post'}), name='comments_for_post'),
    path('notifications/unread/', NotificationViewSet.as_view({'get': 'unread'}), name='unread_notifications'),
    path('cms-api/v1/notifications/<int:pk>/mark_as_read/', NotificationViewSet.as_view({'post': 'mark_as_read'}), name='notification-mark-as-read'),
    path('cms-api/v1/notifications/mark_all_as_read/', NotificationViewSet.as_view({'post': 'mark_all_as_read'}), name='notification-mark-all-as-read'),
]
