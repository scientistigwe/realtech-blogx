import Cookies from "js-cookie";
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
} from "../utils/api";

const handleApiError = (error, message) => {
  const errorMessage = error.response?.data || error.message;
  console.error(`${message}:`, errorMessage);
  throw new Error(errorMessage);
};

export const authService = {
  async createJwt({ username, password }) {
    try {
      const response = await apiCreateJwt({ username, password });
      console.log("JWT created successfully:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error creating JWT");
    }
  },

  async refreshJwt(refreshToken) {
    try {
      const response = await apiRefreshJwt({ refresh: refreshToken });
      console.log("JWT refreshed:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error refreshing JWT");
    }
  },

  async verifyJwt(token) {
    try {
      await apiVerifyJwt({ token });
      return true; // Return true on success
    } catch (error) {
      handleApiError(error, "Error verifying JWT");
      return false; // Return false if verification fails
    }
  },

  async checkAuth() {
    try {
      const response = await apiCheckAuth();
      console.log("Authentication check:", response.data);
      const isAuthenticated = Boolean(Cookies.get("sessionid"));
      return { user: response.data.user || null, isAuthenticated };
    } catch (error) {
      handleApiError(error, "Error checking authentication");
      return { user: null, isAuthenticated: false };
    }
  },

  async createUser(userData) {
    try {
      const response = await apiCreateUser(userData);
      console.log("User created successfully:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error creating user");
    }
  },

  async getUsersList() {
    try {
      const response = await apiGetUsersList();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching users list");
    }
  },

  async activateUser(data) {
    try {
      const response = await apiActivateUser(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error activating user");
    }
  },

  async getUserProfile() {
    try {
      const response = await apiGetUserProfile();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching user profile");
    }
  },

  async updateUserProfile(data) {
    try {
      const response = await apiUpdateUserProfile(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error updating user profile");
    }
  },

  async partialUpdateUserProfile(data) {
    try {
      const response = await apiPartialUpdateUserProfile(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error partially updating user profile");
    }
  },

  async deleteUserProfile() {
    try {
      const response = await apiDeleteUserProfile();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error deleting user profile");
    }
  },

  async resendActivation(data) {
    try {
      const response = await apiResendActivation(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error resending activation email");
    }
  },

  async resetPassword(data) {
    try {
      const response = await apiResetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error requesting password reset");
    }
  },

  async confirmResetPassword(data) {
    try {
      const response = await apiConfirmResetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error confirming password reset");
    }
  },

  async resetUsername(data) {
    try {
      const response = await apiResetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error requesting username reset");
    }
  },

  async confirmResetUsername(data) {
    try {
      const response = await apiConfirmResetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error confirming username reset");
    }
  },

  async setPassword(data) {
    try {
      const response = await apiSetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error setting new password");
    }
  },

  async setUsername(data) {
    try {
      const response = await apiSetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error setting new username");
    }
  },

  async getUserProfileById(id) {
    try {
      const response = await apiGetUserProfileById(id);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching user profile by ID");
    }
  },

  async updateUserById(id, data) {
    try {
      const response = await apiUpdateUserById(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error updating user profile by ID");
    }
  },

  async partialUpdateUserById(id, data) {
    try {
      const response = await apiPartialUpdateUserById(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error partially updating user profile by ID");
    }
  },

  async deleteUserById(id) {
    try {
      const response = await apiDeleteUserById(id);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error deleting user profile by ID");
    }
  },
};
