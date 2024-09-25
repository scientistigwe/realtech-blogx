import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Post, Category, Tag, Comment, Notification

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

@pytest.fixture
def admin_user():
    return User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpass123')

@pytest.fixture
def category():
    return Category.objects.create(name='Test Category', slug='test-category')

@pytest.fixture
def tag():
    return Tag.objects.create(name='Test Tag', slug='test-tag')

@pytest.fixture
def post(user, category, tag):
    post = Post.objects.create(
        title='Test Post',
        content='This is a test post content',
        author=user,
        category=category,
        status='published'
    )
    post.tags.add(tag)
    return post

@pytest.mark.django_db
class TestCustomTokenObtainPairView:
    def test_obtain_token_pair(self, api_client, user):
        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = api_client.post(url, data)
assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['username'] == 'testuser'

@pytest.mark.django_db
class TestCustomTokenRefreshView:
    def test_refresh_token(self, api_client, user):
        # First, obtain the token pair
        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = api_client.post(url, data)
        refresh_token = response.data['refresh']

        # Now, use the refresh token to obtain a new access token
        url = reverse('token_refresh')
        data = {'refresh': refresh_token}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

@pytest.mark.django_db
class TestCustomUserViewSet:
    def test_me_endpoint(self, api_client, user):
        api_client.force_authenticate(user=user)
        url = reverse('user-me')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'testuser'
        assert response.data['email'] == 'test@example.com'

    def test_check_auth_authenticated(self, api_client, user):
        api_client.force_authenticate(user=user)
        url = reverse('user-check-auth')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['is_authenticated'] == True
        assert response.data['user']['username'] == 'testuser'

    def test_check_auth_unauthenticated(self, api_client):
        url = reverse('user-check-auth')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['is_authenticated'] == False

    def test_logout(self, api_client, user):
        api_client.force_authenticate(user=user)
        url = reverse('user-logout')
        response = api_client.post(url, {'refresh_token': 'dummy_token'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Logout successful.'

@pytest.mark.django_db
class TestTagViewSet:
    def test_list_tags(self, api_client, tag):
        url = reverse('tag-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == 'Test Tag'

    def test_most_used_tags(self, api_client, tag, post):
        url = reverse('tag-most-used')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == 'Test Tag'

@pytest.mark.django_db
class TestCategoryViewSet:
    def test_list_categories(self, api_client, category):
        url = reverse('category-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == 'Test Category'

    def test_subcategories(self, api_client, category):
        subcategory = Category.objects.create(name='Test Subcategory', parent=category)
        url = reverse('category-subcategories', kwargs={'pk': category.pk})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == 'Test Subcategory'

@pytest.mark.django_db
class TestPostViewSet:
    def test_list_posts(self, api_client, post):
        url = reverse('post-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == 'Test Post'

    def test_create_post(self, api_client, user, category):
        api_client.force_authenticate(user=user)
        url = reverse('post-list')
        data = {
            'title': 'New Test Post',
            'content': 'This is a new test post content',
            'category': category.pk,
            'status': 'draft'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Test Post'
        assert response.data['author'] == user.pk

    def test_update_post(self, api_client, user, post):
        api_client.force_authenticate(user=user)
        url = reverse('post-detail', kwargs={'pk': post.pk})
        data = {'title': 'Updated Test Post'}
        response = api_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Test Post'

    def test_delete_post(self, api_client, user, post):
        api_client.force_authenticate(user=user)
        url = reverse('post-detail', kwargs={'pk': post.pk})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Post.objects.count() == 0

    def test_publish_post(self, api_client, admin_user, post):
        api_client.force_authenticate(user=admin_user)
        url = reverse('post-publish', kwargs={'pk': post.pk})
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'published'

    def test_upvote_post(self, api_client, user, post):
        api_client.force_authenticate(user=user)
        url = reverse('post-upvote', kwargs={'pk': post.pk})
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'Post upvoted successfully'

    def test_downvote_post(self, api_client, user, post):
        api_client.force_authenticate(user=user)
        url = reverse('post-downvote', kwargs={'pk': post.pk})
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'Post downvoted successfully'

@pytest.mark.django_db
class TestCommentViewSet:
    @pytest.fixture
    def comment(self, user, post):
        return Comment.objects.create(content='Test comment', author=user, post=post)

    def test_list_comments(self, api_client, comment):
        url = reverse('comment-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['content'] == 'Test comment'

    def test_create_comment(self, api_client, user, post):
        api_client.force_authenticate(user=user)
        url = reverse('comment-list')
        data = {'content': 'New test comment', 'post': post.pk}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['content'] == 'New test comment'
        assert response.data['author'] == user.pk

    def test_approve_comment(self, api_client, admin_user, comment):
        api_client.force_authenticate(user=admin_user)
        url = reverse('comment-approve', kwargs={'pk': comment.pk})
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Comment approved successfully'

@pytest.mark.django_db
class TestNotificationViewSet:
    @pytest.fixture
    def notification(self, user):
        return Notification.objects.create(user=user, message='Test notification')

    def test_list_notifications(self, api_client, user, notification):
        api_client.force_authenticate(user=user)
        url = reverse('notification-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['message'] == 'Test notification'

    def test_mark_as_read(self, api_client, user, notification):
        api_client.force_authenticate(user=user)
        url = reverse('notification-mark-as-read')
        data = {'ids': [notification.pk]}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Marked 1 notifications as read'

@pytest.mark.django_db
class TestSearchViewSet:
    def test_autocomplete(self, api_client, post):
        url = reverse('search-autocomplete') + '?q=test'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == 'Test Post'