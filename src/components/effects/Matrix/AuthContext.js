// Third-party imports
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Asset imports
import incorrectAudio from "../../../assets/audio/didn't-say-the-magic-word.mp3";

const AuthContext = createContext();

// * Secure password validation using environment variable
const getSecurePassword = () => {
  // Use environment variable for password, fallback to a more secure default
  const envPassword = process.env.REACT_APP_AUTH_PASSWORD;
  if (envPassword) {
    return envPassword.toLowerCase().trim();
  }
  // In production, this should always be set via environment variable
  console.warn("REACT_APP_AUTH_PASSWORD not set, using fallback");
  return "secure-default-password";
};

// * Session storage keys
const SESSION_KEYS = {
  IS_UNLOCKED: "matrix_auth_unlocked",
  SESSION_TIMESTAMP: "matrix_auth_timestamp",
  ATTEMPT_COUNT: "matrix_auth_attempts",
  LAST_ATTEMPT: "matrix_auth_last_attempt",
};

// * Session management utilities
const getSessionData = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`Failed to parse session data for ${key}:`, error);
    return null;
  }
};

const setSessionData = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save session data for ${key}:`, error);
  }
};

const clearSessionData = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to clear session data for ${key}:`, error);
  }
};

// * Rate limiting utilities
const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  LOCKOUT_MS: 30 * 60 * 1000, // 30 minutes
};

// * Authentication timing constants
const AUTH_TIMING = {
  MATRIX_MODAL_CLOSE_DELAY: 2000, // 2 seconds - matches Matrix success feedback duration
  SUCCESS_FEEDBACK_DURATION: 2000, // 2 seconds - how long to show success message
};

const checkRateLimit = () => {
  const attemptCount = getSessionData(SESSION_KEYS.ATTEMPT_COUNT) || 0;
  const lastAttempt = getSessionData(SESSION_KEYS.LAST_ATTEMPT) || 0;
  const now = Date.now();

  // * Reset attempts if window has passed
  if (now - lastAttempt > RATE_LIMIT_CONFIG.WINDOW_MS) {
    setSessionData(SESSION_KEYS.ATTEMPT_COUNT, 0);
    return {
      isLimited: false,
      remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS,
    };
  }

  // * Check if locked out
  if (attemptCount >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    const timeSinceLastAttempt = now - lastAttempt;
    if (timeSinceLastAttempt < RATE_LIMIT_CONFIG.LOCKOUT_MS) {
      const remainingLockout =
        RATE_LIMIT_CONFIG.LOCKOUT_MS - timeSinceLastAttempt;
      return {
        isLimited: true,
        remainingAttempts: 0,
        lockoutRemaining: Math.ceil(remainingLockout / 1000 / 60), // minutes
      };
    }
    // * Reset after lockout period
    setSessionData(SESSION_KEYS.ATTEMPT_COUNT, 0);
    return {
      isLimited: false,
      remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS,
    };
  }

  return {
    isLimited: false,
    remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS - attemptCount,
  };
};

const incrementAttemptCount = () => {
  const attemptCount = getSessionData(SESSION_KEYS.ATTEMPT_COUNT) || 0;
  const now = Date.now();

  setSessionData(SESSION_KEYS.ATTEMPT_COUNT, attemptCount + 1);
  setSessionData(SESSION_KEYS.LAST_ATTEMPT, now);
};

