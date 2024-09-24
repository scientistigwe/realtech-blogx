// services/categoryService.js
import api from "../utils/api";

export const categoryService = {
  async listCategories() {
    try {
      let allCategories = [];
      let nextPageUrl = null;
      let response = await api.categories.list(); // Fetch first page

      // Add the categories from the first page
      allCategories = [...response.results];
      nextPageUrl = response.next;

      // Fetch subsequent pages if available
      while (nextPageUrl) {
        const nextPageResponse = await api.categories.list({
          url: nextPageUrl,
        });

        // Accumulate the results from the next page
        allCategories = [...allCategories, ...nextPageResponse.results];
        nextPageUrl = nextPageResponse.next; // Get the next page URL, if available
      }
      return allCategories;
    } catch (error) {
      console.error("Error listing categories:", error);
      throw error;
    }
  },

  async createCategory(data) {
    try {
      const response = await api.categories.create(data);
      return response;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.categories.read(id);
      return response;
    } catch (error) {
      console.error("Error getting category by ID:", error);
      throw error;
    }
  },

  async updateCategory(id, data) {
    try {
      const response = await api.categories.update(id, data);
      return response;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async partialUpdateCategory(id, data) {
    try {
      const response = await api.categories.partial_update(id, data);
      return response;
    } catch (error) {
      console.error("Error partially updating category:", error);
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.categories.delete(id);
      return response;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
