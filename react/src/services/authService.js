// services/authService.js
import {
  createJwt as apiCreateJwt,
  refreshJwt as apiRefreshJwt,
  verifyJwt as apiVerifyJwt,
  checkAuth as apiCheckAuth,
  createUser as apiCreateUser,
  logout as apiLogout,
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

const handleApiError = (error, message) => {
  console.error(`${message}:`, error.response?.data || error.message);
  throw error;
};

export const authService = {
  async createJwt(credentials) {
    try {
      const { username, password } = credentials;
      const response = await apiCreateJwt({ username, password });
      console.log("JWT created successfully:", response.data);
      return {
        user: response.data.user || null,
        isAuthenticated: true,
      };
    } catch (error) {
      handleApiError(error, "Error creating JWT");
      return { user: null, isAuthenticated: false };
    }
  },

  async refreshJwt(refreshToken) {
    try {
      const response = await apiRefreshJwt({ refresh: refreshToken });
      console.log("JWT refreshed:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error refreshing JWT:");
    }
  },

  async verifyJwt(token) {
    try {
      await apiVerifyJwt({ token });
      return true;
    } catch (error) {
      handleApiError(error, "Error verifying JWT:");
      return false;
    }
  },

  async checkAuth() {
    try {
      const response = await apiCheckAuth();
      console.log("Authentication check result:", response.data);
      return {
        user: response.data.user || null,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error("Authentication check failed:", error);
      return { user: null, isAuthenticated: false };
    }
  },

  async createUser(userData) {
    try {
      console.log("Creating user:", userData);
      const response = await apiCreateUser(userData);
      console.log("User created successfully:", response.data);
      if (response.data && response.data.username) {
        return this.createJwt({
          username: userData.username,
          password: userData.password,
        });
      }
      return { user: response.data, isAuthenticated: false };
    } catch (error) {
      handleApiError(error, "Error creating user:");
    }
  },

  async getUsersList() {
    try {
      const response = await apiGetUsersList();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching users list:");
    }
  },

  async activateUser(data) {
    try {
      const response = await apiActivateUser(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error activating user:");
    }
  },

  async getUserProfile() {
    try {
      const response = await apiGetUserProfile();
      console.log("User profile fetched:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching user profile:");
    }
  },

  async updateUserProfile(data) {
    try {
      const response = await apiUpdateUserProfile(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error updating user profile:");
    }
  },

  async partialUpdateUserProfile(data) {
    try {
      const response = await apiPartialUpdateUserProfile(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error partially updating user profile:");
    }
  },

  async deleteUserProfile() {
    try {
      const response = await apiDeleteUserProfile();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error deleting user profile:");
    }
  },

  async resendActivation(data) {
    try {
      const response = await apiResendActivation(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error resending activation email:");
    }
  },

  async resetPassword(data) {
    try {
      const response = await apiResetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error requesting password reset:");
    }
  },

  async confirmResetPassword(data) {
    try {
      const response = await apiConfirmResetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error confirming password reset:");
    }
  },

  async resetUsername(data) {
    try {
      const response = await apiResetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error requesting username reset:");
    }
  },

  async confirmResetUsername(data) {
    try {
      const response = await apiConfirmResetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error confirming username reset:");
    }
  },

  async setPassword(data) {
    try {
      const response = await apiSetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error setting new password:");
    }
  },

  async setUsername(data) {
    try {
      const response = await apiSetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error setting new username:");
    }
  },

  async getUserProfileById(id) {
    try {
      const response = await apiGetUserProfileById(id);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching user profile by ID:");
    }
  },

  async updateUserById(id, data) {
    try {
      const response = await apiUpdateUserById(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error updating user profile by ID:");
    }
  },

  async partialUpdateUserById(id, data) {
    try {
      const response = await apiPartialUpdateUserById(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error partially updating user profile by ID:");
    }
  },

  async deleteUserById(id) {
    try {
      const response = await apiDeleteUserById(id);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error deleting user profile by ID:");
    }
  },
};
