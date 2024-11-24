// Third-party imports
import React, { useState, useEffect } from "react";

// Context imports
import { useAuth } from '../../context/AuthContext';

function NavBar({ items }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const SCROLL_THRESHOLD = 300; // Show button after scrolling 300px
  const { isUnlocked } = useAuth();

  // Add Tools to nav items when unlocked
  const navItems = {
    ...items,
    ...(isUnlocked && { Tools: "/#tools" })
  };

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
    };

    // Check initial scroll position
    checkScroll();

    // Add scroll listener with throttling
    let timeoutId = null;
    const throttledCheckScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          checkScroll();
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener("scroll", throttledCheckScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", throttledCheckScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  let links = Object.keys(navItems)
    .reverse()
    .map((key, i) => (
      <li key={i} className="navbar__item">
        <a
          href={navItems[key]}
          onClick={(event) => {
            event.preventDefault();
            const { href } = event.target;
            if (href.startsWith("#")) {
              window.location.href = `${window.location.origin}${href}`;
            } else {
              window.location.href = href;
            }
          }}
        >
          {key}
        </a>
      </li>
    ));

  return (
    <ul className="navbar">
      {links}
      <div className="theme-switch">
        <div className="switch"></div>
      </div>
      {/* Always render the button, but control visibility with CSS */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        aria-hidden={!showScrollTop}
      >
        ↑
      </button>
    </ul>
  );
}

export default NavBar;
