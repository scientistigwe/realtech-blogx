// Selectors
export const selectTagsState = (state) => state.tags;

export const selectAllTags = createSelector(
  [selectTagsState],
  (tagsState) => tagsState.tags
);

export const selectTagById = (tagId) =>
  createSelector([selectTagsState], (tagsState) =>
    tagsState.tags.find((tag) => tag.id === tagId)
  );

export const selectTagsLoading = createSelector(
  [selectTagsState],
  (tagsState) => tagsState.loading
);

export const selectTagsError = createSelector(
  [selectTagsState],
  (tagsState) => tagsState.error
);
