from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from cms.models.author_model import Author
from cms.models.post_model import Post
from cms.models.custom_user_model import CustomUser
from cms.serializers.author_serializer import AuthorSerializer, ContactAuthorSerializer
from cms.serializers.post_serializer import PostSerializer


# ----------------------------
# Author ViewSet
# ----------------------------

class AuthorViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for Author instances.
    URL: /authors/
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @swagger_auto_schema(
        operation_description="List all Author instances.",
        responses={200: AuthorSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new Author instance.",
        request_body=AuthorSerializer,
        responses={201: AuthorSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve an Author instance.",
        responses={200: AuthorSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an Author instance.",
        request_body=AuthorSerializer,
        responses={200: AuthorSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete an Author instance.",
        responses={204: "No content"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        Assigns the current user to the Author instance being created.
        """
        serializer.save(user=self.request.user)


# ----------------------------
# Author Post ViewSet
# ----------------------------

class AuthorPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Handles retrieving posts by authors.
    URL: /authors/posts/
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], url_path='all')
    def list_all(self, request):
        """
        Lists all posts.
        URL: /authors/posts/all/
        """
        posts = self.queryset
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path=r'(?P<author_id>\d+)')
    def posts_by_author(self, request, author_id=None):
        """
        Lists all posts by a specific author.
        URL: /authors/posts/<author_id>/
        """
        posts = self.queryset.filter(author_id=author_id)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


# ----------------------------
# Author Detail View
# ----------------------------

class AuthorDetailView(generics.RetrieveAPIView):
    """
    Retrieves details of an author by their username.
    URL: /authors/<username>/
    """
    queryset = CustomUser.objects.all()
    serializer_class = AuthorSerializer
    lookup_field = 'username'

    def get_object(self):
        """
        Retrieves the object based on the username.
        """
        username = self.kwargs.get('username')
        return get_object_or_404(self.queryset, username=username)


# ----------------------------
# Contact Author View
# ----------------------------

class ContactAuthorView(generics.CreateAPIView):
    """
    Sends an email to an author.
    URL: /authors/<author_id>/contact/
    """
    serializer_class = ContactAuthorSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, author_id):
        """
        Handles sending an email to the specified author.
        """
        author = get_object_or_404(CustomUser, id=author_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subject = serializer.validated_data['subject']
        message = serializer.validated_data['message']
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [author.email])
        return Response({'detail': 'Email sent successfully'}, status=status.HTTP_200_OK)
