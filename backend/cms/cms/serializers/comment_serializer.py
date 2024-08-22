from rest_framework import serializers
from cms.models.comment_model import Comment

class CommentSerializer(serializers.ModelSerializer):
    post = serializers.StringRelatedField()  # Display post title instead of ID
    author = serializers.StringRelatedField()  # Display author username instead of ID
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S%z')  # ISO format
    updated_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S%z')  # ISO format

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at', 'updated_at', 'sentiment_score', 'moderation_status', 'upvotes', 'downvotes']
        read_only_fields = ['author', 'created_at', 'updated_at', 'upvotes', 'downvotes']  # author, created_at, updated_at, upvotes, and downvotes are read-only
