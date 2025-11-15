import React, { useEffect, useRef, useCallback } from "react";

const BUFFER_COUNT = 5; // Number of content copies for shop mode

const InfiniteScrollEffect = ({ children, shopMode = false }) => {
  const containerRef = useRef(null);
  const scrolling = useRef(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Helper: get the height of a single content block
  const getContentHeight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const firstChild = container.firstElementChild;
    return firstChild ? firstChild.offsetHeight : 0;
  }, []);

  // Shop mode: scroll to center buffer on mount
  useEffect(() => {
    if (!shopMode) return;
    const container = containerRef.current;
    if (!container) return;
    const contentHeight = getContentHeight();
    // Scroll to the center copy
    window.scrollTo({
      top: contentHeight * Math.floor(BUFFER_COUNT / 2),
      behavior: "auto",
    });
  }, [shopMode, getContentHeight]);

  // Shop mode: robust infinite scroll logic
  useEffect(() => {
    if (!shopMode) return;
    const handleScroll = () => {
      const contentHeight = getContentHeight();
      const totalHeight = contentHeight * BUFFER_COUNT;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // If near the top or bottom, reset to center copy at same offset
      if (
        scrollY < contentHeight - windowHeight ||
        scrollY > totalHeight - 2 * contentHeight
      ) {
        const offset = scrollY % contentHeight;
        window.scrollTo({
          top: contentHeight * Math.floor(BUFFER_COUNT / 2) + offset,
          behavior: "auto",
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shopMode, getContentHeight]);

  // Original mode: debounce scroll handler for seamless looping
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
      if (
        scrollingDown &&
        scrollPosition > containerHeight - windowHeight &&
        !shopMode
      ) {
        scrolling.current = true;
        // Create a custom scroll event that the blur effect can detect as programmatic
        const customEvent = new CustomEvent("programmaticScroll", {
          detail: {
            fromY: scrollPosition,
            toY: scrollPosition % containerHeight,
          },
        });
        window.dispatchEvent(customEvent);
        // Use requestAnimationFrame for smooth reset
        animationFrameRef.current = requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollPosition % containerHeight,
            behavior: "auto",
          });
          // Allow a brief moment for the scroll to complete
          setTimeout(() => {
            scrolling.current = false;
          }, 50);
        });
      }
    }, 16); // ~60fps debouncing
  }, [shopMode]);

  useEffect(() => {
    if (shopMode) return; // skip in shop mode
    const container = containerRef.current;
    if (!container) return;
    window.addEventListener("scroll", debouncedScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [debouncedScrollHandler, shopMode]);

  // Style to hide any visual seams
  const containerStyle = {
    position: "relative",
    overflow: "hidden",
  };

  // Render 5 copies in shop mode, 2 in normal mode
  const copies = shopMode ? BUFFER_COUNT : 2;
  const seedArray = Array.from({ length: copies }, () =>
    Math.random().toString(36).slice(2),
  );
  const contentArray = seedArray.map((seed) => (
    <React.Fragment key={`content-copy-${seed}`}>{children}</React.Fragment>
  ));

  return (
    <div ref={containerRef} style={containerStyle}>
      {contentArray}
    </div>
  );
};

export default InfiniteScrollEffect;
