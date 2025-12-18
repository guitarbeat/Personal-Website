// Third-party imports
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
// Custom hooks
import { useVFXEffect } from "../../../hooks/useVFXEffect";
import { cn } from "../../../utils/commonUtils";
// Context imports
import { useAuth } from "../../effects/Matrix/AuthContext";

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
  } catch (_error) {
    // Swallow storage access errors (Safari private mode, etc.)
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  return false;
};

const updateThemeColor = (isLight: boolean) => {
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

interface NavBarProps {
  items: Record<string, string>;
  onMatrixActivate: () => void;
  onShopActivate?: () => void;
  isInShop?: boolean;
}

function NavBar({
  items,
  onMatrixActivate,
  onShopActivate,
  isInShop = false,
}: NavBarProps) {
  const themeClickTimesRef = useRef<number[]>([]);
  const themeSwitchRef = useRef<HTMLButtonElement>(null);
  const [isLightTheme, setIsLightTheme] = useState(getInitialTheme);
  const { isUnlocked } = useAuth();

  // Touch gesture handling for mobile dragging
  const navbarRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  // VFX state for navigation effects
  const [activeLinkRef, setActiveLinkRef] = useState<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLElement>>({});
  const vfxTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);

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
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  // Touch event handlers for dragging
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!navbarRef.current) return;

    setIsDragging(true);
    setStartX(e.touches[0].pageX - navbarRef.current.offsetLeft);
    setScrollLeft(navbarRef.current.scrollLeft);
    navbarRef.current.classList.add("dragging");

    // Prevent default scrolling behavior
    e.preventDefault();
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !navbarRef.current) return;

      e.preventDefault();
      const x = e.touches[0].pageX - navbarRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Reduced scroll speed for smoother experience
      navbarRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  const handleTouchEnd = useCallback(() => {
    if (!navbarRef.current) return;

    setIsDragging(false);
    navbarRef.current.classList.remove("dragging");

    // Add momentum scrolling effect
    const currentScrollLeft = navbarRef.current.scrollLeft;
    const maxScrollLeft =
      navbarRef.current.scrollWidth - navbarRef.current.clientWidth;

    // Snap to edges if close enough
    if (currentScrollLeft < 50) {
      navbarRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else if (currentScrollLeft > maxScrollLeft - 50) {
      navbarRef.current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    }
  }, []);

  // Mouse event handlers for desktop dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!navbarRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - navbarRef.current.offsetLeft);
    setScrollLeft(navbarRef.current.scrollLeft);
    navbarRef.current.classList.add("dragging");
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !navbarRef.current) return;

      e.preventDefault();
      const x = e.pageX - navbarRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Consistent with touch
      navbarRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  const handleMouseUp = useCallback(() => {
    if (!navbarRef.current) return;

    setIsDragging(false);
    navbarRef.current.classList.remove("dragging");

    // Add momentum scrolling effect
    const currentScrollLeft = navbarRef.current.scrollLeft;
    const maxScrollLeft =
      navbarRef.current.scrollWidth - navbarRef.current.clientWidth;

    // Snap to edges if close enough
    if (currentScrollLeft < 50) {
      navbarRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else if (currentScrollLeft > maxScrollLeft - 50) {
      navbarRef.current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    }
  }, []);

  const filteredNavItems = Object.entries(navItems).filter(([label]) => {
    if (label === "Scroll") {
      return isUnlocked;
    }
    return true;
  });

  // * Configure VFX effect for navigation links
  const vfxEnabled = typeof window !== "undefined";

  useVFXEffect({
    enabled: vfxEnabled,
    activeElement: activeLinkRef,
    effectConfig: { shader: "rgbShift", overflow: 100 },
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

    const nextIsLightTheme = !isLightTheme;
    setIsLightTheme(nextIsLightTheme);
  }, [isLightTheme, onMatrixActivate]);

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
    } catch (_error) {
      // Ignore persistence failures (quota restrictions, etc.)
    }
  }, [isLightTheme]);

  // * Cleanup VFX timeout on unmount
  useEffect(() => {
    return () => {
      if (vfxTimeoutRef.current) {
        clearTimeout(vfxTimeoutRef.current);
        vfxTimeoutRef.current = null;
      }
    };
  }, []);

  // * Handle smooth scrolling for hash navigation
  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string, label: string) => {
      // * Clear any existing timeout
      if (vfxTimeoutRef.current) {
        clearTimeout(vfxTimeoutRef.current as any);
        vfxTimeoutRef.current = null;
      }

      // * Set active link for VFX effect
      const linkRef = linkRefs.current[label];
      if (linkRef) {
        setActiveLinkRef(linkRef);

        // * Clear the effect after 1.5 seconds
        vfxTimeoutRef.current = setTimeout(() => {
          setActiveLinkRef(null);
          vfxTimeoutRef.current = null;
        }, 1500);
      }

      // Only intercept hash links (#anchor or /#anchor)
      if (href.includes("#")) {
        e.preventDefault();

        // Extract the ID from URLs like "/#about" or "#about"
        const hashIndex = href.indexOf("#");
        const targetId = href.substring(hashIndex + 1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    },
    [],
  );

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
      className={cn("navbar", hasOverflow && "mobile-draggable")}
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
          className={cn("theme-switch", isLightTheme && "light-theme")}
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
        <ul className="navbar__links">{links}</ul>
      </div>
    </nav>
  );
}

export default NavBar;
