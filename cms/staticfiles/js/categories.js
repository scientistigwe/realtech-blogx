// Utility functions
const getElementValue = (id) => document.getElementById(id).value;
const setElementText = (id, text) =>
  (document.getElementById(id).textContent = text);
const redirect = (url) => (window.location.href = url);

// Error handling
const handleError = (errorElementId, error) => {
  const message = error.message || "An error occurred";
  setElementText(errorElementId, message);
  console.error(message);
};

// Category operations
const createCategory = async (event) => {
  event.preventDefault();
  const name = getElementValue("name");
  try {
    await useCreateCategory({ name });
    redirect("/categories/");
  } catch (error) {
    handleError("createCategoryError", error);
  }
};

const deleteCategory = async (event) => {
  event.preventDefault();
  const id = getElementValue("id");
  try {
    await useDeleteCategory(id);
    redirect("/categories/");
  } catch (error) {
    handleError("deleteCategoryError", error);
  }
};

const updateCategory = async (event) => {
  event.preventDefault();
  const id = getElementValue("id");
  const name = getElementValue("name");
  try {
    await useUpdateCategory(id, { name });
    redirect("/categories/");
  } catch (error) {
    handleError("updateCategoryError", error);
  }
};

const listCategories = async () => {
  try {
    const categories = await useListCategories();
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = categories
      .map((category) => `<li>${category.name}</li>`)
      .join("");
  } catch (error) {
    handleError("listCategoriesError", error);
  }
};

// Event listeners
const addFormListener = (formId, handler) => {
  const form = document.getElementById(formId);
  if (form) form.addEventListener("submit", handler);
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  addFormListener("createCategoryForm", createCategory);
  addFormListener("deleteCategoryForm", deleteCategory);
  addFormListener("updateCategoryForm", updateCategory);
  listCategories();
});
