from rest_framework import serializers
from .models import CustomUser, Category, Tag, Post, Comment, Notification

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'website', 'location', 'profile_picture', 'social_profiles', 'last_active', 'is_author', 'role']
        read_only_fields = ['id', 'last_active']

class ContactMessageSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=100)
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField()

    def validate(self, data):
        if not data.get('title') or not data.get('message'):
            raise serializers.ValidationError("Title and message are required.")
        return data
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'excerpt', 'author', 'status', 'meta_description', 'meta_title', 'publication_date', 'meta_keywords', 'slug', 'is_public', 'thumbnail', 'category', 'tags', 'view_count', 'upvotes', 'downvotes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'view_count', 'upvotes', 'downvotes', 'created_at', 'updated_at']

class CommentSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'sentiment_score', 'moderation_status', 'upvotes', 'downvotes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sentiment_score', 'moderation_status', 'upvotes', 'downvotes', 'created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']