from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.conf.urls.static import static
from django_prometheus import urls as prometheus_urls

# Create a schema view for Swagger and ReDoc
schema_view = get_schema_view(
    openapi.Info(
        title="RealTech BlogX API",
        default_version='v1',
        description="API documentation for RealTech BlogX project.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@realtechblogx.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('cms-api/v1/', include('cms.urls')),
    path('', include(prometheus_urls)),  # Expose Prometheus metrics at `/metrics/`

    # Swagger and ReDoc documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

