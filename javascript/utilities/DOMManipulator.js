/**
 * DOMManipulator.js
 * Utility for dynamic DOM manipulation.
 */

class DOMManipulator {
  /**
   * Creates and returns a new DOM element.
   * @param {string} tagName - The type of element to create (e.g., 'div', 'span').
   * @param {object} [attributes={}] - Attributes to set on the element.
   * @param {string} [innerHTML=""] - Inner HTML content for the element.
   * @returns {HTMLElement} - The created element.
   */
  static createElement(tagName, attributes = {}, innerHTML = "") {
    const element = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    element.innerHTML = innerHTML;
    return element;
  }

  /**
   * Adds an event listener to a DOM element.
   * @param {HTMLElement} element - The target element.
   * @param {string} event - The event type (e.g., 'click').
   * @param {Function} callback - The event handler function.
   */
  static addEventListener(element, event, callback) {
    element.addEventListener(event, callback);
  }

  /**
   * Updates the styles of a DOM element.
   * @param {HTMLElement} element - The target element.
   * @param {object} styles - An object containing CSS properties and values.
   */
  static updateStyles(element, styles) {
    Object.assign(element.style, styles);
  }
}

export default DOMManipulator;
