import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";

const authHandlers = {
  // Change password
  changePassword: async ({ oldPassword, newPassword }) => {
    return handleApiRequest(apiEndpoints.passwordChange.changePassword, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  // Confirm password reset
  confirmPasswordReset: async ({ resetToken, newPassword }) => {
    return handleApiRequest(apiEndpoints.passwordResetConfirm.confirmReset, {
      token: resetToken,
      password: newPassword,
    });
  },

  // Login
  login: async (username, password) => {
    const response = await handleApiRequest(apiEndpoints.auth.jwtCreate, {
      username,
      password,
    });
    localStorage.setItem("authToken", response.token);
    return response;
  },

  // Register a new user
  register: async (data) => {
    return handleApiRequest(apiEndpoints.register.create, data);
  },

  // Request password reset
  requestPasswordReset: async ({ email }) => {
    return handleApiRequest(apiEndpoints.passwordReset.requestReset, { email });
  },

  // Update account details
  updateAccount: async (data) => {
    return handleApiRequest(apiEndpoints.deleteAccount.updateAccount, data);
  },

  // Logout
  logout: async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    const response = await fetch(apiEndpoints.logout.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ refresh_token }),
    });

    const data = await response.json();
    if (data.detail === "Successfully logged out.") {
      window.location.href = "{% url 'homepage' %}";
    } else {
      console.error("Logout failed:", data);
    }
  },
};

// Common function to handle API requests
async function handleApiRequest(url, data, method = "POST") {
  try {
    const response = await api({
      method: method,
      url: url,
      data: data,
    });
    return response;
  } catch (error) {
    console.error(error.message || "Request failed");
    throw error;
  }
}

// Function to get the CSRF token from cookies for Django CSRF protection
function getCookie(name) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default authHandlers;
