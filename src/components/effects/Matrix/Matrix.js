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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseTrail, setMouseTrail] = useState([]);
  const [currentFPS, setCurrentFPS] = useState(0);
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
  const BINARY_ALPHABET = MATRIX_RAIN.BINARY_ALPHABET;
  const HACKER_SYMBOLS = MATRIX_RAIN.HACKER_SYMBOLS;
  
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
    }, ANIMATION_TIMING.MOUSE_TRAIL_UPDATE);

    return () => clearInterval(interval);
  }, [isVisible]);

  // * Set performance mode based on window size - using centralized utility
  useEffect(() => {
    const updatePerformanceMode = () => {
      setPerformanceMode(PerformanceUtils.getPerformanceMode());
    };

    updatePerformanceMode();
    window.addEventListener('resize', updatePerformanceMode);

    return () => window.removeEventListener('resize', updatePerformanceMode);
  }, []);

  // * Enhanced Matrix Rain Effect
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
        this.dropType = Math.random();
        this.char = this.getRandomChar();
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

      getRandomChar() {
        if (this.dropType < MATRIX_RAIN.DROP_TYPES.BINARY) {
          return BINARY_ALPHABET[Math.floor(Math.random() * BINARY_ALPHABET.length)];
        } else if (this.dropType < MATRIX_RAIN.DROP_TYPES.HACKER) {
          return HACKER_SYMBOLS[Math.floor(Math.random() * HACKER_SYMBOLS.length)];
        } else {
          return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
      }

      initializeCharacterProperties() {
        this.speed = Math.random() * (MATRIX_RAIN.SPEED_RANGE.max - MATRIX_RAIN.SPEED_RANGE.min) + MATRIX_RAIN.SPEED_RANGE.min;
        this.fontSize = Math.floor(
          Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE,
        );
        this.opacity = Math.random() * 0.9 + 0.1;
        this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS_ARRAY.length);
        this.rotation = (Math.random() - 0.5) * 0.2;
        this.scale = Math.random() * 0.4 + 0.8;
        this.glitchIntensity = Math.random() * (MATRIX_RAIN.GLITCH_INTENSITY_RANGE.max - MATRIX_RAIN.GLITCH_INTENSITY_RANGE.min) + MATRIX_RAIN.GLITCH_INTENSITY_RANGE.min;
        this.pulseSpeed = Math.random() * (MATRIX_RAIN.PULSE_SPEED_RANGE.max - MATRIX_RAIN.PULSE_SPEED_RANGE.min) + MATRIX_RAIN.PULSE_SPEED_RANGE.min;
      }

      initializeParticles() {
        // Add floating particles around the main character
        for (let i = 0; i < MATRIX_RAIN.PARTICLE_COUNT; i++) {
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
        this.pulsePhase += this.pulseSpeed;

        // * Add glitch effect to position (performance optimized)
        if (this.glitchIntensity > 0.1 && Math.random() < this.glitchIntensity) {
          this.x += (Math.random() - 0.5) * 2;
        }

        // * Update particles
        this.particles = this.particles.filter(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life--;
          particle.opacity = (particle.life / particle.maxLife) * 0.5;
          return particle.life > 0;
        });

        // * Add new particles more frequently for denser effect
        if (Math.random() < 0.15) {
          this.particles.push({
            x: this.x + (Math.random() - 0.5) * 40,
            y: this.y + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            life: Math.random() * 50 + 25,
            maxLife: Math.random() * 50 + 25,
            size: Math.random() * 4 + 1,
            opacity: Math.random() * 0.7 + 0.3,
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
          this.char = this.getRandomChar();
          this.frame = 0;
          this.brightness = Math.random() > MATRIX_RAIN.BRIGHTNESS_HIGHLIGHT_CHANCE;
          this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS_ARRAY.length);
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
        for (const particle of this.particles) {
          const color = MATRIX_COLORS_ARRAY[this.colorIndex];
          context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, particle.opacity));
          context.shadowColor = ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0.5));
          context.shadowBlur = particle.size * 2;
          context.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
        }

        // * Draw trail with enhanced effects
        this.trail.forEach((trailItem, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.4;
          const color = MATRIX_COLORS_ARRAY[trailItem.colorIndex || this.colorIndex];
          const pulseEffect = Math.sin(this.pulsePhase + index * 0.5) * 0.1 + 0.9;

          // Create radial gradient for trail
          const gradient = context.createRadialGradient(
            this.x, trailItem.y * this.fontSize + this.fontSize / 2,
            0,
            this.x, trailItem.y * this.fontSize + this.fontSize / 2,
            this.fontSize * 2
          );

          gradient.addColorStop(0, ColorUtils.toRGBA(ColorUtils.withAlpha(color, trailOpacity * pulseEffect)));
          gradient.addColorStop(0.5, ColorUtils.toRGBA(ColorUtils.withAlpha({...color, r: color.r * 0.7, g: color.g * 0.7, b: color.b * 0.7}, trailOpacity * 0.6 * pulseEffect)));
          gradient.addColorStop(1, ColorUtils.toRGBA(ColorUtils.withAlpha({...color, r: color.r * 0.3, g: color.g * 0.3, b: color.b * 0.3}, 0)));

          context.fillStyle = gradient;
          context.shadowColor = ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0.3));
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
        const color = MATRIX_COLORS_ARRAY[this.colorIndex];
        const pulseEffect = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const currentOpacity = this.opacity * pulseEffect;

        // Add glitch effect to character
        const glitchX = Math.random() < this.glitchIntensity ? (Math.random() - 0.5) * 3 : 0;
        const glitchY = Math.random() < this.glitchIntensity ? (Math.random() - 0.5) * 3 : 0;

        // Create enhanced gradient with more dramatic colors
        const gradient = context.createLinearGradient(
          this.x - this.fontSize + glitchX,
          this.y * this.fontSize + glitchY,
          this.x + this.fontSize + glitchX,
          this.y * this.fontSize + this.fontSize + glitchY,
        );

        gradient.addColorStop(0, ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0)));
        gradient.addColorStop(0.2, ColorUtils.toRGBA(ColorUtils.withAlpha(color, currentOpacity * 0.3)));
        gradient.addColorStop(0.5, ColorUtils.toRGBA(ColorUtils.withAlpha(color, currentOpacity * 0.8)));
        gradient.addColorStop(0.8, ColorUtils.toRGBA(ColorUtils.withAlpha(color, currentOpacity)));
        gradient.addColorStop(1, ColorUtils.toRGBA(ColorUtils.withAlpha({...color, r: color.r * 0.4, g: color.g * 0.4, b: color.b * 0.4}, currentOpacity * 0.6)));

        if (this.brightness) {
          context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(MATRIX_COLORS.WHITE, currentOpacity * 2));
          context.shadowColor = ColorUtils.toRGBA(MATRIX_COLORS.WHITE);
          context.shadowBlur = 15 + Math.sin(this.pulsePhase * 3) * 6;
        } else {
          context.fillStyle = gradient;
          context.shadowColor = ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0.8));
          context.shadowBlur = 6 + Math.sin(this.pulsePhase * 2) * 3;
        }

        // Apply transformations to main character with glitch
        context.save();
        context.translate(this.x + glitchX, this.y * this.fontSize + glitchY);
        context.rotate(this.rotation + (Math.random() < this.glitchIntensity ? (Math.random() - 0.5) * 0.2 : 0));
        context.scale(this.scale, this.scale);
        context.fillText(this.char, 0, 0);
        context.restore();

        // * Add glow effect for bright characters
        if (this.brightness) {
          context.shadowColor = ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0.4));
          context.shadowBlur = 25;
          context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, currentOpacity * 0.4));
          context.save();
          context.translate(this.x + glitchX, this.y * this.fontSize + glitchY);
          context.rotate(this.rotation + (Math.random() < this.glitchIntensity ? (Math.random() - 0.5) * 0.1 : 0));
          context.scale(this.scale * 1.3, this.scale * 1.3);
          context.fillText(this.char, 0, 0);
          context.restore();
        }

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
    const targetFPS = PERFORMANCE.TARGET_FPS;
    const frameInterval = PERFORMANCE.FRAME_INTERVAL;

    // * Performance optimization variables
    let frameCount = 0;
    let lastFPSUpdate = 0;
    const maxDrops = performanceMode === 'mobile' ? PERFORMANCE.MOBILE_MAX_DROPS : PERFORMANCE.DESKTOP_MAX_DROPS;

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        frameCount++;

        // * FPS calculation and performance monitoring
        if (currentTime - lastFPSUpdate >= ANIMATION_TIMING.FPS_UPDATE_INTERVAL) {
          setCurrentFPS(frameCount);
          frameCount = 0;
          lastFPSUpdate = currentTime;
        }

        // * Dynamic performance adjustment using centralized utility
        const performanceMultiplier = PerformanceUtils.getPerformanceMultiplier(currentFPS);
        const shouldDrawScanlines = performanceMode === 'desktop' && performanceMultiplier > 0.6;
        const shouldDrawMouseEffects = performanceMultiplier > 0.4;
        const shouldDrawGlitchEffects = performanceMultiplier > 0.5;
        const shouldDrawTerminalMessages = performanceMultiplier > 0.7;

        // * Enhanced background with gradient fade (optimized)
        context.fillStyle = "rgba(0, 0, 0, 0.05)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // * Add dramatic scanline effect
        if (shouldDrawScanlines) {
          context.fillStyle = "rgba(0, 255, 0, 0.02)";
          for (let i = 0; i < canvas.height; i += 3) {
            context.fillRect(0, i, canvas.width, 1);
          }

          // Add horizontal scanlines for CRT effect
          context.fillStyle = "rgba(0, 255, 0, 0.01)";
          for (let i = 0; i < canvas.width; i += 4) {
            context.fillRect(i, 0, 1, canvas.height);
          }
        }

        // * Add terminal-style border effects
        context.strokeStyle = "rgba(0, 255, 0, 0.15)";
        context.lineWidth = 2;

        context.strokeRect(0, 0, canvas.width, canvas.height);
        
        // * Add blinking cursor effect
        if (Math.floor(currentTime / 500) % 2 === 0) {
          context.fillStyle = "rgba(0, 255, 0, 0.8)";
          context.fillRect(canvas.width - 20, 20, 8, 12);
        }
        
        // * Add system status overlay
        if (shouldDrawTerminalMessages) {
          context.fillStyle = "rgba(0, 255, 0, 0.3)";
          context.font = "10px 'Courier New', monospace";
          const statusInfo = [
            `SYSTEM: ${Math.floor(Math.random() * 100)}% CPU`,
            `MEMORY: ${Math.floor(Math.random() * 100)}% USED`,
            `NETWORK: ${Math.floor(Math.random() * 1000)} PACKETS/SEC`,
            `STATUS: ${Math.random() > 0.5 ? 'ONLINE' : 'COMPROMISED'}`,
            `USER: ${Math.random() > 0.5 ? 'root' : 'anonymous'}`,
            `SHELL: ${Math.random() > 0.5 ? 'bash' : 'zsh'}`
          ];
          statusInfo.forEach((info, index) => {
            context.fillText(info, 20, canvas.height - 100 + index * 12);
          });
        }
    
        // * Add corner brackets for terminal aesthetic
        const bracketSize = 20;
        context.strokeStyle = "rgba(0, 255, 0, 0.3)";
        context.lineWidth = 3;

        // Top-left bracket (┌)
        context.beginPath();
        context.moveTo(10, 10 + bracketSize);
        context.lineTo(10, 10);
        context.lineTo(10 + bracketSize, 10);
        context.stroke();

        // Top-right bracket (┐)
        context.beginPath();
        context.moveTo(canvas.width - 10 - bracketSize, 10);
        context.lineTo(canvas.width - 10, 10);
        context.lineTo(canvas.width - 10, 10 + bracketSize);
        context.stroke();

        // Bottom-left bracket (└)
        context.beginPath();
        context.moveTo(10, canvas.height - 10 - bracketSize);
        context.lineTo(10, canvas.height - 10);
        context.lineTo(10 + bracketSize, canvas.height - 10);
        context.stroke();

        // Bottom-right bracket (┘)
        context.beginPath();
        context.moveTo(canvas.width - 10, canvas.height - 10 - bracketSize);
        context.lineTo(canvas.width - 10, canvas.height - 10);
        context.lineTo(canvas.width - 10 - bracketSize, canvas.height - 10);
        context.stroke();

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

        // * Add dramatic screen glitch effects (performance optimized)
        if (shouldDrawGlitchEffects) {
          const glitchChance = performanceMode === 'mobile' ? MATRIX_RAIN.GLITCH_CHANCE_MOBILE : MATRIX_RAIN.GLITCH_CHANCE_DESKTOP;
          if (Math.random() < glitchChance) {
            // Horizontal glitch lines
            context.fillStyle = "rgba(255, 255, 255, 0.2)";
            const glitchY = Math.random() * canvas.height;
            context.fillRect(0, glitchY, canvas.width, 3);
            
            // Vertical glitch lines
            context.fillStyle = "rgba(0, 255, 0, 0.3)";
            const glitchX = Math.random() * canvas.width;
            context.fillRect(glitchX, 0, 2, canvas.height);
       
            // Random glitch blocks
            context.fillStyle = "rgba(255, 0, 255, 0.15)";
            context.fillRect(
              Math.random() * canvas.width,
              Math.random() * canvas.height,
              Math.random() * 80 + 10,
              Math.random() * 40 + 10
            );
            
            // Terminal-style corruption
            context.fillStyle = "rgba(0, 255, 0, 0.1)";
            for (let i = 0; i < 5; i++) {
              context.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 20 + 5,
                Math.random() * 20 + 5
              );
            }
          }
        }

        // * Add ASCII art header
        if (shouldDrawTerminalMessages && Math.random() < 0.005) {
          context.fillStyle = "rgba(0, 255, 0, 0.6)";
          context.font = "8px 'Courier New', monospace";
          const asciiArt = [
            "    ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗",
            "    ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝",
            "    ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ ",
            "    ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ ",
            "    ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗",
            "    ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝",
            "",
            "    ███████╗██╗  ██╗ █████╗ ██████╗ ██╗   ██╗██╗     ",
            "    ██╔════╝██║  ██║██╔══██╗██╔══██╗██║   ██║██║     ",
            "    ███████╗███████║███████║██████╔╝██║   ██║██║     ",
            "    ╚════██║██╔══██║██╔══██║██╔══██╗██║   ██║██║     ",
            "    ███████║██║  ██║██║  ██║██║  ██║╚██████╔╝███████╗",
            "    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝"
          ];
          const startY = 50;
          asciiArt.forEach((line, index) => {
            context.fillText(line, 50, startY + index * 10);
          });
        }

        // * Add terminal-style data streams (performance optimized)
        if (shouldDrawTerminalMessages && Math.random() < 0.01) {
          context.fillStyle = "rgba(0, 255, 0, 0.4)";
          context.font = "11px 'Courier New', monospace";
          const messages = [
            "root@hacker:~$ sudo rm -rf /",
            "ACCESSING MAINFRAME...",
            "DECRYPTING DATA...",
            "CONNECTION ESTABLISHED",
            "SECURITY BREACH DETECTED",
            "INITIALIZING PROTOCOL...",
            "MATRIX ONLINE",
            "SYSTEM COMPROMISED",
            "NEURAL LINK ACTIVE",
            "> whoami",
            "> ls -la /root",
            "> cat /etc/passwd",
            "> nmap -sS target.com",
            "> hydra -l admin -P passwords.txt ssh://target",
            "> sqlmap -u 'http://target.com/page?id=1' --dbs",
            "> john --wordlist=rockyou.txt hash.txt",
            "> aircrack-ng -w wordlist.txt capture.cap",
            "> msfconsole",
            "> use exploit/windows/smb/ms17_010_eternalblue",
            "> set RHOSTS 192.168.1.100",
            "> exploit",
            "> meterpreter > shell",
            "> C:\\> whoami",
            "> C:\\> systeminfo",
            "> C:\\> net user hacker password123 /add",
            "> C:\\> net localgroup administrators hacker /add",
            "> C:\\> shutdown /r /t 0",
            "> Connection lost...",
            "> Reconnecting...",
            "> Backdoor activated",
            "> Keylogger installed",
            "> Data exfiltration complete",
            "> Covering tracks...",
            "> Mission accomplished"
          ];
          const message = messages[Math.floor(Math.random() * messages.length)];
          context.fillText(message, Math.random() * (canvas.width - 300), Math.random() * canvas.height);
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
      // * Cleanup event listeners
      window.removeEventListener("resize", resizeCanvas);
      
      // * Cancel animation frame
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      // * Memory cleanup
      drops.length = 0;
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      // * Reset performance variables
      frameCount = 0;
      lastFPSUpdate = 0;
      setCurrentFPS(0);
    };
  }, [isVisible, currentFPS, mousePosition.x, mousePosition.y, mouseTrail, performanceMode]);

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
