from rest_framework import serializers
from cms.models.post_model import Post, PostEngagement
from cms.models.tag_model import Tag

# Tag Serializer
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

# Base Serializer with Common Fields
class PostBaseSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()  # Show username instead of ID
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'excerpt', 'author', 'status', 
            'meta_description', 'meta_title', 'publication_date', 
            'meta_keywords', 'slug', 'is_public', 'thumbnail', 
            'created_at', 'updated_at', 'primary_category', 
            'subcategory', 'view_count', 'upvotes', 'downvotes'
        ]

# Serializer for Basic Post Details (Visible to all users)
class PostSerializer(PostBaseSerializer):
    class Meta(PostBaseSerializer.Meta):
        fields = PostBaseSerializer.Meta.fields

# Serializer for Detailed Post (Author and Admin)
class PostDetailSerializer(PostBaseSerializer):
    content = serializers.CharField()  # Include content for detailed view

    class Meta(PostBaseSerializer.Meta):
        fields = PostBaseSerializer.Meta.fields + ['content']

# Serializer for Admin Views
class PostAdminSerializer(PostDetailSerializer):
    search_vector = serializers.CharField()  # Include search_vector for admin views

    class Meta(PostDetailSerializer.Meta):
        fields = PostDetailSerializer.Meta.fields + ['search_vector']

# Post Engagement Serializer (Visible to all users)
class PostEngagementSerializer(serializers.ModelSerializer):
    post = serializers.StringRelatedField()  # Show post title instead of ID
    
    class Meta:
        model = PostEngagement
        fields = [
            'id', 'post', 'clicks', 'sessions', 'conversions', 
            'created_at', 'updated_at', 'score'
        ]

# User Role-Based Serializer Factory
def get_post_serializer(user, detailed=False):
    """
    Return the appropriate post serializer based on the user type and requested detail level.
    """
    if user.is_staff:  # Admin user
        return PostAdminSerializer
    elif user.is_author:  # Author user
        return PostDetailSerializer if detailed else PostSerializer
    else:  # Regular user
        return PostSerializer