export const AuthProvider = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // * Check session storage first
    const sessionUnlocked = getSessionData(SESSION_KEYS.IS_UNLOCKED);
    const sessionTimestamp = getSessionData(SESSION_KEYS.SESSION_TIMESTAMP);

    // * Validate session (expires after 24 hours)
    if (sessionUnlocked && sessionTimestamp) {
      const sessionAge = Date.now() - sessionTimestamp;
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge < maxSessionAge) {
        return true;
      }
      // * Clear expired session
      clearSessionData(SESSION_KEYS.IS_UNLOCKED);
      clearSessionData(SESSION_KEYS.SESSION_TIMESTAMP);
    }

    // * Check URL parameters on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const passwordParam = urlParams.get("password");
    const securePassword = getSecurePassword();

    if (passwordParam?.toLowerCase().trim() === securePassword) {
      // * Set session data
      setSessionData(SESSION_KEYS.IS_UNLOCKED, true);
      setSessionData(SESSION_KEYS.SESSION_TIMESTAMP, Date.now());
      return true;
    }

    return false;
  });

  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(checkRateLimit());
  const audioRef = React.useRef(null);
  const authTimeoutRef = React.useRef(null);

  // * Update rate limit info periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const next = checkRateLimit();
      setRateLimitInfo((prev) => {
        if (!prev) return next;
        const changed =
          prev.isLimited !== next.isLimited ||
          prev.remainingAttempts !== next.remainingAttempts ||
          prev.lockoutRemaining !== next.lockoutRemaining;
        return changed ? next : prev;
      });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const dismissFeedback = useCallback(() => {
    setShowIncorrectFeedback(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const checkPassword = useCallback((password) => {
    // * Check rate limiting first
    const rateLimit = checkRateLimit();
    if (rateLimit.isLimited) {
      return false;
    }

    const securePassword = getSecurePassword();
    const inputPassword = password.toLowerCase().trim();

    if (inputPassword === securePassword) {
      // * Success - set session data immediately for persistence
      setSessionData(SESSION_KEYS.IS_UNLOCKED, true);
      setSessionData(SESSION_KEYS.SESSION_TIMESTAMP, Date.now());

      // * Clear attempt count on success
      clearSessionData(SESSION_KEYS.ATTEMPT_COUNT);
      clearSessionData(SESSION_KEYS.LAST_ATTEMPT);

      setShowSuccessFeedback(true);
      setTimeout(() => setShowSuccessFeedback(false), AUTH_TIMING.SUCCESS_FEEDBACK_DURATION);

      // * Delay the state change to prevent UI issues during Matrix modal transition
      // This prevents sudden DOM changes and blur effect initialization conflicts
      // The delay matches the Matrix success feedback duration for smooth UX
      authTimeoutRef.current = setTimeout(() => {
        setIsUnlocked(true);
        authTimeoutRef.current = null;
      }, AUTH_TIMING.MATRIX_MODAL_CLOSE_DELAY);

      return true;
    }

    // * Failed attempt
    incrementAttemptCount();
    setRateLimitInfo(checkRateLimit());

    setShowIncorrectFeedback(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.loop = true;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // * Playback was interrupted or failed.
          // * This is normal if the user dismissed the feedback quickly.
          // * Optionally, log or handle the error here if needed.
        });
      }
    }
    return false;
  }, []);

  // * Logout function
  const logout = useCallback(() => {
    // Clear any pending authentication timeout
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
      authTimeoutRef.current = null;
    }

    setIsUnlocked(false);
    clearSessionData(SESSION_KEYS.IS_UNLOCKED);
    clearSessionData(SESSION_KEYS.SESSION_TIMESTAMP);
    clearSessionData(SESSION_KEYS.ATTEMPT_COUNT);
    clearSessionData(SESSION_KEYS.LAST_ATTEMPT);
  }, []);

  // * Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          isUnlocked,
          checkPassword,
          showIncorrectFeedback,
          showSuccessFeedback,
          dismissFeedback,
          logout,
          rateLimitInfo,
        }),
        [
          isUnlocked,
          checkPassword,
          showIncorrectFeedback,
          showSuccessFeedback,
          dismissFeedback,
          logout,
          rateLimitInfo,
        ],
      )}
    >
      <audio ref={audioRef} src={incorrectAudio} style={{ display: "none" }}>
        <track kind="captions" srcLang="en" label="English" />
      </audio>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
