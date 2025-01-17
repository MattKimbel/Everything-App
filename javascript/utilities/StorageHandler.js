/**
 * StorageHandler.js
 * Utility for managing localStorage and sessionStorage.
 */

class StorageHandler {
  /**
   * Sets an item in storage.
   * @param {string} key - The storage key.
   * @param {any} value - The value to store.
   * @param {boolean} [isSessionStorage=false] - Use sessionStorage if true; otherwise, use localStorage.
   */
  static setItem(key, value, isSessionStorage = false) {
    const storage = isSessionStorage ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieves an item from storage.
   * @param {string} key - The storage key.
   * @param {boolean} [isSessionStorage=false] - Use sessionStorage if true; otherwise, use localStorage.
   * @returns {any} - The retrieved value, or null if the key does not exist.
   */
  static getItem(key, isSessionStorage = false) {
    const storage = isSessionStorage ? sessionStorage : localStorage;
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Removes an item from storage.
   * @param {string} key - The storage key.
   * @param {boolean} [isSessionStorage=false] - Use sessionStorage if true; otherwise, use localStorage.
   */
  static removeItem(key, isSessionStorage = false) {
    const storage = isSessionStorage ? sessionStorage : localStorage;
    storage.removeItem(key);
  }
}

export default StorageHandler;
