import apiClientBase from "../api/apiService";
import { apiEndpoints } from "../api/apiEndpoints";
import { setAuthStatus, clearAuthStatus, getAuthStatus } from "./authStatus";
import { APIError } from "../utils/apiError";

console.log("AuthService starting...");

// Helper function to handle service calls
const handleServiceCall = async (apiCall, logPrefix) => {
  try {
    const response = await apiCall();
    console.log(`${logPrefix} response:`, response);
    if (response.data?.expirationTime) {
      setAuthStatus(true, response.data.expirationTime); // Update auth status on successful login/refresh
    }
    return response.data;
  } catch (error) {
    console.error(`${logPrefix} error:`, error);
    if (error instanceof APIError) {
      throw error; // Rethrow known API errors
    }
    throw new APIError(error.message, error.response?.status, error); // Convert unknown errors to APIError
  }
};

// User authentication functions

export const loginUser = async (credentials) => {
  return handleServiceCall(
    () => apiClientBase.post(apiEndpoints.auth.login, credentials),
    "Login"
  );
};

export const logoutUser = async () => {
  try {
    await handleServiceCall(
      () => apiClientBase.post(apiEndpoints.auth.logout),
      "Logout"
    );
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  } finally {
    clearAuthStatus(); // Always clear auth status on logout
  }
};

export const registerUser = async (formData) => {
  return handleServiceCall(
    () => apiClientBase.post(apiEndpoints.auth.register, formData),
    "Registration"
  );
};

export const checkAuthentication = async () => {
  const authStatus = getAuthStatus();
  if (authStatus) {
    return { isAuthenticated: true }; // Return cached auth status if available
  }
  return handleServiceCall(
    () => apiClientBase.get(apiEndpoints.auth.checkAuthentication),
    "Authentication Check"
  );
};

export const refreshToken = async () => {
  return handleServiceCall(
    () => apiClientBase.post(apiEndpoints.auth.refreshToken),
    "Token Refresh"
  );
};

export const requestPasswordReset = async (email) => {
  return handleServiceCall(
    () => apiClientBase.post(apiEndpoints.auth.resetPassword, { email }),
    "Password Reset"
  );
};

export const updatePassword = async (passwordData) => {
  return handleServiceCall(
    () =>
      apiClientBase.post(apiEndpoints.auth.resetPasswordConfirm, passwordData),
    "Password Update"
  );
};

export const isUserLoggedIn = () => getAuthStatus()?.isAuthenticated; // Check if the user is logged in
