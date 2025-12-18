import { useCallback } from "react";
import { useScrollThreshold } from "../../../hooks/useScrollUtils";

const ScrollToTopButton = () => {
  const showScrollTop = useScrollThreshold(300, 100);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!showScrollTop) return null;

  return (
    <button
      type="button"
      className="scroll-to-top-btn"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      <span className="fas fa-arrow-up" aria-hidden="true" />
    </button>
  );
};

export default ScrollToTopButton;
