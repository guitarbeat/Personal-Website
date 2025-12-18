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
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generate a random number between min and max (exclusive of max)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number
 */
export const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

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
export const cn = (
  baseClass: string,
  ...classes: (string | boolean | undefined | null)[]
): string => {
  const validClasses = classes.filter(
    (cls): cls is string => !!(cls && typeof cls === "string" && cls.trim()),
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
export const isAboveBreakpoint = (breakpoint: number): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth > breakpoint;
};

/**
 * Get window dimensions
 * @returns {{width: number, height: number}} - Window dimensions
 */
export const getWindowDimensions = (): { width: number; height: number } => {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Throttle function to limit execution frequency
 * Works for both JavaScript and TypeScript contexts
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @returns The throttled function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
) => {
  let inThrottle: boolean = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Alternative throttle implementation with leading and trailing options
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @param options - Configuration options
 * @param options.leading - Execute on the leading edge (default: true)
 * @param options.trailing - Execute on the trailing edge (default: true)
 * @returns The throttled function
 */
type ThrottleOptions = { leading?: boolean; trailing?: boolean };

export const throttleAdvanced = (
  func: (...args: unknown[]) => unknown,
  limit: number,
  options: ThrottleOptions = { leading: true, trailing: true },
): ((...args: unknown[]) => unknown) & { cancel: () => void } => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  let result: unknown;

  const later = (callArgs: unknown[]) => {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func(...callArgs);
  };

  const throttled = (...args: unknown[]) => {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = limit - (now - previous);

    if (remaining <= 0 || remaining > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func(...args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => later(args), remaining);
    }

    return result;
  };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    previous = 0;
  };

  return throttled;
};

// Legacy alias for backward compatibility
export const throttleTS = throttle;

/**
 * Create a timeout with a clear function
 * @param callback - Function to execute
 * @param time - Delay in milliseconds
 * @returns Function to clear the timeout
 */
export function createTimeout(callback: () => void, time: number) {
  const timeout = setTimeout(callback, time);

  return function clear() {
    clearTimeout(timeout);
  };
}

const DEFAULT_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomCharFromAlphabet(alphabet: string): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

/**
 * Generate a random ID string
 * @param idDesiredLength - Length of ID (default: 5)
 * @param alphabet - Characters to use (default: alphanumeric)
 * @returns Random ID string
 */
export function generateId(
  idDesiredLength = 5,
  alphabet = DEFAULT_ALPHABET,
): string {
  return Array.from({ length: idDesiredLength })
    .map(() => {
      return getRandomCharFromAlphabet(alphabet);
    })
    .join("");
}

export interface Point {
  x: number;
  y: number;
}

export function copyPoint(point: Point): Point {
  return {
    ...point,
  };
}

export function subtractPoints(a: Point, b: Point): Point {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}
