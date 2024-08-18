// Selectors
export const selectUserState = (state) => state.user;

export const selectUserProfile = (state) => state.user.profile;

export const selectUserProfilePicture = (state) => state.user.profilePicture;

export const selectUserLoading = (state) => state.user.loading;

export const selectUserError = (state) => state.user.error;
