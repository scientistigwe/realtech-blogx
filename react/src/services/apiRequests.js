import apiClient from "../api/apiInterceptor.js";
import { apiEndpoints } from "../api/apiEndpoints.js";

console.log(`API Client (apirequest.js): ${apiClient}`);

const baseUrl = apiEndpoints.moderation;

const handleRequest = async (endpoint, method, data) => {
  try {
    const response = await apiClient[method](endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}:`, error);
    throw error;
  }
};

export const fetchPendingContent = () =>
  handleRequest(`${baseUrl}/pending-content/`, "get");

export const approveContent = (id, contentType) =>
  handleRequest(`${baseUrl}/approve-content/${id}/`, "post", {
    content_type: contentType,
  });

export const rejectContent = (id, contentType) =>
  handleRequest(`${baseUrl}/reject-content/${id}/`, "post", {
    content_type: contentType,
  });
