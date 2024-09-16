from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    """
    def has_permission(self, request, view):
        # Allow access to admin users or if the method is safe (GET, HEAD, OPTIONS)
        if request.user and request.user.is_staff:
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        return False

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow access to safe methods
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only allow access if the user is the owner
        return obj.user == request.user

class DynamicJwtPermission(permissions.BasePermission):
    """
    Permission class to handle JWT authentication dynamically.
    """
    def has_permission(self, request, view):
        # Allow unauthenticated access to JWT endpoints
        if request.path.startswith('/auth/') and request.method in ['POST', 'GET']:
            print(f"Request: {request.path}")
            return True

        # Allow read-only access to all users for safe methods
        if request.method in permissions.SAFE_METHODS:
            print(f"Request: {request.method}")
            return True

        # For non-safe methods, require authentication
        print(f"Request: {request.user}")

        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read-only access to all users
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow write access to staff users or the object owner
        return request.user.is_staff or obj == request.user
