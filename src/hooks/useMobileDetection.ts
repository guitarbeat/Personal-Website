import { useCallback, useEffect, useState } from "react";

interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  breakpoints: Breakpoints;
  isTouchDevice: boolean;
  isMobileUserAgent: boolean;
  isBelowBreakpoint: (breakpoint: number) => boolean;
  isAboveBreakpoint: (breakpoint: number) => boolean;
  isBetweenBreakpoints: (min: number, max: number) => boolean;
}

/**
 * Custom hook to detect mobile devices and screen size
 * Provides responsive breakpoint detection and mobile-specific utilities
 */
export const useMobileDetection = (): MobileDetectionResult => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);

  // Define breakpoints (matching the SCSS breakpoints)
  const breakpoints: Breakpoints = {
    mobile: 768, // Below 768px is considered mobile
    tablet: 1016, // 768px - 1016px is tablet
    desktop: 1017, // Above 1016px is desktop
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
    window.addEventListener("resize", updateScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, [updateScreenSize]);

  // Additional mobile detection using user agent (as fallback)
  const isMobileUserAgent = useCallback((): boolean => {
    if (typeof window === "undefined") return false;

    const userAgent = window.navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
  }, []);

  // Touch capability detection
  const isTouchDevice = useCallback((): boolean => {
    if (typeof window === "undefined") return false;

    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - msMaxTouchPoints is a legacy Internet Explorer property
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
    isBelowBreakpoint: (breakpoint: number) => screenWidth < breakpoint,
    isAboveBreakpoint: (breakpoint: number) => screenWidth >= breakpoint,
    isBetweenBreakpoints: (min: number, max: number) =>
      screenWidth >= min && screenWidth < max,
  };
};

export default useMobileDetection;
