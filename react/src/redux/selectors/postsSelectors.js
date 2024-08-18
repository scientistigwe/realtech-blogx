import { createSelector } from "reselect";

// Base selector to access the posts state
const selectPostsState = (state) => state.posts;

// Selector to get all posts
export const selectAllPosts = createSelector([selectPostsState], (postsState) =>
  postsState.allPostIds.map((id) => postsState.postsById[id])
);

// Selector to get a single post by ID
export const selectPostById = (postId) =>
  createSelector(
    [selectPostsState],
    (postsState) => postsState.postsById[postId] // Access post by ID directly
  );

// Selector for the current post
export const selectCurrentPost = createSelector(
  [selectPostsState],
  (postsState) => postsState.currentPost
);

// Selector for loading state
export const selectLoading = createSelector(
  [selectPostsState],
  (postsState) => postsState.loading
);

// Selector for error state
export const selectError = createSelector(
  [selectPostsState],
  (postsState) => postsState.error
);

// Selector to get posts by category
export const selectPostsByCategory = (categoryId) =>
  createSelector(
    [selectPostsState],
    (postsState) =>
      postsState.allPostIds
        .map((id) => postsState.postsById[id])
        .filter((post) => post.categoryId === categoryId) // Adjust based on your data structure
  );

// Selector to get posts by subcategory
export const selectPostsBySubcategory = (subcategoryId) =>
  createSelector(
    [selectPostsState],
    (postsState) =>
      postsState.allPostIds
        .map((id) => postsState.postsById[id])
        .filter((post) => post.subcategoryId === subcategoryId) // Adjust based on your data structure
  );

// Selector to get engagement metrics by post ID
export const selectEngagementMetrics = (postId) =>
  createSelector(
    [selectPostsState],
    (postsState) => postsState.engagementMetrics[postId] || {} // Returns engagement metrics or an empty object if not found
  );
