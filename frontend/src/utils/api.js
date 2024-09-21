import axios from "axios";
import Cookies from "js-cookie";
import { apiEndpoints } from "./../utils/apiEndpoints";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/";

class Api {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      timeout: 10000,
    });
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        if (this.requiresAuth(config)) {
          const token = Cookies.get("auth_token"); // Changed from "accessToken"
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.requiresAuth(originalRequest)
        ) {
          originalRequest._retry = true;
          try {
            await this.refreshJwt();
            return this.client(originalRequest);
          } catch (refreshError) {
            this.handleLogout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  requiresAuth(config) {
    if (config.url.startsWith("/auth")) return false;
    if (config.method.toUpperCase() === "GET") return false;
    const authRequiredMethods = ["POST", "PUT", "PATCH", "DELETE"];
    return authRequiredMethods.includes(config.method.toUpperCase());
  }

  async request(method, url, data = null, config = {}) {
    try {
      const response = await this.client({ method, url, data, ...config });

      // Handle successful responses
      return response.data;
    } catch (error) {
      console.error(`API request error for ${method} ${url}:`, error);

      // Check for specific error types
      if (error.response?.status === 400) {
        console.error("Bad Request:", error.response.data);
        throw new Error("Bad Request");
      }
      if (error.response?.status === 401) {
        console.error("Unauthorized:", error.response.data);
        throw new Error("Unauthorized");
      }
      if (error.response?.status === 403) {
        console.error("Forbidden:", error.response.data);
        throw new Error("Forbidden");
      }
      if (error.response?.status >= 500) {
        console.error("Server Error:", error.response.data);
        throw new Error("Server Error");
      }

      // Default error handling
      throw error;
    }
  }

  get(url, config = {}) {
    return this.request("get", url, null, config);
  }
  post(url, data, config = {}) {
    return this.request("post", url, data, config);
  }
  put(url, data, config = {}) {
    return this.request("put", url, data, config);
  }
  patch(url, data, config = {}) {
    return this.request("patch", url, data, config);
  }
  delete(url, config = {}) {
    return this.request("delete", url, null, config);
  }

  // Token management
  getToken() {
    return Cookies.get("auth_token"); // Changed from "accessToken"
  }

  setTokens(accessToken, refreshToken) {
    Cookies.set("auth_token", accessToken, { expires: 1 }); // Changed from "accessToken"
    Cookies.set("refreshToken", refreshToken, { expires: 7 });
  }

  async refreshToken() {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");
    try {
      const response = await this.post("/auth/jwt/refresh/", {
        refresh: refreshToken,
      });
      this.setTokens(response.access, response.refresh);
      return response.access;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  }

  handleLogout(callApi = true) {
    if (callApi && this.getToken()) {
      this.post(apiEndpoints.auth.logout)
        .then(() => {
          Cookies.remove("auth_token"); // Changed from "accessToken"
          Cookies.remove("refreshToken");
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error("Error during logout API call:", error);
        });
    } else {
      Cookies.remove("auth_token"); // Changed from "accessToken"
      Cookies.remove("refreshToken");
      window.location.href = "/login";
    }
  }

  // Generate methods for each endpoint category
  generateMethods(category) {
    const methods = {};
    for (const [key, value] of Object.entries(apiEndpoints[category])) {
      if (typeof value === "function") {
        methods[key] = (id, data) =>
          this[this.getHttpMethod(key)](value(id), data);
      } else {
        methods[key] = (data) => this[this.getHttpMethod(key)](value, data);
      }
    }
    return methods;
  }

  getHttpMethod(key) {
    const methodMap = {
      create: "post",
      list: "get",
      read: "get",
      update: "put",
      partialUpdate: "patch",
      delete: "delete",
      default: "post",
      mostViewed: "get",
    };
    return methodMap[key] || methodMap.default;
  }
}

const api = new Api();

// Generate methods for each category
const apiCategories = [
  "auth",
  "categories",
  "comments",
  "notifications",
  "posts",
  "tags",
  "users",
];
apiCategories.forEach((category) => {
  api[category] = api.generateMethods(category);
});

export default api;

// Named exports
export const { auth, categories, comments, notifications, posts, tags, users } =
  api;
export const getToken = () => api.getToken();
export const handleLogout = () => api.handleLogout();
