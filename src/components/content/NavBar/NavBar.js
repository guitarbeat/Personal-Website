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
  }, [navItems]);

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

    setIsLightTheme((prev) => !prev);
  }, [onMatrixActivate]);

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
