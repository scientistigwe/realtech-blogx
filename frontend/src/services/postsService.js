// services/postService.js
import api from "../utils/api";

const createFormData = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] instanceof File) {
      formData.append(key, data[key]);
    } else if (typeof data[key] === "object") {
      for (const subKey in data[key]) {
        formData.append(`${key}[${subKey}`, data[key][subKey]);
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
      const response = await api.posts.list();
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // Create a new post
  async createPost(formData) {
    try {
      const response = await api.posts.create(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Fetch a single post by ID
  async fetchPostById(id) {
    try {
      const response = await api.posts.read(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      throw error;
    }
  },

  // Update a post
  async updatePost(id, data) {
    try {
      const formData = createFormData(data);
      const response = await api.posts.update(id, formData);
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
      const response = await api.posts.partial_update(id, formData);
      return response.data;
    } catch (error) {
      console.error("Error partially updating post:", error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(id) {
    try {
      await api.posts.delete(id);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Check if a post slug is available
  async checkPostSlug(slug) {
    try {
      const response = await api.posts.check_slug({ slug });
      return response.data;
    } catch (error) {
      console.error("Error checking post slug:", error);
      throw error;
    }
  },

  // Fetch featured posts
  async fetchFeaturedPosts() {
    try {
      const response = await api.posts.featured();
      return response.data;
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  },

  // Fetch most viewed posts
  async fetchMostViewedPosts() {
    try {
      const response = await api.posts.mostViewed();
      console.log(
        `Most viewed posts from service: ${JSON.stringify(response)}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching most viewed posts:", error);
      throw error;
    }
  },

  // Search posts
  async searchPosts(query) {
    try {
      const response = await api.posts.search(query);
      return response.data;
    } catch (error) {
      console.error("Error searching posts:", error);
      throw error;
    }
  },

  // Fetch posts by tag
  async fetchPostsByTag() {
    try {
      const response = await api.posts.posts_by_tag();
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by tag:", error);
      throw error;
    }
  },

  // Fetch posts by category
  async fetchPostsByCategory() {
    try {
      const response = await api.posts.posts_by_category();
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      throw error;
    }
  },

  // Engage with a post
  async engagePost(id) {
    try {
      await api.posts.upvote(id);
    } catch (error) {
      console.error("Error engaging post:", error);
      throw error;
    }
  },

  // Downvote a post
  async downvotePost(id) {
    try {
      await api.posts.downvote(id);
    } catch (error) {
      console.error("Error downvoting post:", error);
      throw error;
    }
  },

  // View a post
  async viewPost(id) {
    try {
      await api.posts.view(id);
    } catch (error) {
      console.error(`Error viewing post with id ${id}:`, error);
      throw error;
    }
  },

  // Track post views
  async trackPostView(id) {
    try {
      await api.posts.track_view(id);
    } catch (error) {
      console.error("Error tracking post view:", error);
      throw error;
    }
  },

  // Fetch analytics
  async fetchAnalytics() {
    try {
      const response = await api.posts.analytics();
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  // Add createFormData to the postService object
  createFormData,
};
