/**
 * HTTPRequestHandler.js
 * Utility for performing HTTP requests using the Fetch API.
 */

class HTTPRequestHandler {
  /**
   * Sends a GET request.
   * @param {string} url - The API endpoint.
   * @param {object} [headers={}] - Optional headers.
   * @returns {Promise<object>} - The JSON response or an error object.
   */
  static async get(url, headers = {}) {
    try {
      const response = await fetch(url, { method: "GET", headers });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Sends a POST request.
   * @param {string} url - The API endpoint.
   * @param {object} data - The request body.
   * @param {object} [headers={}] - Optional headers.
   * @returns {Promise<object>} - The JSON response or an error object.
   */
  static async post(url, data, headers = {}) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Sends a PUT request.
   * @param {string} url - The API endpoint.
   * @param {object} data - The request body.
   * @param {object} [headers={}] - Optional headers.
   * @returns {Promise<object>} - The JSON response or an error object.
   */
  static async put(url, data, headers = {}) {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default HTTPRequestHandler;
