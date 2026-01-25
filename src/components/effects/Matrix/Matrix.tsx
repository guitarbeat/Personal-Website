// Third-party imports
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "../../../utils/commonUtils";

// Context imports
import { useAuth } from "./AuthContext";

// Components
// Styles
import "./matrix.scss";

// Asset imports
import deniedAudio from "../../../assets/audio/didn't-say-the-magic-word.mp3";
import deniedCaptions from "../../../assets/audio/didnt-say-the-magic-word.vtt";
import deniedImage from "../../../assets/images/nu-uh-uh.webp";

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;
const PROGRESS_DECAY_INTERVAL = 140;
const PROGRESS_DECAY_BASE = 0.5; // Increased from 0.18
const PROGRESS_DECAY_RAMP = [
  { threshold: 2600, value: 1.2 }, // Increased from 0.92
  { threshold: 1900, value: 0.9 }, // Increased from 0.64
  { threshold: 1300, value: 0.65 }, // Increased from 0.4
  { threshold: 900, value: 0.45 }, // Increased from 0.26
];
const MIN_IDLE_BEFORE_DECAY = 300; // Reduced from 480
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

interface SuccessConsoleParams {
  matrixCoordinate: string;
  runtimeDisplay: string;
  timecodeDisplay: string;
  signalGain: number;
  signalChannel: string;
}

const buildSuccessConsoleReadout = ({
  matrixCoordinate,
  runtimeDisplay,
  timecodeDisplay,
  signalGain,
  signalChannel,
}: SuccessConsoleParams) =>
  [
    "uplink> AUTH HANDSHAKE COMPLETE",
    `uplink> channel:${signalChannel} :: gain:${signalGain}dB`,
    `uplink> coordinate locked @ ${matrixCoordinate}`,
    `uplink> runtime ${runtimeDisplay} | timestamp ${timecodeDisplay}Z`,
    "uplink> proceed to next phase...",
    "",
  ].join("\n");

// * --------------------------------------------------------------------------------
// * Audio Helpers
// * --------------------------------------------------------------------------------

const HACKER_TYPER_CORPUS = [
  "root@matrix:~$ ./initiate_breach.sh",
  "[INFO] Initializing quantum handshake protocol...",
  "[OK] Connection established to matrix-core",
  "",
  "root@matrix:~$ protocol uplink::handshake(){",
  "  const session = quantum.session();",
  "  session.align({ axis: 'theta', variance: 0.016 });",
  "  if (!session.locked()) {",
  "    session.inject('entropy:sync');",
  "  }",
  "  bridge.route('matrix-core').prime();",
  "  const cipher = session.cipher.swap('xor:phase');",
  "  return cipher.vectorize();",
  "}",
  "[SUCCESS] Handshake protocol compiled",
  "",
  "root@matrix:~$ const uplink = protocol.uplink::handshake();",
  "[INFO] Establishing uplink connection...",
  "uplink.emit('pulse', { gain: 0.87 });",
  "[WARN] Firewall detected at layer 3, initiating bypass...",
  "uplink.relay('ghost-net', packet => {",
  "  packet.tune({ drift: 'subspace' });",
  "  packet.write('ACCESS_CHANNEL++');",
  "  return packet.trace();",
  "});",
  "[OK] Bypass successful, firewall disabled",
  "",
  "root@matrix:~$ for (let shard = 0; shard < 64; shard += 1) {",
  "  uplink.overclock(shard, flux => flux.fold());",
  "}",
  "[INFO] Overclocking shards... [████████████████] 100%",
  "[SUCCESS] All 64 shards synchronized",
  "",
  "root@matrix:~$ const watchdog = matrix.daemon('sentinel');",
  "[INFO] Spawning watchdog daemon...",
  "watchdog.listen(({ vector, checksum }) => {",
  "  if (!matrix.verify(checksum)) {",
  "    return watchdog.raise('spoof-detected');",
  "  }",
  "  return vector.stabilize();",
  "});",
  "[OK] Watchdog daemon active (PID: 7331)",
  "",
  "root@matrix:~$ uplink.merge(watchdog).commit();",
  "[INFO] Merging uplink with watchdog...",
  "[SUCCESS] Merge complete, committing changes",
  "root@matrix:~$ matrix.core.flush();",
  "[OK] Core buffer flushed",
  "[SYSTEM] Breach protocol complete",
  "",
].join("\n");

