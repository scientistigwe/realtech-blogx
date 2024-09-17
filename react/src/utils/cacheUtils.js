// Cache Utilities
const cache = new Map();

/**
 * Get value from cache.
 * @param {string} key - The cache key.
 * @returns {*} - The cached value or undefined if not present.
 */
const getFromCache = (key) => cache.get(key)?.value;

/**
 * Set value to cache with a timestamp.
 * @param {string} key - The cache key.
 * @param {*} value - The value to cache.
 */
const setToCache = (key, value) => {
  cache.set(key, { value, timestamp: Date.now() });
};

/**
 * Check if cache for the given key is still valid based on the provided max age.
 * @param {string} key - The cache key.
 * @param {number} [maxAge=300000] - Maximum age for cache validity in milliseconds (default: 5 minutes).
 * @returns {boolean} - True if the cache is valid, otherwise false.
 */
const isCacheValid = (key, maxAge = 5 * 60 * 1000) => {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < maxAge;
};

/**
 * Clear the cache for the given key.
 * @param {string} key - The cache key.
 */
const clearCache = (key) => {
  cache.delete(key);
};

export { getFromCache, setToCache, isCacheValid, clearCache };
