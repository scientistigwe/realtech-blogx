import { apiEndpoints } from "./apiEndpoints";
import { api } from "./apiUtils";

// Function to change password
export const changePassword = async (data) => {
  try {
    const res = await api.put(apiEndpoints.passwordChange, data);
    return res;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Function to request password reset
export const requestPasswordReset = async (data) => {
  try {
    const res = await api.post(apiEndpoints.passwordReset, data);
    return res;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

// Function to confirm password reset
export const confirmPasswordReset = async (data) => {
  try {
    const res = await api.post(apiEndpoints.passwordResetConfirm, data);
    return res;
  } catch (error) {
    console.error("Error confirming password reset:", error);
    throw error;
  }
};

// Function to update account
export const updateAccount = async (data) => {
  try {
    const res = await api.put(apiEndpoints.updateAccount, data);
    return res;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};
