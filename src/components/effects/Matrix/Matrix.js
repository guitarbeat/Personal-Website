// Third-party imports
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

// Context imports
import { useAuth } from "./AuthContext";

// Components
import NuUhUhEasterEgg from "./NuUhUhEasterEgg";

// Styles
import "./matrix.scss";

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;
const PROGRESS_DECAY_INTERVAL = 140;
<<<<<<< HEAD
const PROGRESS_DECAY_BASE = 0.35;
const PROGRESS_DECAY_RAMP = [
  { threshold: 2600, value: 1.15 },
  { threshold: 1900, value: 0.85 },
  { threshold: 1300, value: 0.65 },
  { threshold: 900, value: 0.5 },
];
const MIN_IDLE_BEFORE_DECAY = 300;
=======
const PROGRESS_DECAY_BASE = 0.5; // Increased from 0.18
const PROGRESS_DECAY_RAMP = [
  { threshold: 2600, value: 1.2 }, // Increased from 0.92
  { threshold: 1900, value: 0.9 }, // Increased from 0.64
  { threshold: 1300, value: 0.65 }, // Increased from 0.4
  { threshold: 900, value: 0.45 }, // Increased from 0.26
];
const MIN_IDLE_BEFORE_DECAY = 300; // Reduced from 480
>>>>>>> dcc2c17f8ab2114eb47e47b2387a2b9922280b33
const KEY_VARIETY_WINDOW = 12;
const REPETITION_DECAY_RESET_MS = 650;

const INITIAL_FEEDBACK = "Initialize uplink by mashing the keys.";

const DEFAULT_CONSOLE_PROMPT = [
  "boot> establishing uplink...",
  "boot> calibrating quantum handshake...",
  "",
].join("\n");

const SUCCESS_FEEDBACK_MESSAGE =
  "Access granted! Breach stabilized. Awaiting extraction command.";

const buildSuccessConsoleReadout = ({
  matrixCoordinate,
  runtimeDisplay,
  timecodeDisplay,
  signalGain,
  signalChannel,
}) =>
  [
    "uplink> AUTH HANDSHAKE COMPLETE",
    `uplink> channel:${signalChannel} :: gain:${signalGain}dB`,
    `uplink> coordinate locked @ ${matrixCoordinate}`,
    `uplink> runtime ${runtimeDisplay} | timestamp ${timecodeDisplay}Z`,
    "uplink> proceed to next phase...",
    "",
  ].join("\n");

const HACKER_TYPER_CORPUS = [
  "protocol uplink::handshake(){",
  "  const session = quantum.session();",
  "  session.align({ axis: 'theta', variance: 0.016 });",
  "  if (!session.locked()) {",
  "    session.inject('entropy:sync');",
  "  }",
  "  bridge.route('matrix-core').prime();",
  "  const cipher = session.cipher.swap('xor:phase');",
  "  return cipher.vectorize();",
  "}",
  "",
  "const uplink = protocol.uplink::handshake();",
  "uplink.emit('pulse', { gain: 0.87 });",
  "uplink.relay('ghost-net', packet => {",
  "  packet.tune({ drift: 'subspace' });",
  "  packet.write('ACCESS_CHANNEL++');",
  "  return packet.trace();",
  "});",
  "",
  "for (let shard = 0; shard < 64; shard += 1) {",
  "  uplink.overclock(shard, flux => flux.fold());",
  "}",
  "",
  "const watchdog = matrix.daemon('sentinel');",
  "watchdog.listen(({ vector, checksum }) => {",
  "  if (!matrix.verify(checksum)) {",
  "    return watchdog.raise('spoof-detected');",
  "  }",
  "  return vector.stabilize();",
  "});",
  "",
  "uplink.merge(watchdog).commit();",
  "matrix.core.flush();",
  "",
].join("\n");

const MAX_DISPLAY_LENGTH = 1400;

const useHackSession = (isVisible) => {
  const [hackingBuffer, setHackingBuffer] = useState(DEFAULT_CONSOLE_PROMPT);
  const [hackProgress, setHackProgress] = useState(12);
  const [hackFeedback, setHackFeedback] = useState(INITIAL_FEEDBACK);

  const resetSession = useCallback(() => {
    setHackingBuffer(DEFAULT_CONSOLE_PROMPT);
    setHackProgress(12);
    setHackFeedback(INITIAL_FEEDBACK);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    resetSession();
  }, [isVisible, resetSession]);

  const isHackingComplete = hackProgress >= 100;

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
    hackingBuffer,
    setHackingBuffer,
    hackProgress,
    setHackProgress: updateHackProgress,
    hackFeedback,
    setHackFeedback,
    isHackingComplete,
  };
};

