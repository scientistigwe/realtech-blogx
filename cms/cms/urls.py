from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, TagViewSet, PostViewSet, CommentViewSet,
    NotificationViewSet, RegisterView, LogoutView, PasswordChangeViewSet,
    PasswordResetConfirmViewSet, AccountViewSet, CustomUserViewSet, 
    request_password_reset, IndexViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Swagger schema view configuration
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

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'tags', TagViewSet, basename='tags')
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'users', CustomUserViewSet, basename='users')
router.register(r'account', AccountViewSet, basename='account')

urlpatterns = [
    # Home and API Token URLs
    path('', IndexViewSet.as_view(), name='homepage'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Custom URL patterns
    path('register-user/', RegisterView.as_view(), name='register_user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-change/', PasswordChangeViewSet.as_view({'post': 'change_password'}), name='password_change'),
    path('password-reset/request/', request_password_reset, name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmViewSet.as_view({'post': 'confirm_reset'}), name='password_reset_confirm'),

    # API Docs (Swagger/Redoc)
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema_swagger_ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema_redoc'),

    # Include router URLs
    path('', include(router.urls)),  # Make sure to use the appropriate API prefix
]
