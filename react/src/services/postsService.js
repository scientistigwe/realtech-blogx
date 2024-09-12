// services/postService.js
import {
  listPosts as apiListPosts,
  createPost as apiCreatePost,
  getPostsByCategory as apiGetPostsByCategory,
  getPostsByTag as apiGetPostsByTag,
  checkSlug as apiCheckPostSlug,
  getFeaturedPosts as apiGetFeaturedPosts,
  getMostViewedPosts as apiGetMostViewedPosts,
  searchPosts as apiSearchPosts,
  getPostById as apiGetPostById,
  updatePost as apiUpdatePost,
  partialUpdatePost as apiPartialUpdatePost,
  deletePost as apiDeletePost,
  downvotePost as apiDownvotePost,
  engagePost as apiEngagePost,
  upvotePost as apiUpvotePost,
  trackPostView as apiTrackPostView,
  viewPost as apiViewPost,
} from "../utils/api"; // Adjust the path as necessary

const createFormData = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] instanceof File) {
      formData.append(key, data[key]);
    } else if (typeof data[key] === "object") {
      for (const subKey in data[key]) {
        formData.append(`${key}[${subKey}]`, data[key][subKey]);
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
};

export const postService = {
  // Fetch all posts
  async fetchPosts() {
    try {
      const response = await apiListPosts();
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // Create a new post
  async createPost(data) {
    try {
      const formData = createFormData(data);
      const response = await apiCreatePost(formData);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Fetch posts by category
  async fetchPostsByCategory(category) {
    try {
      const response = await apiGetPostsByCategory(category);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      throw error;
    }
  },

  // Fetch posts by tag
  async fetchPostsByTag(tag) {
    try {
      const response = await apiGetPostsByTag(tag);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by tag:", error);
      throw error;
    }
  },

  // Check if a post slug is available
  async checkPostSlug(slug) {
    try {
      const response = await apiCheckPostSlug(slug);
      return response.data;
    } catch (error) {
      console.error("Error checking post slug:", error);
      throw error;
    }
  },

  // Fetch featured posts
  async fetchFeaturedPosts() {
    try {
      const response = await apiGetFeaturedPosts();
      return response.data;
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  },

  // Fetch most viewed posts
  async fetchMostViewedPosts() {
    try {
      const response = await apiGetMostViewedPosts();
      return response.data;
    } catch (error) {
      console.error("Error fetching most viewed posts:", error);
      throw error;
    }
  },

  // Search posts
  async searchPosts(query) {
    try {
      const response = await apiSearchPosts(query);
      return response.data;
    } catch (error) {
      console.error("Error searching posts:", error);
      throw error;
    }
  },

  // Fetch a single post by ID
  async fetchPostById(id) {
    try {
      const response = await apiGetPostById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      throw error;
    }
  },

  // Update a post
  async updatePost(id, data) {
    try {
      const formData = createFormData(data);
      const response = await apiUpdatePost(id, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Partially update a post
  async partialUpdatePost(id, data) {
    try {
      const formData = createFormData(data);
      const response = await apiPartialUpdatePost(id, formData);
      return response.data;
    } catch (error) {
      console.error("Error partially updating post:", error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(id) {
    try {
      await apiDeletePost(id);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Downvote a post
  async downvotePost(id) {
    try {
      await apiDownvotePost(id);
    } catch (error) {
      console.error("Error downvoting post:", error);
      throw error;
    }
  },

  // Engage with a post
  async engagePost(id) {
    try {
      await apiEngagePost(id);
    } catch (error) {
      console.error("Error engaging post:", error);
      throw error;
    }
  },

  // Upvote a post
  async upvotePost(id) {
    try {
      await apiUpvotePost(id);
    } catch (error) {
      console.error("Error upvoting post:", error);
      throw error;
    }
  },

  // Track post views
  async trackPostView(id) {
    try {
      await apiTrackPostView(id);
    } catch (error) {
      console.error("Error tracking post view:", error);
      throw error;
    }
  },

  // View a post
  async viewPost(id) {
    try {
      await apiViewPost(id);
    } catch (error) {
      console.error(`Error view post with id ${id}: ${error}`);
      throw error;
    }
  },
};
