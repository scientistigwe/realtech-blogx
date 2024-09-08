document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("updateAccountForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch("/api/account/update/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "Account information updated successfully") {
          alert("Account updated successfully");
          // Optionally, you could redirect or update the UI
        } else {
          alert("Error: " + JSON.stringify(result));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  function getCookie(name) {
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
  }
});
