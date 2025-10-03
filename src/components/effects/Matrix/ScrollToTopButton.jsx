import React, { useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useScrollThreshold } from "../../../hooks/useScrollThreshold";

const ScrollToTopButton = () => {
  const { isUnlocked } = useAuth();
  const showScrollTop = useScrollThreshold(300, 100);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!isUnlocked || !showScrollTop) return null;

  return (
    <button
      type="button"
      className="scroll-to-top-btn"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;

