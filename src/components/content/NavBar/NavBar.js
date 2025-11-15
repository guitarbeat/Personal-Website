// Third-party imports
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { Link } from "react-router-dom";

// Context imports
import { useAuth } from "../../effects/Matrix/AuthContext";

// Custom hooks
import { useVFXEffect } from "../../../hooks/useVFXEffect";

// Theme Configuration
const THEME = {
  LIGHT: "light",
  DARK: "dark",
  STORAGE_KEY: "theme",
  CLASS_NAME: "light-theme",
};

// Utility functions

const isBrowser = typeof window !== "undefined";
const isDocumentAvailable = typeof document !== "undefined";
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

const getInitialTheme = () => {
  if (!isBrowser) {
    return false;
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME.STORAGE_KEY);
    if (savedTheme) {
      return savedTheme === THEME.LIGHT;
    }
  } catch (error) {
    // Swallow storage access errors (Safari private mode, etc.)
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  return false;
};

const updateThemeColor = (isLight) => {
  if (!isDocumentAvailable) {
    return;
  }

  const themeColor = isLight ? "#ffffff" : "#1a1a1a";
  const existingMeta =
    document.querySelector("meta#theme-color") ??
    document.querySelector('meta[name="theme-color"]');

  if (existingMeta) {
    existingMeta.setAttribute("content", themeColor);
    return;
  }

  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.id = "theme-color";
  meta.setAttribute("content", themeColor);
  document.head.appendChild(meta);
};

