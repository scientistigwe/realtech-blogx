from django.utils.translation import gettext_lazy as _
from django.db import models
from django.core.validators import URLValidator
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    website = models.URLField(validators=[URLValidator()], blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    twitter_handle = models.URLField(blank=True, null=True)  # Optional Twitter profile link
    facebook_profile = models.URLField(blank=True, null=True)  # Optional Facebook profile link
    linkedin_profile = models.URLField(blank=True, null=True)  # Optional LinkedIn profile link
    last_active = models.DateTimeField(default=timezone.now)
    is_author = models.BooleanField(default=False)  # Add this line

    # Custom related names to avoid clashes with default User model relationships
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        related_name='custom_users',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        related_name='custom_users',
        related_query_name='custom_user',
    )

    def __str__(self):
        return self.username
