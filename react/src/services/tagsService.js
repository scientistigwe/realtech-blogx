// services/tagService.js
import {
  listTags as apiListTags,
  createTag as apiCreateTag,
  getTagById as apiGetTagById,
  updateTag as apiUpdateTag,
  partialUpdateTag as apiPartialUpdateTag,
  deleteTag as apiDeleteTag,
} from "../utils/api"; // Adjust the path as necessary

export const tagService = {
  // List all tags
  async listTags() {
    try {
      const response = await apiListTags();
      return response.data; // Assuming the response contains the list of tags
    } catch (error) {
      console.error("Error listing tags:", error);
      throw error;
    }
  },

  // Create a new tag
  async createTag(data) {
    try {
      const response = await apiCreateTag(data);
      return response.data; // Assuming the response contains the created tag data
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  },

  // Read a tag by ID
  async getTagById(id) {
    try {
      const response = await apiGetTagById(id);
      return response.data; // Assuming the response contains the tag data
    } catch (error) {
      console.error("Error reading tag by ID:", error);
      throw error;
    }
  },

  // Update a tag by ID
  async updateTag(id, data) {
    try {
      const response = await apiUpdateTag(id, data);
      return response.data; // Assuming the response contains the updated tag data
    } catch (error) {
      console.error("Error updating tag by ID:", error);
      throw error;
    }
  },

  // Partially update a tag by ID
  async partialUpdateTag(id, data) {
    try {
      const response = await apiPartialUpdateTag(id, data);
      return response.data; // Assuming the response contains the partially updated tag data
    } catch (error) {
      console.error("Error partially updating tag by ID:", error);
      throw error;
    }
  },

  // Delete a tag by ID
  async deleteTag(id) {
    try {
      await apiDeleteTag(id);
    } catch (error) {
      console.error("Error deleting tag by ID:", error);
      throw error;
    }
  },
};
