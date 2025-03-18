import React, { useEffect, useRef } from "react";

const InfiniteScrollEffect = ({ children }) => {
  const containerRef = useRef(null);
  const scrolling = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrolling.current) return;

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

        // Smooth reset to maintain blur effect
        requestAnimationFrame(() => {
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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