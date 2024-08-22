console.log("AuthStatus starting...");

// Initialize state for authentication status
let isAuthenticated = false;
let tokenExpirationTime = 0;

// Function to set authentication status and expiration time
export const setAuthStatus = (status, expirationTime) => {
  isAuthenticated = status;
  tokenExpirationTime = expirationTime;
  console.log(`Auth status set: ${status}, expires at: ${expirationTime}`);
};

// Function to get the current authentication status
export const getAuthStatus = () => {
  // Check if the current time is less than the token expiration time
  return isAuthenticated && Date.now() < tokenExpirationTime;
};

// Function to clear authentication status
export const clearAuthStatus = () => {
  isAuthenticated = false;
  tokenExpirationTime = 0;
  console.log("Auth status cleared");
};
