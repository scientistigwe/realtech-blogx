import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { authService } from "../services/authService";
import { usersService } from "../services/usersService";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authResponse = await authService.checkAuth();
        if (authResponse.isAuthenticated) {
          const userProfile = await usersService.getCurrentUserProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const { token } = await authService.login(
        credentials.username,
        credentials.password
      );
      Cookies.set("token", token, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      }); // Store token in cookie
      setIsAuthenticated(true);
      const userProfile = await usersService.getCurrentUserProfile();
      setUser(userProfile);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      Cookies.remove("token"); // Remove token from cookie
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
