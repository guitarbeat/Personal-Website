// Third-party imports
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

// Context imports
import { useAuth } from "./AuthContext";

// Components

// Styles
import "./matrix.scss";

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;
const PROGRESS_DECAY_INTERVAL = 140;
const PROGRESS_DECAY_BASE = 0.12;
const PROGRESS_DECAY_RAMP = [
  { threshold: 2600, value: 0.65 },
  { threshold: 1900, value: 0.42 },
  { threshold: 1300, value: 0.26 },
  { threshold: 900, value: 0.18 },
];
const MIN_IDLE_BEFORE_DECAY = 480;

const INITIAL_FEEDBACK = "Initialize uplink by mashing the keys.";

const useHackSession = (isVisible) => {
  const [password, setPassword] = useState("");
  const [hackingBuffer, setHackingBuffer] = useState("");
  const [hackProgress, setHackProgress] = useState(0);
  const [hackFeedback, setHackFeedback] = useState(INITIAL_FEEDBACK);
  const [hintLevel, setHintLevel] = useState(0);
  const [areHintsUnlocked, setAreHintsUnlocked] = useState(false);

  const resetSession = useCallback(() => {
    setPassword("");
    setHackingBuffer("");
    setHackProgress(0);
    setHackFeedback(INITIAL_FEEDBACK);
    setHintLevel(0);
    setAreHintsUnlocked(false);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    resetSession();
  }, [isVisible, resetSession]);

  const isHackingComplete = hackProgress >= 100;

  const handleHackCompletion = useCallback(() => {
    setHackFeedback("Firewall bypassed. Enter password to finalize override.");
    setHackingBuffer("");
    setAreHintsUnlocked(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !isHackingComplete || areHintsUnlocked) {
      return;
    }

    handleHackCompletion();
  }, [
    isVisible,
    isHackingComplete,
    areHintsUnlocked,
    handleHackCompletion,
  ]);

  const advanceHintLevel = useCallback(() => {
    setHintLevel((prev) => (prev < 2 ? prev + 1 : prev));
  }, []);

  const updateHackProgress = useCallback((updater) => {
    setHackProgress((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : Number(updater ?? prev);

      if (Number.isNaN(next)) {
        return prev;
      }

      return Math.max(0, Math.min(100, next));
    });
  }, []);

  return {
    password,
    setPassword,
    hackingBuffer,
    setHackingBuffer,
    hackProgress,
    setHackProgress: updateHackProgress,
    hackFeedback,
    setHackFeedback,
    hintLevel,
    advanceHintLevel,
    areHintsUnlocked,
    isHackingComplete,
  };
};

