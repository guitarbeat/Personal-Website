// Third-party imports
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollThreshold } from "../../../hooks/useScrollThreshold";

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
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME.STORAGE_KEY);
  if (savedTheme) {
    return savedTheme === THEME.LIGHT;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches;
};

const updateThemeColor = (isLight) => {
  const themeColorMeta = document.querySelector("meta#theme-color");
  if (themeColorMeta) {
    themeColorMeta.content = isLight ? "#ffffff" : "#1a1a1a";
  }
};

function NavBar({ items, onMatrixActivate, onShopActivate, isInShop = false }) {
  const showScrollTop = useScrollThreshold(300, 100);
  const [themeClicks, setThemeClicks] = useState([]);
  const [isLightTheme, setIsLightTheme] = useState(getInitialTheme);
  const { isUnlocked } = useAuth();
  
  // Touch gesture handling for mobile dragging
  const navbarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    // Only add Scroll link if user is authenticated
    if (isUnlocked) {
      navItems.Scroll = "/#scroll";
    }
  } else if (isUnlocked) {
    navItems.Scroll = "/#scroll";
  }

  const handleThemeClick = useCallback(() => {
    const now = Date.now();
    const newClicks = [...themeClicks, now].filter(
      (click) => now - click < 2000,
    );
    setThemeClicks(newClicks);

    if (newClicks.length >= 5) {
      setThemeClicks([]);
      if (onMatrixActivate) {
        onMatrixActivate();
      }
    }

    setIsLightTheme((prev) => {
      const newTheme = !prev;
      localStorage.setItem(
        THEME.STORAGE_KEY,
        newTheme ? THEME.LIGHT : THEME.DARK,
      );
      return newTheme;
    });
  }, [themeClicks, onMatrixActivate]);

  useEffect(() => {
    const { body } = document;
    body.classList.toggle(THEME.CLASS_NAME, isLightTheme);
    updateThemeColor(isLightTheme);
  }, [isLightTheme]);

  const links = Object.keys(navItems)
    .reverse()
    .map((key) => (
      <li key={key} className="navbar__item">
        <Link
          to={isInShop && key === "Home" ? "/" : navItems[key]}
          onClick={(event) => {
            if (key === "Scroll" && onShopActivate) {
              event.preventDefault();
              onShopActivate();
              return;
            }
            // Rest of click handler for scrolling if needed
          }}
        >
          {key}
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
        {links}
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
      </div>
      <button
        type="button"
        className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        aria-hidden={!showScrollTop}
      >
        ↑
      </button>
    </nav>
  );
}

export default NavBar;
