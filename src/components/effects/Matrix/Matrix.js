// Third-party imports
import React, { useEffect, useRef, useState, useCallback } from "react";

// Context imports
import { useAuth } from "./AuthContext";

// Audio imports
import { playKnightRiderTheme, stopKnightRiderTheme, setAudioVolume } from "../../../utils/audioUtils";

// Components
import AudioControls from "./AudioControls";
import HintSystem from "./HintSystem";
import FeedbackSystem from "./FeedbackSystem";
import { useMatrixRain } from "./useMatrixRain";

// Styles
import "./matrix.scss";

const Matrix = ({ isVisible, onSuccess }) => {
  const formRef = useRef(null);
  const [password, setPassword] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [matrixFadeIn, setMatrixFadeIn] = useState(false);
  const [matrixIntensity, setMatrixIntensity] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [audioVolume, setAudioVolumeState] = useState(0.3);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioStatus, setAudioStatus] = useState('loading'); // 'loading', 'playing', 'error', 'stopped'

  // Use the matrix rain hook
  const canvasRef = useMatrixRain(isVisible, matrixIntensity, isTransitioning);



  const {
    checkPassword,
    showIncorrectFeedback,
    showSuccessFeedback,
    rateLimitInfo,
  } = useAuth();




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
        // Don't call onSuccess immediately - let the user see the success feedback
        // The modal will close after the success feedback duration
        setTimeout(() => {
          onSuccess?.();
        }, 2000); // 2 second delay to show success feedback
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
    [showIncorrectFeedback, showSuccessFeedback, onSuccess, canvasRef],
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

    // Remove the key press handler that dismisses feedback
    // Now feedback can only be dismissed by entering correct password
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, handleKeyDown]);


  // * Audio control handlers
  const handleVolumeChange = useCallback((e) => {
    const newVolume = Number.parseFloat(e.target.value);
    setAudioVolumeState(newVolume);
    setAudioVolume(newVolume);
  }, []);

  const handleMuteToggle = useCallback(() => {
    const newMutedState = !isAudioMuted;
    setIsAudioMuted(newMutedState);
    setAudioVolume(newMutedState ? 0 : audioVolume);
  }, [isAudioMuted, audioVolume]);

  // * Audio management for Knight Rider theme
  useEffect(() => {
    if (isVisible) {
      // Reset fade-in state when matrix becomes visible
      setMatrixFadeIn(false);
      setMatrixIntensity(0);
      setIsTransitioning(true);

      // Progressive matrix intensity buildup
      const intensityInterval = setInterval(() => {
        setMatrixIntensity(prev => {
          if (prev >= 1) {
            clearInterval(intensityInterval);
            setMatrixFadeIn(true);
            setIsTransitioning(false);
            return 1;
          }
          return prev + 0.1;
        });
      }, 100);

      setAudioStatus('loading');
      // Start playing Knight Rider theme when matrix is activated
      playKnightRiderTheme()
        .then((success) => {
          setAudioStatus(success ? 'playing' : 'error');
        })
        .catch((error) => {
          console.warn('Failed to play Knight Rider theme:', error);
          setAudioStatus('error');
        });

      // Cleanup interval on unmount
      return () => {
        clearInterval(intensityInterval);
        setAudioStatus('stopped');
        stopKnightRiderTheme().catch((error) => {
          console.warn('Failed to stop Knight Rider theme:', error);
        });
      };
    } else {
      // Reset fade-in state when matrix is hidden
      setMatrixFadeIn(false);
      setMatrixIntensity(0);
      setIsTransitioning(false);
      setAudioStatus('stopped');
      // Stop playing when matrix is closed
      stopKnightRiderTheme().catch((error) => {
        console.warn('Failed to stop Knight Rider theme:', error);
      });
    }
  }, [isVisible]);

  // * Update audio volume when volume state changes
  useEffect(() => {
    if (isVisible) {
      setAudioVolume(isAudioMuted ? 0 : audioVolume);
    }
  }, [audioVolume, isAudioMuted, isVisible]);





  if (!isVisible) {
    return null;
  }

  return (
    <dialog
      open
      className={`matrix-container ${isVisible ? "visible" : ""} ${matrixFadeIn ? "matrix-fade-in" : ""}`}
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
      <HintSystem hintLevel={hintLevel} onHintClick={handleHintClick} />

      {/* * Keyboard shortcuts hint */}
      <div className="keyboard-hints">
        <span>ESC: Exit</span>
        <span>H: Toggle Hints</span>
        <span>ENTER: Submit</span>
      </div>

      {/* * Audio controls */}
      <AudioControls
        audioStatus={audioStatus}
        isAudioMuted={isAudioMuted}
        audioVolume={audioVolume}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
      />


      {/* * Rate limiting message */}
      {rateLimitInfo.isLimited && (
        <div className="rate-limit-message">
          {rateLimitInfo.lockoutRemaining
            ? `Too many attempts. Try again in ${rateLimitInfo.lockoutRemaining} minute${rateLimitInfo.lockoutRemaining !== 1 ? 's' : ''}.`
            : "Too many attempts. Please try again later."}
        </div>
      )}

      <FeedbackSystem
        showIncorrectFeedback={showIncorrectFeedback}
        showSuccessFeedback={showSuccessFeedback}
        failedAttempts={failedAttempts}
      />

      {/* Transition status indicator */}
      {isTransitioning && (
        <div className="matrix-transition-status">
          <div className="transition-text">
            {matrixIntensity < 0.3 ? "INITIALIZING MATRIX..." :
              matrixIntensity < 0.6 ? "ESTABLISHING CONNECTION..." :
                matrixIntensity < 0.9 ? "LOADING NEURAL INTERFACE..." :
                  "MATRIX ONLINE"}
          </div>
          <div className="transition-progress">
            <div
              className="progress-bar"
              style={{ width: `${matrixIntensity * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Always show the login form unless showing success feedback */}
      {!showSuccessFeedback && (
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
