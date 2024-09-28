import { createAsyncThunk } from "@reduxjs/toolkit";
import { tagService } from "../../services/tagsService";

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      return await tagService.listTags();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tagData, { rejectWithValue }) => {
    try {
      return await tagService.createTag(tagData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await tagService.updateTag(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async (id, { rejectWithValue }) => {
    try {
      await tagService.deleteTag(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMostUsedTags = createAsyncThunk(
  "tags/fetchMostUsedTags",
  async (_, { rejectWithValue }) => {
    try {
      return await tagService.listTags(); // Assuming this returns tags sorted by usage
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
