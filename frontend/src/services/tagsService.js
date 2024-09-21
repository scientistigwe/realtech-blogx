// services/tagService.js
import api from "../utils/api";

export const tagService = {
  // List all tags
  async listTags() {
    try {
      const response = await api.tags.list();
      return response.data;
    } catch (error) {
      console.error("Error listing tags:", error);
      throw error;
    }
  },

  // Create a new tag
  async createTag(data) {
    try {
      const response = await api.tags.create(data);
      return response.data;
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  },

  // Read a tag by ID
  async getTagById(id) {
    try {
      const response = await api.tags.read(id);
      return response.data;
    } catch (error) {
      console.error("Error reading tag by ID:", error);
      throw error;
    }
  },

  // Update a tag by ID
  async updateTag(id, data) {
    try {
      const response = await api.tags.update(id, data);
      return response.data;
    } catch (error) {
      console.error("Error updating tag by ID:", error);
      throw error;
    }
  },

  // Partially update a tag by ID
  async partialUpdateTag(id, data) {
    try {
      const response = await api.tags.partial_update(id, data);
      return response.data;
    } catch (error) {
      console.error("Error partially updating tag by ID:", error);
      throw error;
    }
  },

  // Delete a tag by ID
  async deleteTag(id) {
    try {
      await api.tags.delete(id);
    } catch (error) {
      console.error("Error deleting tag by ID:", error);
      throw error;
    }
  },
};
