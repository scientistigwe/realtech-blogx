# serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 'password', 
            'password2', 'bio', 'website', 'location', 'profile_picture', 
            'twitter_handle', 'facebook_profile', 'linkedin_profile', 
            'last_login', 'date_joined', 'last_active', 'is_active', 
            'is_staff', 'is_superuser', 'is_author'
        ]
        read_only_fields = ('id', 'last_login', 'date_joined', 'last_active')

    def validate(self, data):
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
