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
    this.generateCategoryMethods();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        // Convert request details into a JSON string before saving to localStorage
        const requestDetails = {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data,
        };

        // Store request details in local storage (stringify to store objects)
        localStorage.setItem(
          `Request_${new Date().getTime()}`, // Unique key based on timestamp
          JSON.stringify(requestDetails) // Convert object to string
        );

        console.log("Starting Request", requestDetails);

        // If authorization is required, attach token
        if (this.requiresAuth(config)) {
          const token = Cookies.get("accessToken"); // Correct cookie name
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
            console.log(`Token attached to request: ${token}`);
            // Log that the token is attached and save to local storage
            console.log(`Token attached to request: ${token}`);
            localStorage.setItem(
              `Token_Attached_Request_${new Date().getTime()}`,
              JSON.stringify({
                ...requestDetails,
                token, // Save the token attached request details
              })
            );
          } else {
            console.log(
              "No token found, proceeding without Authorization header."
            );
          }
        } else {
          console.log("Authorization not required for this request.");
        }

        return config;
      },
      (error) => {
        // Log request errors
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        // Convert response details to a JSON string before saving to localStorage
        const responseDetails = {
          url: response.config.url,
          status: response.status,
          data: response.data,
        };

        // Store response details in local storage
        localStorage.setItem(
          `Response_${new Date().getTime()}`, // Unique key based on timestamp
          JSON.stringify(responseDetails)
        );

        console.log("Response received", responseDetails);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.requiresAuth(originalRequest)
        ) {
          originalRequest._retry = true;
          try {
            console.log("Refreshing JWT...");
            await this.refreshJwt();
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error("Failed to refresh JWT, logging out:", refreshError);
            this.handleLogout();
            return Promise.reject(refreshError);
          }
        }

        // Log response errors and save to localStorage
        console.error("Response Error:", error);
        localStorage.setItem(
          `Response_Error_${new Date().getTime()}`,
          JSON.stringify({
            url: originalRequest?.url,
            error: error.message,
            status: error.response?.status,
          })
        );

        return Promise.reject(error);
      }
    );
  }

  requiresAuth(config) {
    // Condition 1: Skip authentication for authentication-related endpoints
    if (config.url.startsWith("/auth")) return false;

    // Condition 2: Define specific endpoints that require authentication
    const authRequiredEndpoints = [
      "cms-api/v1/posts/", // POST
      "auth/users/", // GET (user list)
      "auth/users/activation/", // POST (user activation)
      "auth/users/me/", // GET (user details)
      "cms-api/v1/users/me/", // GET (user details)
      "auth/users/me/", // PUT (update user)
      "auth/users/me/", // PATCH (partial update user)
    ];

    // Check if the endpoint requires authentication
    const isAuthRequiredEndpoint = authRequiredEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    // Condition 3: Check if the request method requires authentication
    const authRequiredMethods = ["POST", "PUT", "PATCH", "DELETE"];
    const isAuthRequiredMethod = authRequiredMethods.includes(
      config.method.toUpperCase()
    );

    // Return true if either condition 2 or 3 is true
    if (isAuthRequiredEndpoint || isAuthRequiredMethod) {
      return true;
    }

    // If none of the conditions are met, return false
    return false;
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

  generateCategoryMethods() {
    for (const [category, endpoints] of Object.entries(apiEndpoints)) {
      this[category] = {};
      for (const [key, value] of Object.entries(endpoints)) {
        if (typeof value === "function") {
          this[category][key] = (id, data) =>
            this[this.getHttpMethod(key)](value(id), data);
        } else {
          this[category][key] = (data) =>
            this[this.getHttpMethod(key)](value, data);
        }
      }
    }
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
      subcategories: "get",
      delete: "delete",
      approve: "post",
      reject: "post",
      upvote: "post",
      downvote: "post",
      markAsRead: "post",
      markAllAsRead: "post",
      checkSlug: "post",
      featured: "get",
      mostViewed: "get",
      view: "get",
      search: "get",
      byTag: "get",
      byCategory: "get",
      byAuthor: "get",
      byDateRange: "get",
      publish: "post",
      analytics: "post",
      list: "get",
      create: "post",
      read: "get",
      update: "put",
      partialUpdate: "patch",
      checkAuth: "get",
      logout: "post",
      usersList: "get",
      usersActivation: "post",
      usersMeRead: "get",
      usersMeUpdate: "put",
      usersMePartialUpdate: "patch",
      usersMeDelete: "delete",
      usersResendActivation: "post",
      usersResetPassword: "post",
      usersResetPasswordConfirm: "post",
      usersResetUsername: "post",
      usersResetUsernameConfirm: "post",
      usersSetPassword: "post",
      usersSetUsername: "post",
      jwtCreate: "post",
      jwtRefresh: "post",
      jwtVerify: "post",
      usersCreate: "post",
      me: "get",
      checkAdminStatus: "get",
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
