import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiEndpoints } from "./../../api/apiEndpoints";
import {
  fetchPosts as fetchPostsApi,
  fetchPostById as fetchPostByIdApi,
  fetchPostsByCategory as fetchPostsByCategoryApi,
  fetchPostsBySubcategory as fetchPostsBySubcategoryApi,
  createPost as createPostApi,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
  uploadPostThumbnail,
  fetchEngagementMetrics as fetchEngagementMetricsApi,
} from "./../../api/posts";

// Thunks for async actions

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchPostsApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await fetchPostByIdApi(postId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostsByCategory = createAsyncThunk(
  "posts/fetchPostsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const data = await fetchPostsByCategoryApi(categoryId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostsBySubcategory = createAsyncThunk(
  "posts/fetchPostsBySubcategory",
  async (subcategoryId, { rejectWithValue }) => {
    try {
      const data = await fetchPostsBySubcategoryApi(subcategoryId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const data = await createPostApi(postData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const data = await updatePostApi(postId, postData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await deletePostApi(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadThumbnail = createAsyncThunk(
  "posts/uploadThumbnail",
  async ({ postId, file }, { rejectWithValue }) => {
    try {
      const response = await uploadPostThumbnail(postId, file);
      return { postId, thumbnailUrl: response }; // Assuming response contains the thumbnail URL
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEngagementMetrics = createAsyncThunk(
  "posts/fetchEngagementMetrics",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await fetchEngagementMetricsApi(postId);
      return { postId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  postsById: {},
  allPostIds: [],
  currentPost: null,
  loading: false,
  error: null,
  engagementMetrics: {},
  uploadThumbnailError: null,
};

// Slice definition
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const posts = action.payload;
        state.postsById = posts.reduce((acc, post) => {
          acc[post.id] = post;
          return acc;
        }, {});
        state.allPostIds = posts.map((post) => post.id);
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        const posts = action.payload;
        state.postsById = posts.reduce((acc, post) => {
          acc[post.id] = post;
          return acc;
        }, {});
        state.allPostIds = posts.map((post) => post.id);
        state.loading = false;
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostsBySubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsBySubcategory.fulfilled, (state, action) => {
        const posts = action.payload;
        state.postsById = posts.reduce((acc, post) => {
          acc[post.id] = post;
          return acc;
        }, {});
        state.allPostIds = posts.map((post) => post.id);
        state.loading = false;
      })
      .addCase(fetchPostsBySubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        const post = action.payload;
        state.postsById[post.id] = post;
        state.allPostIds.push(post.id);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const post = action.payload;
        state.postsById[post.id] = post;
        state.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        delete state.postsById[postId];
        state.allPostIds = state.allPostIds.filter((id) => id !== postId);
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadThumbnail.pending, (state) => {
        state.loading = true;
        state.uploadThumbnailError = null;
      })
      .addCase(uploadThumbnail.fulfilled, (state, action) => {
        const { postId, thumbnailUrl } = action.payload;
        state.postsById[postId].thumbnailUrl = thumbnailUrl; // Update the specific post's thumbnail
        state.loading = false;
      })
      .addCase(uploadThumbnail.rejected, (state, action) => {
        state.loading = false;
        state.uploadThumbnailError = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError, setCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
