import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import NuUhUhEasterEgg from "./NuUhUhEasterEgg";

const PasscodeInput = () => {
  const { isUnlocked, logout } = useAuth();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const handleShowAccessDenied = useCallback(() => {
    setShowAccessDenied(true);
  }, []);

  const handleHideAccessDenied = useCallback(() => {
    setShowAccessDenied(false);
  }, []);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (
        !showAccessDenied &&
        event.altKey &&
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "n"
      ) {
        event.preventDefault();
        handleShowAccessDenied();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleShowAccessDenied, showAccessDenied]);

  return (
    <>
      {isUnlocked ? (
        <div className="passcode-widget">
          <span className="auth-state">Authenticated</span>
          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="passcode-widget" aria-live="polite">
          <span className="auth-state">Matrix override required</span>
          <span className="auth-hint">
            Launch the Matrix console to authenticate.
          </span>
          <span className="auth-easter-egg-hint">
            Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Alt</kbd> + <kbd>N</kbd>{" "}
            or use the button below to replay the classic access denied moment.
          </span>
          <button
            type="button"
            className="access-denied-btn"
            onClick={handleShowAccessDenied}
            aria-label="Trigger the access denied Easter egg"
          >
            Trigger Access Denied
          </button>
        </div>
      )}
      {showAccessDenied && <NuUhUhEasterEgg onClose={handleHideAccessDenied} />}
    </>
  );
};

export default PasscodeInput;
