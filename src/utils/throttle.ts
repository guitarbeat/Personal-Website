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
