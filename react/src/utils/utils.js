// src/api/utils.js

// Utility function to handle API errors
export const handleApiError = (error, action) => {
  console.error("API Error:", error);

  // Extract error message
  const errorMessage = error.response
    ? (error.response.data && error.response.data.detail) ||
      error.response.statusText
    : error.message;

  // Optionally, display user-friendly messages or perform other actions
  console.error(`Failed to ${action}: ${errorMessage}`);

  // Optionally, rethrow the error if you want the calling function to handle it
  throw new Error(`Failed to ${action}: ${errorMessage}`);
};
