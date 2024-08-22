# serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims here if needed
        return token
