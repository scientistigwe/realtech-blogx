// redux/slices/moderationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPendingContent,
  approveContent,
  rejectContent,
} from "../api/apiRequests";

// Async thunks
export const fetchContent = createAsyncThunk(
  "moderation/fetchContent",
  async () => {
    const response = await fetchPendingContent();
    return response.data;
  }
);

export const approveContentAsync = createAsyncThunk(
  "moderation/approveContent",
  async (id) => {
    await approveContent(id);
    return id;
  }
);

export const rejectContentAsync = createAsyncThunk(
  "moderation/rejectContent",
  async (id) => {
    await rejectContent(id);
    return id;
  }
);

const moderationSlice = createSlice({
  name: "moderation",
  initialState: {
    content: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(approveContentAsync.fulfilled, (state, action) => {
        state.content = state.content.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(rejectContentAsync.fulfilled, (state, action) => {
        state.content = state.content.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const selectContent = (state) => state.moderation.content;
export const selectLoading = (state) => state.moderation.loading;
export const selectError = (state) => state.moderation.error;

export default moderationSlice.reducer;
