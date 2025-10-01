import React, { useCallback } from "react";
import { useAuth } from "./AuthContext";

const ScrollToTopButton = () => {
  const { isUnlocked } = useAuth();

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!isUnlocked) return null;

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

