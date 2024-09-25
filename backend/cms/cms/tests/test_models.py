# Test Cases

from django.test import TestCase
from .models import CustomUser, Post, Comment, Notification

class UserModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword123')

    def test_custom_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertTrue(self.user.is_authenticated)

    def test_custom_user_role(self):
        self.assertEqual(self.user.role, 'visitor')

class PostModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword123')
        self.post = Post.objects.create(title='Test Post', content='This is a test post.', author=self.user)

    def test_post_creation(self):
        self.assertEqual(self.post.title, 'Test Post')
        self.assertEqual(self.post.author, self.user)

    def test_slug_generation(self):
        self.assertIsNotNone(self.post.slug)

    def test_excerpt_generation(self):
        self.assertIn('...', self.post.excerpt)

class CommentModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword123')
        self.post = Post.objects.create(title='Test Post', content='This is a test post.', author=self.user)
        self.comment = Comment.objects.create(post=self.post, author=self.user, content='This is a test comment.')

    def test_comment_creation(self):
        self.assertEqual(self.comment.author, self.user)
        self.assertEqual(self.comment.post, self.post)

class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword123')
        Notification.objects.create(user=self.user, message='Test notification message.')

    def test_notification_creation(self):
        self.assertEqual(Notification.objects.count(), 1)
