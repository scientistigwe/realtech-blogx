import { useState, useCallback, useEffect } from "react";
import { categoryService } from "../services/categoryService";

export const useCategories = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const executeCategoryOperation = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation(...args);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Operation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listCategories = useCallback(async () => {
    try {
      setLoading(true);
      const result = await executeCategoryOperation(
        categoryService.listCategories
      );
      if (result && result.data && Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        console.error("Unexpected response structure");
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      console.error("Error listing categories:", err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [executeCategoryOperation]);

  useEffect(() => {
    listCategories();
  }, [listCategories]);

  const createCategory = useCallback(
    (data) => executeCategoryOperation(categoryService.createCategory, data),
    [executeCategoryOperation]
  );
  const getCategoryById = useCallback(
    (id) => executeCategoryOperation(categoryService.getCategoryById, id),
    [executeCategoryOperation]
  );
  const updateCategory = useCallback(
    (id, data) =>
      executeCategoryOperation(categoryService.updateCategory, id, data),
    [executeCategoryOperation]
  );
  const partialUpdateCategory = useCallback(
    (id, data) =>
      executeCategoryOperation(categoryService.partialUpdateCategory, id, data),
    [executeCategoryOperation]
  );
  const deleteCategory = useCallback(
    (id) => executeCategoryOperation(categoryService.deleteCategory, id),
    [executeCategoryOperation]
  );

  return {
    listCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    partialUpdateCategory,
    deleteCategory,
    categories,
    loading,
    error,
  };
};
