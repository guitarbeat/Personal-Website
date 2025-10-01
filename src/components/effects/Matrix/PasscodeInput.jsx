import React, { useCallback, useState } from "react";
import { useAuth } from "./AuthContext";

const PasscodeInput = () => {
  const {
    isUnlocked,
    checkPassword,
    rateLimitInfo,
    failedAttempts,
    logout,
  } = useAuth();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (rateLimitInfo?.isLimited) return;
      const ok = checkPassword(passcode);
      if (!ok) {
        setError("Incorrect passcode. Try again.");
      } else {
        setError("");
      }
      setPasscode("");
    },
    [passcode, checkPassword, rateLimitInfo?.isLimited],
  );

  if (isUnlocked) {
    return (
      <div className="passcode-widget">
        <span className="auth-state">Authenticated</span>
        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <form className="passcode-widget" onSubmit={handleSubmit}>
      <input
        type="password"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        placeholder="Enter passcode"
        className="passcode-input"
        disabled={rateLimitInfo?.isLimited}
        aria-label="Passcode"
      />
      <button
        type="submit"
        className="passcode-submit"
        disabled={rateLimitInfo?.isLimited}
        aria-label="Submit passcode"
      >
        Unlock
      </button>
      {error && !rateLimitInfo?.isLimited && (
        <div className="passcode-error" role="alert">
          {error}
          {failedAttempts > 0 && ` (Attempts: ${failedAttempts})`}
        </div>
      )}
      {rateLimitInfo?.isLimited && (
        <div className="passcode-error" role="alert">
          Too many attempts. Try again later.
        </div>
      )}
    </form>
  );
};

export default PasscodeInput;

