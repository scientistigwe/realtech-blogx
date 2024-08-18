from django.db import models
from cms.models.custom_user_model import CustomUser

class Author(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

    @property
    def bio(self):
        return self.user.bio

    @property
    def website(self):
        return self.user.website

    @property
    def location(self):
        return self.user.location

    @property
    def twitter_handle(self):
        return self.user.twitter_handle

    @property
    def facebook_profile(self):
        return self.user.facebook_profile

    @property
    def linkedin_profile(self):
        return self.user.linkedin_profile

    def get_profile_picture(self):
        profile = getattr(self.user, 'profile', None)
        if profile and profile.profile_picture:
            return profile.profile_picture.url
        return None
