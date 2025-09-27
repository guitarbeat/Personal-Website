// Third-party imports
import React, { useEffect, useRef, useState, useCallback } from "react";

// Context imports
import { useAuth } from "./AuthContext";

// Asset imports
import incorrectGif from "../../../assets/images/nu-uh-uh.webp";

// Constants
import {
  MATRIX_COLORS,
  ANIMATION_TIMING,
  Z_INDEX,
  PERFORMANCE,
  TYPOGRAPHY,
  LAYOUT,
  MATRIX_RAIN,
  ERROR_MESSAGES,
  ColorUtils,
  PerformanceUtils,
} from "./constants";

// Styles
import "./matrix.scss";

const Matrix = ({ isVisible, onSuccess }) => {
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  const [password, setPassword] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [performanceMode, setPerformanceMode] = useState('desktop');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const {
    checkPassword,
    showIncorrectFeedback,
    showSuccessFeedback,
    dismissFeedback,
    rateLimitInfo,
  } = useAuth();

  // * Configuration constants - using centralized constants
  const MIN_FONT_SIZE = TYPOGRAPHY.FONT_SIZES.MIN;
  const MAX_FONT_SIZE = TYPOGRAPHY.FONT_SIZES.MAX;
  const ALPHABET = MATRIX_RAIN.ALPHABET;

  // Convert color objects to arrays for canvas context
  const MATRIX_COLORS_ARRAY = [
    MATRIX_COLORS.GREEN,
    MATRIX_COLORS.DARK_GREEN,
    MATRIX_COLORS.DARKER_GREEN,
    MATRIX_COLORS.DARKEST_GREEN,
    MATRIX_COLORS.BRIGHT_GREEN,
    MATRIX_COLORS.MEDIUM_GREEN,
    MATRIX_COLORS.CYAN_GREEN,
    MATRIX_COLORS.CYAN,
    MATRIX_COLORS.WHITE,
  ];

  // * Handle form submission with rate limiting
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (rateLimitInfo.isLimited) {
        return;
      }

      const success = checkPassword(password);
      if (success) {
        // Reset failed attempts on success
        setFailedAttempts(0);
        // Call onSuccess immediately to close the modal
        // The modal closes immediately, but the authenticated state (and thus access to protected content) 
        // is intentionally delayed in AuthContext to avoid UI glitches during the transition
        onSuccess?.();
      } else {
        // Increment failed attempts on failure
        setFailedAttempts(prev => prev + 1);
      }
      setPassword("");
    },
    [password, checkPassword, onSuccess, rateLimitInfo.isLimited],
  );

  // * Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onSuccess?.();
      } else if (
        e.key === "Enter" &&
        !showIncorrectFeedback &&
        !showSuccessFeedback
      ) {
        handleSubmit(e);
      } else if (e.key === "h" || e.key === "H") {
        setHintLevel((prev) => (prev < 2 ? prev + 1 : prev));
      }
    },
    [onSuccess, handleSubmit, showIncorrectFeedback, showSuccessFeedback],
  );


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
  const handleHintClick = useCallback((e) => {
    e.stopPropagation();
    setHintLevel((prev) => (prev < 2 ? prev + 1 : prev));
  }, []);

  // * Keyboard event listeners
  useEffect(() => {
    if (!isVisible) {
      return;
    }

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
  }, [isVisible, showIncorrectFeedback, dismissFeedback, handleKeyDown]);

  // * Cleanup on unmount - using refs to track listeners
  const eventListenersRef = useRef([]);

  useEffect(() => {
    return () => {
      // * Cleanup all tracked event listeners
      eventListenersRef.current.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      eventListenersRef.current = [];
    };
  }, []);



  // * Simplified Matrix Rain Effect
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error(ERROR_MESSAGES.CANVAS_ERROR);
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error(ERROR_MESSAGES.CANVAS_ERROR);
      return;
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Drop {
      constructor(x) {
        this.x = x;
        this.y = -100;
        this.char = this.getRandomChar();
        this.changeInterval = Math.random() * 50 + 15;
        this.frame = 0;
        this.brightness = Math.random() > 0.95;
        this.trailLength = Math.floor(Math.random() * (MATRIX_RAIN.TRAIL_LENGTH_RANGE.max - MATRIX_RAIN.TRAIL_LENGTH_RANGE.min) + MATRIX_RAIN.TRAIL_LENGTH_RANGE.min);
        this.trail = [];
        this.initializeProperties();
      }

      getRandomChar() {
        return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }

      initializeProperties() {
        this.speed = Math.random() * (MATRIX_RAIN.SPEED_RANGE.max - MATRIX_RAIN.SPEED_RANGE.min) + MATRIX_RAIN.SPEED_RANGE.min;
        this.fontSize = Math.floor(Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE);
        this.opacity = Math.random() * 0.8 + 0.2;
        this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS_ARRAY.length);
      }

      update() {
        this.y += this.speed;
        this.frame++;

        // Update trail
        this.trail.push({
          char: this.char,
          y: this.y,
          opacity: this.opacity,
          colorIndex: this.colorIndex,
          brightness: this.brightness
        });

        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }

        if (this.frame >= this.changeInterval) {
          this.char = this.getRandomChar();
          this.frame = 0;
          this.brightness = Math.random() > MATRIX_RAIN.BRIGHTNESS_CHANCE;
          this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS_ARRAY.length);
        }

        if (this.y * this.fontSize > canvas.height) {
          this.y = -100 / this.fontSize;
          this.initializeProperties();
          this.trail = [];
        }
      }

      draw() {
        context.save();
        context.font = `${this.fontSize}px monospace`;

        // Draw trail
        this.trail.forEach((trailItem, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.4;
          const color = MATRIX_COLORS_ARRAY[trailItem.colorIndex || this.colorIndex];

          context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, trailOpacity));
          context.fillText(trailItem.char, this.x, trailItem.y * this.fontSize);
        });

        // Draw main character
        const color = MATRIX_COLORS_ARRAY[this.colorIndex];

        if (this.brightness) {
          context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(MATRIX_COLORS.WHITE, this.opacity));
          context.shadowColor = ColorUtils.toRGBA(MATRIX_COLORS.WHITE);
          context.shadowBlur = 10;
        } else {
          context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, this.opacity));
          context.shadowColor = ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0.5));
          context.shadowBlur = 3;
        }

        context.fillText(this.char, this.x, this.y * this.fontSize);
        context.restore();
      }
    }

    const columns = Math.floor(canvas.width / (MIN_FONT_SIZE * 0.8));
    const drops = Array(columns)
      .fill(null)
      .map((_, i) => {
        const drop = new Drop(i * MIN_FONT_SIZE * 0.8);
        drop.y = (Math.random() * canvas.height) / MIN_FONT_SIZE;
        return drop;
      });

    let lastTime = 0;
    const frameInterval = 1000 / 60; // 60 FPS

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        // Simple background fade
        context.fillStyle = "rgba(0, 0, 0, 0.05)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw drops
        drops.forEach(drop => {
          drop.update();
          drop.draw();
        });

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

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      drops.length = 0;
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
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
        if (e.key === "Escape") onSuccess();
      }}
      aria-modal="true"
      aria-labelledby="matrix-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'transparent',
        maxWidth: 'none',
        maxHeight: 'none',
        minWidth: '100vw',
        minHeight: '100vh',
        inset: 0
      }}
    >
      <button
        type="button"
        className="matrix-close-btn"
        onClick={onSuccess}
        aria-label="Exit Matrix"
      >
        EXIT
      </button>

      <canvas
        ref={canvasRef}
        className="matrix-canvas"
        style={{ cursor: 'none' }}
      />

      {/* * Progressive Hint System */}
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

      {/* * Keyboard shortcuts hint */}
      <div className="keyboard-hints">
        <span>ESC: Exit</span>
        <span>H: Toggle Hints</span>
        <span>ENTER: Submit</span>
      </div>


      {/* * Rate limiting message */}
      {rateLimitInfo.isLimited && (
        <div className="rate-limit-message">
          {rateLimitInfo.lockoutRemaining
            ? `Too many attempts. Try again in ${rateLimitInfo.lockoutRemaining} minute${rateLimitInfo.lockoutRemaining !== 1 ? 's' : ''}.`
            : "Too many attempts. Please try again later."}
        </div>
      )}

      {showIncorrectFeedback && (
        <div className="feedback-container-wrapper">
          {Array.from({ length: Math.max(1, failedAttempts) }, (_, index) => (
            <button
              key={index}
              type="button"
              className="feedback-container glitch-effect"
              onClick={dismissFeedback}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  dismissFeedback();
                }
              }}
              aria-label="Incorrect password feedback"
              style={{
                position: 'absolute',
                top: `${20 + (index * 100)}px`,
                left: `${20 + (index * 50)}px`,
                zIndex: 1000 + index,
                transform: `rotate(${index * 5}deg) scale(${1 - (index * 0.1)})`,
              }}
            >
              <img
                src={incorrectGif}
                alt="Incorrect password"
                className="incorrect-gif"
              />
              <div className="feedback-hint">Press any key to continue</div>
            </button>
          ))}
        </div>
      )}

      {showSuccessFeedback && (
        <div className="success-message">
          <span className="success-text">Access Granted</span>
        </div>
      )}

      {!showSuccessFeedback && !showIncorrectFeedback && (
        <form ref={formRef} onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="password-input"
            disabled={rateLimitInfo.isLimited}
            aria-label="Password input"
          />
          <button
            type="submit"
            className="password-submit-btn"
            disabled={rateLimitInfo.isLimited}
            aria-label="Submit password"
          >
            Submit
          </button>
        </form>
      )}
    </dialog>
  );
};

export default Matrix;
