import {
  loginApi,
  logoutApi,
  registerApi,
  checkAuthenticationApi,
  refreshTokenApi,
  updatePasswordApi,
  requestPasswordResetApi,
} from "../api/authApi";
import {
  setAuthStatus,
  clearAuthStatus,
  getAuthStatus,
} from "./../api/authStatus";
import { APIError } from "./apiInterceptor"; // Assuming we've moved APIError to a separate file

const isDevelopment = process.env.NODE_ENV === "development";

function devLog(...args) {
  if (isDevelopment) {
    console.log(...args);
  }
}

function devError(...args) {
  if (isDevelopment) {
    console.error(...args);
  }
}

const handleResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    devLog("API Response received:", response);
    if (response.data?.expirationTime) {
      devLog(
        "Setting auth status with expiration time:",
        response.data.expirationTime
      );
      setAuthStatus(true, response.data.expirationTime);
    }
    return response.data;
  } catch (error) {
    devError("API Request Error:", error);
    if (error instanceof APIError) {
      throw error;
    } else {
      throw new APIError(error.message, error.response?.status, error);
    }
  }
};

export const loginUser = async (credentials) => {
  devLog("Attempting to log in with:", credentials);
  return handleResponse(() => loginApi(credentials));
};

export const logoutUser = async () => {
  try {
    devLog("Attempting to log out.");
    await logoutApi();
    devLog("Logout request sent.");
  } finally {
    devLog("Clearing auth status.");
    clearAuthStatus();
  }
};

export const registerUser = async (formData) => {
  devLog("Attempting to register with:", formData);
  return handleResponse(() => registerApi(formData));
};

export const checkAuthentication = async () => {
  devLog("Checking authentication status.");
  if (getAuthStatus()) {
    devLog("Auth status found in Redux state.");
    return { isAuthenticated: true };
  }
  return handleResponse(() => checkAuthenticationApi());
};

export const refreshToken = async () => {
  devLog("Attempting to refresh token.");
  return handleResponse(() => refreshTokenApi());
};

export const requestPasswordReset = async (email) => {
  devLog("Requesting password reset for email:", email);
  return handleResponse(() => requestPasswordResetApi(email));
};

export const updatePassword = async (passwordData) => {
  devLog("Updating password with data:", passwordData);
  return handleResponse(() => updatePasswordApi(passwordData));
};

export const isUserLoggedIn = () => {
  const authStatus = getAuthStatus();
  return authStatus && authStatus.isAuthenticated;
};

export { getAuthStatus };
