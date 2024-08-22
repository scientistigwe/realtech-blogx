import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./../api/apiEndpoints";

console.log(`API Client (tags.js): ${apiClient}`);

/* ================================
   Public Endpoint - No Authentication Required
   ================================ */

// Fetch all tags (Public)
export const fetchTags = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.tags.list);
    return response.data; // Return the tags data
  } catch (error) {
    throw new Error("Failed to fetch tags: " + error.message);
  }
};

/* ================================
   Private Endpoints - Requires Authentication
   ================================ */

// Create a new tag (Requires Authentication)
export const createTag = async (tagData) => {
  try {
    const response = await apiClient.post(apiEndpoints.tags.create, tagData);
    return response.data; // Return the created tag data
  } catch (error) {
    throw new Error("Failed to create tag: " + error.message);
  }
};

// Update an existing tag (Requires Authentication)
export const updateTag = async (tagId, tagData) => {
  try {
    const response = await apiClient.put(
      `${apiEndpoints.tags.update(tagId)}`,
      tagData
    );
    return response.data; // Return the updated tag data
  } catch (error) {
    throw new Error("Failed to update tag: " + error.message);
  }
};

// Delete a tag (Requires Authentication)
export const deleteTag = async (tagId) => {
  try {
    const response = await apiClient.delete(
      `${apiEndpoints.tags.delete(tagId)}`
    );
    return response.data; // Return the response data or a success message
  } catch (error) {
    throw new Error("Failed to delete tag: " + error.message);
  }
};
