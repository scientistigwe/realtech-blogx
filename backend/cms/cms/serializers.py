from rest_framework import serializers
from .models import CustomUser, Category, Tag, Post, Comment, Notification
from django.db import transaction

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

from django.db import transaction
from rest_framework import serializers
from .models import Post, Tag

class PostSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'excerpt', 'author', 'status', 'meta_description', 'meta_title', 'publication_date', 'meta_keywords', 'slug', 'is_public', 'thumbnail', 'category', 'category_id', 'tags', 'tag_names', 'view_count', 'upvotes', 'downvotes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'view_count', 'upvotes', 'downvotes', 'created_at', 'updated_at']

    @transaction.atomic
    def create(self, validated_data):
        category_id = validated_data.pop('category_id', None)
        tag_names = validated_data.pop('tag_names', [])
        
        post = Post.objects.create(**validated_data)
        
        if category_id:
            post.category_id = category_id
        
        if tag_names:
            tags = []
            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                tags.append(tag)
            post.tags.set(tags)
        
        post.save()
        return post

    @transaction.atomic
    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        tag_names = validated_data.pop('tag_names', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if category_id is not None:
            instance.category_id = category_id
        
        if tag_names is not None:
            tags = []
            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                tags.append(tag)
            instance.tags.set(tags)
        
        instance.save()
        return instance

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