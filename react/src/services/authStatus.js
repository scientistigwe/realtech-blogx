/**
 * @file authStatus.js
 * @description Manages the authentication status and token expiration logic in memory.
 * This is used to check and update the authentication status independently of Redux.
 *
 * @relation - Used by `authService.js` to manage authentication status without involving Redux directly.
 */

let isAuthenticated = false;
let tokenExpirationTime = 0;

export const setAuthStatus = (status, expirationTime) => {
  console.log("Setting auth status:", { status, expirationTime });
  isAuthenticated = status;
  tokenExpirationTime = expirationTime;
};

export const getAuthStatus = () => {
  const status = isAuthenticated && Date.now() < tokenExpirationTime;
  console.log("Getting auth status:", status);
  return status;
};

export const clearAuthStatus = () => {
  console.log("Clearing auth status.");
  isAuthenticated = false;
  tokenExpirationTime = 0;
};
