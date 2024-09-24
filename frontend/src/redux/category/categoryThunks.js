import { createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../../services/categoryService";

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.listCategories();
      if (response && Array.isArray(response)) {
        return response;
      } else {
        throw new Error("Response data is not an array");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching categories"
      );
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      // Ensure response is the created category object
      if (response && typeof response === "object") {
        return response; // Return the created category object
      } else {
        throw new Error("Response is not an object");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while creating the category"
      );
    }
  }
);

// Fetch category by ID
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id);
      // Ensure response is the category object
      if (response && typeof response === "object") {
        return response; // Return the category object
      } else {
        throw new Error("Response is not an object");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the category"
      );
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, data);
      // Ensure response is the updated category object
      if (response && typeof response === "object") {
        return response; // Return the updated category object
      } else {
        throw new Error("Response is not an object");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while updating the category"
      );
    }
  }
);

// Partially update category
export const partialUpdateCategory = createAsyncThunk(
  "categories/partialUpdateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await categoryService.partialUpdateCategory(id, data);
      // Ensure response is the partially updated category object
      if (response && typeof response === "object") {
        return response; // Return the partially updated category object
      } else {
        throw new Error("Response is not an object");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while partially updating the category"
      );
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id; // Return the id of the deleted category
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while deleting the category"
      );
    }
  }
);
