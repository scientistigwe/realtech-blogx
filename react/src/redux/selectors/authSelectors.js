/**
 * @file authSelectors.js
 * @description Provides memoized selectors for accessing authentication-related pieces of state from Redux.
 *
 * @relation - Used by components to access auth state in a performant manner.
 * - Selectors are used by components to access state managed in `authSlice.js`.
 */

import { createSelector } from "reselect";

const selectAuthState = (state) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (authState) => authState.isAuthenticated
);

export const selectUser = createSelector(
  [selectAuthState],
  (authState) => authState.user
);

export const selectToken = createSelector(
  [selectAuthState],
  (authState) => authState.token
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (authState) => authState.loading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (authState) => authState.error
);
