import axios from "axios";
import Cookies from "js-cookie";
import { apiEndpoints } from "./apiEndpoints";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to handle CSRF token
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.startsWith("/login")) {
        console.error("Unauthorized access, redirecting to login");
        window.location.href = "/login";
      }
    } else {
      console.error("API error:", error.message);
    }
    return Promise.reject(error);
  }
);

// API functions
const api = {
  auth: {
    register: (data) => apiClient.post(apiEndpoints.auth.register, data),
    login: (data) => apiClient.post(apiEndpoints.auth.login, data),
    logout: () => apiClient.post(apiEndpoints.auth.logout),
    refreshToken: (data) =>
      apiClient.post(apiEndpoints.auth.refreshToken, data),
    verifyToken: (data) => apiClient.post(apiEndpoints.auth.verifyToken, data),
    resetPassword: (data) =>
      apiClient.post(apiEndpoints.auth.resetPassword, data),
    resetPasswordConfirm: (data) =>
      apiClient.post(apiEndpoints.auth.resetPasswordConfirm, data),
    activateUser: (data) =>
      apiClient.post(apiEndpoints.auth.activateUser, data),
  },
  users: {
    currentUserProfile: () =>
      apiClient.get(apiEndpoints.users.currentUserProfile),
    profile: (id) => apiClient.get(apiEndpoints.users.profile(id)),
    updateProfile: (data) =>
      apiClient.put(apiEndpoints.users.updateProfile, data),
    deleteAccount: () => apiClient.delete(apiEndpoints.users.deleteAccount),
  },
  authors: {
    list: () => apiClient.get(apiEndpoints.authors.list), // List only authors
    detail: (authorId) => apiClient.get(apiEndpoints.authors.detail(authorId)), // Fetch author details
    contactAuthor: (authorId, message) =>
      apiClient.post(apiEndpoints.authors.contact(authorId), { message }), // Contact author
  },
  posts: {
    fetchAll: () => apiClient.get(apiEndpoints.posts.fetchAll),
    fetchById: (postId) => apiClient.get(apiEndpoints.posts.fetchById(postId)),
    fetchByCategory: (category) =>
      apiClient.get(apiEndpoints.posts.fetchByCategory(category)),
    fetchBySubcategory: (subcategory) =>
      apiClient.get(apiEndpoints.posts.fetchBySubcategory(subcategory)),
    fetchByUser: (userId) =>
      apiClient.get(apiEndpoints.posts.fetchByUser(userId)),
    mostViewed: () => apiClient.get(apiEndpoints.posts.mostViewed),
    create: (data) => apiClient.post(apiEndpoints.posts.create, data),
    update: (postId, data) =>
      apiClient.put(apiEndpoints.posts.update(postId), data),
    delete: (postId) => apiClient.delete(apiEndpoints.posts.delete(postId)),
    fetchEngagementMetrics: (postId) =>
      apiClient.get(apiEndpoints.posts.fetchEngagementMetrics(postId)),
    upvote: (postId) => apiClient.post(apiEndpoints.posts.upvote(postId)),
    downvote: (postId) => apiClient.post(apiEndpoints.posts.downvote(postId)),
  },
  comments: {
    create: (postId, data) =>
      apiClient.post(apiEndpoints.comments.create(postId), data),
    update: (commentId, data) =>
      apiClient.put(apiEndpoints.comments.update(commentId), data),
    delete: (commentId) =>
      apiClient.delete(apiEndpoints.comments.delete(commentId)),
    upvote: (commentId) =>
      apiClient.post(apiEndpoints.comments.upvote(commentId)),
    downvote: (commentId) =>
      apiClient.post(apiEndpoints.comments.downvote(commentId)),
  },
  tags: {
    list: () => apiClient.get(apiEndpoints.tags.list),
    create: (data) => apiClient.post(apiEndpoints.tags.create, data),
    update: (tagId, data) =>
      apiClient.put(apiEndpoints.tags.update(tagId), data),
    delete: (tagId) => apiClient.delete(apiEndpoints.tags.delete(tagId)),
  },
  notifications: {
    list: () => apiClient.get(apiEndpoints.notifications.list),
    read: (notificationId) =>
      apiClient.post(apiEndpoints.notifications.read(notificationId)),
    create: (data) => apiClient.post(apiEndpoints.notifications.create, data),
  },
  moderation: {
    pendingContent: () => apiClient.get(apiEndpoints.moderation.pendingContent),
    approveContent: (contentId) =>
      apiClient.post(apiEndpoints.moderation.approveContent(contentId)),
    rejectContent: (contentId) =>
      apiClient.post(apiEndpoints.moderation.rejectContent(contentId)),
  },
};

export default api;
