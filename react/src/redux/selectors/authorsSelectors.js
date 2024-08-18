import { createSelector } from "reselect"; // Import createSelector from reselect

const selectAuthorsState = (state) => state.authors;

// Selector to get all authors
export const selectAllAuthors = createSelector(
  [selectAuthorsState],
  (authorsState) => authorsState.authors
);

// Selector to get an author by ID
export const selectAuthorById = (authorId) =>
  createSelector([selectAuthorsState], (authorsState) =>
    authorsState.author && authorsState.author.id === authorId
      ? authorsState.author
      : null
  );

// Selector to get loading state for fetching authors and author details
export const selectLoading = createSelector(
  [selectAuthorsState],
  (authorsState) => authorsState.loading
);

// Selector to get error state
export const selectError = createSelector(
  [selectAuthorsState],
  (authorsState) => authorsState.error
);

// Selector to get contact message state
export const selectContactMessage = createSelector(
  [selectAuthorsState],
  (authorsState) => authorsState.contactMessage
);

// Selector to get contact success state
export const selectContactSuccess = createSelector(
  [selectAuthorsState],
  (authorsState) => authorsState.contactSuccess
);

// Selector to get contact error state
export const selectContactError = createSelector(
  [selectAuthorsState],
  (authorsState) => authorsState.contactError
);
