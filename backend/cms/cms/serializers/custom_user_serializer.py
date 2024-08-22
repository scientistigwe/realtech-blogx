from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer

# Import CustomUser model
CustomUser = get_user_model()

# Basic User Serializer
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'bio', 'website', 'location', 
            'profile_picture', 'twitter_handle', 'facebook_profile', 
            'linkedin_profile', 'last_active'
        ]

# Detailed User Profile Serializer
class CustomUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'bio', 'website', 'location', 
            'profile_picture', 'twitter_handle', 'facebook_profile', 
            'linkedin_profile', 'last_active', 'is_author'
        ]

# Admin Serializer
class CustomUserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'bio', 'website', 'location', 
            'profile_picture', 'twitter_handle', 'facebook_profile', 
            'linkedin_profile', 'last_active', 'is_author', 'is_staff', 
            'is_superuser'
        ]

# Djoser Custom User Create Serializer
class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'password', 'bio', 'website', 
            'location', 'profile_picture', 'twitter_handle', 
            'facebook_profile', 'linkedin_profile'
        ]

# Djoser Custom User Serializer
class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'bio', 'website', 'location', 
            'profile_picture', 'twitter_handle', 'facebook_profile', 
            'linkedin_profile', 'last_active', 'is_author'
        ]