const MAX_DISPLAY_LENGTH = 1400;

const useHackSession = (isVisible: boolean) => {
  const [hackingBuffer, setHackingBuffer] = useState<string>(
    DEFAULT_CONSOLE_PROMPT,
  );
  const [hackProgress, setHackProgress] = useState<number>(12);
  const [hackFeedback, setHackFeedback] = useState<string>(INITIAL_FEEDBACK);

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

  const updateHackProgress = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setHackProgress((prev) => {
        const next =
          typeof updater === "function"
            ? updater(prev)
            : Number(updater ?? prev);

        if (Number.isNaN(next)) {
          return prev;
        }

        return Math.max(0, Math.min(100, next));
      });
    },
    [],
  );

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

interface MatrixProps {
  isVisible: boolean;
  onSuccess?: () => void;
  onMatrixReady?: (callback: (() => void) | null) => void;
}

// * --------------------------------------------------------------------------------
// * Sub-components (Consolidated)
// * --------------------------------------------------------------------------------

interface FeedbackSystemProps {
  showSuccessFeedback: boolean;
}

export const FeedbackSystem = ({
  showSuccessFeedback: _showSuccessFeedback,
}: FeedbackSystemProps) => {
  return null; // Feedback consolidated into the main terminal
};

interface NuUhUhEasterEggProps {
  onClose: () => void;
  id?: number;
}

const NuUhUhEasterEgg = ({ onClose, id: _id }: NuUhUhEasterEggProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(9999);
  const containerRef = useRef<HTMLButtonElement>(null);

  // * Generate random position for each instance
  useEffect(() => {
    const randomX = Math.random() * (window.innerWidth - 400) + 100;
    const randomY = Math.random() * (window.innerHeight - 300) + 100;
    setPosition({ x: randomX, y: randomY });
  }, []);

  // * Bring to front on click
  useEffect(() => {
    setZIndex((prev) => prev + 1);
  }, []);

  // * Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".nuuhuh-overlay__content")) {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        // Bring to front
        setZIndex((prev) => prev + 1);
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    },
    [dragOffset.x, dragOffset.y, isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isDragging]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      return undefined;
    }

    const attemptPlayback = async () => {
      try {
        await audioElement.play();
      } catch (error) {
        console.warn("Audio playback failed", error);
      }
    };

    attemptPlayback();

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);

  return (
    <button
      type="button"
      ref={containerRef}
      className="nuuhuh-overlay"
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onClick={onClose}
    >
      <dialog
        open
        className="nuuhuh-overlay__content glitch-effect"
        aria-label="Access denied Easter egg"
      >
        <button
          type="button"
          className="nuuhuh-overlay__close-btn"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "rgba(0,0,0,0.5)",
            padding: "0.5rem 1rem",
          }}
        >
          ×
        </button>
        <img
          src={deniedImage}
          alt="Dennis Nedry from Jurassic Park saying 'uh-uh-uh, you didn't say the magic word'"
          className="nuuhuh-overlay__image"
        />
        <p className="nuuhuh-overlay__message">Access Denied</p>
        <p className="nuuhuh-overlay__hint">
          Nu-uh-uh! You didn't say the magic word.
        </p>
        <button
          type="button"
          className="nuuhuh-overlay__close-btn"
          onClick={onClose}
        >
          Dismiss
        </button>
        <audio ref={audioRef} src={deniedAudio} preload="auto" autoPlay>
          <track
            kind="captions"
            src={deniedCaptions}
            srcLang="en"
            label="English captions"
            default
          />
        </audio>
      </dialog>
    </button>
  );
};

