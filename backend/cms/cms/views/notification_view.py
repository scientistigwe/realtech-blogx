from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from cms.models.notification_model import Notification
from cms.serializers.notification_serializer import NotificationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Serializers
class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'  # Adjust if needed to only include specific fields

# Views
class NotificationListView(generics.ListAPIView):
    """
    Retrieves a list of notifications for the authenticated user.
    URL: /notifications/
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Retrieve a list of notifications for the authenticated user",
        responses={
            200: openapi.Response('Success', NotificationSerializer(many=True)),
            401: openapi.Response('Unauthorized'),
        },
    )
    def get_queryset(self):
        """
        Override the get_queryset method to filter notifications based on the authenticated user.
        """
        if getattr(self, 'swagger_fake_view', False):
            # Return an empty queryset for schema generation
            return Notification.objects.none()
        
        # Retrieve notifications for the authenticated user, ordered by creation date (most recent first)
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationUpdateView(generics.UpdateAPIView):
    """
    Marks a notification as read.
    URL: /notifications/<id>/read/
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Notification.objects.none()
        return Notification.objects.all()

    def get_object(self):
        notification_id = self.kwargs.get('pk')
        return get_object_or_404(Notification, id=notification_id, user=self.request.user)

    def perform_update(self, serializer):
        serializer.validated_data['is_read'] = True
        serializer.save()

    @swagger_auto_schema(
        operation_description="Mark a notification as read",
        responses={
            200: openapi.Response('Success', NotificationSerializer()),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        },
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

class NotificationCreateView(generics.CreateAPIView):
    """
    Creates a new notification (for admin purposes or internal use).
    URL: /notifications/create/
    """
    serializer_class = NotificationCreateSerializer
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(
        operation_description="Create a new notification",
        request_body=NotificationCreateSerializer,
        responses={
            201: openapi.Response('Created', NotificationCreateSerializer()),
            400: openapi.Response('Bad Request'),
            401: openapi.Response('Unauthorized'),
        },
    )
    def perform_create(self, serializer):
        """
        Save the new notification instance.
        """
        serializer.save(user=self.request.user)
