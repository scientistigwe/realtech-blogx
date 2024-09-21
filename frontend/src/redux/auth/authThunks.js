import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const createAuthThunk = (type, serviceMethod, needsTokenCheck = true) => {
  const thunkCreator = createAsyncThunk(
    `auth/${type}`,
    async (arg, { rejectWithValue, dispatch }) => {
      try {
        if (needsTokenCheck) {
          const isValid = await authService.ensureValidToken();
          if (!isValid) {
            throw new Error("Invalid token");
          }
        }
        const response = await serviceMethod(arg);
        console.log(`${type} Response:`, response);
        return response;
      } catch (error) {
        console.error(`${type} Error:`, error);
        if (error.message === "Invalid token") {
          // Logout when token is invalid
          const logoutResult = await authService.logout();
          if (!logoutResult.success) {
            throw new Error(logoutResult.message);
          }
        }
        return rejectWithValue(error?.response?.data || error.message);
      }
    }
  );

  return needsTokenCheck ? withTokenCheck(thunkCreator) : thunkCreator;
};

const withTokenCheck = (thunk) => {
  return createAsyncThunk(thunk.typePrefix, async (arg, thunkAPI) => {
    try {
      const isValid = await authService.ensureValidToken();
      if (!isValid) {
        throw new Error("Invalid token");
      }
      return await thunk.payload(arg, thunkAPI);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  });
};

// Define thunks
export const loginUser = createAuthThunk("login", authService.createJwt, false);
export const registerUser = createAuthThunk(
  "register",
  authService.createUser,
  false
);
export const checkAuth = createAuthThunk("checkAuth", authService.checkAuth);
export const fetchUserProfile = createAuthThunk(
  "fetchUserProfile",
  authService.getUserProfile
);
export const updateUserProfile = createAuthThunk(
  "updateUserProfile",
  authService.updateUserProfile
);
export const resetPassword = createAuthThunk(
  "resetPassword",
  authService.resetPassword
);
export const confirmResetPassword = createAuthThunk(
  "confirmResetPassword",
  authService.confirmResetPassword
);
export const resetUsername = createAuthThunk(
  "resetUsername",
  authService.resetUsername
);
export const confirmResetUsername = createAuthThunk(
  "confirmResetUsername",
  authService.confirmResetUsername
);
export const setPassword = createAuthThunk(
  "setPassword",
  authService.setPassword
);
export const setUsername = createAuthThunk(
  "setUsername",
  authService.setUsername
);
export const getUserProfileById = createAuthThunk(
  "getUserProfileById",
  authService.getUserProfileById
);
export const updateUserById = createAuthThunk("updateUserById", (args) =>
  authService.updateUserById(args.id, args.data)
);
export const partialUpdateUserById = createAuthThunk(
  "partialUpdateUserById",
  (args) => authService.partialUpdateUserById(args.id, args.data)
);
export const deleteUserById = createAuthThunk(
  "deleteUserById",
  authService.deleteUserById
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.logout();
      return result;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);
