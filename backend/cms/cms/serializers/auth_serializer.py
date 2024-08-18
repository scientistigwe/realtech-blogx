# serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from cms.models.custom_user_model import CustomUser
from cms.models.author_model import Author
from cms.models.profile_model import Profile
from rest_framework.exceptions import ValidationError

# User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    is_author = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name', 'bio', 
            'location', 'website', 'twitter_handle', 'facebook_profile', 
            'linkedin_profile', 'profile_picture', 'is_author'
        ]

    def create(self, validated_data):
        # Handle password hashing
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            bio=validated_data.get('bio', ''),
            location=validated_data.get('location', ''),
            website=validated_data.get('website', ''),
            twitter_handle=validated_data.get('twitter_handle', ''),
            facebook_profile=validated_data.get('facebook_profile', ''),
            linkedin_profile=validated_data.get('linkedin_profile', ''),
            is_author=validated_data.get('is_author', False),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
# JWT Token Serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom Token Obtain Pair Serializer that includes additional user data in the token.
    """

    @classmethod
    def get_token(cls, user):
        """
        Add custom claims to the token.
        """
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        """
        Override the validate method to include additional data in the response.
        """
        data = super().validate(attrs)

        # Include additional response data
        data.update({
            'username': self.user.username,
            'email': self.user.email,
        })

        return data