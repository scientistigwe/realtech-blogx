from django.db import models
from cms.models.time_stamped_model import TimeStampedModel
from cms.models.utils import media_upload_to

class MediaUpload(TimeStampedModel):
    user = models.ForeignKey(
        'CustomUser', 
        on_delete=models.CASCADE, 
        related_name='media_uploads'
    )
    file = models.ImageField(
        upload_to=media_upload_to, 
        blank=True, 
        null=True
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Media uploaded by {self.user.username} at {self.uploaded_at}"
