/**
 * @file store.js
 * @description Configures and exports the Redux store, combining all slices (reducers) into a single store.
 *
 * @relation - Combines reducers from various slices like `authSlice.js`, `postsSlice.js`, etc.
 * - The resulting store is used throughout the application for state management.
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postsSlice";
import userReducer from "./slices/userSlice";
import authorsReducer from "./slices/authorsSlice";
import commentsReducer from "./slices/commentsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import tagsReducer from "./slices/tagSlice";
import searchReducer from "./slices/searchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    user: userReducer,
    authors: authorsReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    tags: tagsReducer,
    search: searchReducer,
  },
});

export default store;
