// postThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { postService } from "../../services/postsService";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await postService.fetchPosts();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(formData);
      return response; // The entire response object is returned
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      return await postService.fetchPostById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const formData = postService.createFormData(postData);
      const response = await postService.updatePost(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const partialUpdatePost = createAsyncThunk(
  "posts/partialUpdatePost",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const formData = postService.createFormData(postData);
      const response = await postService.partialUpdatePost(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await postService.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkPostSlug = createAsyncThunk(
  "posts/checkPostSlug",
  async (slug, { rejectWithValue }) => {
    try {
      return await postService.checkPostSlug(slug);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedPosts = createAsyncThunk(
  "posts/fetchFeaturedPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await postService.fetchFeaturedPosts();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMostViewedPosts = createAsyncThunk(
  "posts/fetchMostViewedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.fetchMostViewedPosts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (query, { rejectWithValue }) => {
    try {
      return await postService.searchPosts(query);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostsByTag = createAsyncThunk(
  "posts/fetchPostsByTag",
  async (tagSlug, { rejectWithValue }) => {
    try {
      return await postService.fetchPostsByTag(tagSlug);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostsByCategory = createAsyncThunk(
  "posts/fetchPostsByCategory",
  async (categorySlug, { rejectWithValue }) => {
    try {
      return await postService.fetchPostsByCategory(categorySlug);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const engagePost = createAsyncThunk(
  "posts/engagePost",
  async (id, { rejectWithValue }) => {
    try {
      await postService.engagePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const downvotePost = createAsyncThunk(
  "posts/downvotePost",
  async (id, { rejectWithValue }) => {
    try {
      await postService.downvotePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const viewPost = createAsyncThunk(
  "posts/viewPost",
  async (id, { rejectWithValue }) => {
    try {
      await postService.viewPost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const trackPostView = createAsyncThunk(
  "posts/trackPostView",
  async (id, { rejectWithValue }) => {
    try {
      await postService.trackPostView(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  "posts/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await postService.fetchAnalytics();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
