import { useState } from "react";
import api from "../api/api";

// Hook to create JWT
export const useCreateJwt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createJwt = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await api.auth.jwtCreate({ username, password });
      return response.data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createJwt, loading, error };
};

// Hook to refresh JWT
export const useRefreshJwt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshJwt = async (refreshToken) => {
    setLoading(true);
    try {
      const response = await api.auth.jwtRefresh({ refresh: refreshToken });
      return response.data;
    } catch (err) {
      setError(err.message || "Token refresh failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { refreshJwt, loading, error };
};

// Hook to verify JWT
export const useVerifyJwt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyJwt = async (token) => {
    setLoading(true);
    try {
      await api.auth.jwtVerify({ token });
    } catch (err) {
      setError(err.message || "Token verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verifyJwt, loading, error };
};

// Hook to check if user is authenticated based on the JWT token
export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      // Use apiClient to make a request to a protected endpoint
      await api.auth.verifyJwt();
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, loading, error };
};

// Hook to register a new user
export const useRegister = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to register a new user
  const registerUser = async (data) => {
    setLoading(true);
    try {
      const res = await api.register.create(data);
      return res.data; // Assuming the response contains user data or confirmation
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    error,
    loading,
  };
};

// Hook to handle user logout
export const useLogout = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      const res = await api.logout.create(); // POST /logout/
      setResponse(res.data);
      // Optionally handle any additional cleanup after logout
      // e.g., clear user data from local storage
      localStorage.removeItem("authToken");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, logout };
};
