from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cms.models.post_model import Post
from cms.serializers.post_serializer import PostSerializer
from cms.models.comment_model import Comment
from cms.serializers.comment_serializer import CommentSerializer

class PendingContentListView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Filter pending posts and comments
        posts = Post.objects.filter(status='pending')
        comments = Comment.objects.filter(moderation_status='pending')
        
        # Serialize the data
        post_serializer = PostSerializer(posts, many=True)
        comment_serializer = CommentSerializer(comments, many=True)
        
        return Response({
            'posts': post_serializer.data,
            'comments': comment_serializer.data
        })

class ApproveContentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        content_type = request.data.get('content_type')  # 'post' or 'comment'
        content_id = kwargs.get('id')
        
        if content_type == 'post':
            try:
                post = Post.objects.get(id=content_id)
                post.status = 'approved'
                post.save()
                return Response({'status': 'Post approved'}, status=status.HTTP_200_OK)
            except Post.DoesNotExist:
                return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        elif content_type == 'comment':
            try:
                comment = Comment.objects.get(id=content_id)
                comment.moderation_status = 'approved'
                comment.save()
                return Response({'status': 'Comment approved'}, status=status.HTTP_200_OK)
            except Comment.DoesNotExist:
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid content type'}, status=status.HTTP_400_BAD_REQUEST)

class RejectContentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        content_type = request.data.get('content_type')  # 'post' or 'comment'
        content_id = kwargs.get('id')
        
        if content_type == 'post':
            try:
                post = Post.objects.get(id=content_id)
                post.status = 'rejected'
                post.save()
                return Response({'status': 'Post rejected'}, status=status.HTTP_200_OK)
            except Post.DoesNotExist:
                return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        elif content_type == 'comment':
            try:
                comment = Comment.objects.get(id=content_id)
                comment.moderation_status = 'rejected'
                comment.save()
                return Response({'status': 'Comment rejected'}, status=status.HTTP_200_OK)
            except Comment.DoesNotExist:
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid content type'}, status=status.HTTP_400_BAD_REQUEST)