// services/usersService.js
import {
  listUsers as apiListUsers,
  getUserProfile as apiGetUserProfile,
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
      return data; // Ensure this is correct based on your API response
    } catch (error) {
      console.error("Error listing users:", error);
      throw error; // Re-throwing the error for `useUsers` to catch
    }
  },

  getCurrentUserProfile: async () => {
    try {
      const data = await apiGetUserProfile();
      return data; // Ensure this is correct based on your API response
    } catch (error) {
      console.error("Error getting current user profile:", error);
      throw error; // Re-throwing the error for `useUsers` to catch
    }
  },

  getUserById: async (id) => {
    try {
      const data = await apiGetUserById(id);
      return data; // Ensure this is correct based on your API response
    } catch (error) {
      console.error(`Error getting user by ID ${id}:`, error);
      throw error; // Re-throwing the error for `useUsers` to catch
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await apiUpdateUser(id, data);
      return response.data; // Ensure this is correct based on your API response
    } catch (error) {
      console.error(`Error updating user by ID ${id}:`, error);
      throw error; // Re-throwing the error for `useUsers` to catch
    }
  },

  partialUpdateUser: async (id, data) => {
    try {
      const response = await apiPartialUpdateUser(id, data);
      return response.data; // Ensure this is correct based on your API response
    } catch (error) {
      console.error(`Error partially updating user by ID ${id}:`, error);
      throw error; // Re-throwing the error for `useUsers` to catch
    }
  },

  deleteUser: async (id) => {
    try {
      await apiDeleteUser(id);
    } catch (error) {
      console.error(`Error deleting user by ID ${id}:`, error);
      throw error; // Re-throwing the error for `useUsers` to catch
    }
  },
};
