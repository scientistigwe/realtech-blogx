import logging
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from cms.models.custom_user_model import CustomUser
from cms.serializers.auth_serializer import CustomTokenObtainPairSerializer, RegisterSerializer
from cms.serializers.custom_user_serializer import CustomUserSerializer

logger = logging.getLogger(__name__)

# ----------------------------
# Authentication Views
# ----------------------------

class RegisterView(generics.CreateAPIView):
    """
    Handles user registration.
    URL: /auth/register/
    """
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @swagger_auto_schema(
        operation_description="Register a new user",
        request_body=RegisterSerializer,
        responses={201: CustomUserSerializer()}
    )
    def create(self, request, *args, **kwargs):
        logger.info("Request Headers: %s", request.headers)
        logger.info("Request Data: %s", request.data)

        # Initialize a mutable QueryDict to hold the copied data
        data = request.data.copy()

        # Explicitly handle file uploads separately
        files = request.FILES
        if 'profile_picture' in files:
            data['profile_picture'] = files['profile_picture']

        # Add the is_author field
        is_author = data.get('is_author', 'false').lower() == 'true'
        data['is_author'] = is_author

        # Now, data contains only serializable data and can be passed to the serializer
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        response = Response({
            'user': CustomUserSerializer(user).data,
        'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)

        # Set JWT tokens as cookies
        response.set_cookie(key='access', value=str(refresh.access_token), httponly=True, secure=True, samesite='Strict')
        response.set_cookie(key='refresh', value=str(refresh), httponly=True, secure=True, samesite='Strict')
        return response

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Handles obtaining a new token pair (access and refresh tokens).
    URL: /auth/token/
    """
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        operation_description="Take a set of user credentials and returns an access and refresh JSON web token pair.",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Successful login",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description='Access token'),
                        'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username of the authenticated user'),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email of the authenticated user'),
                        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the authenticated user'),
                    }
                )
            ),
            status.HTTP_401_UNAUTHORIZED: "Invalid credentials",
        }
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Extract username from the request data or response data
        username = request.data.get('username') or response.data.get('username')
        
        if username:
            user = get_object_or_404(CustomUser, username=username)
            user_data = CustomUserSerializer(user).data
        else:
            user_data = {}

        # Add user details to the response data
        response.data.update({
            'user_id': user_data.get('id'),
            'email': user_data.get('email'),
            'username': user_data.get('username'),
        })

        response.set_cookie(
            key='access',
            value=response.data.get('access', ''),
            httponly=True,
            secure=True,
            samesite='Lax'
        )
        response.set_cookie(
            key='refresh',
            value=response.data.get('refresh', ''),
            httponly=True,
            secure=True,
            samesite='Lax'
        )
        return response

class CustomTokenRefreshView(TokenRefreshView):
    """
    Handles refreshing the access token using the refresh token.
    URL: /auth/token/refresh/
    """
    @swagger_auto_schema(
        operation_description="Take a refresh token and returns a new access token if the refresh token is valid.",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Successful token refresh",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description='New access token'),
                    }
                )
            ),
            status.HTTP_401_UNAUTHORIZED: "Invalid token",
        }
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            auth = JWTAuthentication()
            validated_token = auth.get_validated_token(refresh_token)
            user = auth.get_user(validated_token)
        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_authenticated:
            return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

        recent_activity_threshold = timezone.now() - timedelta(minutes=5)
        if user.last_active < recent_activity_threshold:
            return Response({"detail": "User has been inactive for too long."}, status=status.HTTP_401_UNAUTHORIZED)

        response = super().post(request, *args, **kwargs)
        response.set_cookie(
            key='access',
            value=response.data.get('access', ''),
            httponly=True,
            secure=True,
            samesite='Strict'
        )
        return response


class LogoutView(APIView):
    """
    Handles logging out the user by deleting the token cookies.
    URL: /auth/logout/
    """
    def post(self, request):
        response = Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response


class CheckAuthenticationView(APIView):
    """
    Checks if the user is authenticated.
    URL: /auth/check-authentication/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        is_authenticated = request.user.is_authenticated
        if is_authenticated:
            refresh = RefreshToken.for_user(request.user)
            response = Response({
                "authenticated": True,
                "user_id": request.user.id,
                "access_token": str(refresh.access_token),
                "message": "User is authenticated"
            }, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access',
                value=str(refresh.access_token),
                httponly=True,
                secure=True,
                samesite='Strict'
            )
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite='Strict'
            )
        else:
            response = Response({
                "authenticated": False,
                "message": "User is not authenticated"
            }, status=status.HTTP_401_UNAUTHORIZED)
        return response
