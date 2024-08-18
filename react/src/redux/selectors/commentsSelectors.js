import { createSelector } from "reselect";

// Base selector to get the comments slice of state
const selectCommentsState = (state) => state.comments;

// Selector to get all comments
export const selectAllComments = createSelector(
  [selectCommentsState],
  (commentsState) => commentsState.comments
);

// Selector to get loading state
export const selectLoading = createSelector(
  [selectCommentsState],
  (commentsState) => commentsState.loading
);

// Selector to get error state
export const selectError = createSelector(
  [selectCommentsState],
  (commentsState) => commentsState.error
);
