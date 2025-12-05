import { useAuth } from "./AuthContext";

const PasscodeInput = () => {
  const { isUnlocked, logout } = useAuth();

  if (!isUnlocked) {
    return null;
  }

  return (
    <div className="passcode-widget">
      <span className="auth-state">Authenticated</span>
      <button type="button" className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default PasscodeInput;