const Matrix = ({ isVisible, onSuccess, onMatrixReady }) => {
  const canvasRef = useRef(null);
  const {
    hackingBuffer,
    setHackingBuffer,
    hackProgress,
    setHackProgress,
    hackFeedback,
    setHackFeedback,
    isHackingComplete,
  } = useHackSession(isVisible);
  const hackInputRef = useRef(null);
  const completionTriggeredRef = useRef(false);
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
  const idleFailureTrackerRef = useRef({ lowStreak: 0 });
  const { completeHack, showSuccessFeedback } = useAuth();
  const easterEggTriggeredRef = useRef(false);
  const [easterEggs, setEasterEggs] = useState([]);
  const hackCorpus = useMemo(
    () => Array.from({ length: 24 }, () => HACKER_TYPER_CORPUS).join("\n"),
    [],
  );
  const hackStreamIndexRef = useRef(0);
  const keyPatternRef = useRef({ recentKeys: [], lastKey: null, streak: 0 });
  const successTelemetryRef = useRef(null);

  // * Configuration constants
  const ALPHABET =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  const updateHackDisplay = useCallback(
    (direction, magnitude) => {
      if (!Number.isFinite(magnitude) || magnitude <= 0) {
        return;
      }

      setHackingBuffer((prev) => {
        if (direction === "backward") {
          const nextLength = Math.max(0, prev.length - magnitude);
          const trimmed =
            nextLength <= DEFAULT_CONSOLE_PROMPT.length
              ? DEFAULT_CONSOLE_PROMPT
              : prev.slice(0, nextLength);

          const nextIndex = (hackStreamIndexRef.current - magnitude) % hackCorpus.length;
          hackStreamIndexRef.current =
            nextIndex < 0 ? hackCorpus.length + nextIndex : nextIndex;

          return trimmed;
        }

        let remaining = magnitude;
        let chunk = "";

        while (remaining > 0) {
          const start = hackStreamIndexRef.current;
          const available = Math.min(remaining, hackCorpus.length - start);

          if (available <= 0) {
            break;
          }

          chunk += hackCorpus.slice(start, start + available);
          hackStreamIndexRef.current = (start + available) % hackCorpus.length;
          remaining -= available;
        }

        if (chunk.length === 0) {
          return prev;
        }

        const combined = `${prev}${chunk}`;
        if (combined.length <= MAX_DISPLAY_LENGTH) {
          return combined;
        }

        return combined.slice(combined.length - MAX_DISPLAY_LENGTH);
      });
    },
    [hackCorpus, setHackingBuffer],
  );

  const handleHackInputChange = useCallback((event) => {
    if (event.target.value) {
      event.target.value = "";
    }
  }, []);

  const handleHackKeyDown = useCallback(
    (e) => {
      if (isHackingComplete) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab") {
        return;
      }

      const isCharacterKey =
        e.key.length === 1 || e.key === "Space" || e.key === "Enter";
      const isBackspace = e.key === "Backspace";

      if (!isCharacterKey && !isBackspace) {
        return;
      }

      idleFailureTrackerRef.current.lowStreak = 0;

      const now = Date.now();
      const lastTime = lastKeyTimeRef.current;
      const delta = lastTime ? now - lastTime : null;

      let baseIncrement = 0.6; // Reduced from 1.05

      if (delta !== null) {
        if (delta < 120) {
          baseIncrement = 1.8; // Reduced from 3.2
        } else if (delta < 220) {
          baseIncrement = 1.3; // Reduced from 2.4
        } else if (delta < 360) {
          baseIncrement = 0.95; // Reduced from 1.65
        } else {
          baseIncrement = 0.45; // Reduced from 0.95
        }
      }

      let feedbackMessage = "Signal detected. Keep the keystrokes flowing.";
      let progressDelta = 0;

      if (isBackspace) {
        e.preventDefault();
        updateHackDisplay(
          "backward",
          Math.max(4, Math.round(baseIncrement * 3.5)),
        );
        keyPatternRef.current.lastKey = null;
        keyPatternRef.current.streak = 0;
        feedbackMessage = "Trace sanitized. Countermeasure resetting.";
        progressDelta = -Math.max(0.45, baseIncrement * 0.65);
      } else if (isCharacterKey) {
        e.preventDefault();
        const normalizedKey =
          e.key === " " ? "space" : e.key.toLowerCase();
        const tracker = keyPatternRef.current;

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

        if (uniqueCount >= 7) {
          comboMultiplier += 0.25; // Reduced from 0.4
        } else if (uniqueCount >= 5) {
          comboMultiplier += 0.15; // Reduced from 0.25
        } else if (uniqueCount >= 4) {
          comboMultiplier += 0.08; // Reduced from 0.12
        } else if (
          tracker.recentKeys.length >= KEY_VARIETY_WINDOW &&
          uniqueCount <= 3
        ) {
          comboMultiplier *= 0.4; // Increased penalty from 0.6
        }

        if (tracker.streak >= 6) {
          comboMultiplier *= 0.15; // Increased penalty from 0.2
        } else if (tracker.streak >= 4) {
          comboMultiplier *= 0.25; // Increased penalty from 0.35
        } else if (tracker.streak >= 3) {
          comboMultiplier *= 0.4; // Increased penalty from 0.55
        }

        if (normalizedKey === "enter" || normalizedKey === "space") {
          comboMultiplier *= 0.5; // Increased penalty from 0.7
        }

        if (tracker.streak >= 4) {
          feedbackMessage = "Pattern lock detected—mix up your glyphs.";
        } else if (uniqueCount >= 6 && delta !== null && delta < 260) {
          feedbackMessage = "Chaotic uplink engaged—firewall fracturing.";
        } else if (
          uniqueCount <= 2 &&
          tracker.recentKeys.length >= Math.min(KEY_VARIETY_WINDOW, 6)
        ) {
          feedbackMessage =
            "Repeating glyphs flagged. Adaptive shield resisting.";
        } else if (delta !== null) {
          if (delta < 140) {
            feedbackMessage = "Trace evaded! Ultra-fast breach underway.";
          } else if (delta < 260) {
            feedbackMessage = "Firewall destabilizing—stellar rhythm.";
          } else if (delta < 400) {
            feedbackMessage = "Maintaining uplink. Accelerate to finish.";
          } else {
            feedbackMessage = "Connection cooling—slam the keys faster!";
          }
        }

        const comboAdjustedIncrement = baseIncrement * comboMultiplier;
        const chunkBase = Math.max(8, Math.round(comboAdjustedIncrement * 4));
        const chunkVariance = Math.floor(Math.random() * 5);
        updateHackDisplay("forward", chunkBase + chunkVariance);

        progressDelta = comboAdjustedIncrement;
      }

      lastKeyTimeRef.current = now;
      setHackFeedback(feedbackMessage);

      if (progressDelta > 0) {
        setHackProgress((prev) => {
          const friction =
            prev >= 85 ? 0.35 : prev >= 65 ? 0.5 : prev >= 40 ? 0.65 : 0.8; // Reduced from 0.55, 0.72, 0.85, 1
          const next = prev + progressDelta * friction;
          return Math.min(100, next);
        });
      } else if (progressDelta < 0) {
        setHackProgress((prev) => Math.max(0, prev + progressDelta));
      }
    },
    [
      isHackingComplete,
      setHackFeedback,
      setHackProgress,
      updateHackDisplay,
    ],
  );

  const focusHackInput = useCallback(() => {
    window.requestAnimationFrame(() => {
      hackInputRef.current?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (!onMatrixReady) {
      return undefined;
    }

    onMatrixReady(focusHackInput);

    return () => {
      onMatrixReady(null);
    };
  }, [onMatrixReady, focusHackInput]);

  const resetIdleFailureTracking = useCallback(() => {
    idleFailureTrackerRef.current.lowStreak = 0;
  }, []);

  const triggerIdleFailure = useCallback(() => {
    if (easterEggTriggeredRef.current) {
      return;
    }
    
    easterEggTriggeredRef.current = true;
    resetIdleFailureTracking();
    lastKeyTimeRef.current = null;
    setHackFeedback("Signal severed. Access denied. Reinitialize the override.");
    
    const eggId = Date.now();
    setEasterEggs((prev) => [...prev, eggId]);
  }, [resetIdleFailureTracking, setHackFeedback]);

  const handleDismissEasterEgg = useCallback((eggId) => {
    setEasterEggs((prev) => prev.filter((id) => id !== eggId));
    resetIdleFailureTracking();
    lastKeyTimeRef.current = null;
    setHackProgress(12);
    setHackingBuffer(DEFAULT_CONSOLE_PROMPT);
    setHackFeedback("Channel reset. Re-engage manual override.");
    easterEggTriggeredRef.current = false;
    focusHackInput();
  }, [
    focusHackInput,
    resetIdleFailureTracking,
    setHackFeedback,
    setHackProgress,
    setHackingBuffer,
  ]);

  // * Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onSuccess?.();
      } else if (e.key === "Enter" && !showSuccessFeedback && isHackingComplete) {
        onSuccess?.();
      }
    },
    [onSuccess, showSuccessFeedback, isHackingComplete],
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

  const keyboardHints = useMemo(
    () => [
      { action: "Any key", description: "Amplify the breach signal" },
      { action: "ENTER", description: "Exit once the link stabilizes" },
      { action: "ESC", description: "Abort the uplink immediately" },
    ],
    [],
  );

  const consoleDisplay = hackingBuffer || DEFAULT_CONSOLE_PROMPT;
  const successTelemetry = successTelemetryRef.current;
  const showConsoleCursor = !isHackingComplete;

  const handleViewportEngage = useCallback(() => {
    if (isHackingComplete) {
      return;
    }

    focusHackInput();
  }, [focusHackInput, isHackingComplete]);

  // * Handle container clicks
  const handleContainerClick = useCallback(
    (e) => {
      if (e.target !== canvasRef.current) {
        return;
      }

      if (showSuccessFeedback) {
        return;
      }

      onSuccess?.();
    },
    [showSuccessFeedback, onSuccess],
  );

  // * Keyboard event listeners
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    lastKeyTimeRef.current = null;
    focusHackInput();

    const handleKeyPress = () => {
      focusHackInput();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    isVisible,
    handleKeyDown,
    focusHackInput,
  ]);

  useEffect(() => {
    if (hackingBuffer === DEFAULT_CONSOLE_PROMPT) {
      hackStreamIndexRef.current = 0;
    }
  }, [hackingBuffer]);

  useEffect(() => {
    if (!isHackingComplete) {
      successTelemetryRef.current = null;
      return;
    }

    if (!successTelemetryRef.current) {
      successTelemetryRef.current = {
        runtimeDisplay,
        timecodeDisplay,
        signalGain,
        signalChannel,
      };
    }

    const successReadout = buildSuccessConsoleReadout({
      matrixCoordinate,
      runtimeDisplay: successTelemetryRef.current.runtimeDisplay,
      timecodeDisplay: successTelemetryRef.current.timecodeDisplay,
      signalGain: successTelemetryRef.current.signalGain,
      signalChannel: successTelemetryRef.current.signalChannel,
    });

    setHackFeedback(SUCCESS_FEEDBACK_MESSAGE);
    setHackingBuffer(successReadout);
  }, [
    isHackingComplete,
    matrixCoordinate,
    runtimeDisplay,
    setHackFeedback,
    setHackingBuffer,
    signalGain,
    signalChannel,
    timecodeDisplay,
  ]);

  useEffect(() => {
    if (!isHackingComplete || completionTriggeredRef.current) {
      return undefined;
    }

    completionTriggeredRef.current = true;
    completeHack();

    const closeTimeout = window.setTimeout(() => {
      onSuccess?.();
    }, 2000);

    return () => {
      window.clearTimeout(closeTimeout);
    };
  }, [isHackingComplete, completeHack, onSuccess]);

  useEffect(() => {
    if (!isVisible) {
      completionTriggeredRef.current = false;
    }
  }, [isVisible]);

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

        let shouldTriggerFailure = false;

        setHackProgress((prev) => {
          if (prev <= 0) {
            return prev;
          }

          const next = Math.max(0, prev - decayAmount);

          if (next < prev) {
            setHackFeedback((current) => {
              if (
                current ===
                "Override complete. Authentication channel stabilized."
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
            idleFailureTrackerRef.current.lowStreak = 0;
            shouldTriggerFailure = true;
          } else if (next < 8) {
            idleFailureTrackerRef.current.lowStreak += 1;

            if (idleFailureTrackerRef.current.lowStreak >= 3) {
              shouldTriggerFailure = true;
              idleFailureTrackerRef.current.lowStreak = 0;
            }
          } else {
            idleFailureTrackerRef.current.lowStreak = 0;
          }

          return next;
        });

        if (shouldTriggerFailure) {
          triggerIdleFailure();
        }
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
    triggerIdleFailure,
  ]);

  useEffect(() => {
    if (!isVisible || showSuccessFeedback) {
      return;
    }

    focusHackInput();
  }, [isVisible, showSuccessFeedback, focusHackInput]);

  useEffect(() => {
    if (!isVisible) {
      setEasterEggs([]);
      easterEggTriggeredRef.current = false;
      resetIdleFailureTracking();
    }
  }, [isVisible, resetIdleFailureTracking]);



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






  // * Temporary test handler for easter egg
  const handleTestEasterEgg = () => {
    const eggId = Date.now();
    setEasterEggs((prev) => [...prev, eggId]);
    setHackProgress(0);
  };

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
          onSuccess();
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
        background: 'transparent',
      }}
    >
      <canvas
        ref={canvasRef}
        className="matrix-canvas"
        role="img"
        aria-label="Matrix rain animation"
      />
      <div className="matrix-console-shell">
        <div className="matrix-console-grid">
