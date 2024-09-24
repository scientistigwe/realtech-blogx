import { createAsyncThunk } from "@reduxjs/toolkit";
import { usersService } from "../../services/usersService";

const createUserThunk = (type, serviceMethod, needsTokenCheck = true) => {
  const thunkCreator = createAsyncThunk(
    `users/${type}`,
    async (arg, { rejectWithValue, dispatch }) => {
      try {
        if (needsTokenCheck) {
          const isValid = await usersService.ensureValidToken();
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
          const logoutResult = await usersService.logout();
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
      const isValid = await usersService.ensureValidToken();
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
export const fetchUsers = createUserThunk(
  "fetchUsers",
  usersService.getUsers,
  true
);

export const fetchCurrentUser = createUserThunk(
  "fetchCurrentUser",
  usersService.getCurrentUser,
  true
);

export const fetchAdminStatus = createUserThunk(
  "fetchAdminStatus",
  usersService.getAdminStatus,
  true
);

export const fetchUserById = createUserThunk(
  "fetchUserById",
  (args) => usersService.getUserById(args.id),
  false
);

export const updateUser = createUserThunk(
  "updateUser",
  (args) => usersService.updateUser(args.id, args.data),
  true
);

export const partialUpdateUser = createUserThunk(
  "partialUpdateUser",
  (args) => usersService.partialUpdateUser(args.id, args.data),
  true
);

export const deleteUser = createUserThunk(
  "deleteUser",
  (args) => usersService.deleteUser(args.id),
  true
);
