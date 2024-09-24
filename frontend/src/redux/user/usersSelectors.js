import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./../store"; // Assuming you have a RootState type defined

// Create selectors
const selectUsers = (state: RootState) => state.users;
const selectCurrentUser = (state: RootState) => state.users.currentUser;
const selectAdminStatus = (state: RootState) => state.users.adminStatus;
const selectUsersLoading = (state: RootState) => state.users.loading;
const selectUsersError = (state: RootState) => state.users.error;

// Combine selectors
export const selectUsersState = createSelector(
  [
    selectUsers,
    selectCurrentUser,
    selectAdminStatus,
    selectUsersLoading,
    selectUsersError,
  ],
  (users, currentUser, adminStatus, loading, error) => ({
    users,
    currentUser,
    adminStatus,
    loading,
    error,
  })
);

// Additional selectors
export const selectUserById = (userId: string) =>
  createSelector([selectUsers], (users) =>
    users.find((user) => user.id === userId)
  );

export const selectUserByIdAndCurrentUser = createSelector(
  [selectUsers, selectCurrentUser],
  (users, currentUser) => users.find((user) => user.id === currentUser?.id)
);

// Selectors matching the pattern you provided
export const selectIsAdmin = (state: RootState) =>
  state.users.currentUser && state.users.currentUser.isAdmin;
