// src/components/FormComponents.js

/**
 * A basic text input component with a label.
 * @param {Object} props - The props for the component.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.name - The name attribute for the input field.
 * @param {string} props.value - The value of the input field.
 * @param {function} props.onChange - Function to handle input changes.
 * @param {string} [props.type=text] - The type of the input field (e.g., text, email).
 * @param {string} [props.error] - Error message to display.
 * @param {Object} [props.props] - Additional props to pass to the input field.
 * @returns {JSX.Element} The rendered component.
 */

import PropTypes from "prop-types";
import React, { useRef, useEffect } from "react";
import Quill from "quill";
export const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error = "",
  ...props
}) => (
  <div className="form-group">
    <label htmlFor={name} aria-label={label}>
      {label}:
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      aria-required="true"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={`${name}-error`}
      {...props}
      className={`form-input ${error ? "input-error" : ""}`}
    />
    {error && (
      <div id={`${name}-error`} className="error-message" role="alert">
        {error}
      </div>
    )}
  </div>
);

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
};

// Password input component

/**
 * A password input component with a label.
 * @param {Object} props - The props for the component.
 * @param {string} props.label - The label for the password field.
 * @param {string} props.name - The name attribute for the password field.
 * @param {string} props.value - The value of the password field.
 * @param {function} props.onChange - Function to handle input changes.
 * @param {string} [props.error] - Error message to display.
 * @param {Object} [props.props] - Additional props to pass to the input field.
 * @returns {JSX.Element} The rendered component.
 */
export const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  error = "",
  ...props
}) => (
  <div className="form-group">
    <label htmlFor={name} aria-label={label}>
      {label}:
    </label>
    <input
      id={name}
      type="password"
      name={name}
      value={value}
      onChange={onChange}
      aria-required="true"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={`${name}-error`}
      {...props}
      className={`form-input ${error ? "input-error" : ""}`}
    />
    {error && (
      <div id={`${name}-error`} className="error-message" role="alert">
        {error}
      </div>
    )}
  </div>
);

PasswordInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

// Quill editor component
/**
 * A rich text editor component using Quill.
 * @param {Object} props - The props for the component.
 * @param {string} props.label - The label for the editor.
 * @param {string} props.value - The initial content for the editor.
 * @param {function} props.onChange - Function to handle content changes.
 * @returns {JSX.Element} The rendered component.
 */
export const QuillEditor = ({ label, value, onChange }) => {
  const quillRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      editorInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });

      // Set initial content
      editorInstance.current.root.innerHTML = value || "";

      // Handle content changes
      editorInstance.current.on("text-change", () => {
        onChange(editorInstance.current.root.innerHTML);
      });

      return () => {
        editorInstance.current.off("text-change");
      };
    }
  }, [onChange, value]);

  return (
    <div className="form-group">
      <label>{label}:</label>
      <div ref={quillRef} className="quill-editor" aria-label={label} />
    </div>
  );
};

QuillEditor.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
