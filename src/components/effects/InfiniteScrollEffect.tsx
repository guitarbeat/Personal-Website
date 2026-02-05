import React, { useCallback, useEffect, useRef } from "react";

const BUFFER_COUNT = 5; // Number of content copies for shop mode

interface InfiniteScrollEffectProps {
  children: React.ReactNode;
  shopMode?: boolean;
}

const InfiniteScrollEffect = ({
  children,
  shopMode = false,
}: InfiniteScrollEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolling = useRef<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const contentHeightRef = useRef<number>(0);

  // Helper: get the height of a single content block
  const getContentHeight = useCallback(() => {
    // * Performance optimization: Return cached value if available to avoid reflows
    if (contentHeightRef.current > 0) return contentHeightRef.current;

    const container = containerRef.current;
    if (!container) return 0;
    const firstChild = container.firstElementChild as HTMLElement | null;
    const height = firstChild ? firstChild.offsetHeight : 0;

    // Cache the value
    if (height > 0) contentHeightRef.current = height;

    return height;
  }, []);

  // Performance: Use ResizeObserver to update height without layout thrashing during scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: Re-observe if children structure changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const firstChild = container.firstElementChild as HTMLElement | null;
    if (!firstChild) return;

    // Initial measure
    contentHeightRef.current = firstChild.offsetHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.borderBoxSize) {
          // Firefox implements borderBoxSize as a sequence
          const borderBoxSize = Array.isArray(entry.borderBoxSize)
            ? entry.borderBoxSize[0]
            : entry.borderBoxSize;
          contentHeightRef.current = borderBoxSize.blockSize;
        } else {
          contentHeightRef.current = (entry.target as HTMLElement).offsetHeight;
        }
      }
    });

    resizeObserver.observe(firstChild);
    return () => resizeObserver.disconnect();
  }, [children]);

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

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleScroll = () => {
      const contentHeight = getContentHeight();
      if (contentHeight === 0) return;

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

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
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

      // Use cached height if available
      const containerHeight = getContentHeight();

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
  }, [shopMode, getContentHeight]);

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
  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
  };

  // Render 5 copies in shop mode, 2 in normal mode
  const copies = shopMode ? BUFFER_COUNT : 2;
  const seedArray = Array.from({ length: copies }, (_, i) => i);
  const contentArray = seedArray.map((index) => (
    <React.Fragment key={`content-copy-${index}`}>{children}</React.Fragment>
  ));

  return (
    <div ref={containerRef} style={containerStyle}>
      {contentArray}
    </div>
  );
};

export default InfiniteScrollEffect;
