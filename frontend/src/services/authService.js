// services/authService.js
import api from "../utils/api";
import Cookies from "js-cookie";

const TOKEN_EXPIRY_BUFFER = 60 * 1000; // 1 minute in milliseconds

const handleApiError = (error, message) => {
  console.error(`${message}:`, error.response?.data || error.message);
  throw error;
};

const setTokens = (accessToken, refreshToken) => {
  Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 day
  Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days
};

const clearTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

export const authService = {
  async createJwt(credentials) {
    try {
      const { username, password } = credentials;
      const response = await api.auth.jwtCreate({ username, password });
      setTokens(response.access, response.refresh);
      return {
        user: response.user,
        authToken: response.access,
        refreshToken: response.refresh,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error("Error creating JWT:", error);
      return { user: null, isAuthenticated: false };
    }
  },

  async refreshJwt() {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }
    try {
      const response = await api.auth.jwtRefresh({ refresh: refreshToken });
      setTokens(response.access, response.refresh);
      return response;
    } catch (error) {
      clearTokens();
      handleApiError(error, "Error refreshing JWT:");
    }
  },

  async verifyJwt() {
    const token = Cookies.get("authToken"); // Changed from "accessToken"
    if (!token) {
      return false;
    }
    try {
      await api.auth.jwtVerify({ token });
      return true;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return this.refreshJwt();
      }
      return false;
    }
  },

  async checkAuth() {
    try {
      const response = await api.auth.checkAuth();
      if (response.is_authenticated) {
        return {
          user: response.user,
          isAuthenticated: true,
        };
      } else {
        clearTokens();
        return { user: null, isAuthenticated: false };
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      clearTokens();
      return { user: null, isAuthenticated: false };
    }
  },

  async logout() {
    try {
      const response = await api.auth.logout();
      // Clear the auth token
      Cookies.remove("authToken"); // Changed from "accessToken"
      // Dispatch the logout action
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Error during logout:", error);
      return { success: false, message: error.message || "Logout failed" };
    }
  },

  async createUser(userData) {
    try {
      console.log("Creating user:", userData);
      const response = await api.auth.usersCreate(userData);
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
      const response = await api.auth.usersList();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching users list:");
    }
  },

  async activateUser(data) {
    try {
      const response = await api.auth.usersActivation(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error activating user:");
    }
  },

  async getUserProfile() {
    try {
      const response = await api.auth.usersMeRead();
      console.log("User profile fetched:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching user profile:");
    }
  },

  async updateUserProfile(data) {
    try {
      const response = await api.auth.usersMeUpdate(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error updating user profile:");
    }
  },

  async partialUpdateUserProfile(data) {
    try {
      const response = await api.auth.usersMePartialUpdate(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error partially updating user profile:");
    }
  },

  async deleteUserProfile() {
    try {
      const response = await api.auth.usersMeDelete();
      return response.data;
    } catch (error) {
      handleApiError(error, "Error deleting user profile:");
    }
  },

  async resendActivation(data) {
    try {
      const response = await api.auth.usersResendActivation(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error resending activation email:");
    }
  },

  async resetPassword(data) {
    try {
      const response = await api.auth.usersResetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error requesting password reset:");
    }
  },

  async confirmResetPassword(data) {
    try {
      const response = await api.auth.usersResetPasswordConfirm(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error confirming password reset:");
    }
  },

  async resetUsername(data) {
    try {
      const response = await api.auth.usersResetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error requesting username reset:");
    }
  },

  async confirmResetUsername(data) {
    try {
      const response = await api.auth.usersResetUsernameConfirm(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error confirming username reset:");
    }
  },

  async setPassword(data) {
    try {
      const response = await api.auth.usersSetPassword(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error setting new password:");
    }
  },

  async setUsername(data) {
    try {
      const response = await api.auth.usersSetUsername(data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error setting new username:");
    }
  },

  async getUserProfileById(id) {
    try {
      const response = await api.auth.usersRead(id);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching user profile by ID:");
    }
  },

  async updateUserById(id, data) {
    try {
      const response = await api.auth.usersUpdate(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error updating user profile by ID:");
    }
  },

  async partialUpdateUserById(id, data) {
    try {
      const response = await api.auth.usersPartialUpdate(id, data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error partially updating user profile by ID:");
    }
  },

  async deleteUserById(id) {
    try {
      const response = await api.auth.usersDelete(id);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error deleting user profile by ID:");
    }
  },

  async ensureValidToken() {
    const token = Cookies.get("authToken"); // Changed from "accessToken"
    if (!token) {
      return false;
    }
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
      if (Date.now() >= expiryTime - TOKEN_EXPIRY_BUFFER) {
        await this.refreshJwt();
      }
      return true;
    } catch (error) {
      console.error("Error ensuring valid token:", error);
      return false;
    }
  },
};

export default authService;
