import React, { useEffect, useRef, useCallback } from "react";

const InfiniteScrollEffect = ({ children }) => {
  const containerRef = useRef(null);
  const scrolling = useRef(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Debounced scroll handler to improve performance
  const debouncedScrollHandler = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (scrolling.current) return;

      const container = containerRef.current;
      if (!container) return;

      const containerHeight = container.firstElementChild?.offsetHeight || 0;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Track natural scroll direction
      const scrollingDown = scrollPosition > lastScrollY.current;
      lastScrollY.current = scrollPosition;

      // Only reset when scrolling down and near the bottom
      if (scrollingDown && scrollPosition > containerHeight - windowHeight) {
        scrolling.current = true;

        // Create a custom scroll event that the blur effect can detect as programmatic
        const customEvent = new CustomEvent('programmaticScroll', {
          detail: {
            fromY: scrollPosition,
            toY: scrollPosition % containerHeight
          }
        });
        window.dispatchEvent(customEvent);

        // Use requestAnimationFrame for smooth reset
        animationFrameRef.current = requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollPosition % containerHeight,
            behavior: 'auto'
          });

          // Allow a brief moment for the scroll to complete
          setTimeout(() => {
            scrolling.current = false;
          }, 50);
        });
      }
    }, 16); // ~60fps debouncing
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    window.addEventListener("scroll", debouncedScrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [debouncedScrollHandler]);

  // Style to hide any visual seams
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Original content */}
      {children}
      {/* Duplicate content for seamless loop */}
      {children}
    </div>
  );
};

export default InfiniteScrollEffect; 