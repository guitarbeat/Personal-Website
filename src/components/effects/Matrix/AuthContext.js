// Third-party imports
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Hook imports
import { useMobileDetection } from "../../../hooks/useMobileDetection";

// Constants
import { ANIMATION_TIMING, ERROR_MESSAGES, SECURITY } from "./constants";

const AuthContext = createContext();

// * Session storage keys
const SESSION_KEYS = {
  IS_UNLOCKED: "matrix_auth_unlocked",
  SESSION_TIMESTAMP: "matrix_auth_timestamp",
  MOBILE_UNLOCKED: "matrix_auth_mobile_unlocked",
  MOBILE_SESSION_TIMESTAMP: "matrix_auth_mobile_timestamp",
};

const DEVICE_KEYS = {
  DEFAULT: "default",
  MOBILE: "mobile",
};

const SESSION_CONFIG = {
  [DEVICE_KEYS.DEFAULT]: {
    unlockedKey: SESSION_KEYS.IS_UNLOCKED,
    timestampKey: SESSION_KEYS.SESSION_TIMESTAMP,
  },
  [DEVICE_KEYS.MOBILE]: {
    unlockedKey: SESSION_KEYS.MOBILE_UNLOCKED,
    timestampKey: SESSION_KEYS.MOBILE_SESSION_TIMESTAMP,
  },
};

const INITIAL_UNLOCK_STATE = {
  [DEVICE_KEYS.DEFAULT]: false,
  [DEVICE_KEYS.MOBILE]: false,
};

const hasSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

// * Session management utilities
const getSessionData = (key) => {
  if (!hasSessionStorage()) {
    return null;
  }

  try {
    const data = window.sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`${ERROR_MESSAGES.STORAGE_ERROR} for ${key}:`, error);
    return null;
  }
};

const setSessionData = (key, value) => {
  if (!hasSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`${ERROR_MESSAGES.STORAGE_ERROR} for ${key}:`, error);
    if (error.name === "QuotaExceededError") {
      try {
        Object.values(SESSION_KEYS).forEach(clearSessionData);
        window.sessionStorage.setItem(key, JSON.stringify(value));
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
  if (!hasSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`${ERROR_MESSAGES.STORAGE_ERROR} for ${key}:`, error);
  }
};

const createUnlockStateFromSession = () => {
  const unlockState = { ...INITIAL_UNLOCK_STATE };
  const maxSessionAge = SECURITY.SESSION.DURATION_MS;

  for (const [device, keys] of Object.entries(SESSION_CONFIG)) {
    const isStoredUnlocked = getSessionData(keys.unlockedKey);
    const storedTimestamp = getSessionData(keys.timestampKey);

    if (isStoredUnlocked && storedTimestamp) {
      const sessionAge = Date.now() - storedTimestamp;
      if (sessionAge < maxSessionAge) {
        unlockState[device] = true;
      } else {
        clearSessionData(keys.unlockedKey);
        clearSessionData(keys.timestampKey);
      }
    }
  }

  return unlockState;
};

export const AuthProvider = ({ children }) => {
  const { isMobile } = useMobileDetection();

  const [unlockState, setUnlockState] = useState(createUnlockStateFromSession);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const authTimeoutRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  const updateUnlockState = useCallback((device, value) => {
    setUnlockState((prev) => {
      if (prev[device] === value) {
        return prev;
      }

      return {
        ...prev,
        [device]: value,
      };
    });
  }, []);

  const persistUnlockState = useCallback((device, value) => {
    const config = SESSION_CONFIG[device];
    if (!config) {
      return;
    }

    if (value) {
      setSessionData(config.unlockedKey, true);
      setSessionData(config.timestampKey, Date.now());
    } else {
      clearSessionData(config.unlockedKey);
      clearSessionData(config.timestampKey);
    }
  }, []);

  const resetUnlockState = useCallback(() => {
    setUnlockState({ ...INITIAL_UNLOCK_STATE });
    for (const device of Object.keys(SESSION_CONFIG)) {
      persistUnlockState(device, false);
    }
  }, [persistUnlockState]);

  const finalizeUnlock = useCallback(() => {
    updateUnlockState(DEVICE_KEYS.DEFAULT, true);

    if (isMobile) {
      updateUnlockState(DEVICE_KEYS.MOBILE, true);
    }
  }, [isMobile, updateUnlockState]);

  const completeHack = useCallback(() => {
    const devicesToPersist = [DEVICE_KEYS.DEFAULT];
    if (isMobile) {
      devicesToPersist.push(DEVICE_KEYS.MOBILE);
    }

    for (const device of devicesToPersist) {
      persistUnlockState(device, true);
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
  }, [finalizeUnlock, isMobile, persistUnlockState]);

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
    resetUnlockState();
  }, [resetUnlockState]);

  // * Dev mode: Quick unlock/lock toggle for previewing unlocked state
  const devToggleUnlock = useCallback(() => {
    const currentState = isMobile ? isMobileUnlocked : isUnlocked;
    const targetDevice = isMobile ? DEVICE_KEYS.MOBILE : DEVICE_KEYS.DEFAULT;

    if (currentState) {
      // Lock
      updateUnlockState(targetDevice, false);
      persistUnlockState(targetDevice, false);
    } else {
      // Unlock
      updateUnlockState(targetDevice, true);
      persistUnlockState(targetDevice, true);
    }
  }, [isMobile, isMobileUnlocked, isUnlocked, persistUnlockState, updateUnlockState]);

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

  const {
    [DEVICE_KEYS.DEFAULT]: isUnlocked,
    [DEVICE_KEYS.MOBILE]: isMobileUnlocked,
  } = unlockState;

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
          devToggleUnlock,
        }),
        [
          isUnlocked,
          isMobileUnlocked,
          toolsAccessible,
          completeHack,
          showSuccessFeedback,
          logout,
          isMobile,
          devToggleUnlock,
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
