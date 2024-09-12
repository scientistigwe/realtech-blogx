import axios from "axios";
import { apiEndpoints } from "./apiEndpoints";
import { checkAuth } from "./api";

const BASE_URL = "http://localhost:8000/cms-api/v1/";

const createApiClient = () => {
  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
  });

  const authenticatedRoutes = [
    "auth/users/me/",
    "auth/users/me/update/",
    "auth/users/me/partial_update/",
    "auth/users/me/delete/",
    "auth/users/{id}/",
    "auth/users/{id}/update/",
    "auth/users/{id}/partial_update/",
    "auth/users/{id}/delete/",
    "auth/users/{id}/contact/",
    "posts/upvote/",
    "posts/downvote/",
    "comments/upvote/",
    "comments/downvote/",
    "comments/moderate/",
  ];

  client.interceptors.request.use(
    async (config) => {
      const csrfCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="));

      if (csrfCookie) {
        const csrfToken = csrfCookie.split("=")[1];
        config.headers["X-CSRFToken"] = csrfToken;
      }

      // Check if the route requires authentication
      if (authenticatedRoutes.some((route) => config.url.includes(route))) {
        try {
          // Check auth status before making the request
          const authStatus = await checkAuth();
          if (!authStatus.isAuthenticated) {
            throw new Error("User is not authenticated");
          }
        } catch (error) {
          console.error("Authentication failed:", error);
          // Redirect to login page
          if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
          }
          return Promise.reject(error);
        }
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
          const refreshResponse = await client.post(
            apiEndpoints.auth.jwtRefresh
          );
          console.log("Token refreshed successfully:", refreshResponse.data);

          // Update the Authorization header with the new token
          const newToken = refreshResponse.data.token;
          originalRequest.headers["Authorization"] = `JWT ${newToken}`;

          return client(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError.message);
          // Clear local storage and redirect to login page
          localStorage.removeItem("token");
          if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
          }
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
