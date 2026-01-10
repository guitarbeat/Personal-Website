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

  // * Performance: Cache geometric values to avoid layout thrashing during scroll
  const contentHeightRef = useRef<number>(0);
  const windowHeightRef = useRef<number>(
    typeof window !== "undefined" ? window.innerHeight : 0,
  );

  // Helper: get the height of a single content block
  // Only used for initialization or fallback
  const getContentHeight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const firstChild = container.firstElementChild as HTMLElement | null;
    return firstChild ? firstChild.offsetHeight : 0;
  }, []);

  // * Initialize ResizeObserver and listeners for cached values
  // biome-ignore lint/correctness/useExhaustiveDependencies: children prop change requires re-init to attach observer to new DOM
  useEffect(() => {
    const updateWindowHeight = () => {
      windowHeightRef.current = window.innerHeight;
    };

    window.addEventListener("resize", updateWindowHeight);
    updateWindowHeight(); // Initial set

    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (container?.firstElementChild) {
      // Initial read to populate ref immediately
      contentHeightRef.current = (
        container.firstElementChild as HTMLElement
      ).offsetHeight;

      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Update ref when size changes
          // using offsetHeight to be consistent with scroll logic requirements
          contentHeightRef.current = (entry.target as HTMLElement).offsetHeight;
        }
      });
      resizeObserver.observe(container.firstElementChild);
    }

    return () => {
      window.removeEventListener("resize", updateWindowHeight);
      resizeObserver?.disconnect();
    };
  }, [children]);

  // Shop mode: scroll to center buffer on mount
  useEffect(() => {
    if (!shopMode) return;
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
      // * Use cached height values to prevent reflows
      const contentHeight =
        contentHeightRef.current || getContentHeight();
      const totalHeight = contentHeight * BUFFER_COUNT;
      const scrollY = window.scrollY;
      const windowHeight = windowHeightRef.current;

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

      // * Use cached height values
      const containerHeight =
        contentHeightRef.current || getContentHeight();

      const scrollPosition = window.scrollY;
      const windowHeight = windowHeightRef.current;

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
