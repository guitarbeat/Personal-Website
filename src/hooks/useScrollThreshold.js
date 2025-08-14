import { useEffect, useState } from "react";

/**
 * Custom hook to detect when page scroll exceeds a threshold
 * @param {number} threshold - Scroll threshold in pixels (default: 300)
 * @param {number} throttleMs - Throttle time in milliseconds (default: 100)
 * @returns {boolean} - True if scroll position is above threshold
 */
export const useScrollThreshold = (threshold = 300, throttleMs = 100) => {
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setIsAboveThreshold(window.scrollY > threshold);
    };

    // Check initial scroll position
    checkScroll();

    let timeoutId = null;
    const throttledCheckScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          checkScroll();
          timeoutId = null;
        }, throttleMs);
      }
    };

    window.addEventListener("scroll", throttledCheckScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledCheckScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, throttleMs]);

  return isAboveThreshold;
};

/**
 * Custom hook to get current scroll position
 * @param {number} throttleMs - Throttle time in milliseconds (default: 16)
 * @returns {number} - Current scroll position in pixels
 */
export const useScrollPosition = (throttleMs = 16) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let timeoutId = null;

    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY);
    };

    const throttledUpdateScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          updateScrollPosition();
          timeoutId = null;
        }, throttleMs);
      }
    };

    // Set initial position
    updateScrollPosition();

    window.addEventListener("scroll", throttledUpdateScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledUpdateScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [throttleMs]);

  return scrollPosition;
};
