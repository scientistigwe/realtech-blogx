// Utility functions
const getElementValue = (id) => document.getElementById(id).value;
const setElementText = (id, text) => {
  const element = document.getElementById(id);
  if (element) element.innerText = text;
};

const handleFormSubmit = async (event, action, successMessage) => {
  event.preventDefault();
  try {
    await action();
    setElementText("result", successMessage);
  } catch (error) {
    setElementText(
      "result",
      `Error: ${error.message || "An unexpected error occurred."}`
    );
    console.error("Error:", error);
  }
};

// User account operations
const changePassword = () =>
  handleFormSubmit(
    event,
    async () => {
      const oldPassword = getElementValue("oldPassword");
      const newPassword = getElementValue("newPassword");
      await useChangePassword({ oldPassword, newPassword });
    },
    "Password changed successfully!"
  );

const confirmPasswordReset = () =>
  handleFormSubmit(
    event,
    async () => {
      const resetToken = getElementValue("resetToken");
      const newPassword = getElementValue("newPassword");
      await useConfirmPasswordReset({ resetToken, newPassword });
    },
    "Password reset confirmed!"
  );

const login = () =>
  handleFormSubmit(
    event,
    async () => {
      const username = getElementValue("id_username");
      const password = getElementValue("id_password");
      await useCreateJwt(username, password);
      window.location.href = "/dashboard/";
    },
    "Login successful!"
  );

const register = async () => {
  const form = document.getElementById("registerForm");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const result = await useRegister(data);
    setElementText(
      "messages",
      '<div class="alert alert-success">Registration successful! Redirecting to your profile...</div>'
    );
    setTimeout(
      () => (window.location.href = `/profile/${result.user_id}/`),
      3000
    );
  } catch (error) {
    setElementText(
      "messages",
      `<div class="alert alert-danger">${
        error.message || "Registration failed. Please try again."
      }</div>`
    );
    console.error("Error during registration:", error);
  }
};

const requestPasswordReset = () =>
  handleFormSubmit(
    event,
    async () => {
      const email = getElementValue("email");
      await useRequestPasswordReset({ email });
    },
    "Password reset request sent!"
  );

const updateAccount = () =>
  handleFormSubmit(
    event,
    async () => {
      const data = {
        username: getElementValue("username"),
        email: getElementValue("email"),
        first_name: getElementValue("first_name"),
        last_name: getElementValue("last_name"),
        bio: getElementValue("bio"),
        website: getElementValue("website"),
        location: getElementValue("location"),
      };
      await useUpdateAccount(data);
    },
    "Account updated successfully!"
  );

// Event listeners
const addFormListener = (formId, handler) => {
  const form = document.getElementById(formId);
  if (form) form.addEventListener("submit", handler);
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  addFormListener("change-password-form", changePassword);
  addFormListener("confirm-reset-form", confirmPasswordReset);
  addFormListener("loginForm", login);
  addFormListener("registerForm", (e) => {
    e.preventDefault();
    register();
  });
  addFormListener("request-reset-form", requestPasswordReset);
  addFormListener("update-account-form", updateAccount);

  // Special case for register button
  const registerButton = document.getElementById("registerButton");
  if (registerButton) registerButton.addEventListener("click", register);
});
