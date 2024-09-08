import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to list all users
export const listUsers = async () => {
  try {
    const res = await api.get(apiEndpoints.users.list);
    return res.data; // Assuming the response contains the list of users
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
};

// Function to create a new user
export const createUser = async (data) => {
  try {
    const res = await api.post(apiEndpoints.users.create, data);
    return res.data; // Assuming the response contains the created user data
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Function to get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const res = await api.get(apiEndpoints.users.me);
    return res.data; // Assuming the response contains the current user profile data
  } catch (error) {
    console.error("Error getting current user profile:", error);
    throw error;
  }
};

// Function to read a user by ID
export const readUser = async (id) => {
  try {
    const res = await api.get(apiEndpoints.users.read(id));
    return res.data; // Assuming the response contains the user data
  } catch (error) {
    console.error(`Error reading user with ID ${id}:`, error);
    throw error;
  }
};

// Function to update a user by ID
export const updateUser = async (id, data) => {
  try {
    const res = await api.put(apiEndpoints.users.update(id), data);
    return res.data; // Assuming the response contains the updated user data
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Function to partially update a user by ID
export const partialUpdateUser = async (id, data) => {
  try {
    const res = await api.patch(apiEndpoints.users.partialUpdate(id), data);
    return res.data; // Assuming the response contains the partially updated user data
  } catch (error) {
    console.error(`Error partially updating user with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a user by ID
export const deleteUser = async (id) => {
  try {
    await api.delete(apiEndpoints.users.delete(id));
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

// Function to contact a user by ID
export const contactUser = async (id, data) => {
  try {
    const res = await api.post(apiEndpoints.users.contact(id), data);
    return res.data; // Assuming the response contains the result of the contact operation
  } catch (error) {
    console.error(`Error contacting user with ID ${id}:`, error);
    throw error;
  }
};
