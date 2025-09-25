// Third-party imports
import React, { useEffect, useRef, useState, useCallback } from "react";

// Context imports
import { useAuth } from "./AuthContext";

// Asset imports
import incorrectGif from "../../../assets/images/nu-uh-uh.webp";

// Styles
import "./matrix.scss";

const Matrix = ({ isVisible, onSuccess }) => {
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  const [password, setPassword] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseTrail, setMouseTrail] = useState([]);
  const [currentFPS, setCurrentFPS] = useState(0);
  const [performanceMode, setPerformanceMode] = useState('desktop');
  const {
    checkPassword,
    showIncorrectFeedback,
    showSuccessFeedback,
    dismissFeedback,
    rateLimitInfo,
  } = useAuth();

  // * Configuration constants
  const MIN_FONT_SIZE = 10;
  const MAX_FONT_SIZE = 24;
  const ALPHABET =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]()/\\|~`^";
  const MATRIX_COLORS = [
    { r: 0, g: 255, b: 0 },    // Classic green
    { r: 0, g: 200, b: 0 },    // Darker green
    { r: 0, g: 150, b: 0 },    // Even darker green
    { r: 255, g: 255, b: 255 }, // White highlights
    { r: 0, g: 255, b: 100 },  // Cyan-green
    { r: 100, g: 255, b: 0 },  // Lime green
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
        // Call onSuccess immediately to close the modal
        // The modal closes immediately, but the authenticated state (and thus access to protected content) 
        // is intentionally delayed in AuthContext to avoid UI glitches during the transition
        onSuccess?.();
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

  // * Handle mouse movement for interactive effects
  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });

      // Add to mouse trail
      setMouseTrail(prev => {
        const newTrail = [...prev, { x, y, life: 30 }];
        return newTrail.slice(-20); // Keep only last 20 points
      });
    }
  }, []);

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

  // * Mouse event listeners
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);

      return () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isVisible, handleMouseMove]);

  // * Update mouse trail
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMouseTrail(prev =>
        prev.map(point => ({ ...point, life: point.life - 1 }))
          .filter(point => point.life > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible]);

  // * Set performance mode based on window size
  useEffect(() => {
    const updatePerformanceMode = () => {
      setPerformanceMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    updatePerformanceMode();
    window.addEventListener('resize', updatePerformanceMode);

    return () => window.removeEventListener('resize', updatePerformanceMode);
  }, []);

  // * Enhanced Matrix Rain Effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        this.trailLength = Math.floor(Math.random() * 5) + 3;
        this.trail = [];
        this.particles = [];
        this.glowIntensity = Math.random() * 0.5 + 0.5;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.initializeCharacterProperties();
        this.initializeParticles();
      }

      initializeCharacterProperties() {
        this.speed = Math.random() * 3 + 0.5;
        this.fontSize = Math.floor(
          Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE,
        );
        this.opacity = Math.random() * 0.8 + 0.2;
        this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS.length);
        this.rotation = (Math.random() - 0.5) * 0.1;
        this.scale = Math.random() * 0.3 + 0.85;
      }

      initializeParticles() {
        // Add floating particles around the main character
        for (let i = 0; i < 3; i++) {
          this.particles.push({
            x: this.x + (Math.random() - 0.5) * 20,
            y: this.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: Math.random() * 60 + 30,
            maxLife: Math.random() * 60 + 30,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
          });
        }
      }

      update() {
        this.y += this.speed;
        this.frame++;
        this.pulsePhase += 0.1;

        // * Update particles
        this.particles = this.particles.filter(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life--;
          particle.opacity = (particle.life / particle.maxLife) * 0.5;
          return particle.life > 0;
        });

        // * Add new particles occasionally
        if (Math.random() < 0.1) {
          this.particles.push({
            x: this.x + (Math.random() - 0.5) * 30,
            y: this.y + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            life: Math.random() * 40 + 20,
            maxLife: Math.random() * 40 + 20,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.6 + 0.2,
          });
        }

        // * Update trail with enhanced data
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
          this.char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          this.frame = 0;
          this.brightness = Math.random() > 0.97;
          this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS.length);
        }

        if (this.y * this.fontSize > canvas.height) {
          this.y = -100 / this.fontSize;
          this.initializeCharacterProperties();
          this.trail = [];
          this.particles = [];
          this.initializeParticles();
        }
      }

      draw() {
        context.save();
        context.font = `${this.fontSize}px monospace`;

        // * Draw particles
        this.particles.forEach(particle => {
          const color = MATRIX_COLORS[this.colorIndex];
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity})`;
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
          context.shadowBlur = particle.size * 2;
          context.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
        });

        // * Draw trail with enhanced effects
        this.trail.forEach((trailItem, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.4;
          const color = MATRIX_COLORS[trailItem.colorIndex || this.colorIndex];
          const pulseEffect = Math.sin(this.pulsePhase + index * 0.5) * 0.1 + 0.9;

          // Create radial gradient for trail
          const gradient = context.createRadialGradient(
            this.x, trailItem.y * this.fontSize + this.fontSize / 2,
            0,
            this.x, trailItem.y * this.fontSize + this.fontSize / 2,
            this.fontSize * 2
          );

          gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${trailOpacity * pulseEffect})`);
          gradient.addColorStop(0.5, `rgba(${color.r * 0.7}, ${color.g * 0.7}, ${color.b * 0.7}, ${trailOpacity * 0.6 * pulseEffect})`);
          gradient.addColorStop(1, `rgba(${color.r * 0.3}, ${color.g * 0.3}, ${color.b * 0.3}, 0)`);

          context.fillStyle = gradient;
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
          context.shadowBlur = 2 + index * 0.5;

          // Apply rotation and scale to trail
          context.save();
          context.translate(this.x, trailItem.y * this.fontSize);
          context.rotate(this.rotation * (1 - index / this.trail.length));
          context.scale(this.scale, this.scale);
          context.fillText(trailItem.char, 0, 0);
          context.restore();
        });

        // * Draw main character with enhanced effects
        const color = MATRIX_COLORS[this.colorIndex];
        const pulseEffect = Math.sin(this.pulsePhase) * 0.2 + 0.8;
        const currentOpacity = this.opacity * pulseEffect;

        // Create enhanced gradient
        const gradient = context.createLinearGradient(
          this.x - this.fontSize,
          this.y * this.fontSize,
          this.x + this.fontSize,
          this.y * this.fontSize + this.fontSize,
        );

        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${color.r * 0.6}, ${color.g * 0.6}, ${color.b * 0.6}, ${currentOpacity * 0.7})`);

        if (this.brightness) {
          context.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 1.8})`;
          context.shadowColor = "rgba(255, 255, 255, 0.9)";
          context.shadowBlur = 12 + Math.sin(this.pulsePhase * 2) * 4;
        } else {
          context.fillStyle = gradient;
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;
          context.shadowBlur = 4 + Math.sin(this.pulsePhase) * 2;
        }

        // Apply transformations to main character
        context.save();
        context.translate(this.x, this.y * this.fontSize);
        context.rotate(this.rotation);
        context.scale(this.scale, this.scale);
        context.fillText(this.char, 0, 0);
        context.restore();

        // * Add glow effect for bright characters
        if (this.brightness) {
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
          context.shadowBlur = 20;
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.3})`;
          context.save();
          context.translate(this.x, this.y * this.fontSize);
          context.rotate(this.rotation);
          context.scale(this.scale * 1.2, this.scale * 1.2);
          context.fillText(this.char, 0, 0);
          context.restore();
        }

        context.restore();
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

    // * Performance optimization variables
    let frameCount = 0;
    let lastFPSUpdate = 0;
    const maxDrops = performanceMode === 'mobile' ? 50 : 100;

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        frameCount++;

        // * FPS calculation and performance monitoring
        if (currentTime - lastFPSUpdate >= 1000) {
          setCurrentFPS(frameCount);
          frameCount = 0;
          lastFPSUpdate = currentTime;
        }

        // * Dynamic performance adjustment
        const performanceMultiplier = currentFPS < 30 ? 0.5 : currentFPS < 45 ? 0.75 : 1;
        const shouldDrawScanlines = performanceMode === 'desktop' && performanceMultiplier > 0.7;
        const shouldDrawMouseEffects = performanceMultiplier > 0.5;

        // * Enhanced background with gradient fade (optimized)
        context.fillStyle = "rgba(0, 0, 0, 0.03)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // * Add subtle scanline effect (conditional)
        if (shouldDrawScanlines) {
          context.fillStyle = "rgba(0, 255, 0, 0.01)";
          for (let i = 0; i < canvas.height; i += 4) {
            context.fillRect(0, i, canvas.width, 1);
          }
        }

        // * Update and draw drops with performance optimization
        const activeDrops = drops.slice(0, Math.min(drops.length, maxDrops));
        for (let i = activeDrops.length - 1; i >= 0; i--) {
          const drop = activeDrops[i];
          drop.update();
          drop.draw();
        }

        // * Draw mouse trail (conditional)
        if (shouldDrawMouseEffects && mouseTrail.length > 0) {
          context.save();
          mouseTrail.forEach((point, index) => {
            const opacity = (point.life / 30) * 0.8 * performanceMultiplier;
            const size = (point.life / 30) * 8 + 2;

            context.fillStyle = `rgba(0, 255, 0, ${opacity * 0.3})`;
            context.shadowColor = "rgba(0, 255, 0, 0.5)";
            context.shadowBlur = size * 2;
            context.fillRect(
              point.x - size / 2,
              point.y - size / 2,
              size,
              size
            );
          });
          context.restore();
        }

        // * Draw mouse cursor effect (conditional)
        if (shouldDrawMouseEffects && mousePosition.x > 0 && mousePosition.y > 0) {
          context.save();
          const gradient = context.createRadialGradient(
            mousePosition.x, mousePosition.y, 0,
            mousePosition.x, mousePosition.y, 50
          );
          gradient.addColorStop(0, "rgba(0, 255, 0, 0.1)");
          gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.05)");
          gradient.addColorStop(1, "rgba(0, 255, 0, 0)");

          context.fillStyle = gradient;
          context.fillRect(
            mousePosition.x - 50,
            mousePosition.y - 50,
            100,
            100
          );
          context.restore();
        }

        // * Add occasional screen glitch effect (reduced frequency on mobile)
        const glitchChance = performanceMode === 'mobile' ? 0.0005 : 0.001;
        if (Math.random() < glitchChance) {
          context.fillStyle = "rgba(255, 255, 255, 0.1)";
          context.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 100 + 10,
            Math.random() * 20 + 5
          );
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

      // * Memory cleanup
      drops.length = 0;
      context.clearRect(0, 0, canvas.width, canvas.height);

      // * Reset performance variables
      frameCount = 0;
      lastFPSUpdate = 0;
      setCurrentFPS(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* * Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="performance-indicator">
          <span>FPS: {currentFPS || '--'}</span>
          <span>Mode: {performanceMode}</span>
        </div>
      )}

      {/* * Rate limiting message */}
      {rateLimitInfo.isLimited && (
        <div className="rate-limit-message">
          {rateLimitInfo.lockoutRemaining
            ? `Too many attempts. Try again in ${rateLimitInfo.lockoutRemaining} minute${rateLimitInfo.lockoutRemaining !== 1 ? 's' : ''}.`
            : `Too many attempts. Please try again later.`}
        </div>
      )}

      {showIncorrectFeedback && (
        <button
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
        >
          <img
            src={incorrectGif}
            alt="Incorrect password"
            className="incorrect-gif"
          />
          <div className="feedback-hint">Press any key to continue</div>
        </button>
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
