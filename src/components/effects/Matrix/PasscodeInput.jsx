import { useAuth } from "./AuthContext";

const PasscodeInput = () => {
  const { isUnlocked, logout } = useAuth();

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
    </>
  );
};

export default PasscodeInput;
