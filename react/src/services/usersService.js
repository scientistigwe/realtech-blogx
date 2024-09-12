// services/usersService.js
import {
  listUsers as apiListUsers,
  getUserMe as apiGetUserMe,
  getUserProfileById as apiGetUserById,
  updateUserProfile as apiUpdateUser,
  partialUpdateUserProfile as apiPartialUpdateUser,
  deleteUserProfile as apiDeleteUser,
} from "../utils/api"; // Adjust the path according to your project structure

// User Service functions
export const usersService = {
  listUsers: async () => {
    try {
      const data = await apiListUsers();
      return data;
    } catch (error) {
      console.error("Error listing users:", error);
      throw error;
    }
  },

  getCurrentUserProfile: async () => {
    try {
      const data = await apiGetUserMe();
      return data;
    } catch (error) {
      console.error("Error getting current user profile:", error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const data = await apiGetUserById(id);
      return data;
    } catch (error) {
      console.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await apiUpdateUser(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user by ID ${id}:`, error);
      throw error;
    }
  },

  partialUpdateUser: async (id, data) => {
    try {
      const response = await apiPartialUpdateUser(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error partially updating user by ID ${id}:`, error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await apiDeleteUser(id);
    } catch (error) {
      console.error(`Error deleting user by ID ${id}:`, error);
      throw error;
    }
  },
};
