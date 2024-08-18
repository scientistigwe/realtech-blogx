import { createSelector } from "reselect"; // Add this import at the top of your file

// Selectors
export const selectSearchState = (state) => state.search;

export const selectSearchResults = createSelector(
  [selectSearchState],
  (searchState) =>
    searchState.allResultIds.map((id) => searchState.resultsById[id])
);

export const selectSearchLoading = createSelector(
  [selectSearchState],
  (searchState) => searchState.loading
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (searchState) => searchState.error
);
