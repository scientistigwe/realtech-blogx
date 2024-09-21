import { useState } from "react";
import { usersService } from "../services/usersService"; // Adjust the path as necessary

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listUsers = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const users = await usersService.listUsers();
      return users;
    } catch (err) {
      setError(err.message || "Failed to load users."); // Improved error handling
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserProfile = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const userProfile = await usersService.getCurrentUserProfile();
      return userProfile;
    } catch (err) {
      setError(err.message || "Failed to load user profile."); // Improved error handling
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const user = await usersService.getUserById(id);
      return user;
    } catch (err) {
      setError(err.message || `Failed to load user with ID ${id}.`); // Improved error handling
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, data) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const user = await usersService.updateUser(id, data);
      return user;
    } catch (err) {
      setError(err.message || `Failed to update user with ID ${id}.`); // Improved error handling
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const partialUpdateUser = async (id, data) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const user = await usersService.partialUpdateUser(id, data);
      return user;
    } catch (err) {
      setError(err.message || `Failed to partially update user with ID ${id}.`); // Improved error handling
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      await usersService.deleteUser(id);
    } catch (err) {
      setError(err.message || `Failed to delete user with ID ${id}.`); // Improved error handling
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    listUsers,
    getCurrentUserProfile,
    getUserById,
    updateUser,
    partialUpdateUser,
    deleteUser,
    loading,
    error,
  };
};
