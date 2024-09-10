import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";

// accountHandlers.js

const accountHandlers = {
  updateAccount: async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await api.put(apiEndpoints.deleteAccount.updateAccount, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === "Account information updated successfully") {
        alert("Account updated successfully");
        form.reset();
        // Optionally, update the UI or redirect here
      } else {
        alert("Error: " + JSON.stringify(result));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  },

  getCookie: (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },
};

export default accountHandlers;
