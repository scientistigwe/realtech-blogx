import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to fetch all posts
export const fetchPosts = async () => {
  try {
    const res = await api.get(apiEndpoints.posts.list);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Function to create a new post
export const createPost = async (data) => {
  try {
    const res = await api.post(apiEndpoints.posts.create, data);
    return res.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Function to fetch posts by category
export const fetchPostsByCategory = async (category) => {
  try {
    const res = await api.get(`${apiEndpoints.posts.byCategory}${category}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    throw error;
  }
};

// Function to fetch posts by tag
export const fetchPostsByTag = async (tag) => {
  try {
    const res = await api.get(`${apiEndpoints.posts.byTag}${tag}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    throw error;
  }
};

// Function to check if a post slug is available
export const checkPostSlug = async (slug) => {
  try {
    const res = await api.post(apiEndpoints.posts.checkSlug, { slug });
    return res.data;
  } catch (error) {
    console.error("Error checking post slug:", error);
    throw error;
  }
};

// Function to fetch featured posts
export const fetchFeaturedPosts = async () => {
  try {
    const res = await api.get(apiEndpoints.posts.featured);
    return res.data;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    throw error;
  }
};

// Function to fetch most viewed posts
export const fetchMostViewedPosts = async () => {
  try {
    const res = await api.get(apiEndpoints.posts.mostViewed);
    return res.data;
  } catch (error) {
    console.error("Error fetching most viewed posts:", error);
    throw error;
  }
};

// Function to search posts
export const searchPosts = async (query) => {
  try {
    const res = await api.get(`${apiEndpoints.posts.search}?query=${query}`);
    return res.data;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
};

// Function to fetch a single post by ID
export const fetchPostById = async (id) => {
  try {
    const res = await api.get(apiEndpoints.posts.read(id));
    return res.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};

// Function to update a post
export const updatePost = async (id, data) => {
  try {
    const res = await api.put(apiEndpoints.posts.update(id), data);
    return res.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Function to partially update a post
export const partialUpdatePost = async (id, data) => {
  try {
    const res = await api.patch(apiEndpoints.posts.partialUpdate(id), data);
    return res.data;
  } catch (error) {
    console.error("Error partially updating post:", error);
    throw error;
  }
};

// Function to delete a post
export const deletePost = async (id) => {
  try {
    await api.delete(apiEndpoints.posts.delete(id));
    return id;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Function to downvote a post
export const downvotePost = async (id) => {
  try {
    await api.post(apiEndpoints.posts.downvote(id));
  } catch (error) {
    console.error("Error downvoting post:", error);
    throw error;
  }
};

// Function to upvote a post
export const upvotePost = async (id) => {
  try {
    await api.post(apiEndpoints.posts.upvote(id));
  } catch (error) {
    console.error("Error upvoting post:", error);
    throw error;
  }
};

// Function to engage with a post
export const engagePost = async (id) => {
  try {
    await api.post(apiEndpoints.posts.engage(id));
  } catch (error) {
    console.error("Error engaging with post:", error);
    throw error;
  }
};

// Function to view a post
export const viewPost = async (id) => {
  try {
    const res = await api.get(apiEndpoints.posts.view(id));
    return res.data;
  } catch (error) {
    console.error("Error viewing post:", error);
    throw error;
  }
};
