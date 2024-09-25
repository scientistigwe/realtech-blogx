"""
Django REST Framework serializers for the blog application.

This module defines the serializers for the various models in the blog application,
including custom users, categories, tags, posts, comments, and notifications.
"""
from rest_framework import serializers
from .models import CustomUser, Category, Tag, Post, Comment, Notification
from django.db import transaction

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.

    This serializer is used to serialize and deserialize the CustomUser model,
    which extends the default Django User model with additional fields.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'website', 'location', 'profile_picture', 'social_profiles', 'last_active', 'is_author', 'role']
        read_only_fields = ['id', 'last_active']

class ContactMessageSerializer(serializers.Serializer):
    """
    Serializer for handling contact messages.

    This serializer is used to validate and serialize contact messages sent by users.
    """
    title = serializers.CharField(max_length=100)
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField()

    def validate(self, data):
        """
        Validate the contact message data.

        Args:
            data (dict): The data to be validated.

        Returns:
            dict: The validated data.

        Raises:
            serializers.ValidationError: If the title or message is missing.
        """
        if not data.get('title') or not data.get('message'):
            raise serializers.ValidationError("Title and message are required.")
        return data

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.

    This serializer is used to serialize and deserialize the Category model,
    which represents a category for blog posts.
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']

class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tag model.

    This serializer is used to serialize and deserialize the Tag model,
    which represents a tag for blog posts.
    """
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.

    This serializer is used to serialize and deserialize the Post model,
    which represents a blog post. It also handles the creation and update
    of posts, including the associated category and tags.
    """
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
        """
        Create a new post.

        Args:
            validated_data (dict): The validated data to create the post.

        Returns:
            Post: The created post instance.
        """
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
        """
        Update an existing post.

        Args:
            instance (Post): The post instance to be updated.
            validated_data (dict): The validated data to update the post.

        Returns:
            Post: The updated post instance.
        """
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
    """
    Serializer for the Comment model.

    This serializer is used to serialize and deserialize the Comment model,
    which represents a comment on a blog post.
    """
    author = CustomUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'sentiment_score', 'moderation_status', 'upvotes', 'downvotes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sentiment_score', 'moderation_status', 'upvotes', 'downvotes', 'created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Notification model.

    This serializer is used to serialize and deserialize the Notification model,
    which represents a notification for a user.
    """
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']