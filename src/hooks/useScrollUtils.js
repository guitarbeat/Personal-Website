import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook to create a throttled scroll event handler
 * @param {Function} callback - Function to call on scroll
 * @param {number} throttleMs - Throttle time in milliseconds
 * @returns {Function} - Throttled scroll handler
 */
const useThrottledScroll = (callback, throttleMs = 16) => {
  const throttledCallback = useCallback(() => {
    let timeoutId = null;
    
    return () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          callback();
          timeoutId = null;
        }, throttleMs);
      }
    };
  }, [callback, throttleMs]);

  return throttledCallback;
};

/**
 * Custom hook to detect when page scroll exceeds a threshold
 * @param {number} threshold - Scroll threshold in pixels (default: 300)
 * @param {number} throttleMs - Throttle time in milliseconds (default: 100)
 * @returns {boolean} - True if scroll position is above threshold
 */
export const useScrollThreshold = (threshold = 300, throttleMs = 100) => {
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);

  const checkScroll = useCallback(() => {
    setIsAboveThreshold(window.scrollY > threshold);
  }, [threshold]);

  const throttledCheckScroll = useThrottledScroll(checkScroll, throttleMs);

  useEffect(() => {
    // Check initial scroll position
    checkScroll();

    const scrollHandler = throttledCheckScroll();
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [checkScroll, throttledCheckScroll]);

  return isAboveThreshold;
};

/**
 * Custom hook to get current scroll position
 * @param {number} throttleMs - Throttle time in milliseconds (default: 16)
 * @returns {number} - Current scroll position in pixels
 */
export const useScrollPosition = (throttleMs = 16) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const updateScrollPosition = useCallback(() => {
    setScrollPosition(window.scrollY);
  }, []);

  const throttledUpdateScroll = useThrottledScroll(updateScrollPosition, throttleMs);

  useEffect(() => {
    // Set initial position
    updateScrollPosition();

    const scrollHandler = throttledUpdateScroll();
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [updateScrollPosition, throttledUpdateScroll]);

  return scrollPosition;
};