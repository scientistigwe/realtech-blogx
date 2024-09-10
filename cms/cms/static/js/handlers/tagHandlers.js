import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";

const tagHandlers = {
  createTag: async (event) => {
    event.preventDefault();
    const name = document.getElementById("tag-name").value;
    try {
      await api.post(apiEndpoints.tags.create, { name });
      alert("Tag created successfully!");
      document.getElementById("create-tag-form").reset();
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("An error occurred while creating the tag.");
    }
  },

  deleteTag: async (event) => {
    event.preventDefault();
    const id = document.getElementById("delete-tag-id").value;
    try {
      await api.delete(apiEndpoints.tags.delete(id));
      alert("Tag deleted successfully!");
      document.getElementById("delete-tag-form").reset();
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("An error occurred while deleting the tag.");
    }
  },

  updateTag: async (event) => {
    event.preventDefault();
    const id = document.getElementById("update-tag-id").value;
    const name = document.getElementById("update-tag-name").value;
    try {
      await api.put(apiEndpoints.tags.update(id), { name });
      alert("Tag updated successfully!");
      document.getElementById("update-tag-form").reset();
    } catch (error) {
      console.error("Error updating tag:", error);
      alert("An error occurred while updating the tag.");
    }
  },

  partialUpdateTag: async (event) => {
    event.preventDefault();
    const id = document.getElementById("partial-update-tag-id").value;
    const name = document.getElementById("partial-update-tag-name").value;
    const data = name ? { name } : {};
    try {
      await api.patch(apiEndpoints.tags.partialUpdate(id), data);
      alert("Tag partially updated successfully!");
      document.getElementById("partial-update-tag-form").reset();
    } catch (error) {
      console.error("Error partially updating tag:", error);
      alert("An error occurred while partially updating the tag.");
    }
  },

  fetchTag: async (event) => {
    event.preventDefault();
    const id = document.getElementById("tag-id").value;
    try {
      const response = await api.get(apiEndpoints.tags.read(id));
      const tag = response.data;
      document.getElementById(
        "tag-info"
      ).innerHTML = `<p>Name: ${tag.name}</p>`;
      alert("Tag fetched successfully!");
    } catch (error) {
      console.error("Error fetching tag:", error);
      alert("An error occurred while fetching the tag.");
    }
  },

  loadTags: async () => {
    try {
      const response = await api.get(apiEndpoints.tags.list);
      const tags = response.data;
      const tagList = tags.map((tag) => `<li>${tag.name}</li>`).join("");
      document.getElementById("tag-list").innerHTML = tagList;
      alert("Tags loaded successfully!");
    } catch (error) {
      console.error("Error loading tags:", error);
      alert("An error occurred while loading the tags.");
    }
  },
};

export default tagHandlers;
