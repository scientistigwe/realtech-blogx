from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from cms.models.notification_model import Notification
from cms.serializers.notification_serializer import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    """
    Retrieves a list of notifications for the authenticated user.
    URL: /notifications/
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            # queryset just for schema generation metadata
            return Notification.objects.none()
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationUpdateView(generics.UpdateAPIView):
    """
    Marks a notification as read.
    URL: /notifications/<id>/read/
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        notification_id = self.kwargs.get('pk')
        return generics.get_object_or_404(Notification, id=notification_id, user=self.request.user)

    def perform_update(self, serializer):
        # Ensure that we only mark notifications as read
        serializer.validated_data['is_read'] = True
        serializer.save()

class NotificationCreateView(generics.CreateAPIView):
    """
    Creates a new notification (for admin purposes or internal use).
    URL: /notifications/create/
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save()
