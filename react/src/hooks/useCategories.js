import { useState, useEffect } from "react";
import api from "../api/api"; // Adjust the path according to your project structure

// Hook to list all categories
export const useListCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.categories.list();
      setCategories(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, error, loading };
};

// Hook to create a new category
export const useCreateCategory = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createCategory = async (data) => {
    setLoading(true);
    try {
      const res = await api.categories.create(data);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, createCategory };
};

// Hook to get a category by ID
export const useGetCategoryById = (id) => {
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategoryById = async () => {
    setLoading(true);
    try {
      const res = await api.categories.read(id);
      setCategory(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryById();
  }, [id]);

  return { category, error, loading };
};

// Hook to update a category by ID
export const useUpdateCategory = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateCategory = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.categories.update(id, data);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, updateCategory };
};

// Hook to partially update a category by ID
export const usePartialUpdateCategory = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const partialUpdateCategory = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.categories.partialUpdate(id, data);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, partialUpdateCategory };
};

// Hook to delete a category by ID
export const useDeleteCategory = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      const res = await api.categories.delete(id);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, deleteCategory };
};
