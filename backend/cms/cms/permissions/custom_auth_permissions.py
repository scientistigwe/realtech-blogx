import re
import time
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CustomAuthPermission(BasePermission):
    authenticated_routes = [
        r"^auth/users/me/?$",
        r"^auth/users/me/update/?$",
        r"^auth/users/me/partial_update/?$",
        r"^auth/users/me/delete/?$",
        r"^auth/users/\d+/?$",
        r"^auth/users/\d+/update/?$",
        r"^auth/users/\d+/partial_update/?$",
        r"^auth/users/\d+/delete/?$",
        r"^auth/users/\d+/contact/?$",
        r"^posts/upvote/?$",
        r"^posts/downvote/?$",
        r"^comments/upvote/?$",
        r"^comments/downvote/?$",
        r"^comments/moderate/?$",
    ]

    def has_permission(self, request, view):
        if any(re.match(route, request.path_info) for route in self.authenticated_routes):
            if not self.is_authenticated(request):
                raise PermissionDenied(detail="User is not authenticated")
            
            if not self.is_token_valid(request):
                try:
                    self.refresh_token(request)
                except (InvalidToken, TokenError):
                    raise PermissionDenied(detail="Token refresh failed")

        return True

    def is_authenticated(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('JWT '):
            return False
        token = auth_header[4:]
        try:
            RefreshToken(token).payload
            return True
        except:
            return False

    def is_token_valid(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('JWT '):
            return False
        token = auth_header[4:]
        try:
            payload = RefreshToken(token).payload
            return payload['exp'] > int(time.time())
        except:
            return False

    def refresh_token(self, request):
        from rest_framework_simplejwt.views import TokenRefreshView
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        from rest_framework.status import HTTP_401_UNAUTHORIZED

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('JWT '):
            raise PermissionDenied(detail="Invalid authorization header")
        
        token = auth_header[4:]
        refresh_view = TokenRefreshView.as_view()
        request._request.data = {'refresh': token}
        refresh_response = refresh_view(request._request)
        
        if refresh_response.status_code == HTTP_401_UNAUTHORIZED:
            raise PermissionDenied(detail="Token refresh failed")

        new_token = refresh_response.data['access']
        request.META['HTTP_AUTHORIZATION'] = f'JWT {new_token}'
