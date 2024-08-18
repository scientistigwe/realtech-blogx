from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from cms.models.media_upload_model import MediaUpload
from cms.models.post_model import Post
from cms.serializers.media_upload_serializer import MediaUploadSerializer
from cms.views.permission_view import IsAuthorOrReadOnly

class MediaUploadViewSet(viewsets.ModelViewSet):
    queryset = MediaUpload.objects.all()
    serializer_class = MediaUploadSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            # queryset just for schema generation metadata
            return MediaUpload.objects.none()
        return MediaUpload.objects.filter(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Create a new media upload for the authenticated user.",
        request_body=MediaUploadSerializer,
        responses={201: MediaUploadSerializer()}
    )
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Delete a specific media upload.",
        responses={
            204: "No content",
            403: "Forbidden - You do not have permission to delete this upload."
        }
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        operation_description="List all media uploads for the authenticated user.",
        responses={200: MediaUploadSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def my_uploads(self, request):
        uploads = self.get_queryset()
        serializer = self.get_serializer(uploads, many=True)
        return Response(serializer.data)

# ----------------------------
# Image Handling Views
# ----------------------------

@api_view(['POST'])
def upload_profile_picture(request):
    """
    Handles uploading a profile picture for the authenticated user.
    """
    profile_picture = request.FILES.get('profile_picture')
    if not profile_picture:
        return Response({'detail': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

    request.user.profile_picture = profile_picture
    request.user.save()

    return Response({'detail': 'Profile picture uploaded successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def upload_post_thumbnail(request):
    """
    Handles uploading a thumbnail image for a post.
    """
    post = get_object_or_404(Post, id=request.data.get('post_id'))
    thumbnail = request.FILES.get('thumbnail')
    
    if not thumbnail:
        return Response({'detail': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

    post.thumbnail = thumbnail
    post.save()

    return Response({'detail': 'Thumbnail uploaded successfully.'}, status=status.HTTP_200_OK)
