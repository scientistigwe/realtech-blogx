import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./../features/auth/authSlice";
import notificationReducer from "../features/notifications/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
  },
});

export default store;
