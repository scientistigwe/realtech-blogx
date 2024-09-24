import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUsers,
  fetchCurrentUser,
  fetchAdminStatus,
  fetchUserById,
  updateUser,
  partialUpdateUser,
  deleteUser,
} from "./usersThunk";

const initialState = {
  users: [],
  currentUser: null,
  adminStatus: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setAdminStatus: (state, action) => {
      state.adminStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Admin Status
      .addCase(fetchAdminStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.adminStatus = action.payload;
      })
      .addCase(fetchAdminStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        // You might want to store this separately if it's not the current user
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user if it's the current user
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Partial Update User
      .addCase(partialUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(partialUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user if it's the current user
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
      })
      .addCase(partialUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // If the deleted user is the current user, log them out
        if (state.currentUser && state.currentUser.id === action.payload) {
          return initialState;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUsers, setCurrentUser, setAdminStatus } = usersSlice.actions;

export default usersSlice.reducer;

export const selectUsersState = (state) => ({
  users: state.users,
  currentUser: state.currentUser,
  adminStatus: state.adminStatus,
  loading: state.loading,
  error: state.error,
});
