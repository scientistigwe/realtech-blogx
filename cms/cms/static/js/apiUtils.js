// Default headers
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Function to get the CSRF token from a meta tag
const getCsrfToken = () => {
  const tokenElement = document.querySelector('meta[name="csrf-token"]');
  return tokenElement ? tokenElement.getAttribute("content") : null;
};

// Function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `HTTP error! status: ${response.status}`;
    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
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
        ...DEFAULT_HEADERS,
        ...options.headers,
        "X-CSRFToken": csrfToken,
      };
    } else {
      options.headers = {
        ...DEFAULT_HEADERS,
        ...options.headers,
      };
    }

    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    console.error("API Error:", error.message);
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
      body: JSON.stringify(data),
    }),
  put: (url, data) =>
    fetchData(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: (url, data) =>
    fetchData(url, {
      method: "PATCH",
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
      // Custom message handling here, e.g., showing an error message to the user
      throw error;
    }
  },
  post: async (url, data) => {
    try {
      const response = await api.post(url, data);
      console.log("POST request successful:", response);
      return response;
    } catch (error) {
      console.error("POST request failed:", error.message);
      // Custom message handling here
      throw error;
    }
  },
  put: async (url, data) => {
    try {
      const response = await api.put(url, data);
      console.log("PUT request successful:", response);
      return response;
    } catch (error) {
      console.error("PUT request failed:", error.message);
      // Custom message handling here
      throw error;
    }
  },
  patch: async (url, data) => {
    try {
      const response = await api.patch(url, data);
      console.log("PATCH request successful:", response);
      return response;
    } catch (error) {
      console.error("PATCH request failed:", error.message);
      // Custom message handling here
      throw error;
    }
  },
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      console.log("DELETE request successful:", response);
      return response;
    } catch (error) {
      console.error("DELETE request failed:", error.message);
      // Custom message handling here
      throw error;
    }
  },
};
