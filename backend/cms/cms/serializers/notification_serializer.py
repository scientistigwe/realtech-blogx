from rest_framework import serializers
from cms.models.notification_model import Notification

class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show username instead of ID
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S%z')  # ISO format

    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']
        read_only_fields = ['user', 'created_at']  # User and created_at are read-only
