import apiClient from "./../redux/storeConfig";
import { apiEndpoints } from "./apiEndpoints";

/* ================================
   Private Endpoints - Authentication Required
   ================================ */

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
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload profile picture: " + error.message);
  }
};

// Upload post thumbnail (Private, requiresAuth: true)
export const uploadPostThumbnail = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      apiEndpoints.fileUpload.postThumbnail,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload post thumbnail: " + error.message);
  }
};
