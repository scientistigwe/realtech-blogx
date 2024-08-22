from rest_framework import permissions
from django.contrib.auth import get_user_model
from djoser.views import UserViewSet
from cms.serializers.custom_user_serializer import (
    CustomUserSerializer, CustomUserDetailSerializer, CustomUserAdminSerializer,
    CustomUserCreateSerializer
)
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

CustomUser = get_user_model()

class CustomUserViewSet(UserViewSet):
    """
    Handles CRUD operations for CustomUser model.
    """
    queryset = CustomUser.objects.all()

    def get_serializer_class(self):
        """
        Determine the appropriate serializer class based on the action.
        """
        if self.action == 'create':
            return CustomUserCreateSerializer
        elif self.request.user.is_staff:
            return CustomUserAdminSerializer
        elif self.action == 'retrieve':
            return CustomUserDetailSerializer
        else:
            return CustomUserSerializer

    def get_permissions(self):
        """
        Return the list of permissions based on the action being performed.
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  # Public access for list and retrieve
        elif self.action in ['create']:
            return [permissions.IsAuthenticated()]  # Authenticated access for creation
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]  # Admin access for update and destroy
        return [permissions.IsAuthenticated()]  # Default to authenticated for other actions

    @swagger_auto_schema(
        operation_description="Retrieve a list of users",
        responses={
            200: openapi.Response('Success', CustomUserSerializer(many=True)),
            404: openapi.Response('Not Found'),
        },
    )
    def list(self, request, *args, **kwargs):
        """
        List all users with is_author=True if the user is authenticated.
        """
        if request.user.is_authenticated and request.user.is_staff:
            # If the user is staff, they can see all users
            return super().list(request, *args, **kwargs)
        else:
            # For non-staff users, filter by is_author
            queryset = CustomUser.objects.filter(is_author=True)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Retrieve a single user",
        responses={
            200: openapi.Response('Success', CustomUserDetailSerializer()),
            404: openapi.Response('Not Found'),
        },
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new user",
        request_body=CustomUserCreateSerializer,
        responses={
            201: openapi.Response('Created', CustomUserSerializer()),
            400: openapi.Response('Bad Request'),
        },
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an existing user",
        request_body=CustomUserSerializer,
        responses={
            200: openapi.Response('Success', CustomUserSerializer()),
            400: openapi.Response('Bad Request'),
            404: openapi.Response('Not Found'),
        },
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partially update an existing user",
        request_body=CustomUserSerializer,
        responses={
            200: openapi.Response('Success', CustomUserSerializer()),
            400: openapi.Response('Bad Request'),
            404: openapi.Response('Not Found'),
        },
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete an existing user",
        responses={
            204: openapi.Response('Success'),
            404: openapi.Response('Not Found'),
        },
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
