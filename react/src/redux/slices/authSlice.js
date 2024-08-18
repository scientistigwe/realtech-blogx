/**
 * @file authSlice.js
 * @description Manages the authentication state in Redux, including `isAuthenticated`, `user`, `token`, etc.
 * Provides async actions for login, logout, token refresh, and handles side effects via thunks.
 *
 * @relation - Uses functions from `authService.js` to perform async operations and update the Redux state.
 * - This slice is included in `store.js` as part of the Redux store.
 * - Exports actions and reducers that are used in various components for authentication management.
 * - Authslice dispatches requests/responses to/from `authService` for handling authentication operations.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../authService";
import { APIError } from "../../api/apiInterceptor"; // Import APIError

const isDevelopment = process.env.NODE_ENV === "development";

function devLog(...args) {
  if (isDevelopment) {
    console.log(...args);
  }
}

function devError(...args) {
  if (isDevelopment) {
    console.error(...args);
  }
}

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  refreshAttempted: false,
};

// Create async thunks for auth operations
export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      devLog("Authslice dispatching register request to authService");
      return await authService.registerUser(formData);
    } catch (error) {
      devError("Authslice received error from authService on register:", error);
      return rejectWithValue(
        error instanceof APIError ? error.message : "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      devLog("Authslice dispatching login request to authService");
      return await authService.loginUser(credentials);
    } catch (error) {
      devError("Authslice received error from authService on login:", error);
      return rejectWithValue(
        error instanceof APIError ? error.message : "Login failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      devLog("Authslice dispatching logout request to authService");
      await authService.logoutUser();
    } catch (error) {
      devError("Authslice received error from authService on logout:", error);
      return rejectWithValue(
        error instanceof APIError ? error.message : "Logout failed"
      );
    }
  }
);

export const checkAuthentication = createAsyncThunk(
  "auth/checkAuthentication",
  async (_, { rejectWithValue }) => {
    try {
      devLog(
        "Authslice dispatching checkAuthentication request to authService"
      );
      return await authService.checkAuthentication();
    } catch (error) {
      devError(
        "Authslice received error from authService on checkAuthentication:",
        error
      );
      return rejectWithValue(
        error instanceof APIError
          ? error.message
          : "Authentication check failed"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.refreshAttempted) {
      return rejectWithValue("Refresh token already attempted");
    }
    try {
      devLog("Authslice dispatching refreshToken request to authService");
      return await authService.refreshToken();
    } catch (error) {
      devError(
        "Authslice received error from authService on refreshToken:",
        error
      );
      return rejectWithValue(
        error instanceof APIError ? error.message : "Token refresh failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        devLog("Authslice handling login.pending state");
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        devLog("Authslice handling login.fulfilled state");
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshAttempted = false;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        devLog("Authslice handling login.rejected state");
        state.isAuthenticated = false;
        state.error = action.payload;
        state.refreshAttempted = false;
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        devLog("Authslice handling register.pending state");
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        devLog("Authslice handling register.fulfilled state");
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshAttempted = false;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        devLog("Authslice handling register.rejected state");
        state.isAuthenticated = false;
        state.error = action.payload;
        state.refreshAttempted = false;
        state.loading = false;
      })
      .addCase(checkAuthentication.pending, (state) => {
        devLog("Authslice handling checkAuthentication.pending state");
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthentication.fulfilled, (state, action) => {
        devLog("Authslice handling checkAuthentication.fulfilled state");
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshAttempted = false;
        state.loading = false;
      })
      .addCase(checkAuthentication.rejected, (state, action) => {
        devLog("Authslice handling checkAuthentication.rejected state");
        state.isAuthenticated = false;
        state.error = action.payload;
        state.refreshAttempted = false;
        state.loading = false;
      })
      .addCase(refreshToken.pending, (state) => {
        devLog("Authslice handling refreshToken.pending state");
        state.loading = true;
        state.refreshAttempted = false;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        devLog("Authslice handling refreshToken.fulfilled state");
        state.isAuthenticated = true;
        state.refreshAttempted = false;
        state.loading = false;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        devLog("Authslice handling refreshToken.rejected state");
        state.isAuthenticated = false;
        state.error = action.payload;
        state.refreshAttempted = true;
        state.loading = false;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
