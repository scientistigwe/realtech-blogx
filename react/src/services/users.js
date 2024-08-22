import apiClient from "./../api/apiInterceptor";
import { apiEndpoints } from "./../api/apiEndpoints"; // Import API endpoints configuration

console.log(`API Client (users.js): ${apiClient}`);

/* ================================
   Public Endpoints - No Authentication Required
   ================================ */

// No public endpoints for user profile in this file

/* ================================
   Private Endpoints - Authentication Required
   ================================ */

// Fetch current user profile (Private, requiresAuth: true)
export const fetchCurrentUserProfile = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.users.curentUserProfile);
    return response.data; // Return the current user profile data
  } catch (error) {
    throw new Error("Failed to fetch current user profile: " + error.message);
  }
};

// Fetch user profile by ID (Private, requiresAuth: true)
export const fetchUserProfile = async (id) => {
  if (!id) {
    throw new Error("ID is undefined");
  }

  try {
    const url = apiEndpoints.users.profile(id); // Construct URL for user profile
    const response = await apiClient.get(url);
    return response.data; // Return the user profile data
  } catch (error) {
    throw new Error("Failed to fetch user profile: " + error.message);
  }
};

// Update user profile by ID (Private, requiresAuth: true)
export const updateUserProfile = async (id, data) => {
  try {
    const url = apiEndpoints.users.updateProfile(id); // Construct URL for updating user profile
    const response = await apiClient.put(url, data);
    return response.data; // Return the updated user profile data
  } catch (error) {
    throw new Error("Failed to update user profile: " + error.message);
  }
};

// Delete user account by ID (Private, requiresAuth: true)
export const deleteUserAccount = async (id) => {
  try {
    const url = apiEndpoints.users.deleteAccount(id); // Construct URL for deleting user account
    const response = await apiClient.delete(url);
    return response.data; // Return the response data or a success message
  } catch (error) {
    throw new Error("Failed to delete user account: " + error.message);
  }
};

// Upload profile picture (Private, requiresAuth: true)
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      apiEndpoints.fileUpload.profilePicture,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // Return the uploaded profile picture data
  } catch (error) {
    throw new Error("Failed to upload profile picture: " + error.message);
  }
};
