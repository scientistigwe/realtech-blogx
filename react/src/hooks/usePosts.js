import { useState } from "react";
import api from "../api/api"; // Adjust the path according to your project structure

// Hook to manage posts
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch all posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.posts.list();
      setPosts(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new post
  const createPost = async (data) => {
    setLoading(true);
    try {
      const res = await api.posts.create(data);
      setPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch posts by category
  const fetchPostsByCategory = async (category) => {
    setLoading(true);
    try {
      const res = await api.posts.byCategory(category);
      setPosts(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch posts by tag
  const fetchPostsByTag = async (tag) => {
    setLoading(true);
    try {
      const res = await api.posts.byTag(tag);
      setPosts(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if a post slug is available
  const checkPostSlug = async (slug) => {
    setLoading(true);
    try {
      const res = await api.posts.checkSlug(slug);
      return res.data; // Assuming the response contains the result
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch featured posts
  const fetchFeaturedPosts = async () => {
    setLoading(true);
    try {
      const res = await api.posts.featured();
      setPosts(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch most viewed posts
  const fetchMostViewedPosts = async () => {
    setLoading(true);
    try {
      const res = await api.posts.mostViewed();
      setPosts(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to search posts
  const searchPosts = async (query) => {
    setLoading(true);
    try {
      const res = await api.posts.search(query);
      setPosts(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single post by ID
  const fetchPostById = async (id) => {
    setLoading(true);
    try {
      const res = await api.posts.read(id);
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a post
  const updatePost = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.posts.update(id, data);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? res.data : post))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to partially update a post
  const partialUpdatePost = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.posts.partialUpdate(id, data);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? res.data : post))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a post
  const deletePost = async (id) => {
    setLoading(true);
    try {
      await api.posts.delete(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to downvote a post
  const downvotePost = async (id) => {
    setLoading(true);
    try {
      await api.posts.downvote(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to engage with a post
  const engagePost = async (id) => {
    setLoading(true);
    try {
      await api.posts.engage(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to upvote a post
  const upvotePost = async (id) => {
    setLoading(true);
    try {
      await api.posts.upvote(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to track post views
  const trackPostView = async (id) => {
    setLoading(true);
    try {
      await api.posts.view(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    error,
    loading,
    fetchPosts,
    createPost,
    fetchPostsByCategory,
    fetchPostsByTag,
    checkPostSlug,
    fetchFeaturedPosts,
    fetchMostViewedPosts,
    searchPosts,
    fetchPostById,
    updatePost,
    partialUpdatePost,
    deletePost,
    downvotePost,
    engagePost,
    upvotePost,
    trackPostView,
  };
};
