export const apiEndpoints = {
  auth: {
    register: "/auth/register/", // Register a new user
    login: "/auth/login/", // Log in a user
    logout: "/auth/logout/", // Log out a user
    checkAuthentication: "/auth/check-authentication/", // Check if the user is authenticated
    refreshToken: "/auth/token/refresh/", // Refresh the JWT token
  },
  users: {
    currentUserProfile: "/users/me/", // Fetch current user profile
    profile: (id) => `/users/${id}/profile/`, // Fetch user profile by ID
    updateProfile: (id) => `/users/${id}/profile/update/`, // Update user profile by ID
    deleteAccount: (id) => `/users/${id}/profile/delete-account/`, // Delete user account by ID
    resetPassword: (id) => `/users/${id}/profile/reset-password/`, // Reset user password by ID
  },
  posts: {
    fetchAll: "/posts/", // List all posts
    fetchById: (postId) => `/posts/${postId}/`, // Fetch a specific post by ID
    fetchByCategory: (category) => `/posts/category/${category}/`, // Fetch posts by category
    fetchBySubcategory: (subcategory) => `/posts/subcategory/${subcategory}/`, // Fetch posts by subcategory
    fetchByUser: (userId) => `/posts/user/${userId}/`, // Fetch posts by user
    mostViewed: "/posts/most-viewed/", // Fetch most viewed posts
    create: "/posts/", // Create a new post
    update: (postId) => `/posts/${postId}/`, // Update a specific post by ID
    delete: (postId) => `/posts/${postId}/`, // Delete a specific post by ID
    uploadThumbnail: "/upload/post-thumbnail/", // Upload post thumbnail
    fetchEngagementMetrics: (postId) => `/posts/${postId}/engagement/`, // Fetch engagement metrics for a post
    upvote: (postId) => `/posts/${postId}/upvote/`, // Upvote a specific post by ID
    downvote: (postId) => `/posts/${postId}/downvote/`, // Downvote a specific post by ID
  },
  comments: {
    create: (postId) => `/posts/${postId}/comments/`,
    update: (commentId) => `/comments/${commentId}/`,
    delete: (commentId) => `/comments/${commentId}/`,
    upvote: (commentId) => `/comments/${commentId}/upvote/`,
    downvote: (commentId) => `/comments/${commentId}/downvote/`,
  },
  tags: {
    list: "/tags/", // List all tags
    create: "/tags/", // Create a new tag
    update: (tagId) => `/tags/${tagId}/`, // Update a specific tag by ID
    delete: (tagId) => `/tags/${tagId}/`, // Delete a specific tag by ID
  },
  notifications: {
    list: "/notifications/", // Retrieve notifications
    read: (notificationId) => `/notifications/${notificationId}/read/`, // Mark notification as read
    create: "/notifications/create/", // Create a new notification
  },
  moderation: {
    pendingContent: "/moderation/pending-content/", // Fetch pending content
    approveContent: (contentId) => `/moderation/approve-content/${contentId}/`, // Approve content
    rejectContent: (contentId) => `/moderation/reject-content/${contentId}/`, // Reject content
  },
};
