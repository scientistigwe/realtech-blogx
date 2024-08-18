// src/redux/slices/authorsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAuthorById as apiFetchAuthorById,
  fetchAuthors as apiFetchAuthors,
  contactAuthor as apiContactAuthor,
} from "../../api/authors"; // Adjust import path as needed

// Initial state for the authors slice
const initialState = {
  authors: [], // List of authors
  author: null, // Single author data
  loading: false, // Loading state for async actions
  error: null, // Error state
  contactMessage: "", // Contact message form field
  contactSuccess: "", // Success message for contact action
  contactError: "", // Error message for contact action
};

// Thunks for async actions

// Fetch all authors
export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetchAuthors(); // Fetch authors from API
      return data; // Return data on success
    } catch (error) {
      return rejectWithValue(error.message); // Return error message on failure
    }
  }
);

// Fetch a single author by ID
export const fetchAuthorById = createAsyncThunk(
  "authors/fetchAuthorById",
  async (authorId, { rejectWithValue }) => {
    try {
      const data = await apiFetchAuthorById(authorId); // Fetch author by ID
      return data; // Return data on success
    } catch (error) {
      return rejectWithValue(error.message); // Return error message on failure
    }
  }
);

// Send a contact message to an author
export const sendContactMessage = createAsyncThunk(
  "authors/sendContactMessage",
  async ({ authorId, message }, { rejectWithValue }) => {
    try {
      await apiContactAuthor(authorId, message); // Send contact message
      return "Your message has been sent."; // Return success message
    } catch (error) {
      return rejectWithValue("Failed to send your message."); // Return error message
    }
  }
);

// Slice definition
const authorsSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    // Set contact message input value
    setContactMessage: (state, action) => {
      state.contactMessage = action.payload;
    },
    // Reset contact state fields
    resetContactState: (state) => {
      state.contactMessage = "";
      state.contactSuccess = "";
      state.contactError = "";
    },
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.authors = action.payload; // Set authors data
        state.loading = false; // Set loading state to false
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false; // Set loading state to false
        state.error = action.payload; // Set error message
      })
      .addCase(fetchAuthorById.pending, (state) => {
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.author = action.payload; // Set single author data
        state.loading = false; // Set loading state to false
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.loading = false; // Set loading state to false
        state.error = action.payload; // Set error message
      })
      .addCase(sendContactMessage.pending, (state) => {
        state.loading = true; // Set loading state to true
        state.contactSuccess = ""; // Clear previous success message
        state.contactError = ""; // Clear previous error message
      })
      .addCase(sendContactMessage.fulfilled, (state, action) => {
        state.contactSuccess = action.payload; // Set success message
        state.loading = false; // Set loading state to false
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.contactError = action.payload; // Set error message
        state.loading = false; // Set loading state to false
      });
  },
});

// Export actions and reducer
export const { setContactMessage, resetContactState, clearError } =
  authorsSlice.actions;
export default authorsSlice.reducer;
