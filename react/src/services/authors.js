import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./../api/apiEndpoints";

console.log(`API Client (author.js): ${apiClient}`);

// Helper function to replace placeholder in URL
const replacePlaceholder = (url, id) => url.replace("<int:id>", id);

// ------------------ Public Endpoints (No Authentication Required) ------------------

// Fetch author details by ID
export const fetchAuthorById = async (authorId) => {
  try {
    const response = await apiClient.get(
      replacePlaceholder(apiEndpoints.authors.fetchById(authorId))
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch author details: " + error.message);
  }
};

// Fetch all authors
export const fetchAuthors = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.authors.fetchAuthors());
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch authors: " + error.message);
  }
};

// Contact an author
export const contactAuthor = async (authorId, message) => {
  try {
    const response = await apiClient.post(
      replacePlaceholder(apiEndpoints.authors.contact(authorId)),
      { message }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to contact author: " + error.message);
  }
};

// Fetch posts by a specific author
export const fetchPostsByAuthor = async (authorId) => {
  try {
    const response = await apiClient.get(
      replacePlaceholder(apiEndpoints.authors.postsByAuthor(authorId))
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch posts by author: " + error.message);
  }
};
