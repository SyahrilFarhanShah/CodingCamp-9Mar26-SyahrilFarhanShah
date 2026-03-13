/**
 * Storage Module
 * Provides Local Storage with automatic fallback to in-memory storage
 * 
 * **Validates: Requirements 3.3, 3.8, 4.3, 4.7, 8.1**
 */

function createStorage() {
  let storageAvailable = false;
  let errorMessage = null;
  const memoryStorage = new Map();

  // Test if Local Storage is available
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch (e) {
    storageAvailable = false;
    if (e.name === 'QuotaExceededError') {
      errorMessage = 'Storage quota exceeded. Your data will not persist across sessions.';
    } else {
      errorMessage = 'Storage unavailable. Your data will not persist across sessions.';
    }
    console.warn('Local Storage unavailable, using in-memory fallback:', e);
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @returns {any|null} Parsed value or null if not found
   */
  function get(key) {
    try {
      if (storageAvailable) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } else {
        return memoryStorage.has(key) ? memoryStorage.get(key) : null;
      }
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON serialized)
   * @returns {boolean} True if successful
   */
  function set(key, value) {
    try {
      if (storageAvailable) {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } else {
        memoryStorage.set(key, value);
        return true;
      }
    } catch (e) {
      console.error('Error writing to storage:', e);
      if (e.name === 'QuotaExceededError') {
        // Switch to memory storage on quota exceeded
        storageAvailable = false;
        errorMessage = 'Storage quota exceeded. Switching to in-memory storage.';
        memoryStorage.set(key, value);
        return true;
      }
      return false;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  function remove(key) {
    try {
      if (storageAvailable) {
        localStorage.removeItem(key);
      } else {
        memoryStorage.delete(key);
      }
    } catch (e) {
      console.error('Error removing from storage:', e);
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean} True if Local Storage is available
   */
  function isAvailable() {
    return storageAvailable;
  }

  /**
   * Get error message if storage failed
   * @returns {string|null} Error message or null
   */
  function getError() {
    return errorMessage;
  }

  return {
    get,
    set,
    remove,
    isAvailable,
    getError
  };
}


