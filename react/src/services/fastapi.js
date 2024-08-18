// src/api/fastApi.js

import { store, apiClient } from "./../redux/storeConfig"; // Assuming apiConfig is correctly set up
import { apiEndpoints } from "./apiEndpoints"; // Assuming apiEndpoints are defined here
import { handleApiError } from "./utils"; // Updated error handling utility

// Analyze sentiment
export const analyzeSentiment = async (text) => {
  try {
    const response = await apiClient.post(apiEndpoints.analyzeSentiment, {
      text,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "analyze sentiment");
  }
};
