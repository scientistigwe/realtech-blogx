from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from cms.models.post_model import Post
from cms.models.comment_model import Comment
from cms.serializers.post_serializer import PostSerializer
from cms.serializers.comment_serializer import CommentSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Custom Permission Class
class IsModerator(BasePermission):
    """
    Custom permission to only allow moderators or admins to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)

# Serializers
class PendingContentSerializer(serializers.Serializer):
    posts = PostSerializer(many=True)
    comments = CommentSerializer(many=True)

class ApproveRejectContentSerializer(serializers.Serializer):
    content_type = serializers.ChoiceField(choices=['post', 'comment'])

# Views
class PendingContentListView(generics.ListAPIView):
    """
    Retrieves a list of pending posts and comments for moderation.
    URL: /moderation/pending-content/
    """
    permission_classes = [IsModerator]
    serializer_class = PendingContentSerializer

    @swagger_auto_schema(
        operation_description="Retrieve a list of pending posts and comments for moderation",
        responses={
            200: openapi.Response('Success', PendingContentSerializer()),
            401: openapi.Response('Unauthorized'),
        },
    )
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return {'posts': [], 'comments': []}
        
        posts = Post.objects.filter(status='pending')
        comments = Comment.objects.filter(moderation_status='pending')
        
        return {'posts': posts, 'comments': comments}

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        post_serializer = PostSerializer(data['posts'], many=True)
        comment_serializer = CommentSerializer(data['comments'], many=True)
        
        return Response({
            'posts': post_serializer.data,
            'comments': comment_serializer.data
        })

class ApproveRejectContentView(generics.GenericAPIView):
    """
    Approves or rejects a post or comment.
    URL: /moderation/<approve/reject>-content/<id>/
    """
    permission_classes = [IsModerator]
    lookup_field = 'id'
    serializer_class = ApproveRejectContentSerializer

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.status_value = None  # This will be set by subclasses

    @swagger_auto_schema(
        operation_description="Approve or reject a post or comment",
        request_body=ApproveRejectContentSerializer,
        responses={
            200: openapi.Response('Success', openapi.Schema(type=openapi.TYPE_STRING)),
            400: openapi.Response('Bad Request'),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        },
    )
    def post(self, request, *args, **kwargs):
        if getattr(self, 'swagger_fake_view', False):
            return Response({'status': self.status_value})

        return self._update_content_status(request, self.status_value)

    def _update_content_status(self, request, status_value):
        content_type = request.data.get('content_type')
        content_id = self.kwargs.get(self.lookup_field)

        if content_type == 'post':
            return self._update_post_status(content_id, status_value)
        elif content_type == 'comment':
            return self._update_comment_status(content_id, status_value)
        else:
            return Response({'error': 'Invalid content type'}, status=status.HTTP_400_BAD_REQUEST)

    def _update_post_status(self, content_id, status_value):
        try:
            post = Post.objects.get(id=content_id)
            post.status = status_value
            post.save()
            return Response({'status': f'Post {status_value}'}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    def _update_comment_status(self, content_id, status_value):
        try:
            comment = Comment.objects.get(id=content_id)
            comment.moderation_status = status_value
            comment.save()
            return Response({'status': f'Comment {status_value}'}, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

class ApproveContentView(ApproveRejectContentView):
    status_value = 'approved'

class RejectContentView(ApproveRejectContentView):
    status_value = 'rejected'
