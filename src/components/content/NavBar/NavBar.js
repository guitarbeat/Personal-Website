// Third-party imports
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch.js";

// Context imports
import { useAuth } from "../../effects/Matrix/AuthContext";

// Custom hooks
import { useVFXEffect } from "../../../hooks/useVFXEffect";

function NavBar({ items, onMatrixActivate, onShopActivate, isInShop = false }) {
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
        <ThemeSwitch onMatrixActivate={onMatrixActivate} />
        <ul className="navbar__links">
          {links}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
