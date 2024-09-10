import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";
import * as utils from "./../utils.js";

// Comment Handlers
const commentHandlers = {
  // Create a comment
  createComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    try {
      await api.post(apiEndpoints.comments.create, formData);
      utils.showMessage("Comment created successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  // Fetch all comments
  fetchComments: async () => {
    try {
      const response = await api.get(apiEndpoints.comments.list);
      const comments = await response.json();
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = comments
        .map(
          (comment) =>
            `<li>${comment.text} (Upvotes: ${comment.upvotes}, Downvotes: ${comment.downvotes})</li>`
        )
        .join("");
    } catch (error) {
      utils.handleError(error);
    }
  },

  // Moderate a comment
  moderateComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    try {
      await api.post(apiEndpoints.comments.moderate(id));
      utils.showMessage("Comment moderated successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  // Delete a comment
  deleteComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    try {
      await api.delete(apiEndpoints.comments.delete(id));
      utils.showMessage("Comment deleted successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  // Update a comment
  updateComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    const formData = new FormData(form);
    try {
      await api.put(apiEndpoints.comments.update(id), formData);
      utils.showMessage("Comment updated successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  // Vote on a comment (upvote/downvote)
  voteComment: async (event, voteType) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    try {
      await api.post(apiEndpoints.comments.vote(id, voteType));
      utils.showMessage(`Comment ${voteType}d successfully!`);
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },
};

// API functions
export const useListComments = async () => {
  try {
    const response = await api.get(apiEndpoints.comments.list);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    throw err;
  }
};

export const useCreateComment = async (data) => {
  try {
    const response = await api.post(apiEndpoints.comments.create, data);
    return response.data;
  } catch (err) {
    console.error("Failed to create comment:", err);
    throw err;
  }
};

export const useGetCommentById = async (id) => {
  try {
    const response = await api.get(`${apiEndpoints.comments.read}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch comment with ID ${id}:`, err);
    throw err;
  }
};

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

export const useDeleteComment = async (id) => {
  try {
    const response = await api.delete(`${apiEndpoints.comments.delete}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete comment with ID ${id}:`, err);
    throw err;
  }
};

export const useUpvoteComment = async (id) => {
  try {
    const response = await api.post(`${apiEndpoints.comments.upvote}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to upvote comment with ID ${id}:`, err);
    throw err;
  }
};

export const useDownvoteComment = async (id) => {
  try {
    const response = await api.post(`${apiEndpoints.comments.downvote}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to downvote comment with ID ${id}:`, err);
    throw err;
  }
};

export const useModerateComment = async (id) => {
  try {
    const response = await api.post(`${apiEndpoints.comments.moderate}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to moderate comment with ID ${id}:`, err);
    throw err;
  }
};

export default commentHandlers;
