/**
 * @file apiRequest.js
 * @description Contains API request functions related to content moderation, like fetching, approving, and rejecting content.
 *
 * @relation - Uses `apiClient` from `apiConfig.js` to make HTTP requests.
 */

import apiClient from "../api/apiInterceptor";
import { apiEndpoints } from "./apiEndpoints";

const baseUrl = apiEndpoints.moderation;

export const fetchPendingContent = async () => {
  try {
    const response = await apiClient.get(`${baseUrl}/pending-content/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending content:", error);
    throw error;
  }
};

export const approveContent = async (id, contentType) => {
  try {
    const response = await apiClient.post(`${baseUrl}/approve-content/${id}/`, {
      content_type: contentType,
    });
    return response.data;
  } catch (error) {
    console.error("Error approving content:", error);
    throw error;
  }
};

export const rejectContent = async (id, contentType) => {
  try {
    const response = await apiClient.post(`${baseUrl}/reject-content/${id}/`, {
      content_type: contentType,
    });
    return response.data;
  } catch (error) {
    console.error("Error rejecting content:", error);
    throw error;
  }
};
