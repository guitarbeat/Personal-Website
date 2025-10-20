// Third-party imports
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

// Hook imports
import { useMobileDetection } from "../../../hooks/useMobileDetection";

// Constants
import {
  SECURITY,
  ANIMATION_TIMING,
  ERROR_MESSAGES,
} from "./constants";

const AuthContext = createContext();

// * Session storage keys
const SESSION_KEYS = {
  IS_UNLOCKED: "matrix_auth_unlocked",
  SESSION_TIMESTAMP: "matrix_auth_timestamp",
  MOBILE_UNLOCKED: "matrix_auth_mobile_unlocked",
  MOBILE_SESSION_TIMESTAMP: "matrix_auth_mobile_timestamp",
};

// * Session management utilities
const getSessionData = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`${ERROR_MESSAGES.STORAGE_ERROR} for ${key}:`, error);
    return null;
  }
};

const setSessionData = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`${ERROR_MESSAGES.STORAGE_ERROR} for ${key}:`, error);
    if (error.name === "QuotaExceededError") {
      try {
        Object.values(SESSION_KEYS).forEach(clearSessionData);
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (retryError) {
        console.error(
          `${ERROR_MESSAGES.STORAGE_ERROR} even after cleanup:`,
          retryError,
        );
      }
    }
  }
};

const clearSessionData = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`${ERROR_MESSAGES.STORAGE_ERROR} for ${key}:`, error);
  }
};

export const AuthProvider = ({ children }) => {
  const { isMobile } = useMobileDetection();

  const [isUnlocked, setIsUnlocked] = useState(() => {
    const sessionUnlocked = getSessionData(SESSION_KEYS.IS_UNLOCKED);
    const sessionTimestamp = getSessionData(SESSION_KEYS.SESSION_TIMESTAMP);

    if (sessionUnlocked && sessionTimestamp) {
      const sessionAge = Date.now() - sessionTimestamp;
      const maxSessionAge = SECURITY.SESSION.DURATION_MS;

      if (sessionAge < maxSessionAge) {
        return true;
      }

      clearSessionData(SESSION_KEYS.IS_UNLOCKED);
      clearSessionData(SESSION_KEYS.SESSION_TIMESTAMP);
    }

    return false;
  });

  const [isMobileUnlocked, setIsMobileUnlocked] = useState(() => {
    const mobileSessionUnlocked = getSessionData(SESSION_KEYS.MOBILE_UNLOCKED);
    const mobileSessionTimestamp = getSessionData(
      SESSION_KEYS.MOBILE_SESSION_TIMESTAMP,
    );

    if (mobileSessionUnlocked && mobileSessionTimestamp) {
      const sessionAge = Date.now() - mobileSessionTimestamp;
      const maxSessionAge = SECURITY.SESSION.DURATION_MS;

      if (sessionAge < maxSessionAge) {
        return true;
      }

      clearSessionData(SESSION_KEYS.MOBILE_UNLOCKED);
      clearSessionData(SESSION_KEYS.MOBILE_SESSION_TIMESTAMP);
    }

    return false;
  });

  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const authTimeoutRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  const finalizeUnlock = useCallback(() => {
    setIsUnlocked(true);
    if (isMobile) {
      setIsMobileUnlocked(true);
    }
  }, [isMobile]);

  const completeHack = useCallback(() => {
    setSessionData(SESSION_KEYS.IS_UNLOCKED, true);
    setSessionData(SESSION_KEYS.SESSION_TIMESTAMP, Date.now());

    if (isMobile) {
      setSessionData(SESSION_KEYS.MOBILE_UNLOCKED, true);
      setSessionData(SESSION_KEYS.MOBILE_SESSION_TIMESTAMP, Date.now());
    }

    setShowSuccessFeedback(true);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setShowSuccessFeedback(false);
      feedbackTimeoutRef.current = null;
    }, ANIMATION_TIMING.SUCCESS_FEEDBACK_DURATION);

    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
    }
    authTimeoutRef.current = setTimeout(() => {
      finalizeUnlock();
      authTimeoutRef.current = null;
    }, ANIMATION_TIMING.MATRIX_MODAL_CLOSE_DELAY);

    return true;
  }, [isMobile, finalizeUnlock]);

  const logout = useCallback(() => {
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
      authTimeoutRef.current = null;
    }

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }

    setShowSuccessFeedback(false);
    setIsUnlocked(false);
    setIsMobileUnlocked(false);

    clearSessionData(SESSION_KEYS.IS_UNLOCKED);
    clearSessionData(SESSION_KEYS.SESSION_TIMESTAMP);
    clearSessionData(SESSION_KEYS.MOBILE_UNLOCKED);
    clearSessionData(SESSION_KEYS.MOBILE_SESSION_TIMESTAMP);
  }, []);

  useEffect(() => {
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const toolsAccessible = useMemo(() => {
    if (isMobile) {
      return isMobileUnlocked;
    }
    return isUnlocked;
  }, [isMobile, isMobileUnlocked, isUnlocked]);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          isUnlocked,
          isMobileUnlocked,
          toolsAccessible,
          completeHack,
          showSuccessFeedback,
          logout,
          isMobile,
        }),
        [
          isUnlocked,
          isMobileUnlocked,
          toolsAccessible,
          completeHack,
          showSuccessFeedback,
          logout,
          isMobile,
        ],
      )}
    >
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
