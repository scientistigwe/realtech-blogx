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
  async listCategories() {
    try {
      const response = await apiListCategories();
      return response; // Ensure this matches the API response format
    } catch (error) {
      console.error("Error listing categories:", error);
      throw error;
    }
  },

  async createCategory(data) {
    try {
      const response = await apiCreateCategory(data);
      return response;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await apiGetCategoryById(id);
      return response;
    } catch (error) {
      console.error("Error getting category by ID:", error);
      throw error;
    }
  },

  async updateCategory(id, data) {
    try {
      const response = await apiUpdateCategory(id, data);
      return response;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async partialUpdateCategory(id, data) {
    try {
      const response = await apiPartialUpdateCategory(id, data);
      return response;
    } catch (error) {
      console.error("Error partially updating category:", error);
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      const response = await apiDeleteCategory(id);
      return response;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
