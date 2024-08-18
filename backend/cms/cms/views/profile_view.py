from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from cms.serializers.custom_user_serializer import CustomUserSerializer, CustomUserUpdateSerializer
from cms.serializers.profile_serializer import PasswordResetSerializer


# User Profile Views

class CurrentUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)


class UserProfileDetailView(generics.RetrieveAPIView):
    """
    Retrieves the details of the user's profile.
    URL: /users/profile/
    """
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class ProfileUpdateView(generics.UpdateAPIView):
    """
    Handles updating the user's profile information.
    URL: /users/profile/update/
    """
    serializer_class = CustomUserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        serializer.save()

class PasswordResetView(generics.UpdateAPIView):
    """
    Handles resetting the user's password.
    URL: /users/profile/reset-password/
    """
    serializer_class = PasswordResetSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        user = self.get_object()
        old_password = serializer.validated_data.get('old_password')
        new_password = serializer.validated_data.get('new_password')

        if not user.check_password(old_password):
            raise serializer.ValidationError({"old_password": "Old password is incorrect."})

        user.set_password(new_password)
        user.save()

class DeleteAccountView(APIView):
    """
    Handles deleting the user's account.
    URL: /users/profile/delete/
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'detail': 'Account deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
