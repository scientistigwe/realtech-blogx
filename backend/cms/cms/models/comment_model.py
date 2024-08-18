from django.db import models
from cms.models.post_model import Post
from cms.models.custom_user_model import CustomUser

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sentiment_score = models.FloatField(blank=True, null=True)
    moderation_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected')
        ],
        default='pending'
    )
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)

    def approve(self):
        self.moderation_status = 'approved'
        self.save(update_fields=['moderation_status'])

    def reject(self):
        self.moderation_status = 'rejected'
        self.save(update_fields=['moderation_status'])

    def upvote(self):
        self.upvotes += 1
        self.save(update_fields=['upvotes'])

    def downvote(self):
        self.downvotes += 1
        self.save(update_fields=['downvotes'])

    def __str__(self):
        return f'Comment by {self.author} on {self.post}'
