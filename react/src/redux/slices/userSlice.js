import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserProfile as apiFetchUserProfile,
  fetchCurrentUserProfile as apiFetchCurrentUserProfile,
  updateUserProfile as apiUpdateUserProfile,
  deleteUserAccount as apiDeleteUserAccount,
  uploadProfilePicture as apiUploadProfilePicture,
} from "../../api/users";

const initialState = {
  profile: null,
  profilePicture: null,
  loading: false,
  error: null,
};

// Thunks for user operations
export const fetchCurrentUserProfile = createAsyncThunk(
  "user/fetchCurrentUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFetchCurrentUserProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiFetchUserProfile(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateUserProfile(id, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "user/deleteUserAccount",
  async (id, { rejectWithValue }) => {
    try {
      await apiDeleteUserAccount(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadUserProfilePicture = createAsyncThunk(
  "user/uploadUserProfilePicture",
  async (file, { rejectWithValue }) => {
    try {
      const response = await apiUploadProfilePicture(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    clearUserState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.profile = null;
        state.profilePicture = null;
        state.loading = false;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadUserProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserProfilePicture.fulfilled, (state, action) => {
        state.profilePicture = action.payload;
        state.loading = false;
      })
      .addCase(uploadUserProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setProfilePicture, clearUserState } =
  userSlice.actions;
export default userSlice.reducer;
