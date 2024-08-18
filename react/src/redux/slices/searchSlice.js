import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchPosts } from "../../api/search"; // Adjust the import path as needed

const initialState = {
  resultsById: {},
  allResultIds: [],
  loading: false,
  error: null,
};

// Thunk for searching posts
export const performSearch = createAsyncThunk(
  "search/performSearch",
  async (query, { rejectWithValue }) => {
    try {
      const data = await searchPosts(query);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.resultsById = {};
      state.allResultIds = [];
    },
    setResults: (state, action) => {
      const results = action.payload;
      state.resultsById = results.reduce((acc, post) => {
        acc[post.id] = post;
        return acc;
      }, {});
      state.allResultIds = results.map((post) => post.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        const results = action.payload;
        state.resultsById = results.reduce((acc, post) => {
          acc[post.id] = post;
          return acc;
        }, {});
        state.allResultIds = results.map((post) => post.id);
        state.loading = false;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearResults, setResults } = searchSlice.actions;
export default searchSlice.reducer;
