from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from cms.views.permission_view import IsAuthorOrReadOnly
from cms.serializers.custom_user_serializer import (
    CustomUserSerializer, 
    CustomUserCreateSerializer, 
    CustomUserUpdateSerializer
)

CustomUser = get_user_model()

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return CustomUserCreateSerializer
        elif self.action in ['update', 'partial_update', 'update_me']:
            return CustomUserUpdateSerializer
        return CustomUserSerializer

    @swagger_auto_schema(
        operation_description="List all users",
        responses={200: CustomUserSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new user",
        request_body=CustomUserCreateSerializer,
        responses={201: CustomUserSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a specific user",
        responses={200: CustomUserSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update a user",
        request_body=CustomUserUpdateSerializer,
        responses={200: CustomUserSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partially update a user",
        request_body=CustomUserUpdateSerializer,
        responses={200: CustomUserSerializer()}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a user",
        responses={204: "No content"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Get the current user's profile",
        responses={200: CustomUserSerializer()}
    )
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

@swagger_auto_schema(
    method='put',
    operation_description="Update the current user's profile (PUT)",
    request_body=CustomUserUpdateSerializer,
    responses={200: CustomUserSerializer()}
)
@swagger_auto_schema(
    method='patch',
    operation_description="Partially update the current user's profile (PATCH)",
    request_body=CustomUserUpdateSerializer,
    responses={200: CustomUserSerializer()}
)
@action(detail=False, methods=['put', 'patch'], url_path='update-me')
def update_me(self, request):
    serializer = self.get_serializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