function NavBar({ items, onMatrixActivate, onShopActivate, isInShop = false }) {
  const themeClickTimesRef = useRef([]);
  const themeSwitchRef = useRef(null);
  const toggleEffectCounterRef = useRef(0);
  const easterEggTimelineRef = useRef(null);
  const easterEggAnimatingRef = useRef(false);
  const [isLightTheme, setIsLightTheme] = useState(getInitialTheme);
  const { isUnlocked } = useAuth();

  // Touch gesture handling for mobile dragging
  const navbarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  // VFX state for navigation effects
  const [activeLinkRef, setActiveLinkRef] = useState(null);
  const linkRefs = useRef({});

  // Create navItems conditionally - memoized to prevent unnecessary re-renders
  const navItems = useMemo(() => {
    let result = { ...items };
    if (isInShop) {
      result = {
        Home: "/",
      };
    }
    return result;
  }, [items, isInShop]);

  // * Check if navbar content overflows and needs dragging
  useEffect(() => {
    if (!navbarRef.current) return;

    const checkOverflow = () => {
      const element = navbarRef.current;
      if (element) {
        const hasHorizontalOverflow = element.scrollWidth > element.clientWidth;
        setHasOverflow(hasHorizontalOverflow);
      }
    };

    // ! Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(checkOverflow, 0);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  // Touch event handlers for dragging
  const handleTouchStart = useCallback((e) => {
    if (!navbarRef.current) return;

    setIsDragging(true);
    setStartX(e.touches[0].pageX - navbarRef.current.offsetLeft);
    setScrollLeft(navbarRef.current.scrollLeft);
    navbarRef.current.classList.add('dragging');

    // Prevent default scrolling behavior
    e.preventDefault();
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !navbarRef.current) return;

    e.preventDefault();
    const x = e.touches[0].pageX - navbarRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Reduced scroll speed for smoother experience
    navbarRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    if (!navbarRef.current) return;

    setIsDragging(false);
    navbarRef.current.classList.remove('dragging');

    // Add momentum scrolling effect
    const currentScrollLeft = navbarRef.current.scrollLeft;
    const maxScrollLeft = navbarRef.current.scrollWidth - navbarRef.current.clientWidth;

    // Snap to edges if close enough
    if (currentScrollLeft < 50) {
      navbarRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (currentScrollLeft > maxScrollLeft - 50) {
      navbarRef.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    }
  }, []);

  // Mouse event handlers for desktop dragging
  const handleMouseDown = useCallback((e) => {
    if (!navbarRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - navbarRef.current.offsetLeft);
    setScrollLeft(navbarRef.current.scrollLeft);
    navbarRef.current.classList.add('dragging');
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !navbarRef.current) return;

    e.preventDefault();
    const x = e.pageX - navbarRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Consistent with touch
    navbarRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    if (!navbarRef.current) return;

    setIsDragging(false);
    navbarRef.current.classList.remove('dragging');

    // Add momentum scrolling effect
    const currentScrollLeft = navbarRef.current.scrollLeft;
    const maxScrollLeft = navbarRef.current.scrollWidth - navbarRef.current.clientWidth;

    // Snap to edges if close enough
    if (currentScrollLeft < 50) {
      navbarRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (currentScrollLeft > maxScrollLeft - 50) {
      navbarRef.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    }
  }, []);

  const filteredNavItems = Object.entries(navItems).filter(([label]) => {
    if (label === "Scroll") {
      return isUnlocked;
    }
    return true;
  });

  // * Configure VFX effect for navigation links
  const vfxEnabled = typeof window !== 'undefined';
  
  useVFXEffect({
    enabled: vfxEnabled,
    activeElement: activeLinkRef,
    effectConfig: { shader: 'rgbShift', overflow: 100 }
  });

  const playThemeSwitchEasterEgg = useCallback(
    async (nextIsLightTheme) => {
      if (
        !isBrowser ||
        !isDocumentAvailable ||
        !themeSwitchRef.current ||
        easterEggAnimatingRef.current
      ) {
        return false;
      }

      if (
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return false;
      }

      const button = themeSwitchRef.current;
      const handle = button.querySelector(".switch-handle");

      if (!handle) {
        return false;
      }

      easterEggAnimatingRef.current = true;
      const previousPointerEvents = button.style.pointerEvents;
      button.style.pointerEvents = "none";

      let gsap;

      try {
        ({ gsap } = await import("gsap"));

        if (easterEggTimelineRef.current) {
          easterEggTimelineRef.current.kill();
        }

        const buttonRect = button.getBoundingClientRect();
        const handleTravel = Math.max(buttonRect.width - buttonRect.height, 0);
        const startingOffset = isLightTheme ? handleTravel : 0;
        const targetOffset = nextIsLightTheme ? handleTravel : 0;
        const rotationIncrement = nextIsLightTheme ? 90 : -90;
        const accentColor = nextIsLightTheme ? "#41BA20" : "#B3B8C4";

        gsap.set(handle, { x: startingOffset });

        const timeline = gsap.timeline({
          onComplete: () => {
            setIsLightTheme(nextIsLightTheme);
          },
        });

        easterEggTimelineRef.current = timeline;

        timeline
          .to(button, {
            rotation: `+=${rotationIncrement * 2}`,
            transformOrigin: "50% 50%",
            ease: "elastic.out(0.95, 0.5)",
            duration: 1.5,
          })
          .to(
            handle,
            {
              x: targetOffset,
              ease: "expo.inOut",
              duration: 0.55,
            },
            "-=1.2",
          )
          .to(
            [button, handle],
            {
              backgroundColor: accentColor,
              duration: 0.2,
              ease: "power1.inOut",
            },
            "<",
          );

        await timeline;
        return true;
      } catch (error) {
        // Log error for debugging
        console.error("Theme switch animation failed:", error);
        return false;
      } finally {
        if (gsap) {
          gsap.set(button, { clearProps: "transform,backgroundColor" });
          gsap.set(handle, { clearProps: "transform,backgroundColor" });
        } else {
          // Fallback if gsap import fails or isn't available
          button.style.removeProperty("transform");
          button.style.removeProperty("background-color");
          handle.style.removeProperty("transform");
          handle.style.removeProperty("background-color");
        }
        button.style.pointerEvents = previousPointerEvents;
        easterEggAnimatingRef.current = false;
        easterEggTimelineRef.current = null;
      }
    },
    [isLightTheme, setIsLightTheme],
  );

  const shouldPlayThemeSwitchEasterEgg = useCallback(() => {
    if (easterEggAnimatingRef.current) {
      return false;
    }

    toggleEffectCounterRef.current += 1;

    if (toggleEffectCounterRef.current >= 7) {
      toggleEffectCounterRef.current = 0;
      return true;
    }

    if (Math.random() < 0.1) {
      toggleEffectCounterRef.current = 0;
      return true;
    }

    return false;
  }, []);

  const handleThemeClick = useCallback(() => {
    const now = Date.now();
    const clickTimes = themeClickTimesRef.current;

    clickTimes.push(now);

    while (clickTimes.length > 0 && now - clickTimes[0] >= 2000) {
      clickTimes.shift();
    }

    if (clickTimes.length >= 5) {
      clickTimes.length = 0;
      if (onMatrixActivate) {
        onMatrixActivate();
      }
    }

    const nextIsLightTheme = !isLightTheme;

    if (shouldPlayThemeSwitchEasterEgg()) {
      void (async () => {
        const played = await playThemeSwitchEasterEgg(nextIsLightTheme);
        if (!played) {
          setIsLightTheme(nextIsLightTheme);
        }
      })();
    } else {
      setIsLightTheme(nextIsLightTheme);
    }
  }, [
    isLightTheme,
    onMatrixActivate,
    playThemeSwitchEasterEgg,
    shouldPlayThemeSwitchEasterEgg,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!isDocumentAvailable) {
      return;
    }

    document.body.classList.toggle(THEME.CLASS_NAME, isLightTheme);
    updateThemeColor(isLightTheme);
  }, [isLightTheme]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(
        THEME.STORAGE_KEY,
        isLightTheme ? THEME.LIGHT : THEME.DARK,
      );
    } catch (error) {
      // Ignore persistence failures (quota restrictions, etc.)
    }
  }, [isLightTheme]);

  useEffect(
    () => () => {
      if (easterEggTimelineRef.current) {
        easterEggTimelineRef.current.kill();
        easterEggTimelineRef.current = null;
      }
      if (themeSwitchRef.current) {
        themeSwitchRef.current.style.pointerEvents = "";
      }
      easterEggAnimatingRef.current = false;
    },
    [],
  );

  // * Handle smooth scrolling for hash navigation
  const handleNavClick = useCallback((e, href, label) => {
    // * Set active link for VFX effect
    const linkRef = linkRefs.current[label];
    if (linkRef) {
      setActiveLinkRef(linkRef);
    }

    // Only intercept hash links (#anchor or /#anchor)
    if (href.includes('#')) {
      e.preventDefault();
      
      // Extract the ID from URLs like "/#about" or "#about"
      const hashIndex = href.indexOf('#');
      const targetId = href.substring(hashIndex + 1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, []);

  const links = filteredNavItems.map(([label, href]) => (
    <li 
      key={label} 
      className="navbar__item"
      ref={(el) => {
        if (el) {
          linkRefs.current[label] = el;
        }
      }}
    >
      <Link
        to={isInShop && label === "Home" ? "/" : href}
        onClick={(e) => handleNavClick(e, href, label)}
      >
        {label}
      </Link>
    </li>
  ));

  return (
    <nav
      ref={navbarRef}
      className={`navbar ${hasOverflow ? 'mobile-draggable' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="navbar__content">
        <button
          ref={themeSwitchRef}
          className={`theme-switch ${isLightTheme ? "light-theme" : ""}`}
          onClick={handleThemeClick}
          role="switch"
          aria-checked={isLightTheme}
          aria-label={`Switch to ${isLightTheme ? "dark" : "light"} theme`}
          type="button"
        >
          <div className="switch-handle">
            <div className="moon-phase-container" />
          </div>
        </button>
        <ul className="navbar__links">
          {links}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
