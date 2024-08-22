# cms/views/permission_view.py

from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow admins to perform CRUD operations, but only read-only access for others.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow users to manage their own account or admins to manage any account.
    """
    def has_object_permission(self, request, view, obj):
        # Admins have full access
        if request.user.is_staff:
            return True
        # Allow users to access their own account
        return obj == request.user

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow authors to edit their own posts, but others can only view.
    """
    def has_object_permission(self, request, view, obj):
        # Allow read-only access for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the author of the post
        return obj.author == request.user
