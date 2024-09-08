import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to create JWT
export const useCreateJwt = async (username, password) => {
  try {
    const response = await api.auth.jwtCreate({ username, password });
    return response.data;
  } catch (err) {
    console.error(err.message || "Login failed");
    throw err;
  }
};

// Function to refresh JWT
export const useRefreshJwt = async (refreshToken) => {
  try {
    const response = await api.auth.jwtRefresh({ refresh: refreshToken });
    return response.data;
  } catch (err) {
    console.error(err.message || "Token refresh failed");
    throw err;
  }
};

// Function to verify JWT
export const useVerifyJwt = async (token) => {
  try {
    await api.auth.jwtVerify({ token });
  } catch (err) {
    console.error(err.message || "Token verification failed");
    throw err;
  }
};

// Function to check if user is authenticated based on the JWT token
export const useIsAuthenticated = async () => {
  try {
    await api.auth.verifyJwt();
    return true;
  } catch (err) {
    console.error(err.message || "Verification failed");
    return false;
  }
};

// Function to register a new user
export const useRegister = async (data) => {
  try {
    const res = await api.register.create(data);
    return res.data;
  } catch (err) {
    console.error(err.message || "Registration failed");
    throw err;
  }
};

// Function to handle user logout
export const useLogout = async () => {
  try {
    const res = await api.logout.create(); // POST /logout/
    console.log("Logout successful", res.data);
    // Optionally handle any additional cleanup after logout
    localStorage.removeItem("authToken");
  } catch (err) {
    console.error(err.message || "Logout failed");
    throw err;
  }
};
