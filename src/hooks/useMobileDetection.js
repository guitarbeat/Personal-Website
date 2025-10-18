import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to detect mobile devices and screen size
 * Provides responsive breakpoint detection and mobile-specific utilities
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  // Define breakpoints (matching the SCSS breakpoints)
  const breakpoints = {
    mobile: 768,    // Below 768px is considered mobile
    tablet: 1016,   // 768px - 1016px is tablet
    desktop: 1017   // Above 1016px is desktop
  };

  const updateScreenSize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setScreenWidth(width);
    setScreenHeight(height);

    // Update device type based on width
    setIsMobile(width < breakpoints.mobile);
    setIsTablet(width >= breakpoints.mobile && width < breakpoints.desktop);
    setIsDesktop(width >= breakpoints.desktop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Initial check
    updateScreenSize();

    // Add resize listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, [updateScreenSize]);

  // Additional mobile detection using user agent (as fallback)
  const isMobileUserAgent = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const userAgent = window.navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
  }, []);

  // Touch capability detection
  const isTouchDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;

    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  // Combined mobile detection (screen size + user agent + touch)
  const isMobileDevice = isMobile || (isMobileUserAgent() && isTouchDevice());

  return {
    isMobile: isMobileDevice,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    breakpoints,
    isTouchDevice: isTouchDevice(),
    isMobileUserAgent: isMobileUserAgent(),
    // Helper functions
    isBelowBreakpoint: (breakpoint) => screenWidth < breakpoint,
    isAboveBreakpoint: (breakpoint) => screenWidth >= breakpoint,
    isBetweenBreakpoints: (min, max) => screenWidth >= min && screenWidth < max,
  };
};

export default useMobileDetection;