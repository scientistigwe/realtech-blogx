import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPosts,
  createPost,
  fetchPostById,
  updatePost,
  partialUpdatePost,
  deletePost,
  checkPostSlug,
  fetchFeaturedPosts,
  fetchMostViewedPosts,
  searchPosts,
  fetchPostsByTag,
  fetchPostsByCategory,
  engagePost,
  downvotePost,
  viewPost,
  trackPostView,
  fetchAnalytics,
} from "./postThunks";

const initialState = {
  posts: [],
  currentPost: null,
  featuredPosts: [],
  mostViewedPosts: [],
  searchResults: [],
  postsByTag: [],
  postsByCategory: [],
  analytics: null,
  loading: false,
  error: null,
  slugAvailable: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearCreationSuccess: (state) => {
      state.creationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Post By ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.currentPost = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Partial Update Post
      .addCase(partialUpdatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(partialUpdatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...action.payload };
        }
        state.currentPost = { ...state.currentPost, ...action.payload };
      })
      .addCase(partialUpdatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Post Slug
      .addCase(checkPostSlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkPostSlug.fulfilled, (state, action) => {
        state.loading = false;
        state.slugAvailable = action.payload;
      })
      .addCase(checkPostSlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Featured Posts
      .addCase(fetchFeaturedPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredPosts = action.payload;
      })
      .addCase(fetchFeaturedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Most Viewed Posts
      .addCase(fetchMostViewedPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMostViewedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.mostViewedPosts = action.payload;
      })
      .addCase(fetchMostViewedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Posts
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Posts By Tag
      .addCase(fetchPostsByTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostsByTag.fulfilled, (state, action) => {
        state.loading = false;
        state.postsByTag = action.payload;
      })
      .addCase(fetchPostsByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Posts By Category
      .addCase(fetchPostsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.postsByCategory = action.payload;
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Engage Post
      .addCase(engagePost.fulfilled, (state, action) => {
        const post = state.posts.find((post) => post.id === action.payload);
        if (post) {
          post.engagements = (post.engagements || 0) + 1;
        }
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost.engagements =
            (state.currentPost.engagements || 0) + 1;
        }
      })

      // Downvote Post
      .addCase(downvotePost.fulfilled, (state, action) => {
        const post = state.posts.find((post) => post.id === action.payload);
        if (post) {
          post.downvotes = (post.downvotes || 0) + 1;
        }
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost.downvotes = (state.currentPost.downvotes || 0) + 1;
        }
      })

      // View Post
      .addCase(viewPost.fulfilled, (state, action) => {
        const post = state.posts.find((post) => post.id === action.payload);
        if (post) {
          post.views = (post.views || 0) + 1;
        }
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost.views = (state.currentPost.views || 0) + 1;
        }
      })

      // Track Post View (if different from viewPost)
      .addCase(trackPostView.fulfilled, (state, action) => {
        // Implement if needed, similar to viewPost
      })

      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPost } = postSlice.actions;
export const { clearCreationSuccess } = postSlice.actions;

export default postSlice.reducer;

export const selectAllPosts = (state) => state.posts.posts;
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectFeaturedPosts = (state) => state.posts.featuredPosts;
export const selectMostViewedPosts = (state) => state.posts.mostViewedPosts;
export const selectSearchResults = (state) => state.posts.searchResults;
export const selectPostsByTag = (state) => state.posts.postsByTag;
export const selectPostsByCategory = (state) => state.posts.postsByCategory;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectSlugAvailable = (state) => state.posts.slugAvailable;
export const selectAnalytics = (state) => state.posts.analytics;
export const selectPostCreationSuccess = (state) => state.posts.creationSuccess;
