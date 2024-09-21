import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuth,
  fetchUserProfile,
  updateUserProfile,
  resetPassword,
  confirmResetPassword,
  resetUsername,
  confirmResetUsername,
  setPassword,
  setUsername,
  getUserProfileById,
  updateUserById,
  partialUpdateUserById,
  deleteUserById,
} from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  authToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.authToken = action.payload.authToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens: (state) => {
      state.authToken = null;
      state.refreshToken = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authToken = action.payload.authToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authToken = action.payload.authToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        return initialState;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authToken = action.payload.authToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(checkAuth.rejected, (state) => {
        return initialState;
      })

      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Confirm Reset Password
      .addCase(confirmResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Username
      .addCase(resetUsername.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetUsername.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Confirm Reset Username
      .addCase(confirmResetUsername.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmResetUsername.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmResetUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Set Password
      .addCase(setPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Set Username
      .addCase(setUsername.pending, (state) => {
        state.loading = true;
      })
      .addCase(setUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, username: action.payload.username };
      })
      .addCase(setUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Profile By ID
      .addCase(getUserProfileById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfileById.fulfilled, (state, action) => {
        state.loading = false;
        // You might want to store this separately if it's not the current user
      })
      .addCase(getUserProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User By ID
      .addCase(updateUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user if it's the current user
        if (state.user && state.user.id === action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Partial Update User By ID
      .addCase(partialUpdateUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(partialUpdateUserById.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user if it's the current user
        if (state.user && state.user.id === action.payload.id) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(partialUpdateUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User By ID
      .addCase(deleteUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.loading = false;
        // If the deleted user is the current user, log them out
        if (state.user && state.user.id === action.payload) {
          return initialState;
        }
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTokens, clearTokens, clearError } = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state) => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  error: state.auth.error,
});

export const selectTokens = (state) => ({
  authToken: state.auth.authToken,
  refreshToken: state.auth.refreshToken,
});
