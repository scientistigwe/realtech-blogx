from django.db import models
from cms.models.custom_user_model import CustomUser
from cms.models.media_upload_model import media_upload_to

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to=media_upload_to, blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
