import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import "./devAuthControls.scss";

/**
 * DevAuthControls - Development tool for quickly toggling unlock state
 * Only visible in development mode
 */
const DevAuthControls = () => {
  const { isUnlocked, devToggleUnlock } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // * Only show in development mode
  const isDevMode =
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost";

  useEffect(() => {
    if (!isDevMode) {
      return;
    }

    // * Keyboard shortcut: Ctrl/Cmd + Shift + U to toggle unlock
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "u"
      ) {
        event.preventDefault();
        devToggleUnlock();
      }

      // * Toggle visibility: Ctrl/Cmd + Shift + D
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [devToggleUnlock, isDevMode]);

  if (!isDevMode) {
    return null;
  }

  return (
    <>
      {!isVisible && (
        <button
          type="button"
          className="dev-auth-controls__trigger"
          onClick={() => setIsVisible(true)}
          aria-label="Show dev auth controls"
          title="Dev: Auth Preview (Ctrl/Cmd + Shift + D)"
        >
          🔓
        </button>
      )}
      {isVisible && (
        <div className="dev-auth-controls" role="complementary" aria-label="Dev auth controls">
          <div className="dev-auth-controls__header">
            <span className="dev-auth-controls__title">Dev: Auth Preview</span>
            <button
              type="button"
              className="dev-auth-controls__close"
              onClick={() => setIsVisible(false)}
              aria-label="Close dev auth controls"
            >
              ×
            </button>
          </div>
          <div className="dev-auth-controls__content">
            <div className="dev-auth-controls__status">
              <span className="dev-auth-controls__label">Status:</span>
              <span
                className={isUnlocked ? "dev-auth-controls__status--unlocked" : "dev-auth-controls__status--locked"}
              >
                {isUnlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
            <button
              type="button"
              className="dev-auth-controls__toggle"
              onClick={devToggleUnlock}
              aria-label={isUnlocked ? "Lock site" : "Unlock site"}
            >
              {isUnlocked ? "🔒 Lock Site" : "🔓 Unlock Site"}
            </button>
            <div className="dev-auth-controls__hint">
              <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> to toggle
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevAuthControls;
