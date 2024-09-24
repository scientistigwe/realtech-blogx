import { createSelector } from "reselect";

// Basic selectors
export const selectCategoriesState = (state) => state.categories;

// Memoized selectors
export const selectCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.categories || []
);

export const selectCategoriesCount = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.count || 0
);

export const selectNextPage = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.nextPage || null
);

export const selectCategoryStatus = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.status || "idle"
);

export const selectCategoryError = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.error || null
);

export const selectCategoryById = createSelector(
  [selectCategories, (state, categoryId) => categoryId],
  (categories, categoryId) =>
    categories.find((category) => category.id === categoryId) || null
);

export const selectRootCategories = createSelector(
  [selectCategories],
  (categories) => categories.filter((category) => category.parent_id === null)
);
