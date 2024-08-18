import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNotifications as apiFetchNotifications,
  markNotificationAsRead as apiMarkNotificationAsRead,
  createNotification as apiCreateNotification,
} from "../../api/notifications"; // Adjust the import path as needed

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Thunks for async actions
export const fetchNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetchNotifications();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      const data = await apiMarkNotificationAsRead(notificationId);
      return { id: notificationId, ...data }; // Include ID for updating state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNotification = createAsyncThunk(
  "notifications/createNotification",
  async (notificationData, { rejectWithValue }) => {
    try {
      const data = await apiCreateNotification(notificationData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(readNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (notification) => notification.id === action.payload.id
        );
        if (index !== -1) {
          state.notifications[index] = action.payload; // Update the notification as read
        }
        state.loading = false;
      })
      .addCase(readNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.push(action.payload); // Add the new notification to the list
        state.loading = false;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
