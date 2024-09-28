import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
import authReducer from "./auth/authSlice";
import categoryReducer from "./category/categorySlice";
import usersReducer from "./user/usersSlice";
import tagReducer from "./tag/tagSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  posts: postReducer,
  auth: authReducer,
  categories: categoryReducer,
  users: usersReducer,
  tags: tagReducer, // Make sure this line is present
});

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
