import { useState } from "react";

/**
 * Custom hook to manage form state.
 * @param {Object} initialState - The initial state of the form.
 * @returns {Object} - Contains form data, setters, and handlers for form inputs.
 */
export const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  /**
   * Handles changes in form inputs.
   * @param {Event} e - The change event.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Resets the form data to its initial state.
   */
  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
  };
};
