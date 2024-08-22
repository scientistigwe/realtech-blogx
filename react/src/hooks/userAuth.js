import { useState, useEffect } from "react";
import api from "./../api/apiClient"; // Adjust the import path as necessary

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await api.auth.refreshToken(); // This will verify if the user is authenticated
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async ({ username, password }) => {
    setLoading(true);
    setError(null);

    try {
      await api.auth.login({ username, password });
      setIsAuthenticated(true);
      setMessage("Login successful.");
      return { username }; // Return user data if needed
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData, profilePicture, isAuthor) => {
    setLoading(true);
    setError(null);
    setMessage("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formDataToSend.append(key, value);
        }
      });
      formDataToSend.append("is_author", isAuthor);
      if (isAuthor) {
        formDataToSend.append("facebook_profile", formData.facebook || "");
        formDataToSend.append("twitter_handle", formData.twitter || "");
        formDataToSend.append("linkedin_profile", formData.linkedin || "");
      }
      if (profilePicture) {
        formDataToSend.append(
          "profile_picture",
          profilePicture,
          profilePicture.name
        );
      }

      await api.auth.register(formDataToSend);
      setMessage("Registration successful.");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.auth.logout();
      setIsAuthenticated(false);
      setMessage("Logout successful.");
    } catch (err) {
      setError(err.message || "Logout failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, loading, error, message, login, register, logout };
};

export default useAuth;
