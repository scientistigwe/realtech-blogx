// apiClient.js
import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./../api/apiEndpoints"; // Import API endpoints configuration

console.log(`API Client (auth/posts.js): ${apiClient}`);

/* ================================
   Public Endpoints - No Authentication Required
   ================================ */

// Fetch all posts (Public)
export const fetchPosts = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.posts.fetchAll);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch posts: " + error.message);
  }
};

// Fetch post by ID (Public)
export const fetchPostById = async (postId) => {
  try {
    if (!postId) throw new Error("Post ID is required");
    const response = await apiClient.get(apiEndpoints.posts.fetchById(postId));
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch post by ID: " + error.message);
  }
};

// Updated API function to fetch posts by category
export const fetchPostsByCategory = async (category) => {
  try {
    if (!category) throw new Error("Category is required");
    const response = await apiClient.get(
      apiEndpoints.posts.fetchByCategory(category)
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts by category:", error.message || error);
    throw new Error(`Failed to fetch posts by category: ${error.message}`);
  }
};

// Updated API function to fetch posts by subcategory
export const fetchPostsBySubcategory = async (subcategory) => {
  try {
    if (!subcategory) throw new Error("Subcategory is required");

    const response = await apiClient.get(
      apiEndpoints.posts.fetchBySubcategory(subcategory)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch posts by subcategory:",
      error.message || error
    );
    throw new Error(`Failed to fetch posts by subcategory: ${error.message}`);
  }
};

// Fetch posts by user (Public)
export const fetchPostsByUser = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await apiClient.get(
      apiEndpoints.posts.fetchByUser(userId)
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch posts by user: " + error.message);
  }
};

// Fetch most viewed posts (Public)
export const fetchMostViewedPosts = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.posts.mostViewed);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch most viewed posts: " + error.message);
  }
};

/* ================================
   Private Endpoints - Authentication Required
   ================================ */

// Create a new post (Private, requiresAuth: true)
export const createPost = async (data) => {
  try {
    const response = await apiClient.post(apiEndpoints.posts.create, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create post: " + error.message);
  }
};

// Update a post (Private, requiresAuth: true)
export const updatePost = async (postId, data) => {
  try {
    if (!postId) throw new Error("Post ID is required");
    const response = await apiClient.put(
      apiEndpoints.posts.update(postId),
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update post: " + error.message);
  }
};

// Delete a post (Private, requiresAuth: true)
export const deletePost = async (postId) => {
  try {
    if (!postId) throw new Error("Post ID is required");
    const response = await apiClient.delete(apiEndpoints.posts.delete(postId));
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete post: " + error.message);
  }
};

// Fetch engagement metrics for a specific post (Public)
export const fetchEngagementMetrics = async (postId) => {
  try {
    if (!postId) throw new Error("Post ID is required");
    const response = await apiClient.get(
      apiEndpoints.posts.fetchEngagementMetrics(postId)
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch engagement metrics: " + error.message);
  }
};

// Upload post thumbnail (Private, requiresAuth: true)
export const uploadPostThumbnail = async (postId, file) => {
  try {
    if (!postId || !file) throw new Error("Post ID and file are required");
    const formData = new FormData();
    formData.append("thumbnail", file);
    formData.append("post_id", postId);

    const response = await apiClient.post(
      apiEndpoints.posts.uploadThumbnail,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to upload post thumbnail: " + error.message);
  }
};

// Upvote a post (Private, requiresAuth: true)
export const upvotePost = async (postId) => {
  try {
    if (!postId) throw new Error("Post ID is required");
    const response = await apiClient.post(apiEndpoints.posts.upvote(postId));
    return response.data;
  } catch (error) {
    throw new Error("Failed to upvote post: " + error.message);
  }
};

// Downvote a post (Private, requiresAuth: true)
export const downvotePost = async (postId) => {
  try {
    if (!postId) throw new Error("Post ID is required");
    const response = await apiClient.post(apiEndpoints.posts.downvote(postId));
    return response.data;
  } catch (error) {
    throw new Error("Failed to downvote post: " + error.message);
  }
};
