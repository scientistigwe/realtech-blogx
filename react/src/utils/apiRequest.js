import apiClient from "./apiClient";
import { getCsrfToken } from "./csrf";

// Helper function to refresh the token
const refreshToken = async () => {
  try {
    await apiClient.post("/auth/token/refresh/");
    console.log("Token refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logout();
  }
};

// Helper function to log out the user
const logout = () => {
  // Clear any client-side state
  // For example:
  // store.dispatch(clearUserState());

  // Redirect to login page
  window.location.href = "/login";
};

// Main API request function
export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const csrfToken = getCsrfToken();

    const headers = {
      "X-CSRFToken": csrfToken,
      ...config.headers,
    };

    // Always include credentials for JWT in HTTP-only cookies
    const credentials = "include";

    console.log(`API request:`, {
      method,
      url,
      data,
      headers,
      credentials,
    });

    const response = await apiClient({
      method,
      url,
      data,
      headers,
      credentials,
      ...config,
    });

    console.log(`API response for ${method} ${url}:`, response.data);

    return response;
  } catch (error) {
    // Log detailed error information for better debugging
    if (error.response) {
      console.error(`API request failed for ${method} ${url}:`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Specific handling for authentication errors
      if (error.response.status === 401) {
        console.error("Authentication error. JWT may be invalid or expired.");
        await refreshToken();
      }
    } else {
      console.error(`API request error for ${method} ${url}:`, error.message);
    }

    // Re-throw the error so it can be handled upstream
    throw error;
  }
};
