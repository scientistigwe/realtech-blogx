from rest_framework import serializers
from rest_framework.validators import ValidationError
from cms.models.author_model import Author
from cms.models.tag_model import Tag
from cms.models.post_model import Post, PrimaryCategory, Subcategory, PostEngagement
from cms.serializers.author_serializer import AuthorSerializer
from cms.serializers.tag_serializer import TagSerializer

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    primary_category = serializers.ChoiceField(choices=PrimaryCategory.choices)
    subcategory = serializers.ChoiceField(choices=Subcategory.choices, required=False)
    tags = TagSerializer(many=True, read_only=True)
    thumbnail = serializers.SerializerMethodField()
    upvotes = serializers.ReadOnlyField()
    downvotes = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'excerpt', 'author', 'status', 'meta_description', 
            'meta_title', 'publication_date', 'meta_keywords', 'slug', 'is_public', 
            'thumbnail', 'primary_category', 'subcategory', 'tags', 'created_at', 'upvotes', 'downvotes'
        ]
        read_only_fields = ['slug', 'upvotes', 'downvotes']

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None
    
class PostCreateSerializer(serializers.ModelSerializer):
    primary_category = serializers.ChoiceField(choices=PrimaryCategory.choices)
    subcategory = serializers.ChoiceField(choices=Subcategory.choices, required=False, allow_null=True)
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)
    thumbnail = serializers.ImageField(required=False)
    upvotes = serializers.ReadOnlyField()
    downvotes = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = [
            'title', 'content', 'excerpt', 'primary_category', 'subcategory', 
            'tags', 'status', 'meta_description', 'meta_keywords', 
            'is_public', 'thumbnail', 'upvotes', 'downvotes', 'created_at',
        ]

    read_only_fields = ['upvotes', 'downvotes']
    
    def create(self, validated_data):
        user = self.context['request'].user
        try:
            author = Author.objects.get(user=user)
            tags = validated_data.pop('tags', [])
            thumbnail = validated_data.pop('thumbnail', None)

            post = Post.objects.create(author=author, **validated_data)
            post.tags.set(tags)

            if thumbnail:
                post.thumbnail = thumbnail
                post.save()

            return post
        except Author.DoesNotExist:
            raise serializers.ValidationError({"detail": "User is not an author"})
        except ValidationError as e:
            raise serializers.ValidationError(e.args[0])
        except Exception as e:
            raise serializers.ValidationError({"detail": str(e)})

class PostCreateUpdateSerializer(serializers.ModelSerializer):
    primary_category = serializers.ChoiceField(choices=PrimaryCategory.choices)
    subcategory = serializers.ChoiceField(choices=Subcategory.choices, required=False, allow_null=True)
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)
    upvotes = serializers.ReadOnlyField()
    downvotes = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = [
            'title', 'content', 'excerpt', 'author', 'status', 'meta_description', 
            'meta_title', 'publication_date', 'meta_keywords', 'is_public', 
            'thumbnail', 'primary_category', 'subcategory', 'tags', 'upvotes', 'downvotes', 'updated_at'
        ]

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tags)
        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if tags is not None:
            instance.tags.set(tags)
        instance.save()
        return instance

# Post Engagement Serializer
class PostEngagementSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    score = serializers.ReadOnlyField()

    class Meta:
        model = PostEngagement
        fields = ['id', 'post', 'clicks', 'sessions', 'conversions', 'score']
        read_only_fields = ['id', 'score']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['score'] = instance.score
        return representation
