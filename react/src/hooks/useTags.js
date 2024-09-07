import { useState } from "react";
import api from "../api/api"; // Adjust the path according to your project structure

// Hook to manage tags
export const useTags = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to list all tags
  const listTags = async () => {
    setLoading(true);
    try {
      const res = await api.tags.list();
      return res.data; // Assuming the response contains the list of tags
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new tag
  const createTag = async (data) => {
    setLoading(true);
    try {
      const res = await api.tags.create(data);
      return res.data; // Assuming the response contains the created tag data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to read a tag by ID
  const readTag = async (id) => {
    setLoading(true);
    try {
      const res = await api.tags.read(id);
      return res.data; // Assuming the response contains the tag data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a tag by ID
  const updateTag = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.tags.update(id, data);
      return res.data; // Assuming the response contains the updated tag data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to partially update a tag by ID
  const partialUpdateTag = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.tags.partialUpdate(id, data);
      return res.data; // Assuming the response contains the partially updated tag data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a tag by ID
  const deleteTag = async (id) => {
    setLoading(true);
    try {
      await api.tags.delete(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    listTags,
    createTag,
    readTag,
    updateTag,
    partialUpdateTag,
    deleteTag,
    error,
    loading,
  };
};
