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
    def has_permission(self, request, view):
        print(f"Checking permission for path: {request.path}")
        print(f"Request method: {request.method}")
        print(f"User authenticated: {request.user.is_authenticated}")

        # Allow access to authentication-related endpoints
        if request.path.startswith('/auth'):
            return True

        # Allow access to safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For PostViewSet, use the custom check_post_permissions method
        if hasattr(view, 'check_post_permissions'):
            return view.check_post_permissions(request)

        # For other views, apply the existing logic
        auth_required_endpoints = [
            "/cms-api/v1/posts/",  # POST
            "/auth/users/",  # GET (user list)
            "/auth/users/activation/",  # POST (user activation)
            "/auth/users/me/",  # GET (user details)
            "/cms-api/v1/users/me/",  # GET (user details)
            "/auth/users/me/",  # PUT (update user)
            "/auth/users/me/",  # PATCH (partial update user)
        ]

        is_auth_required_endpoint = any(endpoint in request.path for endpoint in auth_required_endpoints)

        auth_required_methods = ["PUT", "PATCH", "DELETE"]
        is_auth_required_method = request.method.upper() in auth_required_methods

        if is_auth_required_endpoint or is_auth_required_method:
            return request.user and request.user.is_authenticated

        return True

    def has_object_permission(self, request, view, obj):
        # Allow read-only access to all users
        if request.method in permissions.SAFE_METHODS:
            return True

        # For PostViewSet, use the custom check_post_permissions method
        if hasattr(view, 'check_post_permissions'):
            return view.check_post_permissions(request)

        # For other objects, allow write access to staff users or the object owner
        return request.user.is_staff or obj == request.user


