// tagSelectors.js
export const selectTags = (state) => state.tags?.tags ?? [];
export const selectMostUsedTags = (state) => state.tags?.mostUsedTags ?? [];
export const selectTagsLoading = (state) => state.tags?.loading ?? false;
export const selectTagsError = (state) => state.tags?.error ?? null;
