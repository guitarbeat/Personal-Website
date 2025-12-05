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
      ) : null}
      {showAccessDenied && <NuUhUhEasterEgg onClose={handleHideAccessDenied} />}
    </>
  );
};

export default PasscodeInput;
