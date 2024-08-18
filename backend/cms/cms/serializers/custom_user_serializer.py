from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

CustomUser = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'bio', 
            'website', 'location', 'twitter_handle', 'facebook_profile', 
            'linkedin_profile', 'last_active', 'password', 
            'confirm_password', 'profile_picture', 'is_author'
        ]
        read_only_fields = ['last_active', 'profile_picture']

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)  # We don't need to keep confirm_password
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        
        # Update instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def get_profile_picture(self, obj):
        # Ensure `profile_picture` field is accessed correctly
        return obj.profile.profile_picture.url if hasattr(obj, 'profile') and obj.profile.profile_picture else None

class CustomUserCreateSerializer(CustomUserSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

class CustomUserUpdateSerializer(CustomUserSerializer):
    profile_picture = serializers.ImageField(required=False)

    class Meta(CustomUserSerializer.Meta):
        read_only_fields = CustomUserSerializer.Meta.read_only_fields + ['username', 'email']
        fields = CustomUserSerializer.Meta.fields

    def update(self, instance, validated_data):
        profile_picture = validated_data.pop('profile_picture', None)
        instance = super().update(instance, validated_data)

        if profile_picture:
            # Handle profile picture update
            if hasattr(instance, 'profile'):
                if instance.profile.profile_picture:
                    instance.profile.profile_picture.delete(save=False)  # Delete old picture if it exists
                instance.profile.profile_picture = profile_picture
                instance.profile.save()

        return instance
