from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),

    # API URLs
    path('', include('cms.urls')),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Only serve media files in DEBUG mode
if not settings.DEBUG:
    urlpatterns.pop()
