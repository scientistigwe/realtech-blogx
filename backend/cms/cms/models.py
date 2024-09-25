"""
Django models for a blog application.

This module defines the data models used in the blog application,
including models for custom users, posts, categories, tags, comments, and notifications.
"""
from django.db import models
from django.utils.text import slugify
from django.contrib.postgres.search import SearchVectorField
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import os

class TimeStampedModel(models.Model):
    """
    An abstract base model that adds created_at and updated_at fields.
    
    This model is inherited by other models to provide timestamps for creation and modification.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

def upload_to(instance, filename):
    """
    Generates a file path for uploaded images based on the instance type and slug.
    
    This function is used as the upload_to argument for image fields to organize the uploaded files.
    
    Args:
        instance (django.db.models.Model): The model instance the image is being uploaded for.
        filename (str): The original filename of the uploaded image.
    
    Returns:
        str: The new file path for the uploaded image.
    """
    return os.path.join(f'{instance.__class__.__name__.lower()}s', instance.slug, filename)

class CustomUser(AbstractUser, TimeStampedModel):
    """
    A custom user model extending Django's AbstractUser with additional fields.
    
    This model represents the users of the blog application, with extra fields for user profiles.
    """
    ROLE_CHOICES = (
        ('visitor', 'Visitor'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    )
    
    bio = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to=upload_to, blank=True, null=True)
    social_profiles = models.JSONField(default=dict, blank=True)
    last_active = models.DateTimeField(default=timezone.now)
    is_author = models.BooleanField(default=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='visitor')

    def __str__(self):
        """
        Returns a string representation of the user.
        
        Returns:
            str: The username of the user.
        """
        return self.username

class Category(TimeStampedModel):
    """
    Represents a category for posts.
    
    This model stores the name and slug of a category, as well as a self-referential
    foreign key to represent parent-child relationships between categories.
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to generate a slug if it doesn't exist.
        
        Args:
            *args: Arguments passed to the superclass save method.
            **kwargs: Keyword arguments passed to the superclass save method.
        """
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        """
        Returns a string representation of the category.
        
        Returns:
            str: The name of the category.
        """
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'

class Tag(TimeStampedModel):
    """
    Represents a tag for posts.
    
    This model stores the name and slug of a tag.
    """
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to generate a slug if it doesn't exist.
        
        Args:
            *args: Arguments passed to the superclass save method.
            **kwargs: Keyword arguments passed to the superclass save method.
        """
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        """
        Returns a string representation of the tag.
        
        Returns:
            str: The name of the tag.
        """
        return self.name

class Post(TimeStampedModel):
    """
    Represents a blog post.
    
    This model stores the title, content, author, status, metadata, and other
    information related to a blog post. It also includes fields for tracking
    post engagement (view count, upvotes, downvotes) and a search vector field
    for full-text search.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=255, db_index=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True, null=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    meta_description = models.TextField(blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    publication_date = models.DateField(null=True, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    is_public = models.BooleanField(default=True)
    thumbnail = models.ImageField(upload_to=upload_to, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    view_count = models.PositiveIntegerField(default=0)
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    search_vector = SearchVectorField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['view_count']),
            models.Index(fields=['search_vector']),
        ]

    def __str__(self):
        """
        Returns a string representation of the post.
        
        Returns:
            str: The title of the post.
        """
        return self.title

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to generate a unique slug and excerpt.
        
        Args:
            *args: Arguments passed to the superclass save method.
            **kwargs: Keyword arguments passed to the superclass save method.
        """
        if not self.slug:
            self.slug = self.generate_unique_slug()
        if not self.excerpt:
            self.excerpt = self.generate_excerpt()
        super().save(*args, **kwargs)
        self.update_search_vector()

    def generate_unique_slug(self):
        """
        Generates a unique slug for the post.
        
        Returns:
            str: The generated unique slug.
        """
        slug = slugify(self.title)
        unique_slug = slug
        num = 1
        while Post.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{slug}-{num}"
            num += 1
        return unique_slug

    def generate_excerpt(self):
        """
        Generates a short excerpt from the post content.
        
        Returns:
            str: The generated excerpt.
        """
        return self.content[:100] + '...' if self.content else ''

    def update_search_vector(self):
        """
        Updates the search vector for the post.
        
        This method is called in the save method to update the search_vector field,
        which is used for full-text search.
        """
        from django.contrib.postgres.search import SearchVector
        Post.objects.filter(id=self.id).update(search_vector=SearchVector('title', 'content'))

class Comment(TimeStampedModel):
    """
    Represents a comment on a post.
    
    This model stores the post, author, content, sentiment score, moderation status,
    and engagement (upvotes, downvotes) of a comment.
    """
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    sentiment_score = models.FloatField(blank=True, null=True)
    moderation_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)

    def __str__(self):
        """
        Returns a string representation of the comment.
        
        Returns:
            str: A string describing the comment, including the author and post.
        """
        return f'Comment by {self.author} on {self.post}'

class Notification(TimeStampedModel):
    """
    Represents a notification for a user.
    
    This model stores the user, message, and read status of a notification.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    def __str__(self):
        """
        Returns a string representation of the notification.
        
        Returns:
            str: A string describing the notification, including the user and message.
        """
        return f"Notification for {self.user.username}: {self.message[:50]}"