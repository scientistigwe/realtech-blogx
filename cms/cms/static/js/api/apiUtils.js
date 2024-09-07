// Function to get the CSRF token from a meta tag
const getCsrfToken = () => {
  const tokenElement = document.querySelector('meta[name="csrf-token"]');
  return tokenElement ? tokenElement.getAttribute("content") : null;
};

// Function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Main fetch function with error handling
const fetchData = async (url, options = {}) => {
  try {
    const csrfToken = getCsrfToken();

    // Add CSRF token to headers if it exists
    if (csrfToken) {
      options.headers = {
        ...options.headers,
        "X-CSRFToken": csrfToken,
      };
    }

    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    console.error("API Error:", error);
    // You can add custom error handling here, e.g., showing a notification to the user
    throw error;
  }
};

// API object with methods for different HTTP requests
export const api = {
  get: (url) => fetchData(url, { method: "GET" }),
  post: (url, data) =>
    fetchData(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  put: (url, data) =>
    fetchData(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  patch: (url, data) =>
    fetchData(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (url) => fetchData(url, { method: "DELETE" }),
};

// Example usage of the api object with message handling
export const apiWithMessageHandling = {
  get: async (url) => {
    try {
      const data = await api.get(url);
      console.log("GET request successful:", data);
      return data;
    } catch (error) {
      console.error("GET request failed:", error.message);
      // You can add custom message handling here, e.g., showing an error message to the user
      throw error;
    }
  },
  // Implement similar message handling for post, put, patch, and delete methods
};
