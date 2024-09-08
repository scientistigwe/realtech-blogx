import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to list all categories
export const useListCategories = async () => {
  try {
    const response = await api.get(apiEndpoints.categories.list);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    throw err;
  }
};

// Function to create a new category
export const useCreateCategory = async (data) => {
  try {
    const response = await api.post(apiEndpoints.categories.create, data);
    return response.data;
  } catch (err) {
    console.error("Failed to create category:", err);
    throw err;
  }
};

// Function to get a category by ID
export const useGetCategoryById = async (id) => {
  try {
    const response = await api.get(`${apiEndpoints.categories.read}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch category with ID ${id}:`, err);
    throw err;
  }
};

// Function to update a category by ID
export const useUpdateCategory = async (id, data) => {
  try {
    const response = await api.put(
      `${apiEndpoints.categories.update}/${id}`,
      data
    );
    return response.data;
  } catch (err) {
    console.error(`Failed to update category with ID ${id}:`, err);
    throw err;
  }
};

// Function to partially update a category by ID
export const usePartialUpdateCategory = async (id, data) => {
  try {
    const response = await api.patch(
      `${apiEndpoints.categories.update}/${id}`,
      data
    );
    return response.data;
  } catch (err) {
    console.error(`Failed to partially update category with ID ${id}:`, err);
    throw err;
  }
};

// Function to delete a category by ID
export const useDeleteCategory = async (id) => {
  try {
    const response = await api.delete(
      `${apiEndpoints.categories.delete}/${id}`
    );
    return response.data;
  } catch (err) {
    console.error(`Failed to delete category with ID ${id}:`, err);
    throw err;
  }
};
