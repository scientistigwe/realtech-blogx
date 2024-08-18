from rest_framework import permissions

# ----------------------------
# Consolidated Permission
# ----------------------------

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners or authors of an object to edit it.
    
    - Allows read-only access for all users (GET, HEAD, OPTIONS methods).
    - Grants write permissions only to the owner of the object or the author.
    """
    def has_object_permission(self, request, view, obj):
        # Allow read-only access for safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For write operations, check if the user is the owner or the author
        return obj == request.user or getattr(obj, 'author', None) == request.user
