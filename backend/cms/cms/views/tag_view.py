from rest_framework import viewsets
from cms.models.tag_model import Tag
from cms.serializers.tag_serializer import TagSerializer
from rest_framework.permissions import AllowAny

class TagViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for tags.
    URL: /tags/
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
