# cms/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models.custom_user_model import CustomUser
from .models.author_model import Author
from .models.profile_model import Profile

@receiver(post_save, sender=CustomUser)
def create_related_models(sender, instance, created, **kwargs):
    if created:
        # Create Profile
        Profile.objects.create(user=instance)
        
        # Create Author if is_author is True
        if instance.is_author:
            Author.objects.create(user=instance)

@receiver(post_save, sender=CustomUser)
def save_related_models(sender, instance, **kwargs):
    # Update Profile if it exists
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        # Create profile if it doesn't exist
        Profile.objects.create(user=instance)
    
    # Update Author if exists
    if instance.is_author and hasattr(instance, 'author'):
        instance.author.save()