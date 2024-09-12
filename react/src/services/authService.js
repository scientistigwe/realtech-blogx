// services/authService.js
import {
  createJwt as apiCreateJwt,
  refreshJwt as apiRefreshJwt,
  verifyJwt as apiVerifyJwt,
  checkAuth as apiCheckAuth,
  createUser as apiCreateUser,
  getUsersList as apiGetUsersList,
  activateUser as apiActivateUser,
  getUserProfile as apiGetUserProfile,
  updateUserProfile as apiUpdateUserProfile,
  partialUpdateUserProfile as apiPartialUpdateUserProfile,
  deleteUserProfile as apiDeleteUserProfile,
  resendActivation as apiResendActivation,
  resetPassword as apiResetPassword,
  confirmResetPassword as apiConfirmResetPassword,
  resetUsername as apiResetUsername,
  confirmResetUsername as apiConfirmResetUsername,
  setPassword as apiSetPassword,
  setUsername as apiSetUsername,
  getUserProfileById as apiGetUserProfileById,
  updateUserById as apiUpdateUserById,
  partialUpdateUserById as apiPartialUpdateUserById,
  deleteUserById as apiDeleteUserById,
} from "../utils/api"; // Adjust the path as necessary

export const authService = {
  // Create a JWT and return user profile (assumes you call another API to get user info)
  async createJwt(username, password) {
    try {
      const response = await apiCreateJwt({ username, password });
      console.log("JWT created:", response.data);
      const userProfile = await authService.getUserProfile();
      return userProfile;
    } catch (error) {
      console.error(
        "Error creating JWT:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  // Refresh an existing JWT
  async refreshJwt(refreshToken) {
    try {
      const response = await apiRefreshJwt({ refresh: refreshToken });
      console.log("JWT refreshed:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error refreshing JWT:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  // Verify a JWT
  async verifyJwt(token) {
    try {
      await apiVerifyJwt({ token });
    } catch (error) {
      console.error("Error verifying JWT:", error);
      throw error;
    }
  },

  // Check if the user is authenticated
  async checkAuth() {
    try {
      const response = await apiCheckAuth();
      console.log("Authentication check result:", response.data);
      return response.data.is_authenticated;
    } catch (error) {
      console.error(
        "Error checking authentication:",
        error.response ? error.response.data : error.message
      );
      return false;
    }
  },

  // Create a new user
  async createUser(data) {
    try {
      const response = await apiCreateUser(data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Get the list of users
  async getUsersList() {
    try {
      const response = await apiGetUsersList();
      return response.data;
    } catch (error) {
      console.error("Error fetching users list:", error);
      throw error;
    }
  },

  // Activate a user
  async activateUser(data) {
    try {
      const response = await apiActivateUser(data);
      return response.data;
    } catch (error) {
      console.error("Error activating user:", error);
      throw error;
    }
  },

  // Get the profile of the current user
  async getUserProfile() {
    try {
      const response = await apiGetUserProfile();
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update the current user's profile
  async updateUserProfile(data) {
    try {
      const response = await apiUpdateUserProfile(data);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Partially update the current user's profile
  async partialUpdateUserProfile(data) {
    try {
      const response = await apiPartialUpdateUserProfile(data);
      return response.data;
    } catch (error) {
      console.error("Error partially updating user profile:", error);
      throw error;
    }
  },

  // Delete the current user's profile
  async deleteUserProfile() {
    try {
      const response = await apiDeleteUserProfile();
      return response.data;
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw error;
    }
  },

  // Resend activation email
  async resendActivation(data) {
    try {
      const response = await apiResendActivation(data);
      return response.data;
    } catch (error) {
      console.error("Error resending activation email:", error);
      throw error;
    }
  },

  // Request a password reset
  async resetPassword(data) {
    try {
      const response = await apiResetPassword(data);
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  // Confirm password reset
  async confirmResetPassword(data) {
    try {
      const response = await apiConfirmResetPassword(data);
      return response.data;
    } catch (error) {
      console.error("Error confirming password reset:", error);
      throw error;
    }
  },

  // Request a username reset
  async resetUsername(data) {
    try {
      const response = await apiResetUsername(data);
      return response.data;
    } catch (error) {
      console.error("Error resetting username:", error);
      throw error;
    }
  },

  // Confirm username reset
  async confirmResetUsername(data) {
    try {
      const response = await apiConfirmResetUsername(data);
      return response.data;
    } catch (error) {
      console.error("Error confirming username reset:", error);
      throw error;
    }
  },

  // Set a new password
  async setPassword(data) {
    try {
      const response = await apiSetPassword(data);
      return response.data;
    } catch (error) {
      console.error("Error setting new password:", error);
      throw error;
    }
  },

  // Set a new username
  async setUsername(data) {
    try {
      const response = await apiSetUsername(data);
      return response.data;
    } catch (error) {
      console.error("Error setting new username:", error);
      throw error;
    }
  },

  // Get a user's profile by ID
  async getUserProfileById(id) {
    try {
      const response = await apiGetUserProfileById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile by ID:", error);
      throw error;
    }
  },

  // Update a user's profile by ID
  async updateUserById(id, data) {
    try {
      const response = await apiUpdateUserById(id, data);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile by ID:", error);
      throw error;
    }
  },

  // Partially update a user's profile by ID
  async partialUpdateUserById(id, data) {
    try {
      const response = await apiPartialUpdateUserById(id, data);
      return response.data;
    } catch (error) {
      console.error("Error partially updating user profile by ID:", error);
      throw error;
    }
  },

  // Delete a user profile by ID
  async deleteUserById(id) {
    try {
      const response = await apiDeleteUserById(id);
      return response.data;
    } catch (error) {
      console.error("Error deleting user by ID:", error);
      throw error;
    }
  },
};
