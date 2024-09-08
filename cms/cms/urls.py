from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
CategoryViewSet, TagViewSet, PostViewSet,
    CommentViewSet, NotificationViewSet, RegisterView, LogoutView,
   PasswordChangeViewSet, PasswordResetConfirmViewSet, CategoryViewSet,
    CommentViewSet, AccountViewSet, LogoutView, NotificationViewSet,
    PostViewSet, TagViewSet, CustomUserViewSet, request_password_reset, IndexViewSet
    )
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="RealTech BlogX API",
      default_version='v1',
      description="API documentation for RealTech BlogX project.",
      terms_of_service="https://www.yourapp.com/terms/",
      contact=openapi.Contact(email="contact@realtechblogx.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# API Token URLs
urlpatterns = [
   path('', IndexViewSet.as_view(), name='homepage'),    
   path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
   
    # Categories URLs
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='categories_list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='categories_read'),
    
    # Comments URLs
    path('comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='comments_list'),
    path('comments/<int:pk>/', CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='comments_read'),
    path('comments/<int:pk>/downvote/', CommentViewSet.as_view({'post': 'downvote'}), name='comments_downvote'),
    path('comments/<int:pk>/moderate/', CommentViewSet.as_view({'post': 'moderate'}), name='comments_moderate'),
    path('comments/<int:pk>/upvote/', CommentViewSet.as_view({'post': 'upvote'}), name='comments_upvote'),
    
    # Create User URL    
    path('register-user/', RegisterView.as_view(), name='register-user'),
    
    # Delete Account URL
    path('delete-account/update_account/', AccountViewSet.as_view({'put': 'update_account'}), name='delete-account_update_account'),
    
    # Logout URL
    path('logout/', LogoutView.as_view(), name='logout_create'),
    
    # Notifications URLs
    path('notifications/', NotificationViewSet.as_view({'get': 'list', 'post': 'create'}), name='notifications_list'),
    path('notifications/mark_as_read/', NotificationViewSet.as_view({'post': 'mark_as_read'}), name='notifications_mark_as_read'),
    path('notifications/<int:pk>/', NotificationViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='notifications_read'),
    
    # Password Change URL
    path('password-change/change_password/', PasswordChangeViewSet.as_view({'post': 'change_password'}), name='password-change_change_password'),
    
    # Password Reset Confirm URL
    path('password-reset-confirm/confirm_reset/', PasswordResetConfirmViewSet.as_view({'post': 'confirm_reset'}), name='password-reset-confirm_confirm_reset'),
    
    # Password Reset Request URL
      path('password-reset/request_reset/', request_password_reset, name='password-reset_request_reset'),

    # Posts URLs
    path('posts/', PostViewSet.as_view({'get': 'list', 'post': 'create'}), name='posts_list'),
    path('posts/by-category/', PostViewSet.as_view({'get': 'posts_by_category'}), name='posts_posts_by_category'),
    path('posts/by-tag/', PostViewSet.as_view({'get': 'posts_by_tag'}), name='posts_posts_by_tag'),
    path('posts/check_slug/', PostViewSet.as_view({'post': 'check_slug'}), name='posts_check_slug'),
    path('posts/featured/', PostViewSet.as_view({'get': 'featured'}), name='posts_featured'),
    path('posts/most-viewed/', PostViewSet.as_view({'get': 'most_viewed'}), name='posts_most_viewed'),
    path('posts/search/', PostViewSet.as_view({'get': 'search'}), name='posts_search'),
    path('posts/<int:pk>/', PostViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='posts_read'),
    path('posts/<int:pk>/downvote/', PostViewSet.as_view({'post': 'downvote'}), name='posts_downvote'),
    path('posts/<int:pk>/engage/', PostViewSet.as_view({'post': 'engage'}), name='posts_engage'),
    path('posts/<int:pk>/upvote/', PostViewSet.as_view({'post': 'upvote'}), name='posts_upvote'),
    path('posts/<int:pk>/view/', PostViewSet.as_view({'get': 'view'}), name='posts_view'),
    
    # Tags URLs
    path('tags/', TagViewSet.as_view({'get': 'list', 'post': 'create'}), name='tags_list'),
    path('tags/<int:pk>/', TagViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='tags_read'),
    
    # Users URLs
    path('users/', CustomUserViewSet.as_view({'get': 'list', 'post': 'create'}), name='users_list'),
    path('users/me/', CustomUserViewSet.as_view({'get': 'retrieve_me'}), name='users_me'),
    path('users/<int:pk>/', CustomUserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='users_read'),
    path('users/<int:pk>/contact/', CustomUserViewSet.as_view({'post': 'contact'}), name='users_contact'),

   path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
