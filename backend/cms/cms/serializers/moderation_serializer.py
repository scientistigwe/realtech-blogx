from rest_framework import serializers
from cms.models.post_model import Post
from cms.serializers.post_serializer import PostSerializer
from cms.serializers.comment_serializer import CommentSerializer

class PendingContentSerializer(serializers.Serializer):
    posts = PostSerializer(many=True)
    comments = CommentSerializer(many=True)

class ApproveRejectContentSerializer(serializers.Serializer):
    content_type = serializers.ChoiceField(choices=['post', 'comment'])

class ApproveRejectContentSerializer(serializers.Serializer):
    content_type = serializers.ChoiceField(choices=['post', 'comment'])
