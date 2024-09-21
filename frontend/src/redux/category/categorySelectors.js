import { createSelector } from "reselect";

// Basic selectors
export const selectCategoriesState = (state) => state.categories;

// Memoized selectors
export const selectCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.categories || []
);

export const selectCurrentCategory = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.currentCategory || null
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

export const selectCategoriesWithParent = createSelector(
  [selectCategories],
  (categories) => categories.filter((category) => category.parent_id !== null)
);

export const selectRootCategories = createSelector(
  [selectCategories],
  (categories) => categories.filter((category) => category.parent_id === null)
);
