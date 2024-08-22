/**
 * @file apiError.js
 * @description Defines a custom error class for API-related errors.
 * This class extends the built-in Error class to include additional details about API errors.
 */

export class APIError extends Error {
  /**
   * Creates an instance of APIError.
   * @param {string} message - Error message.
   * @param {number} [status] - HTTP status code associated with the error.
   * @param {Error} [originalError] - The original error object, if available.
   */
  constructor(message, status = null, originalError = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.originalError = originalError;
    this.isAPIError = true; // Custom property to identify API errors

    // Maintain proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
