import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if an element is visible in the viewport
 * @param {React.RefObject} ref - Reference to the element to observe
 * @param {Object} options - IntersectionObserver options
 * @returns {boolean} - Whether the element is visible
 */
export const useVisibilityObserver = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const element = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);

  return isVisible;
};

/**
 * Hook to detect screen orientation
 * @returns {string} - Current orientation ('portrait' or 'landscape')
 */
export const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  const updateOrientation = useCallback(() => {
    setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateOrientation);
    
    // Some devices have an orientation API
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', updateOrientation);
    }
    
    return () => {
      window.removeEventListener('resize', updateOrientation);
        if (window.screen?.orientation) {
          window.screen.orientation.removeEventListener('change', updateOrientation);
        }
    };
  }, [updateOrientation]);

  return orientation;
};

/**
 * Hook to detect if the user is on a mobile device
 * @returns {boolean} - Whether the user is on a mobile device
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};

/**
 * Hook to handle keyboard navigation
 * @param {Function} callback - Function to call when a key is pressed
 * @param {Array} keys - Array of keys to listen for
 */
export const useKeyboardNavigation = (callback, keys) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keys.includes(event.key)) {
        callback(event.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, keys]);
}; 