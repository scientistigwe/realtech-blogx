from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from . import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="RealTech BlogX API",
      default_version='v1',
      description="API documentation for RealTech BlogX project.",
      terms_of_service="https://www.insitechinternational.com/terms/",
      contact=openapi.Contact(email="contact@realtechblogx.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'authors', views.CustomUserViewSet, basename='author')  # Route for authors
router.register(r'users', views.CustomUserViewSet, basename='user')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'comments', views.CommentViewSet, basename='comment')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    # Custom actions
   path('api/check-auth/', views.check_auth, name='check_auth'),
    path('authors/<int:pk>/contact/', views.CustomUserViewSet.as_view({'post': 'contact'}), name='author-contact'),
    path('posts/<int:pk>/upvote/', views.PostViewSet.as_view({'post': 'upvote'}), name='post-upvote'),
    path('posts/<int:pk>/downvote/', views.PostViewSet.as_view({'post': 'downvote'}), name='post-downvote'),
    path('posts/most-viewed/', views.PostViewSet.as_view({'get': 'most_viewed'}), name='post-most-viewed'),
    path('posts/<int:pk>/view/', views.PostViewSet.as_view({'get': 'view'}), name='post-view'),
    path('posts/featured/', views.PostViewSet.as_view({'get': 'featured'}), name='post-featured'),
    # path('posts/check-slug/', views.PostViewSet.as_view({'post': 'check_slug'}), name='post-check-slug'),
    path('comments/<int:pk>/upvote/', views.CommentViewSet.as_view({'post': 'upvote'}), name='comment-upvote'),
    path('comments/<int:pk>/downvote/', views.CommentViewSet.as_view({'post': 'downvote'}), name='comment-downvote'),
    path('comments/<int:pk>/moderate/', views.CommentViewSet.as_view({'post': 'moderate'}), name='comment-moderate'),
    # path('notifications/<int:pk>/mark-as-read/', views.NotificationViewSet.as_view({'post': 'mark_as_read'}), name='notification-mark-as-read'),
    # path('notifications/mark-multiple-as-read/', views.NotificationViewSet.as_view({'post': 'mark_multiple_as_read'}), name='notification-mark-multiple-as-read'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

