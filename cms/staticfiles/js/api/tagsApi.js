import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to list all tags
export const listTags = async () => {
  try {
    const res = await api.get(apiEndpoints.tagsList);
    return res.data; // Assuming the response contains the list of tags
  } catch (error) {
    console.error("Error listing tags:", error);
    throw error;
  }
};

// Function to create a new tag
export const createTag = async (data) => {
  try {
    const res = await api.post(apiEndpoints.tagsCreate, data);
    return res.data; // Assuming the response contains the created tag data
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

// Function to read a tag by ID
export const readTag = async (id) => {
  try {
    const res = await api.get(`${apiEndpoints.tagsRead}/${id}`);
    return res.data; // Assuming the response contains the tag data
  } catch (error) {
    console.error(`Error reading tag with ID ${id}:`, error);
    throw error;
  }
};

// Function to update a tag by ID
export const updateTag = async (id, data) => {
  try {
    const res = await api.put(`${apiEndpoints.tagsUpdate}/${id}`, data);
    return res.data; // Assuming the response contains the updated tag data
  } catch (error) {
    console.error(`Error updating tag with ID ${id}:`, error);
    throw error;
  }
};

// Function to partially update a tag by ID
export const partialUpdateTag = async (id, data) => {
  try {
    const res = await api.patch(
      `${apiEndpoints.tagsPartialUpdate}/${id}`,
      data
    );
    return res.data; // Assuming the response contains the partially updated tag data
  } catch (error) {
    console.error(`Error partially updating tag with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a tag by ID
export const deleteTag = async (id) => {
  try {
    await api.delete(`${apiEndpoints.tagsDelete}/${id}`);
  } catch (error) {
    console.error(`Error deleting tag with ID ${id}:`, error);
    throw error;
  }
};
