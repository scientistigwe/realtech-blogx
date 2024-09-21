// postSelectors.js
import { createSelector } from "@reduxjs/toolkit";

// Base selector with memoization
export const selectPostsState = createSelector(
  (state) => state.posts,
  (postsState) => postsState || {} // Memoized fallback
);

// Simple selectors with fallbacks
export const selectPosts = createSelector([selectPostsState], (postsState) =>
  postsState.posts ? [...postsState.posts] : []
);

export const selectFeaturedPosts = createSelector(
  [selectPostsState],
  (postsState) => postsState.featuredPosts || []
);

export const selectMostViewedPosts = createSelector(
  [selectPostsState],
  (postsState) => postsState.mostViewedPosts || []
);

export const selectCurrentPost = createSelector(
  [selectPostsState],
  (postsState) => postsState.currentPost || null
);

export const selectPostsLoading = createSelector(
  [selectPostsState],
  (postsState) => postsState.loading || false
);

export const selectPostsError = createSelector(
  [selectPostsState],
  (postsState) => postsState.error || null
);

export const selectSlugAvailable = createSelector(
  [selectPostsState],
  (postsState) => postsState.slugAvailable || null
);

// Complex selectors remain the same
// ...

// Complex selectors
export const selectPostById = createSelector(
  [selectPosts, (_, postId) => postId],
  (posts, postId) => posts.find((post) => post.id === postId)
);

export const selectPostsByUser = createSelector(
  [selectPosts, (_, userId) => userId],
  (posts, userId) => posts.filter((post) => post.author.id === userId)
);

export const selectPostsByCategory = createSelector(
  [selectPosts, (_, categoryId) => categoryId],
  (posts, categoryId) => posts.filter((post) => post.category.id === categoryId)
);

export const selectPostsByTag = createSelector(
  [selectPosts, (_, tagId) => tagId],
  (posts, tagId) =>
    posts.filter((post) => post.tags.some((tag) => tag.id === tagId))
);
