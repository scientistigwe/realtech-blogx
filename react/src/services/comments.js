// apiClient.js
import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./apiEndpoints"; // Import API endpoints configuration

/* ================================
   Public Endpoints - No Authentication Required
   ================================ */

// Fetch comments for a specific post (Public)
export const fetchComments = async (postId) => {
  try {
    const response = await apiClient.get(apiEndpoints.comments.create(postId));
    return response.data; // Return the comments data
  } catch (error) {
    throw new Error("Failed to fetch comments: " + error.message);
  }
};

/* ================================
   Private Endpoints - Authentication Required
   ================================ */

// Create a new comment for a specific post (Private, requiresAuth: true)
export const createComment = async (postId, data) => {
  try {
    const response = await apiClient.post(
      apiEndpoints.comments.create(postId),
      data
    );
    return response.data; // Return the created comment data
  } catch (error) {
    throw new Error("Failed to create comment: " + error.message);
  }
};

// Update a specific comment by ID (Private, requiresAuth: true)
export const updateComment = async (commentId, data) => {
  try {
    const response = await apiClient.put(
      apiEndpoints.comments.update(commentId),
      data
    );
    return response.data; // Return the updated comment data
  } catch (error) {
    throw new Error("Failed to update comment: " + error.message);
  }
};

// Delete a specific comment by ID (Private, requiresAuth: true)
export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(
      apiEndpoints.comments.delete(commentId)
    );
    return response.data; // Return the response data or a success message
  } catch (error) {
    throw new Error("Failed to delete comment: " + error.message);
  }
};

// Upvote a comment (Private, requiresAuth: true)
export const upvoteComment = async (commentId) => {
  try {
    const response = await apiClient.post(
      apiEndpoints.comments.upvote(commentId)
    );
    return response.data; // Return the response data or a success message
  } catch (error) {
    throw new Error("Failed to upvote comment: " + error.message);
  }
};

// Downvote a comment (Private, requiresAuth: true)
export const downvoteComment = async (commentId) => {
  try {
    const response = await apiClient.post(
      apiEndpoints.comments.downvote(commentId)
    );
    return response.data; // Return the response data or a success message
  } catch (error) {
    throw new Error("Failed to downvote comment: " + error.message);
  }
};
