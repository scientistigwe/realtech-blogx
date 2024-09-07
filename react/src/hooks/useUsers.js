import { useState } from "react";
import api from "../api/api"; // Adjust the path according to your project structure

// Hook to manage user-related operations
export const useUsers = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to list all users
  const listUsers = async () => {
    setLoading(true);
    try {
      const res = await api.users.list();
      return res.data; // Assuming the response contains the list of users
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new user
  const createUser = async (data) => {
    setLoading(true);
    try {
      const res = await api.users.create(data);
      return res.data; // Assuming the response contains the created user data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get current user profile
  const getCurrentUserProfile = async () => {
    setLoading(true);
    try {
      const res = await api.users.me();
      return res.data; // Assuming the response contains the current user profile data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to read a user by ID
  const readUser = async (id) => {
    setLoading(true);
    try {
      const res = await api.users.read(id);
      return res.data; // Assuming the response contains the user data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a user by ID
  const updateUser = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.users.update(id, data);
      return res.data; // Assuming the response contains the updated user data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to partially update a user by ID
  const partialUpdateUser = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.users.partialUpdate(id, data);
      return res.data; // Assuming the response contains the partially updated user data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a user by ID
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await api.users.delete(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to contact a user by ID
  const contactUser = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.users.contact(id, data);
      return res.data; // Assuming the response contains the result of the contact operation
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    listUsers,
    createUser,
    getCurrentUserProfile,
    readUser,
    updateUser,
    partialUpdateUser,
    deleteUser,
    contactUser,
    error,
    loading,
  };
};
