// services/usersService.js
import api from "../utils/api";

// User Service functions
export const usersService = {
  listUsers: async () => {
    try {
      const response = await api.users.list();
      return response.data;
    } catch (error) {
      console.error("Error listing users:", error);
      throw error;
    }
  },

  getCurrentUserProfile: async () => {
    try {
      const response = await api.users.me_read();
      return response.data;
    } catch (error) {
      console.error("Error getting current user profile:", error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.users.read(id);
      return response.data;
    } catch (error) {
      console.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await api.users.update(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user by ID ${id}:`, error);
      throw error;
    }
  },

  partialUpdateUser: async (id, data) => {
    try {
      const response = await api.users.partial_update(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error partially updating user by ID ${id}:`, error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await api.users.delete(id);
    } catch (error) {
      console.error(`Error deleting user by ID ${id}:`, error);
      throw error;
    }
  },
};
