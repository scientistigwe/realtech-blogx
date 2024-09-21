// services/postService.js
import api from "../api/api"; // Adjust path as needed

export const postService = {
  // Other post-related methods

  async fetchPostAnalytics(userId) {
    try {
      const response = await api.get(`/posts/analytics?user_id=${userId}`);
      return response.data; // Assuming this returns an analytics object
    } catch (error) {
      console.error("Error fetching post analytics:", error);
      throw error;
    }
  },
};