const Matrix = ({ isVisible, onSuccess }) => {
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  const {
    password,
    setPassword,
    hackingBuffer,
    setHackingBuffer,
    hackProgress,
    setHackProgress,
    hackFeedback,
    setHackFeedback,
    hintLevel,
    advanceHintLevel,
    areHintsUnlocked,
    isHackingComplete,
  } = useHackSession(isVisible);
  const [sessionStart] = useState(() => Date.now());
  const [sessionClock, setSessionClock] = useState(() => Date.now());
  const [matrixCoordinate] = useState(() => {
    const sector = Math.floor(Math.random() * 64)
      .toString(16)
      .toUpperCase()
      .padStart(2, "0");
    const node = Math.floor(Math.random() * 4096)
      .toString(16)
      .toUpperCase()
      .padStart(3, "0");
    return `${sector}:${node}`;
  });
  const [signalSeed] = useState(() => Math.floor(Math.random() * 900) + 100);
  const lastKeyTimeRef = useRef(null);
  const {
    checkPassword,
    showIncorrectFeedback,
    showSuccessFeedback,
    dismissFeedback,
    rateLimitInfo,
    audioStatus,
    isAudioMuted,
    audioVolume,
    handleVolumeChange,
    handleMuteToggle,
  } = useAuth();

  // * Configuration constants
  const ALPHABET =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";




  // * Handle form submission with rate limiting
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!isHackingComplete) {
        setHackFeedback("Access channel not ready—keep smashing those keys!");
        return;
      }

      if (rateLimitInfo.isLimited) {
        return;
      }

      const success = checkPassword(password);
      if (success) {
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
      setPassword("");
    },
    [
      password,
      checkPassword,
      onSuccess,
      rateLimitInfo.isLimited,
      isHackingComplete,
    ],
  );

  const handlePasswordChange = useCallback(
    (e) => {
      const inputValue = e.target.value;

      if (!isHackingComplete) {
        setHackingBuffer(inputValue.slice(-64));
        return;
      }

      setPassword(inputValue);
    },
    [isHackingComplete],
  );

  const handleHackKeyDown = useCallback(
    (e) => {
      if (isHackingComplete || rateLimitInfo.isLimited) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      if (e.key === "Tab") {
        return;
      }

      const isCharacterKey = e.key.length === 1 || e.key === "Space";
      if (!isCharacterKey && e.key !== "Backspace") {
        return;
      }

      const now = Date.now();
      const lastTime = lastKeyTimeRef.current;
      const delta = lastTime ? now - lastTime : null;
      let increment = 2;

      if (delta !== null) {
        if (delta < 120) {
          increment = 6;
        } else if (delta < 250) {
          increment = 4;
        } else if (delta < 400) {
          increment = 2.5;
        } else {
          increment = 1.5;
        }
      }

      let feedbackMessage = "Signal detected. Keep the keystrokes flowing.";

      if (delta !== null) {
        if (delta < 120) {
          feedbackMessage = "Trace evaded! Ultra-fast breach underway.";
        } else if (delta < 250) {
          feedbackMessage = "Firewall destabilizing—nice rhythm.";
        } else if (delta < 400) {
          feedbackMessage = "Maintaining uplink. Accelerate to finish.";
        } else {
          feedbackMessage = "Connection cooling—slam the keys faster!";
        }
      }

      lastKeyTimeRef.current = now;
      setHackFeedback(feedbackMessage);
      setHackProgress((prev) => Math.min(100, prev + increment));
    },
    [
      isHackingComplete,
      rateLimitInfo.isLimited,
      setHackFeedback,
      setHackProgress,
    ],
  );

  // * Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        // If showing incorrect feedback, only dismiss it instead of closing the modal
        if (showIncorrectFeedback) {
          dismissFeedback();
        } else {
          onSuccess?.();
        }
      } else if (
        e.key === "Enter" &&
        !showIncorrectFeedback &&
        !showSuccessFeedback &&
        isHackingComplete
      ) {
        handleSubmit(e);
      } else if ((e.key === "h" || e.key === "H") && areHintsUnlocked) {
        advanceHintLevel();
      }
    },
    [
      onSuccess,
      handleSubmit,
      showIncorrectFeedback,
      showSuccessFeedback,
      dismissFeedback,
      isHackingComplete,
      areHintsUnlocked,
      advanceHintLevel,
    ],
  );

  // * Maintain session runtime + telemetry updates while visible
  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    setSessionClock(Date.now());
    const interval = window.setInterval(() => {
      setSessionClock(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isVisible]);

  const sessionElapsedSeconds = Math.max(
    0,
    Math.round((sessionClock - sessionStart) / 1000),
  );

  const runtimeDisplay = useMemo(() => {
    const iso = new Date(sessionElapsedSeconds * 1000).toISOString();
    return iso.substring(11, 19);
  }, [sessionElapsedSeconds]);

  const timecodeDisplay = useMemo(() => {
    const isoTime = new Date(sessionClock).toISOString();
    return isoTime.substring(11, 19);
  }, [sessionClock]);

  const signalGain = useMemo(() => {
    const oscillation = Math.sin(sessionElapsedSeconds / 2) * 4;
    const progressBonus = hackProgress / 3;
    return Math.round(signalSeed / 10 + oscillation + progressBonus);
  }, [sessionElapsedSeconds, hackProgress, signalSeed]);

  const signalChannel = useMemo(() => {
    const base = Math.floor(signalSeed / 3);
    const jitter = (sessionElapsedSeconds % 7) * 3;
    return (base + jitter).toString().padStart(3, "0");
  }, [signalSeed, sessionElapsedSeconds]);

  const breachPhase = useMemo(() => {
    if (isHackingComplete) {
      return {
        label: "CHANNEL STABILIZED",
        detail: "Credentials accepted",
        tone: "success",
      };
    }

    if (hackProgress >= 75) {
      return {
        label: "FIREWALL COLLAPSING",
        detail: "Entropy spike detected",
        tone: "warning",
      };
    }

    if (hackProgress >= 45) {
      return {
        label: "ENCRYPTION FRACTURING",
        detail: "Ghost pulses synchronized",
        tone: "accent",
      };
    }

    return {
      label: "SIGNAL CALIBRATION",
      detail: "Aligning neural uplink",
      tone: "neutral",
    };
  }, [hackProgress, isHackingComplete]);

  // * Handle container clicks
  const handleContainerClick = useCallback(
    (e) => {
      if (e.target !== canvasRef.current) {
        return;
      }

      if (showIncorrectFeedback || showSuccessFeedback) {
        return;
      }

      onSuccess?.();
    },
    [showIncorrectFeedback, showSuccessFeedback, onSuccess],
  );

  // * Handle hint click
  const handleHintClick = useCallback(
    (e) => {
      if (!areHintsUnlocked) {
        return;
      }

      e.stopPropagation();
      advanceHintLevel();
    },
    [areHintsUnlocked, advanceHintLevel],
  );

  // * Keyboard event listeners
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    lastKeyTimeRef.current = null;

    const handleKeyPress = () => {
      if (showIncorrectFeedback) {
        dismissFeedback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    isVisible,
    showIncorrectFeedback,
    dismissFeedback,
    handleKeyDown,
  ]);

  useEffect(() => {
    if (!isVisible || isHackingComplete) {
      return undefined;
    }

    const fallbackInterval = window.setInterval(() => {
      const lastTime = lastKeyTimeRef.current;
      const now = Date.now();

      const applyDecay = (decayAmount) => {
        if (decayAmount <= 0) {
          return;
        }

        setHackProgress((prev) => {
          if (prev <= 0) {
            return prev;
          }

          const next = Math.max(0, prev - decayAmount);

          if (next < prev) {
            setHackFeedback((current) => {
              if (
                current ===
                "Firewall bypassed. Enter password to finalize override."
              ) {
                return current;
              }

              return current.includes("Signal fading")
                ? current
                : "Signal fading—keep the keys alive.";
            });
          }

          if (next === 0) {
            lastKeyTimeRef.current = null;
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
          PROGRESS_DECAY_BASE + (idleDuration - MIN_IDLE_BEFORE_DECAY) / 3200,
          PROGRESS_DECAY_RAMP[0].value,
        );

      applyDecay(decay);
    }, PROGRESS_DECAY_INTERVAL);

    return () => {
      window.clearInterval(fallbackInterval);
    };
  }, [
    isVisible,
    isHackingComplete,
    setHackFeedback,
    setHackProgress,
  ]);



  // * Enhanced Matrix Rain Effect
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Drop {
      constructor(x) {
        this.x = x;
        this.y = -100;
        this.char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        this.changeInterval = Math.random() * 50 + 15;
        this.frame = 0;
        this.brightness = Math.random() > 0.95;
        this.trailLength = Math.floor(Math.random() * 3) + 2;
        this.trail = [];
        this.initializeCharacterProperties();
      }

      initializeCharacterProperties() {
        this.speed = Math.random() * 2 + 0.8;
        this.fontSize = Math.floor(
          Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE,
        );
        this.opacity = Math.random() * 0.6 + 0.3;
      }

      update() {
        this.y += this.speed;
        this.frame++;

        // * Update trail
        this.trail.push({ char: this.char, y: this.y });
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }

        if (this.frame >= this.changeInterval) {
          this.char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          this.frame = 0;
          this.brightness = Math.random() > 0.97;
        }

        if (this.y * this.fontSize > canvas.height) {
          this.y = -100 / this.fontSize;
          this.initializeCharacterProperties();
          this.trail = [];
        }
      }

      draw() {
        context.font = `${this.fontSize}px monospace`;

        // * Draw trail
        this.trail.forEach((trailItem, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.3;
          const gradient = context.createLinearGradient(
            this.x,
            trailItem.y,
            this.x,
            trailItem.y + this.fontSize,
          );
          gradient.addColorStop(0, `rgba(0, 255, 0, ${trailOpacity})`);
          gradient.addColorStop(1, `rgba(0, 170, 0, ${trailOpacity * 0.7})`);

          context.fillStyle = gradient;
          context.shadowColor = "rgba(0, 255, 0, 0.2)";
          context.shadowBlur = 1;
          context.fillText(trailItem.char, this.x, trailItem.y * this.fontSize);
        });

        // * Draw main character
        const gradient = context.createLinearGradient(
          this.x,
          this.y,
          this.x,
          this.y + this.fontSize,
        );
        gradient.addColorStop(0, `rgba(0, 255, 0, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(0, 170, 0, ${this.opacity * 0.7})`);

        if (this.brightness) {
          context.fillStyle = `rgba(255, 255, 255, ${this.opacity * 1.5})`;
          context.shadowColor = "rgba(255, 255, 255, 0.8)";
          context.shadowBlur = 8;
        } else {
          context.fillStyle = gradient;
          context.shadowColor = "rgba(0, 255, 0, 0.4)";
          context.shadowBlur = 3;
        }

        context.fillText(this.char, this.x, this.y * this.fontSize);
        context.shadowBlur = 0;
      }
    }

    const columns = Math.floor(canvas.width / MIN_FONT_SIZE);
    const drops = Array(columns)
      .fill(null)
      .map((_, i) => {
        const drop = new Drop(i * MIN_FONT_SIZE);
        drop.y = (Math.random() * canvas.height) / MIN_FONT_SIZE;
        return drop;
      });

    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        context.fillStyle = "rgba(0, 0, 0, 0.03)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (const drop of drops) {
          drop.update();
          drop.draw();
        }

        lastTime = currentTime;
      }
    };

    let animationFrameId;
    const animate = (currentTime) => {
      draw(currentTime);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);






  if (!isVisible) {
    return null;
  }

  return (
    <dialog
      open
      className={`matrix-container ${isVisible ? "visible" : ""}`}
      onClick={handleContainerClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          // If showing incorrect feedback, only dismiss it instead of closing the modal
          if (showIncorrectFeedback) {
            dismissFeedback();
          } else {
            onSuccess();
          }
        }
      }}
      aria-modal="true"
      aria-labelledby="matrix-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'transparent'
      }}
    >
      <canvas
        ref={canvasRef}
        className="matrix-canvas"
        role="img"
        aria-label="Matrix rain animation"
      />
      <div className="matrix-console-shell">
        <section
          className="matrix-hero"
          aria-labelledby="matrix-title"
          aria-describedby="matrix-subtitle"
        >
          <div className="matrix-hero__ambient" aria-hidden="true">
            <div className="matrix-hero__grid" />
            <div className="matrix-hero__orb matrix-hero__orb--left" />
            <div className="matrix-hero__orb matrix-hero__orb--right" />
          </div>
          <div className="matrix-hero__content">
            <div className="matrix-hero__badge">
              {isHackingComplete ? "ACCESS CHANNEL SECURED" : "NEURAL LINK PRIMED"}
            </div>
            <h2 id="matrix-title" className="matrix-hero__title">
              Matrix breach console
            </h2>
            <p id="matrix-subtitle" className="matrix-hero__subtitle">
              Quantum uplink anchored to sector
              {" "}
              <span className="matrix-hero__highlight">{matrixCoordinate}</span>
              {" "}
              @ {timecodeDisplay}Z. Supply infiltration key to finalize handshake.
            </p>
            <ul className="matrix-hero__telemetry">
              <li className="matrix-hero__stat">
                <span className="matrix-hero__stat-label">Session runtime</span>
                <span className="matrix-hero__stat-value">{runtimeDisplay}</span>
              </li>
              <li className="matrix-hero__stat">
                <span className="matrix-hero__stat-label">Signal gain</span>
                <span className="matrix-hero__stat-value">{signalGain} dB</span>
                <span className="matrix-hero__stat-detail">Channel {signalChannel}</span>
              </li>
              <li
                className={`matrix-hero__stat matrix-hero__stat--${breachPhase.tone}`}
              >
                <span className="matrix-hero__stat-label">Breach phase</span>
                <span className="matrix-hero__stat-value">{breachPhase.label}</span>
                <span className="matrix-hero__stat-detail">{breachPhase.detail}</span>
              </li>
            </ul>
          </div>
        </section>
        <div className="matrix-console-shell__stack">
          {rateLimitInfo.isLimited && (
            <div className="matrix-rate-limit">
              {rateLimitInfo.lockoutRemaining
                ? `Too many attempts. Try again in ${rateLimitInfo.lockoutRemaining} minutes.`
                : `Too many attempts. Try again in ${Math.ceil(rateLimitInfo.lockoutRemaining / 60)} minutes.`}
            </div>
          )}

          <div
            className={`hack-sequencer ${isHackingComplete ? "complete" : ""}`}
            aria-live="polite"
          >
            <div className="hack-sequencer__header">
              <span className="hack-sequencer__spacer" aria-hidden="true">
                {Math.round(hackProgress)}%
              </span>
              <span className="hack-sequencer__title">
                {isHackingComplete ? "Access channel secured" : "Hack into mainframe"}
              </span>
              <span className="hack-sequencer__percentage">
                {Math.round(hackProgress)}%
              </span>
            </div>
            <div className="hack-sequencer__bar">
              <div
                className="hack-sequencer__fill"
                style={{ width: `${hackProgress}%` }}
              />
            </div>
            <p className="hack-sequencer__feedback">{hackFeedback}</p>
          </div>

          {!showSuccessFeedback && (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className={`password-form ${isHackingComplete ? "visible" : ""}`}
            >
              <input
                type="password"
                value={isHackingComplete ? password : hackingBuffer}
                onChange={handlePasswordChange}
                onKeyDown={handleHackKeyDown}
                placeholder={
                  isHackingComplete ? "Enter password" : "Hack into mainframe"
                }
                className="password-input"
                disabled={rateLimitInfo.isLimited}
                aria-label={
                  isHackingComplete
                    ? "Password input"
                    : "Hack into mainframe progress input"
                }
              />
              <button
                type="submit"
                className="password-submit-btn"
                disabled={!isHackingComplete || rateLimitInfo.isLimited}
                aria-label="Submit password"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
      <button
        type="button"
        className="matrix-close-btn"
        onClick={onSuccess}
        aria-label="Exit Matrix"
      >
        EXIT
      </button>
      {/* * Progressive Hint System */}
      {areHintsUnlocked && (
        <button
          type="button"
          className={`matrix-hint-bubble ${hintLevel > 0 ? `level-${hintLevel}` : ""}`}
          onClick={handleHintClick}
          onKeyDown={(e) => e.key === "Enter" && handleHintClick(e)}
          aria-label="Matrix hints"
        >
          <div className="hint-bubble-parts">
            <div className="bub-part-a" />
            <div className="bub-part-b" />
            <div className="bub-part-c" />
          </div>
          <div className="hint-speech-txt">
            <div
              className={`hint-section initial ${hintLevel >= 0 ? "visible" : ""}`}
            >
              <span className="hint-text">
                Digital whispers echo through the void...
              </span>
              <div className="hint-divider" />
            </div>
            <div
              className={`hint-section first ${hintLevel >= 1 ? "visible" : ""}`}
            >
              <span className="hint-text">
                The key lies in the name that starts with 'A',
                <br />
                The first letter of my identity.
              </span>
              <div className="hint-divider" />
            </div>
            <div
              className={`hint-section second ${hintLevel >= 2 ? "visible" : ""}`}
            >
              <span className="hint-text">
                Think of the name that begins my story,
                <br />
                The word that unlocks this digital glory.
              </span>
            </div>
            {hintLevel < 2 && (
              <div className="hint-prompt">
                {hintLevel === 0
                  ? "Click for more..."
                  : "One more secret remains..."}
              </div>
            )}
          </div>
          <div className="hint-speech-arrow">
            <div className="arrow-w" />
            <div className="arrow-x" />
            <div className="arrow-y" />
            <div className="arrow-z" />
          </div>
        </button>
      )}

      {/* * Keyboard shortcuts hint */}
      <div className="keyboard-hints">
        <span>ESC: Exit</span>
        <span>H: Toggle Hints</span>
        <span>ENTER: Submit</span>
      </div>

      {/* * Audio Controls */}
      <div className="audio-controls">
        <div className="audio-status">
          <span className="status-indicator">
            {audioStatus === 'loading' && '⏳'}
            {audioStatus === 'playing' && '🔊'}
            {audioStatus === 'stopped' && '⏸️'}
            {audioStatus === 'error' && '❌'}
          </span>
          <span className="status-text">
            {audioStatus === 'loading' && 'Loading...'}
            {audioStatus === 'playing' && 'Playing'}
            {audioStatus === 'stopped' && 'Stopped'}
            {audioStatus === 'error' && 'Error'}
          </span>
        </div>
        <button
          className={`audio-mute-btn ${isAudioMuted ? 'muted' : ''}`}
          onClick={handleMuteToggle}
          aria-label={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
          type="button"
        >
          {isAudioMuted ? '🔇' : '🔊'}
        </button>
        <div className="volume-control">
          <span className="volume-label">Vol:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={audioVolume}
            onChange={(e) => handleVolumeChange(Number.parseInt(e.target.value))}
            className="volume-slider"
            disabled={isAudioMuted}
          />
          <span className="volume-value">{audioVolume}%</span>
        </div>
      </div>

    </dialog>
  );
};

export default Matrix;
