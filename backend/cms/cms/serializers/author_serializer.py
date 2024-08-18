from rest_framework import serializers
from cms.models.author_model import Author

class AuthorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Author model.
    
    This serializer handles the conversion of Author instances to JSON
    and vice versa. It includes all fields from the model and some additional
    read-only fields derived from properties.
    """
    
    username = serializers.CharField(source='user.username', read_only=True)
    bio = serializers.CharField(source='user.bio', read_only=True)
    profile_picture = serializers.SerializerMethodField()
    website = serializers.URLField(source='user.website', read_only=True)
    location = serializers.CharField(source='user.location', read_only=True)
    twitter_handle = serializers.URLField(source='user.twitter_handle', read_only=True)
    facebook_profile = serializers.URLField(source='user.facebook_profile', read_only=True)
    linkedin_profile = serializers.URLField(source='user.linkedin_profile', read_only=True)

    class Meta:
        model = Author
        fields = [
            'id', 'username', 'profile_picture', 'bio', 'website', 
            'location', 'twitter_handle', 'facebook_profile', 'linkedin_profile'
        ]
        read_only_fields = [
            'id', 'username', 'bio', 'profile_picture', 'website', 
            'location', 'twitter_handle', 'facebook_profile', 'linkedin_profile'
        ]

    def get_profile_picture(self, obj):
        """
        Custom method to get the profile picture URL.
        """
        profile = getattr(obj.user, 'profile', None)
        if profile and profile.profile_picture:
            return profile.profile_picture.url
        return None

    def to_representation(self, instance):
        """
        Override to_representation to handle null values for URL fields.
        """
        representation = super().to_representation(instance)
        url_fields = ['twitter_handle', 'facebook_profile', 'linkedin_profile', 'website']
        for field in url_fields:
            if representation.get(field) == '':
                representation[field] = None
        return representation


class ContactAuthorSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField(max_length=2000)
