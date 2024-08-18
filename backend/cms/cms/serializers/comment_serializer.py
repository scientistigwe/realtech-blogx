from rest_framework import serializers
from cms.models.comment_model import Comment
from cms.serializers.custom_user_serializer import CustomUserSerializer
from cms.serializers.post_serializer import PostSerializer

class CommentSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'author', 'content', 'sentiment_score', 'moderation_status', 
            'created_at', 'updated_at', 'upvotes', 'downvotes'
        ]

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['post', 'content']