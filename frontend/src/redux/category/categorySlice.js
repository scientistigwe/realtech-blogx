import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  fetchCategoryById,
  updateCategory,
  partialUpdateCategory,
  deleteCategory,
} from "./categoryThunks";

const initialState = {
  categories: [], // Only store necessary category data
  currentCategory: null, // To store a single category's details if needed
  status: "idle", // Track status of async operations
  error: null, // Store error messages
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear error on new fetch
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories =
          action.payload?.map((category) => ({
            id: category.id,
            name: category.name,
            // Add other essential fields if needed
          })) ?? []; // Store only essential category data
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch categories";
      })

      // Creating a new category
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.categories.push({
            id: action.payload.id,
            name: action.payload.name, // Store only essential fields
            // Add other essential fields if needed
          });
        }
      })

      // Fetching a category by ID
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.currentCategory = action.payload
          ? { id: action.payload.id, name: action.payload.name }
          : null; // Store minimal details for current category
      })

      // Updating a category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category.id === action.payload?.id
        );
        if (index !== -1 && action.payload) {
          state.categories[index] = {
            id: action.payload.id,
            name: action.payload.name, // Only update relevant fields
            // Add other essential fields if needed
          };
        }
        state.currentCategory =
          {
            id: action.payload.id,
            name: action.payload.name,
            // Add other essential fields if needed
          } || null;
      })

      // Partially updating a category
      .addCase(partialUpdateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category.id === action.payload?.id
        );
        if (index !== -1 && action.payload) {
          state.categories[index] = {
            ...state.categories[index],
            ...action.payload, // Update with only the new data
          };
        }
        state.currentCategory =
          {
            ...state.currentCategory,
            ...action.payload,
          } || null;
      })

      // Deleting a category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null; // Clear current category if deleted
        }
      });
  },
});

export default categorySlice.reducer;
