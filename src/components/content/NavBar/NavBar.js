// Third-party imports
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { Link } from "react-router-dom";

// Context imports
import { useAuth } from "../../effects/Matrix/AuthContext";

// Hook imports
import { useMobileDetection } from "../../../hooks/useMobileDetection";

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
  const { isMobile } = useMobileDetection();

  // Touch gesture handling for mobile dragging
  const navbarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Touch event handlers for dragging
  const handleTouchStart = useCallback((e) => {
    if (!isMobile || !navbarRef.current) return;

    setIsDragging(true);
    setStartX(e.touches[0].pageX - navbarRef.current.offsetLeft);
    setScrollLeft(navbarRef.current.scrollLeft);
    navbarRef.current.classList.add('dragging');

    // Prevent default scrolling behavior
    e.preventDefault();
  }, [isMobile]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !isMobile || !navbarRef.current) return;

    e.preventDefault();
    const x = e.touches[0].pageX - navbarRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Reduced scroll speed for smoother experience
    navbarRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, isMobile, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !navbarRef.current) return;

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
  }, [isMobile]);

  // Mouse event handlers for desktop dragging (optional)
  const handleMouseDown = useCallback((e) => {
    if (!isMobile || !navbarRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - navbarRef.current.offsetLeft);
    setScrollLeft(navbarRef.current.scrollLeft);
    navbarRef.current.classList.add('dragging');
  }, [isMobile]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !isMobile || !navbarRef.current) return;

    e.preventDefault();
    const x = e.pageX - navbarRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Consistent with touch
    navbarRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, isMobile, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    if (!isMobile || !navbarRef.current) return;

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
  }, [isMobile]);

  // Create navItems conditionally
  let navItems = { ...items };

  if (isInShop) {
    navItems = {
      Home: "/",
    };
  }

  const filteredNavItems = Object.entries(navItems).filter(([label]) => {
    if (label === "Scroll") {
      return isUnlocked;
    }
    return true;
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

  const links = filteredNavItems.map(([label, href]) => (
      <li key={label} className="navbar__item">
        <Link
          to={isInShop && label === "Home" ? "/" : href}
        >
          {label}
        </Link>
      </li>
    ));

  return (
    <nav
      ref={navbarRef}
      className={`navbar ${isMobile ? 'mobile-draggable' : ''}`}
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
