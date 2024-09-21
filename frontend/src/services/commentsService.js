// services/commentService.js
import api from "../utils/api";

export const commentService = {
  // List all comments
  async fetchComments() {
    try {
      const response = await api.comments.list();
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Create a new comment
  async createComment(data) {
    try {
      const response = await api.comments.create(data);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Get a comment by ID
  async getCommentById(id) {
    try {
      const response = await api.comments.read(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching comment by ID:", error);
      throw error;
    }
  },

  // Update a comment by ID
  async updateComment(id, data) {
    try {
      const response = await api.comments.update(id, data);
      return response.data;
    } catch (error) {
      console.error("Error updating comment by ID:", error);
      throw error;
    }
  },

  // Partially update a comment by ID
  async partialUpdateComment(id, data) {
    try {
      const response = await api.comments.partial_update(id, data);
      return response.data;
    } catch (error) {
      console.error("Error partially updating comment by ID:", error);
      throw error;
    }
  },

  // Delete a comment by ID
  async deleteComment(id) {
    try {
      await api.comments.delete(id);
    } catch (error) {
      console.error("Error deleting comment by ID:", error);
      throw error;
    }
  },

  // Upvote a comment by ID
  async upvoteComment(id) {
    try {
      const response = await api.comments.upvote(id);
      return response.data;
    } catch (error) {
      console.error("Error upvoting comment by ID:", error);
      throw error;
    }
  },

  // Downvote a comment by ID
  async downvoteComment(id) {
    try {
      const response = await api.comments.downvote(id);
      return response.data;
    } catch (error) {
      console.error("Error downvoting comment by ID:", error);
      throw error;
    }
  },

  // Moderate a comment by ID
  async moderateComment(id) {
    try {
      const response = await api.comments.moderate(id);
      return response.data;
    } catch (error) {
      console.error("Error moderating comment by ID:", error);
      throw error;
    }
  },
};