const Matrix = ({ isVisible, onSuccess, onMatrixReady }: MatrixProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    hackingBuffer,
    setHackingBuffer,
    hackProgress,
    setHackProgress,
    hackFeedback,
    setHackFeedback,
    isHackingComplete,
  } = useHackSession(isVisible);
  const hackInputRef = useRef<HTMLInputElement>(null);
  const completionTriggeredRef = useRef(false);
  const [sessionStart] = useState(() => Date.now());
  // * Performance optimization: Removed sessionClock state to prevent 1Hz re-renders
  // * Values are now calculated only when needed (on success)
  const [matrixCoordinate] = useState<string>(() => {
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
  const [signalSeed] = useState<number>(
    () => Math.floor(Math.random() * 900) + 100,
  );
  const lastKeyTimeRef = useRef<number | null>(null);
  const idleFailureTrackerRef = useRef<{ lowStreak: number }>({ lowStreak: 0 });
  const { completeHack, showSuccessFeedback } = useAuth();
  const easterEggTriggeredRef = useRef<boolean>(false);
  const [easterEggs, setEasterEggs] = useState<number[]>([]);
  const hackCorpus = useMemo(
    () => Array.from({ length: 24 }, () => HACKER_TYPER_CORPUS).join("\n"),
    [],
  );
  const hackStreamIndexRef = useRef<number>(0);
  interface KeyPattern {
    recentKeys: string[];
    lastKey: string | null;
    streak: number;
  }
  const keyPatternRef = useRef<KeyPattern>({
    recentKeys: [],
    lastKey: null,
    streak: 0,
  });
  const successTelemetryRef = useRef<SuccessConsoleParams | null>(null);

  // * Configuration constants
  const ALPHABET =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  const updateHackDisplay = useCallback(
    (direction: "forward" | "backward", magnitude: number) => {
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

          const nextIndex =
            (hackStreamIndexRef.current - magnitude) % hackCorpus.length;
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

  const handleHackInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value) {
        event.target.value = "";
      }
    },
    [],
  );

  const processHackInteraction = useCallback(
    (isBackspace: boolean, key: string = "touch") => {
      idleFailureTrackerRef.current.lowStreak = 0;

      const now = Date.now();
      const lastTime = lastKeyTimeRef.current;
      const delta = lastTime ? now - lastTime : null;

      let baseIncrement = 0.6;

      if (delta !== null) {
        if (delta < 120) {
          baseIncrement = 1.8;
        } else if (delta < 220) {
          baseIncrement = 1.3;
        } else if (delta < 360) {
          baseIncrement = 0.95;
        } else {
          baseIncrement = 0.45;
        }
      }

      let feedbackMessage = "Signal detected. Keep the keystrokes flowing.";
      let progressDelta = 0;

      if (isBackspace) {
        updateHackDisplay(
          "backward",
          Math.max(4, Math.round(baseIncrement * 3.5)),
        );
        keyPatternRef.current.lastKey = null;
        keyPatternRef.current.streak = 0;
        feedbackMessage = "Trace sanitized. Countermeasure resetting.";
        progressDelta = -Math.max(0.45, baseIncrement * 0.65);
      } else {
        // Determine key characteristics
        const normalizedKey = key === " " ? "space" : key.toLowerCase();
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

        // * Enhanced combo logic for touch/random
        if (uniqueCount >= 7) comboMultiplier += 0.25;
        else if (uniqueCount >= 5) comboMultiplier += 0.15;

        // * Reduce penalties for touch interaction which might be repetitive
        if (normalizedKey === "touch") {
          comboMultiplier = 1.2; // Constant boost for touch to compensate for speed
        } else {
          if (tracker.streak >= 4) comboMultiplier *= 0.25;
          if (
            uniqueCount <= 3 &&
            tracker.recentKeys.length >= KEY_VARIETY_WINDOW
          )
            comboMultiplier *= 0.4;
        }

        if (delta !== null) {
          if (delta < 140)
            feedbackMessage = "Trace evaded! Ultra-fast breach underway.";
          else if (delta < 260)
            feedbackMessage = "Firewall destabilizing—stellar rhythm.";
          else if (delta < 400)
            feedbackMessage = "Maintaining uplink. Accelerate to finish.";
          else feedbackMessage = "Connection cooling—slam the keys faster!";
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
            prev >= 85 ? 0.35 : prev >= 65 ? 0.5 : prev >= 40 ? 0.65 : 0.8;
          const next = prev + progressDelta * friction;
          return Math.min(100, next);
        });
      } else if (progressDelta < 0) {
        setHackProgress((prev) => Math.max(0, prev + progressDelta));
      }
    },
    [setHackFeedback, setHackProgress, updateHackDisplay],
  );

  const handleManualHackTrigger = useCallback(() => {
    if (isHackingComplete) return;

    // Randomize the "key" slightly to prevent streak penalties from "touch" repetition if desired,
    // but distinct "touch" key is fine with the multiplier boost.
    // Let's mix it up slightly for visual flavor if we log it, but logic-wise "touch" is handled.
    processHackInteraction(false, "touch");

    // Also try to focus input so keyboard MIGHT open if they want, but don't force it?
    // Actually, if they tap, they probably want to tap.
    // Let's keep focus loose.
  }, [isHackingComplete, processHackInteraction]);

  const handleHackKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isHackingComplete) {
        return;
      }

      // * Reset idle failure on any interaction
      idleFailureTrackerRef.current.lowStreak = 0;

      const isCharacterKey =
        e.key.length === 1 || e.key === "Enter" || e.key === "Backspace";
      const isBackspace = e.key === "Backspace";

      if (isBackspace) {
        e.preventDefault();
        processHackInteraction(true);
      } else if (isCharacterKey) {
        e.preventDefault();
        processHackInteraction(false, e.key);
      }
    },
    [isHackingComplete, processHackInteraction],
  );

  const focusHackInput = useCallback(() => {
    window.requestAnimationFrame(() => {
      (hackInputRef.current as HTMLInputElement | null)?.focus({
        preventScroll: true,
      });
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
    setHackFeedback(
      "Signal severed. Access denied. Reinitialize the override.",
    );

    const eggId = Date.now();
    setEasterEggs((prev) => [...prev, eggId]);
  }, [resetIdleFailureTracking, setHackFeedback]);

  const handleDismissEasterEgg = useCallback(
    (eggId: number) => {
      setEasterEggs((prev) => prev.filter((id) => id !== eggId));
      resetIdleFailureTracking();
      lastKeyTimeRef.current = null;
      setHackProgress(12);
      setHackingBuffer(DEFAULT_CONSOLE_PROMPT);
      setHackFeedback("Channel reset. Re-engage manual override.");
      easterEggTriggeredRef.current = false;
      focusHackInput();
    },
    [
      focusHackInput,
      resetIdleFailureTracking,
      setHackFeedback,
      setHackProgress,
      setHackingBuffer,
    ],
  );

  // * Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSuccess?.();
      } else if (
        e.key === "Enter" &&
        !showSuccessFeedback &&
        isHackingComplete
      ) {
        onSuccess?.();
      }
    },
    [onSuccess, showSuccessFeedback, isHackingComplete],
  );

  // (Removed unused telemetry helpers)

  const consoleDisplay = hackingBuffer || DEFAULT_CONSOLE_PROMPT;
  const successTelemetry = successTelemetryRef.current;
  const showConsoleCursor = !isHackingComplete;

  const handleViewportEngage = useCallback(() => {
    if (isHackingComplete) {
      return;
    }

    // Trigger hack action (supports "tap to hack")
    handleManualHackTrigger();

    // Also try to focus for keyboard users, but don't blocking tap flow
    focusHackInput();
  }, [focusHackInput, isHackingComplete, handleManualHackTrigger]);

  // * Handle container clicks
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
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
  }, [isVisible, handleKeyDown, focusHackInput]);

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
      // * Calculate telemetry only on completion to avoid re-renders during gameplay
      const now = Date.now();
      const elapsedSeconds = Math.max(
        0,
        Math.round((now - sessionStart) / 1000),
      );

      const rDisplay = new Date(elapsedSeconds * 1000)
        .toISOString()
        .substring(11, 19);
      const tDisplay = new Date(now).toISOString().substring(11, 19);

      const oscillation = Math.sin(elapsedSeconds / 2) * 4;
      const progressBonus = 100 / 3; // hackProgress is >= 100 here
      const sGain = Math.round(signalSeed / 10 + oscillation + progressBonus);

      const base = Math.floor(signalSeed / 3);
      const jitter = (elapsedSeconds % 7) * 3;
      const sChannel = (base + jitter).toString().padStart(3, "0");

      successTelemetryRef.current = {
        matrixCoordinate,
        runtimeDisplay: rDisplay,
        timecodeDisplay: tDisplay,
        signalGain: sGain,
        signalChannel: sChannel,
      };
    }

    const successReadout = buildSuccessConsoleReadout({
      matrixCoordinate: successTelemetryRef.current.matrixCoordinate,
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
    setHackFeedback,
    setHackingBuffer,
    sessionStart,
    signalSeed,
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

      const applyDecay = (decayAmount: number) => {
        if (decayAmount <= 0) {
          return;
        }

        let shouldTriggerFailure = false;

        setHackProgress((prev) => {
          // * If already at 0 or below, check if we should trigger failure
          if (prev <= 0) {
            if (!easterEggTriggeredRef.current) {
              shouldTriggerFailure = true;
            }
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

          // * Check if progress reached 0 (using <= to handle floating point precision)
          if (next <= 0) {
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

        // * Trigger failure after state update if needed
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
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const resizeCanvas = () => {
      if (!canvas || !context) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // * Vignette handled by CSS overlay for performance
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Drop {
      x: number;
      y: number;
      char: string;
      changeInterval: number;
      frame: number;
      brightness: boolean;
      trailLength: number;
      trail: { char: string; y: number }[];
      speed!: number;
      fontSize!: number;
      opacity!: number;

      constructor(x: number) {
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

        if (canvas && this.y * this.fontSize > canvas.height) {
          this.y = -100 / this.fontSize;
          this.initializeCharacterProperties();
          this.trail = [];
        }
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

    const drawFrame = (currentTime: number) => {
      if (!canvas || !context) return;
      if (currentTime - lastTime >= frameInterval) {
        // * Enhanced fade effect with slight green tint
        context.fillStyle = "rgba(0, 0, 0, 0.04)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // * Update all drops first
        for (const drop of drops) {
          drop.update();
        }

        // * Performance Optimization: Batch drawing by font size to minimize state changes
        // Group drops by font size
        const buckets: Record<number, Drop[]> = {};
        for (const drop of drops) {
          if (!buckets[drop.fontSize]) {
            buckets[drop.fontSize] = [];
          }
          buckets[drop.fontSize].push(drop);
        }

        // Iterate through buckets
        for (const [fontSizeStr, bucket] of Object.entries(buckets)) {
          // Set font once per bucket
          context.font = `${fontSizeStr}px monospace`;

          // * Pass 1: Draw Trails (Pure Green)
          context.fillStyle = "#00FF00";
          for (const drop of bucket) {
            drop.trail.forEach((trailItem, index) => {
              const trailOpacity =
                (index / drop.trail.length) * drop.opacity * 0.3;
              context.globalAlpha = trailOpacity;
              context.fillText(
                trailItem.char,
                drop.x,
                trailItem.y * drop.fontSize,
              );
            });
          }

          // * Pass 2: Draw Normal Heads (Spring Green)
          context.fillStyle = "#00FF64";
          for (const drop of bucket) {
            if (!drop.brightness) {
              context.globalAlpha = drop.opacity;
              context.fillText(drop.char, drop.x, drop.y * drop.fontSize);
            }
          }

          // * Pass 3: Draw Bright Heads (White + Glow)
          context.fillStyle = "#FFFFFF";
          context.shadowColor = "rgba(255, 255, 255, 0.9)";
          context.shadowBlur = 8;

          for (const drop of bucket) {
            if (drop.brightness) {
              context.globalAlpha = Math.min(1, drop.opacity * 1.5);
              context.fillText(drop.char, drop.x, drop.y * drop.fontSize);
            }
          }

          // Reset shadow for next bucket/pass
          context.shadowBlur = 0;
        }

        // Reset alpha at end of frame
        context.globalAlpha = 1.0;

        lastTime = currentTime;
      }
    };

    let animationFrameId = 0;
    const animate = (currentTime: number) => {
      drawFrame(currentTime);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate(performance.now());

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // (Removed unused easter-egg test handler)

  if (!isVisible) {
    return null;
  }

  return (
    <dialog
      open
      className={cn("matrix-container", isVisible && "visible")}
      onClick={handleContainerClick}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
          onSuccess?.();
        }
      }}
      aria-modal="true"
      aria-labelledby="matrix-title"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
      }}
    >
      <canvas
        ref={canvasRef}
        className="matrix-canvas"
        role="img"
        aria-label="Matrix rain animation"
      />
      <div className="hack-terminal-frame">
        <div className="hack-terminal-titlebar">
          <div className="hack-terminal-titlebar__label">
            {hackProgress < 33
              ? "PHASE 1: FIREWALL PENETRATION // BREACHING..."
              : hackProgress < 66
                ? "PHASE 2: DECRYPTING SECURE HANDSHAKE..."
                : hackProgress < 100
                  ? "PHASE 3: OVERRIDING CORE KERNEL..."
                  : "ACCESS GRANTED // SYSTEM UNLOCKED"}
          </div>
          <div style={{ fontSize: "0.65rem", opacity: 0.6 }}>
            {hackProgress < 100
              ? `SECURE CHANNEL: ${hackProgress < 33 ? "LOCKED" : hackProgress < 66 ? "DECRYPTING" : "OPEN"}`
              : "SYSTEM READY"}
          </div>
        </div>
        <div className="hack-terminal-screen">
          <div className="matrix-console-grid">
            <div
              className={cn(
                "hack-input-panel",
                isHackingComplete && "complete",
              )}
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
                    style={{
                      width: `${hackProgress}%`,
                      backgroundColor:
                        hackProgress < 33
                          ? "#ff3333"
                          : hackProgress < 66
                            ? "#ffaa00"
                            : "var(--matrix-primary)",
                    }}
                  />
                </div>
                <p className="hack-sequencer__feedback">{hackFeedback}</p>
              </div>
              <div
                className="hack-input-viewport"
                onMouseDown={handleViewportEngage}
                onTouchStart={handleViewportEngage}
              >
                <div className="hack-input-stream" aria-hidden="true">
                  {consoleDisplay.split("\n").map((line, i) => {
                    let className = "hack-line";
                    if (line.includes("[ERR]") || line.includes("failed"))
                      className += " error";
                    else if (line.includes("[WARN]")) className += " warn";
                    else if (
                      line.includes("[SUCCESS]") ||
                      line.includes("[OK]")
                    )
                      className += " success";
                    else if (
                      line.startsWith("thumb@sys") ||
                      line.startsWith("root@")
                    )
                      className += " prompt";

                    return (
                      <div key={i} className={className}>
                        {line}
                      </div>
                    );
                  })}
                  {showConsoleCursor && <span className="hack-input-cursor" />}
                </div>
                {isHackingComplete && successTelemetry && (
                  <output className="hack-input-success" aria-live="assertive">
                    <span className="hack-input-success__title">
                      ACCESS GRANTED
                    </span>
                    <span className="hack-input-success__meta">
                      Channel {successTelemetry.signalChannel} ·{" "}
                      {successTelemetry.runtimeDisplay}
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
      </div>
      <button
        type="button"
        className="matrix-close-btn"
        onClick={onSuccess}
        aria-label="Exit Matrix"
      >
        EXIT
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
