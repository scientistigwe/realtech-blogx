// Throttle Utility
let lastRequestTime = 0;

/**
 * Throttles a request to ensure it only occurs once within the defined interval.
 * @param {number} [interval=1000] - The throttle interval in milliseconds (default: 1 second).
 * @returns {Promise} - Resolves when the request is allowed to proceed.
 */
export const throttleRequest = (interval = 1000) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < interval) {
    return new Promise((resolve) =>
      setTimeout(() => {
        lastRequestTime = Date.now();
        resolve();
      }, interval - timeSinceLastRequest)
    );
  }

  lastRequestTime = now;
  return Promise.resolve();
};
