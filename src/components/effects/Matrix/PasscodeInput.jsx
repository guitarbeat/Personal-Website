import React from "react";
import { useAuth } from "./AuthContext";

const PasscodeInput = () => {
  const { isUnlocked, logout } = useAuth();

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
    <div className="passcode-widget" aria-live="polite">
      <span className="auth-state">Matrix override required</span>
      <span className="auth-hint">Launch the Matrix console to authenticate.</span>
    </div>
  );
};

export default PasscodeInput;
