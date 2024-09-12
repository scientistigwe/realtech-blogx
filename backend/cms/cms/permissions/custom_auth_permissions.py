import re
import time
from django.utils.functional import SimpleLazyObject
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import RefreshToken


class CustomAuthPermission(BasePermission):
    authenticated_routes = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.csrf_cookie_name = 'csrftoken'
        self.csrf_token = SimpleLazyObject(lambda: self._get_csrf_token())

    def _get_csrf_token(self):
        csrf_cookie = self.request.META.get('CSRF_COOKIE')
        if csrf_cookie:
            return csrf_cookie.split('=')[1]
        return None

    def has_permission(self, request, view):
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        
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
        from rest_framework import status

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('JWT '):
            raise PermissionDenied(detail="Invalid authorization header")
        
        token = auth_header[4:]
        refresh_view = TokenRefreshView.as_view()
        request._request.data = {'refresh': token}
        refresh_response = refresh_view(request._request)
        
        if refresh_response.status_code == status.HTTP_401_UNAUTHORIZED:
            raise PermissionDenied(detail="Token refresh failed")

        new_token = refresh_response.data['access']
        request.META['HTTP_AUTHORIZATION'] = f'JWT {new_token}'
