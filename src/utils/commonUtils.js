/**
 * Common utility functions following KISS and DRY principles
 */

/**
 * Clamp a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generate a random number between min and max (exclusive of max)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number
 */
export const randomFloat = (min, max) => Math.random() * (max - min) + min;

/**
 * Build className string from base class and conditional classes
 * Follows KISS principle - simple, readable className construction
 * @param {string} baseClass - Base CSS class name
 * @param {...(string|boolean|undefined|null)} classes - Conditional classes
 * @returns {string} - Combined className string
 * @example
 * cn("button", isActive && "active", isDisabled && "disabled")
 * // Returns: "button active" (if isActive is true and isDisabled is false)
 */
export const cn = (baseClass, ...classes) => {
  const validClasses = classes.filter(
    (cls) => cls && typeof cls === "string" && cls.trim(),
  );
  return validClasses.length > 0
    ? `${baseClass} ${validClasses.join(" ")}`.trim()
    : baseClass;
};

/**
 * Check if window width is above a breakpoint
 * @param {number} breakpoint - Breakpoint in pixels
 * @returns {boolean} - True if window width is above breakpoint
 */
export const isAboveBreakpoint = (breakpoint) => {
  if (typeof window === "undefined") return false;
  return window.innerWidth > breakpoint;
};

/**
 * Get window dimensions
 * @returns {{width: number, height: number}} - Window dimensions
 */
export const getWindowDimensions = () => {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
