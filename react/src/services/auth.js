import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./apiEndpoints";
import { setAuthStatus } from "./authStatus";

// Public API functions
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post(apiEndpoints.auth.login, credentials);
    setAuthStatus(true, response.data.expirationTime); // Assuming response contains expirationTime
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const logoutUser = async () => {
  try {
    await apiClient.post(apiEndpoints.auth.logout);
    setAuthStatus(false, 0); // Clear authentication status
  } catch (error) {
    throw new Error("Logout failed");
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post(
      apiEndpoints.users.resetPassword(email)
    );
    return response.data;
  } catch (error) {
    throw new Error("Password reset request failed");
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await apiClient.post(
      apiEndpoints.users.updatePassword,
      passwordData
    );
    return response.data;
  } catch (error) {
    throw new Error("Password update failed");
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await apiClient.post(apiEndpoints.auth.register, formData);
    setAuthStatus(true, response.data.expirationTime); // Assuming response contains expirationTime
    return response.data;
  } catch (error) {
    throw new Error("Registration failed");
  }
};
