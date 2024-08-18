/**
 * @file apiConfig.js
 * @description Centralizes API configuration, focusing on authentication requirements.
 * Defines which endpoints need authentication and provides utility functions to check these requirements.
 *
 * @relation - Used by `apiInterceptor.js` to determine if an API request requires authentication.
 */
import { apiEndpoints } from "./apiEndpoints";

const AUTH_TYPES = {
  ALWAYS: "ALWAYS",
  PUBLIC: "PUBLIC",
  CONDITIONAL: "CONDITIONAL",
};

const endpointAuthConfig = {
  [AUTH_TYPES.ALWAYS]: [
    apiEndpoints.auth.logout,
    apiEndpoints.users.currentUserProfile,
    apiEndpoints.users.profile,
    apiEndpoints.users.updateProfile,
    apiEndpoints.users.deleteAccount,
    apiEndpoints.users.resetPassword,
    apiEndpoints.comments.create,
    apiEndpoints.comments.update,
    apiEndpoints.comments.delete,
    apiEndpoints.tags.create,
    apiEndpoints.tags.update,
    apiEndpoints.tags.delete,
    apiEndpoints.posts.create,
    apiEndpoints.posts.update,
    apiEndpoints.posts.delete,
    apiEndpoints.posts.uploadThumbnail,
    apiEndpoints.posts.fetchEngagementMetrics,
    apiEndpoints.notifications.create,
    apiEndpoints.notifications.list,
    apiEndpoints.moderation.pendingContent,
    apiEndpoints.moderation.approveContent,
    apiEndpoints.moderation.rejectContent,
  ],
  [AUTH_TYPES.PUBLIC]: [
    apiEndpoints.auth.register,
    apiEndpoints.auth.login,
    apiEndpoints.auth.checkAuthentication,
    apiEndpoints.auth.refreshToken,
    apiEndpoints.posts.fetchAll,
    apiEndpoints.posts.fetchById,
    apiEndpoints.posts.fetchByCategory,
    apiEndpoints.posts.fetchBySubcategory,
    apiEndpoints.posts.fetchByUser,
    apiEndpoints.posts.mostViewed,
    apiEndpoints.comments.upvote,
    apiEndpoints.comments.downvote,
    apiEndpoints.tags.list,
    apiEndpoints.notifications.read,
  ],
  [AUTH_TYPES.CONDITIONAL]: [
    apiEndpoints.posts.upvote,
    apiEndpoints.posts.downvote,
  ],
};

// Add this function to check if a user is logged in
const isUserLoggedIn = () => {
  // This is a placeholder. In a real application, you would check if the user has a valid session or token.
  // For example, you might check if there's a valid JWT in localStorage or in a cookie.
  return localStorage.getItem("authToken") !== null;
};

export const needsAuthentication = (url) => {
  const authType = getAuthTypeForEndpoint(url);
  return (
    authType === AUTH_TYPES.ALWAYS ||
    (authType === AUTH_TYPES.CONDITIONAL && !isUserLoggedIn())
  );
};
