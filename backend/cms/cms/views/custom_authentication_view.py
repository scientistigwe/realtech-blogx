# views.py

from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from cms.serializers.custom_registration_serializer import CustomRegisterSerializer
from cms.serializers.custom_login_serializer import CustomLoginSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
User = get_user_model()

class CustomRegisterView(generics.CreateAPIView):
    """
    Registers a new user and returns access and refresh tokens.
    URL: /auth/register/
    """
    serializer_class = CustomRegisterSerializer

    @swagger_auto_schema(
        operation_description="Register a new user and obtain access and refresh tokens.",
        request_body=CustomRegisterSerializer,
        responses={
            201: openapi.Response('User created and tokens issued', CustomRegisterSerializer()),
            400: openapi.Response('Bad Request'),
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        data = serializer.data
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return Response(data)

class CustomLoginView(TokenObtainPairView):
    """
    Logs in a user and returns access and refresh tokens.
    URL: /auth/login/
    """
    serializer_class = CustomLoginSerializer

    @swagger_auto_schema(
        operation_description="Obtain access and refresh tokens by providing username and password.",
        request_body=CustomLoginSerializer,
        responses={
            200: openapi.Response('Tokens issued', CustomLoginSerializer()),
            401: openapi.Response('Unauthorized'),
            400: openapi.Response('Bad Request'),
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
