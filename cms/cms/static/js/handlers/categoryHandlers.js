import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";
import * as utils from "./../utils.js";

// Helper function for API calls
const handleApiCall = async (
  apiCall,
  successMessage,
  redirectUrl,
  errorKey,
  formData = null
) => {
  try {
    await apiCall(formData);
    utils.showMessage(successMessage);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  } catch (error) {
    utils.handleError(errorKey, error);
  }
};

const categoryHandlers = {
  createCategory: async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = Object.fromEntries(new FormData(form).entries());
    handleApiCall(
      () => api.post(apiEndpoints.categories.create, formData),
      "Category created successfully!",
      "/categories/",
      "createCategoryError"
    );
    form.reset();
  },

  deleteCategory: async (event) => {
    event.preventDefault();
    const id = event.target.querySelector('[name="id"]').value;
    handleApiCall(
      () => api.delete(apiEndpoints.categories.delete(id)),
      "Category deleted successfully!",
      "/categories/",
      "deleteCategoryError"
    );
  },

  updateCategory: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    const name = form.querySelector('[name="name"]').value;
    handleApiCall(
      () => api.put(apiEndpoints.categories.update(id), { name }),
      "Category updated successfully!",
      "/categories/",
      "updateCategoryError"
    );
  },

  partialUpdateCategory: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    const data = Object.fromEntries(new FormData(form).entries());
    handleApiCall(
      () => api.patch(apiEndpoints.categories.partialUpdate(id), data),
      "Category partially updated successfully!",
      "/categories/",
      "partialUpdateCategoryError"
    );
  },

  listCategories: async () => {
    try {
      const response = await api.get(apiEndpoints.categories.list);
      const categoryList = document.getElementById("categoryList");
      categoryList.innerHTML = response
        .map((category) => `<li>${category.name}</li>`)
        .join("");
    } catch (error) {
      utils.handleError("listCategoriesError", error);
    }
  },

  // Fetch data for navbar
  fetchNavbarData: async () => {
    try {
      const response = await api.get(apiEndpoints.categories.navbarData());
      const { categories, tags } = response;
      populateCategories(categories);
      populateTags(tags);
    } catch (error) {
      console.error("Error fetching navbar data:", error);
    }
  },
};

export default categoryHandlers;
