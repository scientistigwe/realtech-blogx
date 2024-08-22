import AuthorDetail from "../components/Authors/AuthorDetail";
import AuthorList from "../components/Authors/AuthorList";

export const apiEndpoints = {
  auth: {
    register: "auth/register/", // Custom registration endpoint
    login: "auth/login/", // Custom login endpoint
    logout: "auth/logout/", // Djoser token logout (if used)
    refreshToken: "auth/jwt/refresh/", // JWT refresh token endpoint
    verifyToken: "auth/jwt/verify/", // JWT verify token endpoint
    resetPassword: "auth/users/reset_password/", // Djoser password reset
    resetPasswordConfirm: "auth/users/reset_password_confirm/", // Djoser password reset confirm
    activateUser: "auth/users/activation/", // Djoser user activation
  },
  users: {
    currentUserProfile: "users/profile/", // Fetch current user profile
    profile: (id) => `users/${id}/`, // Fetch user profile by ID
    updateProfile: "users/profile/update/", // Update current user profile
    deleteAccount: "users/profile/delete/", // Delete current user account
  },
  authors: {
    list: "users/?is_author=true", // Filter to list only authors
    detail: (authorId) => `users/${authorId}/`, // Fetch author details
    contact: (authorId) => `users/${authorId}/contact/`, // Contact author
  },
  posts: {
    fetchAll: "posts/", // Fetch all posts
    fetchById: (postId) => `posts/${postId}/`, // Fetch post by ID
    fetchByCategory: (category) => `posts/category/${category}/`, // Fetch posts by category
    fetchBySubcategory: (subcategory) => `posts/subcategory/${subcategory}/`, // Fetch posts by subcategory
    fetchByUser: (userId) => `posts/user/${userId}/`, // Fetch posts by user
    mostViewed: "posts/most-viewed/", // Fetch most viewed posts
    create: "posts/create/", // Create a new post
    update: (postId) => `posts/${postId}/update/`, // Update post by ID
    delete: (postId) => `posts/${postId}/delete/`, // Delete post by ID
    fetchEngagementMetrics: (postId) => `post-engagements/${postId}/`, // Fetch engagement metrics for post
    upvote: (postId) => `posts/${postId}/upvote/`, // Upvote post
    downvote: (postId) => `posts/${postId}/downvote/`, // Downvote post
  },
  comments: {
    create: (postId) => `posts/${postId}/comments/`, // Create comment on a post
    update: (commentId) => `comments/${commentId}/`, // Update comment by ID
    delete: (commentId) => `comments/${commentId}/`, // Delete comment by ID
    upvote: (commentId) => `comments/${commentId}/upvote/`, // Upvote comment
    downvote: (commentId) => `comments/${commentId}/downvote/`, // Downvote comment
  },
  tags: {
    list: "tags/", // List all tags
    create: "tags/", // Create a new tag
    update: (tagId) => `tags/${tagId}/`, // Update tag by ID
    delete: (tagId) => `tags/${tagId}/`, // Delete tag by ID
  },
  notifications: {
    list: "notifications/", // List all notifications
    read: (notificationId) => `notifications/${notificationId}/read/`, // Mark notification as read
    create: "notifications/create/", // Create a new notification
  },
  moderation: {
    pendingContent: "moderation/pending-content/", // List pending content for moderation
    approveContent: (contentId) => `moderation/approve-content/${contentId}/`, // Approve content by ID
    rejectContent: (contentId) => `moderation/reject-content/${contentId}/`, // Reject content by ID
  },
};
