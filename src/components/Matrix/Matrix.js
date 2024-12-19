// Third-party imports
import React, { useEffect, useRef, useState } from "react";

// Context imports
import { useAuth } from "./AuthContext";

// Asset imports
import incorrectGif from "./nu-uh-uh.webp";

// Styles
import "./matrix.scss";

const Matrix = ({ isVisible, onSuccess }) => {
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  const [password, setPassword] = useState("");
  const { checkPassword, showIncorrectFeedback, showSuccessFeedback, dismissFeedback } = useAuth();

  const FONT_SIZE = 18; // Font size for matrix rain
  const ALPHABET =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = checkPassword(password);
    if (success) {
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 2000); // Match the animation duration
    }
    setPassword("");
  };

  // Handle container clicks
  const handleContainerClick = (e) => {
    if (e.target !== canvasRef.current) {
      return;
    }

    if (showIncorrectFeedback || showSuccessFeedback) {
      return;
    }

    onSuccess && onSuccess();
  };

  // Handle keypress for incorrect feedback
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyPress = () => {
      if (showIncorrectFeedback) dismissFeedback();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isVisible, showIncorrectFeedback, dismissFeedback]);

  // Matrix Rain Effect
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reset font settings after canvas resize
      context.font = `${FONT_SIZE}px monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const columns = Math.floor(canvas.width / FONT_SIZE);
    const drops = Array(columns).fill(1);

    // Draw the matrix rain
    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Reset font before drawing characters
      context.font = `${FONT_SIZE}px monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      drops.forEach((y, x) => {
        const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        const xPos = x * FONT_SIZE;
        const yPos = y * FONT_SIZE;

        // Add glow effect for some characters
        context.fillStyle = Math.random() > 0.92 ? "#FFF" : "#0F0";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = 10;

        context.fillText(char, xPos, yPos);

        if (yPos > canvas.height && Math.random() > 0.975) {
          drops[x] = 0; // Reset drop
        }

        drops[x]++;
      });
    };

    let animationFrameId;
    const animate = () => {
      draw();
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`matrix-container ${isVisible ? 'visible' : ''}`} onClick={handleContainerClick}>
      <canvas ref={canvasRef} className="matrix-canvas" />
      
      {showIncorrectFeedback && (
        <div className="feedback-container glitch-effect" onClick={dismissFeedback}>
          <img src={incorrectGif} alt="Incorrect password" className="incorrect-gif" />
          <div className="feedback-hint">Press any key to continue</div>
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
            autoFocus
            className="password-input"
          />
        </form>
      )}
    </div>
  );
};

export default Matrix;