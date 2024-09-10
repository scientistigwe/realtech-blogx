/**
 * Get a DOM element by its ID.
 * @param {string} id - The ID of the element.
 * @returns {HTMLElement | null} - The DOM element or null if not found.
 */
export const getElementById = (id) => document.getElementById(id);

/**
 * Set the innerHTML of a DOM element.
 * @param {string} id - The ID of the element.
 * @param {string} html - The HTML to set.
 */
export const setElementHTML = (id, html) => {
  const element = getElementById(id);
  if (element) element.innerHTML = html;
};

/**
 * Get the value of a DOM element.
 * @param {string} id - The ID of the element.
 * @returns {string} - The value of the element.
 */
export const getElementValue = (id) => {
  const element = getElementById(id);
  return element ? element.value : "";
};

/**
 * Handle API requests and show alerts based on the result.
 * @param {function} apiCall - The API call function.
 * @param {string} successMessage - The message to show on success.
 * @returns {Promise<any>} - The result of the API call.
 */
export const handleApiRequest = async (apiCall, successMessage) => {
  try {
    const response = await apiCall();
    const result = await response.json();
    if (response.ok) {
      alert(successMessage);
      return result;
    } else {
      throw new Error(result.error || "An unexpected error occurred");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error("API Error:", error);
  }
};
