import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./../api/apiEndpoints";

console.log(`API Client (search.js): ${apiClient}`);

/* ================================
   Public Endpoint - No Authentication Required
   ================================ */

// Search posts (Public)
export const searchPosts = async (query) => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.search}?q=${encodeURIComponent(query)}`
    );
    return response.data; // Return the search results data
  } catch (error) {
    throw new Error("Failed to search posts: " + error.message);
  }
};
