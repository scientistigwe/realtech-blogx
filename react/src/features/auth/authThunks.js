import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService"; // Adjust the path as necessary

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.createJwt(credentials);
      console.log("Login Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Login Error:", error); // Debug log
      return rejectWithValue(error.message); // Return error for rejection
    }
  }
);

// Register thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.createUser(userData);
      console.log("Register Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Register Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error) {
      console.error("Logout Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Check Auth thunk
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.checkAuth();
      console.log("Check Auth Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Check Auth Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Fetch User Profile thunk
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userProfile = await authService.getUserProfile();
      return userProfile;
    } catch (error) {
      console.error("Fetch User Profile Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Update User Profile thunk
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const updatedProfile = await authService.updateUserProfile(data);
      return updatedProfile;
    } catch (error) {
      console.error("Update User Profile Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Reset Password thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      console.log("Reset Password Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Reset Password Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Confirm Reset Password thunk
export const confirmResetPassword = createAsyncThunk(
  "auth/confirmResetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.confirmResetPassword(data);
      console.log("Confirm Reset Password Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Confirm Reset Password Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Reset Username thunk
export const resetUsername = createAsyncThunk(
  "auth/resetUsername",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.resetUsername(data);
      console.log("Reset Username Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Reset Username Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Confirm Reset Username thunk
export const confirmResetUsername = createAsyncThunk(
  "auth/confirmResetUsername",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.confirmResetUsername(data);
      console.log("Confirm Reset Username Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Confirm Reset Username Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Set Password thunk
export const setPassword = createAsyncThunk(
  "auth/setPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.setPassword(data);
      console.log("Set Password Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Set Password Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Set Username thunk
export const setUsername = createAsyncThunk(
  "auth/setUsername",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.setUsername(data);
      console.log("Set Username Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Set Username Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Get User Profile by ID thunk
export const getUserProfileById = createAsyncThunk(
  "auth/getUserProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await authService.getUserProfileById(id);
      console.log("Get User Profile by ID Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Get User Profile by ID Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Update User by ID thunk
export const updateUserById = createAsyncThunk(
  "auth/updateUserById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await authService.updateUserById(id, data);
      console.log("Update User by ID Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Update User by ID Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Partial Update User by ID thunk
export const partialUpdateUserById = createAsyncThunk(
  "auth/partialUpdateUserById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await authService.partialUpdateUserById(id, data);
      console.log("Partial Update User by ID Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Partial Update User by ID Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Delete User by ID thunk
export const deleteUserById = createAsyncThunk(
  "auth/deleteUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await authService.deleteUserById(id);
      console.log("Delete User by ID Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Delete User by ID Error:", error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);
