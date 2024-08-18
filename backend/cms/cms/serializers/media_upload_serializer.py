from rest_framework import serializers
from cms.models.media_upload_model import MediaUpload

class MediaUploadSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaUpload
        fields = ['id', 'user', 'file', 'file_url', 'uploaded_at']
        read_only_fields = ['uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None
