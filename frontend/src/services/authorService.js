// services/authorService.js
// listAuthors as apiListAuthors,
//   // getAuthorById as apiGetAuthorById,
//   // contactAuthor as apiContactAuthor,
//   // searchAuthors as apiSearchAuthors,
//   // // Add other necessary imports from api.js here
import api from "../utils/api"; // Adjust the path according to your project structure

// Author Service functions
export const authorService = {
  listAuthors: async () => {
    try {
      const data = await apiListAuthors();
      return data;
    } catch (error) {
      console.error("Error listing authors:", error);
      throw error;
    }
  },

  getAuthorById: async (id) => {
    try {
      const data = await apiGetAuthorById(id);
      return data;
    } catch (error) {
      console.error(`Error getting author by ID ${id}:`, error);
      throw error;
    }
  },

  contactAuthor: async (id, data) => {
    try {
      const response = await apiContactAuthor(id, data);
      return response;
    } catch (error) {
      console.error(`Error contacting author with ID ${id}:`, error);
      throw error;
    }
  },

  searchAuthors: async (query) => {
    try {
      const data = await apiSearchAuthors(query);
      return data;
    } catch (error) {
      console.error(`Error searching authors with query "${query}":`, error);
      throw error;
    }
  },
};
