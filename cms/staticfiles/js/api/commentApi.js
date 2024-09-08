import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to list all comments
export const useListComments = async () => {
  try {
    const response = await api.get(apiEndpoints.comments.list);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    throw err;
  }
};

// Function to create a new comment
export const useCreateComment = async (data) => {
  try {
    const response = await api.post(apiEndpoints.comments.create, data);
    return response.data;
  } catch (err) {
    console.error("Failed to create comment:", err);
    throw err;
  }
};

// Function to get a comment by ID
export const useGetCommentById = async (id) => {
  try {
    const response = await api.get(`${apiEndpoints.comments.read}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch comment with ID ${id}:`, err);
    throw err;
  }
};

// Function to update a comment by ID
export const useUpdateComment = async (id, data) => {
  try {
    const response = await api.put(
      `${apiEndpoints.comments.update}/${id}`,
      data
    );
    return response.data;
  } catch (err) {
    console.error(`Failed to update comment with ID ${id}:`, err);
    throw err;
  }
};

// Function to partially update a comment by ID
export const usePartialUpdateComment = async (id, data) => {
  try {
    const response = await api.patch(
      `${apiEndpoints.comments.update}/${id}`,
      data
    );
    return response.data;
  } catch (err) {
    console.error(`Failed to partially update comment with ID ${id}:`, err);
    throw err;
  }
};

// Function to delete a comment by ID
export const useDeleteComment = async (id) => {
  try {
    const response = await api.delete(`${apiEndpoints.comments.delete}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete comment with ID ${id}:`, err);
    throw err;
  }
};

// Function to upvote a comment by ID
export const useUpvoteComment = async (id) => {
  try {
    const response = await api.post(`${apiEndpoints.comments.upvote}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to upvote comment with ID ${id}:`, err);
    throw err;
  }
};

// Function to downvote a comment by ID
export const useDownvoteComment = async (id) => {
  try {
    const response = await api.post(`${apiEndpoints.comments.downvote}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to downvote comment with ID ${id}:`, err);
    throw err;
  }
};

// Function to moderate a comment by ID
export const useModerateComment = async (id) => {
  try {
    const response = await api.post(`${apiEndpoints.comments.moderate}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to moderate comment with ID ${id}:`, err);
    throw err;
  }
};
