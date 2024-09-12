// services/categoryService.js

import {
  listCategories as apiListCategories,
  createCategory as apiCreateCategory,
  getCategoryById as apiGetCategoryById,
  updateCategory as apiUpdateCategory,
  partialUpdateCategory as apiPartialUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "../utils/api"; // Adjust the path as necessary

export const categoryService = {
  // List all categories
  async listCategories() {
    try {
      const response = await apiListCategories();
      return response.data; // Assuming the response contains the list of categories
    } catch (error) {
      console.error("Error listing categories:", error);
      throw error;
    }
  },

  // Create a new category
  async createCategory(data) {
    try {
      const response = await apiCreateCategory(data);
      return response.data; // Assuming the response contains the created category
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Get a category by its ID
  async getCategoryById(id) {
    try {
      const response = await apiGetCategoryById(id);
      return response.data; // Assuming the response contains the category details
    } catch (error) {
      console.error("Error getting category by ID:", error);
      throw error;
    }
  },

  // Update a category
  async updateCategory(id, data) {
    try {
      const response = await apiUpdateCategory(id, data);
      return response.data; // Assuming the response contains the updated category
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Partially update a category
  async partialUpdateCategory(id, data) {
    try {
      const response = await apiPartialUpdateCategory(id, data);
      return response.data; // Assuming the response contains the updated category
    } catch (error) {
      console.error("Error partially updating category:", error);
      throw error;
    }
  },

  // Delete a category
  async deleteCategory(id) {
    try {
      const response = await apiDeleteCategory(id);
      return response.data; // Assuming the response confirms deletion
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
