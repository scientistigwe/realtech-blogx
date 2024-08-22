from rest_framework import generics, permissions, status
from rest_framework.response import Response
from cms.models.comment_model import Comment
from cms.serializers.comment_serializer import CommentSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

class CommentListCreateView(generics.ListCreateAPIView):
    """
    Retrieves a list of comments or creates a new comment.
    URL: /comments/
    """
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]  # Public access for listing comments
        return [permissions.IsAuthenticated()]  # Authenticated access for creating comments

    @swagger_auto_schema(
        operation_description="Retrieve a list of comments",
        responses={
            200: openapi.Response('Success', CommentSerializer(many=True)),
            401: openapi.Response('Unauthorized'),
        },
    )
    def get_queryset(self):
        return Comment.objects.all()

    @swagger_auto_schema(
        operation_description="Create a new comment",
        request_body=CommentSerializer,
        responses={
            201: openapi.Response('Created', CommentSerializer()),
            400: openapi.Response('Bad Request'),
            401: openapi.Response('Unauthorized'),
        },
    )
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates, or deletes a comment.
    URL: /comments/<id>/
    """
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]  # Public access for retrieving comments
        return [permissions.IsAuthenticated()]  # Authenticated access for updating or deleting comments

    def get_queryset(self):
        return Comment.objects.all()

    @swagger_auto_schema(
        operation_description="Retrieve a comment",
        responses={
            200: openapi.Response('Success', CommentSerializer()),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        },
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update a comment",
        request_body=CommentSerializer,
        responses={
            200: openapi.Response('Success', CommentSerializer()),
            400: openapi.Response('Bad Request'),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        },
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a comment",
        responses={
            204: openapi.Response('Success'),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        },
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied('You can only update your own comments.')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author == self.request.user or self.request.user.is_staff or self.request.user.is_superuser:
            instance.delete()
        else:
            raise PermissionDenied('You can only delete your own comments.')

class CommentUpvoteView(generics.UpdateAPIView):
    """
    Upvotes a comment.
    URL: /comments/<id>/upvote/
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Comment.objects.none()
        return Comment.objects.all()

    @swagger_auto_schema(
        operation_description="Upvote a comment",
        responses={
            200: openapi.Response('Success', CommentSerializer()),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        },
    )
    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        comment.upvote()
        self.perform_update(comment)
        serializer = self.get_serializer(comment)
        return Response(serializer.data)

    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs.get('pk'))

class CommentDownvoteView(generics.UpdateAPIView):
    """
    Downvotes a comment.
    URL: /comments/<id>/downvote/
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Comment.objects.none()
        return Comment.objects.all()

    @swagger_auto_schema(
        operation_description="Downvote a comment",
        responses={
            200: openapi.Response('Success', CommentSerializer()),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        },
    )
    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        comment.downvote()
        self.perform_update(comment)
        serializer = self.get_serializer(comment)
        return Response(serializer.data)

    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs.get('pk'))
