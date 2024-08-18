import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  checkAuthentication,
  login as loginAction,
  logout as logoutAction,
  register as registerAction,
} from "../redux/slices/authSlice";
import { apiEndpoints } from "../api/apiEndpoints";
import { needsAuthentication, initializeApi } from "../api/apiConfig";
import apiClientBase from "../api/apiClientBase";
import {
  setAuthStatus,
  clearAuthStatus,
  getAuthStatus,
} from "../api/authStatus";
import { APIError } from "../api/apiInterceptor";

export const AuthContext = React.createContext();

const api = apiClientBase();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  const checkAuthStatus = async () => {
    try {
      await dispatch(checkAuthentication());
      if (isAuthenticated) {
        setAuthStatus(true, Date.now() + 3600000);
      } else {
        clearAuthStatus();
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }
  };

  const apiCall = async (url, options = {}) => {
    try {
      if (needsAuthentication(url) && !getAuthStatus()) {
        await checkAuthStatus();
        if (!getAuthStatus()) {
          throw new APIError(
            "Session expired or invalid token. Please log in again.",
            401
          );
        }
      }
      const response = await api(url, { ...options });
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        console.error("API call error:", error.message);
      } else {
        console.error("API call error:", error);
      }
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const result = await dispatch(loginAction(credentials)).unwrap();
      setAuthStatus(true, Date.now() + 3600000);
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      clearAuthStatus();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const result = await dispatch(registerAction(formData)).unwrap();
      setAuthStatus(true, Date.now() + 3600000);
      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    try {
      if (!user?.id) {
        throw new APIError("User ID is required to fetch profile.", 400);
      }
      return await apiCall(apiEndpoints.users.profile(user.id));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (!user?.id) {
        throw new APIError("User ID is required to update profile.", 400);
      }
      return await apiCall(apiEndpoints.users.updateProfile(user.id), {
        method: "PUT",
        data: profileData,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const postOperations = {
    fetchPosts: () => apiCall(apiEndpoints.posts.fetchAll),
    fetchPostById: (postId) => apiCall(apiEndpoints.posts.fetchById(postId)),
    createPost: (postData) =>
      apiCall(apiEndpoints.posts.create, {
        method: "POST",
        data: postData,
      }),
    updatePost: (postId, postData) =>
      apiCall(apiEndpoints.posts.update(postId), {
        method: "PUT",
        data: postData,
      }),
    deletePost: (postId) =>
      apiCall(apiEndpoints.posts.delete(postId), { method: "DELETE" }),
  };

  const value = {
    isAuthenticated,
    user,
    apiCall,
    login,
    logout,
    register,
    fetchUserProfile,
    updateUserProfile,
    checkAuthStatus,
    ...postOperations,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
