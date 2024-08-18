import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTags as apiFetchTags,
  createTag as apiCreateTag,
  updateTag as apiUpdateTag,
  deleteTag as apiDeleteTag,
} from "../../api/tags"; // Adjust the import path as needed

const initialState = {
  tags: [], // List of tags
  loading: false, // Loading state for async operations
  error: null, // Error state for async operations
};

// Thunks for tag operations
export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetchTags(); // Fetch tags from API
      return data;
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);

export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tagData, { rejectWithValue }) => {
    try {
      const data = await apiCreateTag(tagData); // Create a tag via API
      return data;
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);

export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ tagId, tagData }, { rejectWithValue }) => {
    try {
      const data = await apiUpdateTag(tagId, tagData); // Update a tag via API
      return data;
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);

export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async (tagId, { rejectWithValue }) => {
    try {
      await apiDeleteTag(tagId); // Delete a tag via API
      return tagId; // Return the ID for removal from state
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);

// Slice definition
const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchTags actions
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.loading = false;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle createTag actions
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
        state.loading = false;
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateTag actions
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(
          (tag) => tag.id === action.payload.id
        );
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleteTag actions
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default tagsSlice.reducer;
