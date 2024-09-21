import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
import authReducer from "./auth/authSlice"; // Your auth slice

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only the auth state
};

// Combine reducers
const rootReducer = combineReducers({
  posts: postReducer,
  auth: authReducer,
  // Add other reducers here if needed
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);

export { store, persistor };
