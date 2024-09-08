// Utility functions
const getElementValue = (id) => document.getElementById(id).value;
const setElementHTML = (id, html) => {
  const element = document.getElementById(id);
  if (element) element.innerHTML = html;
};

const handleApiRequest = async (apiCall, successMessage) => {
  try {
    const response = await apiCall();
    const result = await response.json();
    if (response.ok) {
      alert(successMessage);
      return result;
    } else {
      throw new Error(result.error || "An unexpected error occurred");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error("API Error:", error);
  }
};

// Tag operations
const createTag = (event) => {
  event.preventDefault();
  const name = getElementValue("tag-name");
  handleApiRequest(
    () =>
      fetch(apiEndpoints.tags.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }),
    "Tag created successfully!"
  ).then(() => document.getElementById("create-tag-form").reset());
};

const deleteTag = (event) => {
  event.preventDefault();
  const id = getElementValue("delete-tag-id");
  handleApiRequest(
    () => fetch(apiEndpoints.tags.delete(id), { method: "DELETE" }),
    "Tag deleted successfully!"
  ).then(() => document.getElementById("delete-tag-form").reset());
};

const updateTag = (event) => {
  event.preventDefault();
  const id = getElementValue("update-tag-id");
  const name = getElementValue("update-tag-name");
  handleApiRequest(
    () =>
      fetch(apiEndpoints.tags.update(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }),
    "Tag updated successfully!"
  ).then(() => document.getElementById("update-tag-form").reset());
};

const partialUpdateTag = (event) => {
  event.preventDefault();
  const id = getElementValue("partial-update-tag-id");
  const name = getElementValue("partial-update-tag-name");
  const data = name ? { name } : {};
  handleApiRequest(
    () =>
      fetch(apiEndpoints.tags.partialUpdate(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    "Tag partially updated successfully!"
  ).then(() => document.getElementById("partial-update-tag-form").reset());
};

const fetchTag = async (event) => {
  event.preventDefault();
  const id = getElementValue("tag-id");
  const tag = await handleApiRequest(
    () => fetch(apiEndpoints.tags.read(id)),
    "Tag fetched successfully!"
  );
  if (tag) {
    setElementHTML("tag-info", `<p>Name: ${tag.name}</p>`);
  }
};

const loadTags = async () => {
  const tags = await handleApiRequest(
    () => fetch(apiEndpoints.tags.list),
    "Tags loaded successfully!"
  );
  if (tags) {
    const tagList = tags.map((tag) => `<li>${tag.name}</li>`).join("");
    setElementHTML("tag-list", tagList);
  }
};

// Event listeners
const addFormListener = (formId, handler) => {
  const form = document.getElementById(formId);
  if (form) form.addEventListener("submit", handler);
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  addFormListener("create-tag-form", createTag);
  addFormListener("delete-tag-form", deleteTag);
  addFormListener("update-tag-form", updateTag);
  addFormListener("partial-update-tag-form", partialUpdateTag);
  addFormListener("fetch-tag-form", fetchTag);

  const loadTagsButton = document.getElementById("load-tags");
  if (loadTagsButton) loadTagsButton.addEventListener("click", loadTags);
});