<<<<<<< HEAD
=======
          <div
            className={`hack-sequencer ${
              isHackingComplete ? "complete" : ""
            }`}
          >
            <div className="hack-sequencer__header">
              <span className="hack-sequencer__spacer" aria-hidden="true">
                {Math.round(hackProgress)}%
              </span>
              <span className="hack-sequencer__title">
                {isHackingComplete ? "Access secured" : "Hack in progress"}
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

>>>>>>> dcc2c17f8ab2114eb47e47b2387a2b9922280b33
          <div
            className={`hack-input-panel ${isHackingComplete ? "complete" : ""}`}
          >
            <div className="hack-sequencer">
              <div className="hack-sequencer__header">
                <span className="hack-sequencer__spacer" aria-hidden="true">
                  {Math.round(hackProgress)}%
                </span>
                <span className="hack-sequencer__title">
                  {isHackingComplete ? "Access secured" : "Hack in progress"}
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
            <div
              className="hack-input-viewport"
              role="presentation"
              onMouseDown={handleViewportEngage}
              onTouchStart={handleViewportEngage}
            >
              <pre className="hack-input-stream" aria-hidden="true">
                {consoleDisplay}
                {showConsoleCursor && <span className="hack-input-cursor" />}
              </pre>
              {isHackingComplete && successTelemetry && (
                <output className="hack-input-success" aria-live="assertive">
                  <span className="hack-input-success__title">ACCESS GRANTED</span>
                  <span className="hack-input-success__meta">
                    Channel {successTelemetry.signalChannel} · {successTelemetry.runtimeDisplay}
                  </span>
                  <span className="hack-input-success__cta">
                    Press ENTER or ESC to exit
                  </span>
                </output>
              )}
            </div>
            <input
              type="text"
              ref={hackInputRef}
              onKeyDown={handleHackKeyDown}
              onChange={handleHackInputChange}
              className="hack-input-field"
              disabled={isHackingComplete}
              aria-label="Mash the keys to amplify the breach"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="hack-input-helper"
            />
            <div
              className="hack-input-helper"
              aria-hidden="true"
              id="hack-input-helper"
            >
              {isHackingComplete
                ? "Channel stabilized"
                : "Keep mashing to stabilize the signal"}
            </div>
          </div>
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
      <button
        type="button"
        className="matrix-close-btn"
        onClick={handleTestEasterEgg}
        aria-label="Test Easter Egg"
        style={{ top: '2rem', right: '10rem' }}
      >
        TEST EASTER EGG
      </button>
      {easterEggs.map((eggId) => (
        <NuUhUhEasterEgg 
          key={eggId} 
          id={eggId}
          onClose={() => handleDismissEasterEgg(eggId)} 
        />
      ))}
    </dialog>
  );
};

export default Matrix;
