from rest_framework import serializers
from cms.models.notification_model import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']

    def update(self, instance, validated_data):
        # Update the 'is_read' status if it's in the validated data
        is_read = validated_data.get('is_read', None)
        if is_read is not None:
            instance.is_read = is_read
        instance.save()
        return instance
