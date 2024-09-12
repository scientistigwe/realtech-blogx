// services/commentService.js
import {
  listComments as apiListComments,
  createComment as apiCreateComment,
  getCommentById as apiGetCommentById,
  updateComment as apiUpdateComment,
  partialUpdateComment as apiPartialUpdateComment,
  deleteComment as apiDeleteComment,
  upvoteComment as apiUpvoteComment,
  downvoteComment as apiDownvoteComment,
  moderateComment as apiModerateComment,
} from "../utils/api"; // Adjust the path as necessary

export const commentService = {
  // List all comments
  async fetchComments() {
    try {
      const response = await apiListComments();
      return response.data; // Assuming the response contains the list of comments
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Create a new comment
  async createComment(data) {
    try {
      const response = await apiCreateComment(data);
      return response.data; // Assuming the response contains the created comment data
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Get a comment by ID
  async getCommentById(id) {
    try {
      const response = await apiGetCommentById(id);
      return response.data; // Assuming the response contains the comment data
    } catch (error) {
      console.error("Error fetching comment by ID:", error);
      throw error;
    }
  },

  // Update a comment by ID
  async updateComment(id, data) {
    try {
      const response = await apiUpdateComment(id, data);
      return response.data; // Assuming the response contains the updated comment data
    } catch (error) {
      console.error("Error updating comment by ID:", error);
      throw error;
    }
  },

  // Partially update a comment by ID
  async partialUpdateComment(id, data) {
    try {
      const response = await apiPartialUpdateComment(id, data);
      return response.data; // Assuming the response contains the partially updated comment data
    } catch (error) {
      console.error("Error partially updating comment by ID:", error);
      throw error;
    }
  },

  // Delete a comment by ID
  async deleteComment(id) {
    try {
      await apiDeleteComment(id);
    } catch (error) {
      console.error("Error deleting comment by ID:", error);
      throw error;
    }
  },

  // Upvote a comment by ID
  async upvoteComment(id) {
    try {
      const response = await apiUpvoteComment(id);
      return response.data; // Assuming the response contains the updated comment data
    } catch (error) {
      console.error("Error upvoting comment by ID:", error);
      throw error;
    }
  },

  // Downvote a comment by ID
  async downvoteComment(id) {
    try {
      const response = await apiDownvoteComment(id);
      return response.data; // Assuming the response contains the updated comment data
    } catch (error) {
      console.error("Error downvoting comment by ID:", error);
      throw error;
    }
  },

  // Moderate a comment by ID
  async moderateComment(id) {
    try {
      const response = await apiModerateComment(id);
      return response.data; // Assuming the response contains the moderated comment data
    } catch (error) {
      console.error("Error moderating comment by ID:", error);
      throw error;
    }
  },
};
