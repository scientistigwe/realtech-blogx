import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { apiEndpoints } from "./apiEndpoints";

const BASE_URL = "http://localhost:8000/cms-api/v1/";

const createApiClient = () => {
  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
  });

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 < Date.now();
  };

  const getStoredRefreshToken = () => localStorage.getItem("refreshToken");

  const storeAccessToken = (token) => {
    localStorage.setItem("accessToken", token);
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const clearStoredTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete client.defaults.headers.common["Authorization"];
  };

  const refreshToken = async () => {
    const storedRefreshToken = getStoredRefreshToken();
    if (!storedRefreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      console.log("Attempting to refresh token...");
      const { data } = await client.post(apiEndpoints.auth.jwtRefresh, {
        refresh: storedRefreshToken,
      });

      if (!data || !data.access) {
        throw new Error("Invalid refresh response");
      }

      console.log("Successfully refreshed token");
      storeAccessToken(data.access);
      return data.access;
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      clearStoredTokens();
      throw new Error("Failed to refresh token. Please log in again.");
    }
  };

  client.interceptors.request.use(
    async (config) => {
      const csrfToken = localStorage.getItem("csrfToken");
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }

      let accessToken = localStorage.getItem("accessToken");

      if (accessToken && !isTokenExpired(accessToken)) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      } else if (accessToken && isTokenExpired(accessToken)) {
        try {
          const newToken = await refreshToken();
          config.headers["Authorization"] = `Bearer ${newToken}`;
        } catch (error) {
          console.error("Failed to refresh token:", error.message);
          clearStoredTokens();
          // Optionally redirect to login page here
          // window.location.href = "/auth/login";
          return Promise.reject(error);
        }
      }

      if (
        ["post", "put", "patch"].includes(config.method?.toLowerCase()) &&
        config.data
      ) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log("401 Unauthorized. Attempting to refresh token...");
          const newAccessToken = await refreshToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError.message);
          clearStoredTokens();
          // Redirect to login page
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

export default apiClient;
