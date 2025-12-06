import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import NuUhUhEasterEgg from "./NuUhUhEasterEgg";
import "./matrix.scss";

// * Harder button mashing constants
const LOGOUT_PROGRESS_THRESHOLD = 50; // Progress threshold to track
const LOGOUT_REQUIRED_PROGRESS = 100;
const PROGRESS_DECAY_INTERVAL = 100; // Faster decay (reduced from 140)
const PROGRESS_DECAY_BASE = 0.8; // Increased decay rate
const PROGRESS_DECAY_RAMP = [
  { threshold: 2000, value: 1.5 }, // Increased decay
  { threshold: 1500, value: 1.2 },
  { threshold: 1000, value: 0.95 },
  { threshold: 600, value: 0.7 },
];
const MIN_IDLE_BEFORE_DECAY = 200; // Reduced from 300
const KEY_VARIETY_WINDOW = 10;
const REPETITION_DECAY_RESET_MS = 500; // Reduced from 650

const LogoutKeypad = () => {
  const { isUnlocked, logout } = useAuth();
  const [progress, setProgress] = useState(0);
  const [hasPassedThreshold, setHasPassedThreshold] = useState(false);
  const [popups, setPopups] = useState([]);
  const lastKeyTimeRef = useRef(null);
  const keyPatternRef = useRef({ recentKeys: [], lastKey: null, streak: 0 });
  const popupCountRef = useRef(0);

  // * Reset when unlocked state changes
  useEffect(() => {
    if (!isUnlocked) {
      setProgress(0);
      setHasPassedThreshold(false);
      setPopups([]);
      popupCountRef.current = 0;
      lastKeyTimeRef.current = null;
      keyPatternRef.current = { recentKeys: [], lastKey: null, streak: 0 };
    }
  }, [isUnlocked]);

  // * Handle key presses
  const handleKeyDown = useCallback(
    (e) => {
      if (!isUnlocked) {
        return;
      }

      // * Ignore modifier keys and special keys
      if (e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab") {
        return;
      }

      const isCharacterKey =
        e.key.length === 1 || e.key === "Space" || e.key === "Enter";
      const isBackspace = e.key === "Backspace";

      if (!isCharacterKey && !isBackspace) {
        return;
      }

      const now = Date.now();
      const lastTime = lastKeyTimeRef.current;
      const delta = lastTime ? now - lastTime : null;

      // * Harder thresholds - require faster typing
      let baseIncrement = 0.4; // Reduced from 0.6

      if (delta !== null) {
        if (delta < 80) {
          // Very fast - reduced threshold from 120
          baseIncrement = 1.5; // Reduced from 1.8
        } else if (delta < 150) {
          // Fast - reduced threshold from 220
          baseIncrement = 1.0; // Reduced from 1.3
        } else if (delta < 250) {
          // Medium - reduced threshold from 360
          baseIncrement = 0.7; // Reduced from 0.95
        } else {
          baseIncrement = 0.3; // Reduced from 0.45
        }
      }

      let progressDelta = 0;

      if (isBackspace) {
        e.preventDefault();
        keyPatternRef.current.lastKey = null;
        keyPatternRef.current.streak = 0;
        progressDelta = -Math.max(0.6, baseIncrement * 0.8); // Increased penalty
      } else if (isCharacterKey) {
        e.preventDefault();
        const normalizedKey = e.key === " " ? "space" : e.key.toLowerCase();
        const tracker = keyPatternRef.current;

        // * Track repetition
        if (
          tracker.lastKey === normalizedKey &&
          (delta === null || delta <= REPETITION_DECAY_RESET_MS)
        ) {
          tracker.streak += 1;
        } else {
          tracker.streak = 1;
        }

        tracker.lastKey = normalizedKey;
        tracker.recentKeys = [
          ...tracker.recentKeys.slice(-(KEY_VARIETY_WINDOW - 1)),
          normalizedKey,
        ];

        const uniqueCount = new Set(tracker.recentKeys).size;
        let comboMultiplier = 1;

        // * Variety bonuses (harder to achieve)
        if (uniqueCount >= 8) {
          comboMultiplier += 0.2;
        } else if (uniqueCount >= 6) {
          comboMultiplier += 0.1;
        } else if (uniqueCount >= 4) {
          comboMultiplier += 0.05;
        } else if (
          tracker.recentKeys.length >= KEY_VARIETY_WINDOW &&
          uniqueCount <= 3
        ) {
          comboMultiplier *= 0.3; // Increased penalty
        }

        // * Repetition penalties (stricter)
        if (tracker.streak >= 5) {
          comboMultiplier *= 0.1; // Increased penalty
        } else if (tracker.streak >= 3) {
          comboMultiplier *= 0.2; // Increased penalty
        } else if (tracker.streak >= 2) {
          comboMultiplier *= 0.35; // Increased penalty
        }

        if (normalizedKey === "enter" || normalizedKey === "space") {
          comboMultiplier *= 0.4; // Increased penalty
        }

        progressDelta = baseIncrement * comboMultiplier;
      }

      lastKeyTimeRef.current = now;

      // * Update progress
      if (progressDelta > 0) {
        setProgress((prev) => {
          const friction =
            prev >= 85 ? 0.25 : prev >= 65 ? 0.4 : prev >= 40 ? 0.55 : 0.7; // Increased friction
          const next = prev + progressDelta * friction;

          // * Track if we've passed the threshold
          if (next >= LOGOUT_PROGRESS_THRESHOLD && !hasPassedThreshold) {
            setHasPassedThreshold(true);
          }

          // * Complete logout when reaching 100%
          if (next >= LOGOUT_REQUIRED_PROGRESS) {
            setTimeout(() => {
              logout();
            }, 100);
            return LOGOUT_REQUIRED_PROGRESS;
          }

          return Math.min(LOGOUT_REQUIRED_PROGRESS, next);
        });
      } else if (progressDelta < 0) {
        setProgress((prev) => Math.max(0, prev + progressDelta));
      }
    },
    [isUnlocked, hasPassedThreshold, logout],
  );

  // * Progress decay effect
  useEffect(() => {
    if (!isUnlocked || progress >= LOGOUT_REQUIRED_PROGRESS) {
      return;
    }

    const decayInterval = window.setInterval(() => {
      const lastTime = lastKeyTimeRef.current;
      const now = Date.now();

      const applyDecay = (decayAmount) => {
        if (decayAmount <= 0) {
          return;
        }

        setProgress((prev) => {
          // * Skip if already at 0
          if (prev <= 0) {
            return prev;
          }

          const next = Math.max(0, prev - decayAmount);

          // * Check if progress reached 0 after passing threshold
          if (next <= 0 && hasPassedThreshold) {
            const popupCount = Math.min(popupCountRef.current + 1, 3);
            popupCountRef.current = popupCount;

            // * Create multiple popups
            for (let i = 0; i < popupCount; i++) {
              setTimeout(() => {
                const popupId = Date.now() + i;
                setPopups((prevPopups) => [...prevPopups, popupId]);
              }, i * 200); // Stagger popups
            }

            // * Reset threshold flag after triggering
            setHasPassedThreshold(false);
            popupCountRef.current = 0;
          }

          return next;
        });
      };

      if (lastTime === null) {
        applyDecay(PROGRESS_DECAY_BASE);
        return;
      }

      const idleDuration = now - lastTime;

      if (idleDuration < MIN_IDLE_BEFORE_DECAY) {
        return;
      }

      const rampDecay = PROGRESS_DECAY_RAMP.find(
        ({ threshold }) => idleDuration >= threshold,
      )?.value;

      const decay =
        rampDecay ??
        Math.min(
          PROGRESS_DECAY_BASE + (idleDuration - MIN_IDLE_BEFORE_DECAY) / 2500,
          PROGRESS_DECAY_RAMP[0].value,
        );

      applyDecay(decay);
    }, PROGRESS_DECAY_INTERVAL);

    return () => {
      window.clearInterval(decayInterval);
    };
  }, [isUnlocked, progress, hasPassedThreshold]);

  // * Keyboard event listener
  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUnlocked, handleKeyDown]);

  // * Handle popup dismissal
  const handleDismissPopup = useCallback((popupId) => {
    setPopups((prev) => {
      const remaining = prev.filter((id) => id !== popupId);
      // * Reset popup count when all popups are dismissed
      if (remaining.length === 0) {
        popupCountRef.current = 0;
      }
      return remaining;
    });
  }, []);

  if (!isUnlocked) {
    return null;
  }

  const progressPercent = Math.min(100, Math.max(0, progress));

  return (
    <>
      <div className="logout-keypad">
        <div className="logout-keypad__header">
          <span className="logout-keypad__label">Logout Sequence</span>
          <span className="logout-keypad__progress">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="logout-keypad__progress-bar">
          <div
            className="logout-keypad__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="logout-keypad__hint">
          {progressPercent >= LOGOUT_REQUIRED_PROGRESS
            ? "Logging out..."
            : progressPercent >= LOGOUT_PROGRESS_THRESHOLD
              ? "Keep mashing to complete logout"
              : "Mash keys rapidly to logout"}
        </div>
      </div>
      {popups.map((popupId) => (
        <NuUhUhEasterEgg key={popupId} onClose={() => handleDismissPopup(popupId)} />
      ))}
    </>
  );
};

export default LogoutKeypad;
