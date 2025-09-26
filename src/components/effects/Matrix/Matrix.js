// Third-party imports
import React, { useEffect, useRef, useState, useCallback } from "react";
import { VFX } from "@vfx-js/core";

// Context imports
import { useAuth } from "./AuthContext";

// Asset imports
import incorrectGif from "../../../assets/images/nu-uh-uh.webp";

// Styles
import "./matrix.scss";

const Matrix = ({ isVisible, onSuccess }) => {
  const canvasRef = useRef(null);
  const vfxRef = useRef(null);
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

  // * Enhanced Configuration constants
  const MIN_FONT_SIZE = 10;
  const MAX_FONT_SIZE = 24;
  const ALPHABET =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]()/\\|~`^+-=<>{}[]()/\\|~`^!@#$%^&*()_+-=[]{}|;':\",./<>?";
  
  // * Enhanced color palette with better contrast and visual hierarchy
  const MATRIX_COLORS = [
    { r: 0, g: 255, b: 0, alpha: 0.9 },      // Primary green - high contrast
    { r: 0, g: 220, b: 0, alpha: 0.8 },      // Secondary green
    { r: 0, g: 180, b: 0, alpha: 0.7 },      // Tertiary green
    { r: 0, g: 140, b: 0, alpha: 0.6 },      // Dim green
    { r: 255, g: 255, b: 255, alpha: 1.0 },  // Bright white highlights
    { r: 0, g: 255, b: 150, alpha: 0.8 },    // Cyan-green accent
    { r: 150, g: 255, b: 0, alpha: 0.7 },    // Lime green accent
    { r: 0, g: 255, b: 255, alpha: 0.6 },    // Cyan accent
    { r: 255, g: 100, b: 255, alpha: 0.5 },  // Magenta accent
    { r: 0, g: 255, b: 200, alpha: 0.6 },    // Aqua accent
    { r: 255, g: 200, b: 0, alpha: 0.4 },    // Gold accent
    { r: 255, g: 100, b: 100, alpha: 0.3 },  // Red accent
  ];

  // * Visual enhancement constants
  const VISUAL_CONFIG = {
    // Glow effects
    GLOW_INTENSITY: 0.8,
    GLOW_RADIUS: 15,
    
    // Particle effects
    PARTICLE_COUNT: 3,
    PARTICLE_LIFETIME: 60,
    
    // Trail effects
    TRAIL_FADE: 0.85,
    TRAIL_BLUR: 2,
    
    // Screen effects
    SCANLINE_OPACITY: 0.03,
    VIGNETTE_STRENGTH: 0.3,
    
    // Animation timing
    PULSE_SPEED: 0.08,
    GLITCH_FREQUENCY: 0.003,
    
    // Performance scaling
    MOBILE_SCALE: 0.6,
    DESKTOP_SCALE: 1.0,
  };

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

  // * Initialize VFX-JS effects
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    try {
      // Initialize VFX instance
      vfxRef.current = new VFX();
      
      // Custom Matrix-style glitch shader
      const matrixGlitchShader = `
        precision mediump float;
        uniform float time;
        uniform float intensity;
        uniform float speed;
        uniform sampler2D texture;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Digital glitch effect
          float glitch = random(vec2(floor(uv.y * 20.0) + time * speed, 0.0));
          if (glitch > 0.98) {
            uv.x += (random(vec2(time, uv.y)) - 0.5) * intensity * 0.1;
            uv.y += (random(vec2(time * 1.1, uv.x)) - 0.5) * intensity * 0.05;
          }
          
          // Color channel separation
          float r = texture2D(texture, uv + vec2(intensity * 0.01, 0.0)).r;
          float g = texture2D(texture, uv).g;
          float b = texture2D(texture, uv - vec2(intensity * 0.01, 0.0)).b;
          
          vec3 color = vec3(r, g, b);
          
          // Add digital noise
          float noise = random(uv + time * 0.1) * intensity * 0.1;
          color += noise;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `;

      // Custom Matrix scanline shader
      const matrixScanlineShader = `
        precision mediump float;
        uniform float time;
        uniform float opacity;
        uniform float count;
        uniform float speed;
        uniform sampler2D texture;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          vec4 color = texture2D(texture, uv);
          
          // Scanline effect
          float scanline = sin(uv.y * count + time * speed) * 0.5 + 0.5;
          scanline = pow(scanline, 2.0);
          
          // Add subtle horizontal lines
          float line = step(0.98, fract(uv.y * count));
          
          color.rgb *= (1.0 - scanline * opacity) + line * opacity * 0.5;
          
          gl_FragColor = color;
        }
      `;

      // Apply custom Matrix glitch effect
      vfxRef.current.add(canvasRef.current, {
        shader: matrixGlitchShader,
        overflow: 50,
        uniforms: {
          intensity: 0.4,
          speed: 1.2,
        }
      });

      // Apply custom Matrix scanline effect
      vfxRef.current.add(canvasRef.current, {
        shader: matrixScanlineShader,
        overflow: 30,
        uniforms: {
          opacity: 0.2,
          count: 150,
          speed: 0.8,
        }
      });

      // Add standard noise effect for digital corruption
      vfxRef.current.add(canvasRef.current, {
        shader: 'noise',
        overflow: 20,
        uniforms: {
          intensity: 0.08,
          speed: 0.4,
          scale: 1.5,
        }
      });

      // Add VFX enhancement class to canvas
      canvasRef.current.classList.add('vfx-enhanced');

    } catch (error) {
      console.warn('VFX-JS initialization failed:', error);
      // Continue without VFX effects if WebGL is not available
    }

    return () => {
      if (vfxRef.current) {
        try {
          // Remove VFX enhancement class
          if (canvasRef.current) {
            canvasRef.current.classList.remove('vfx-enhanced');
          }
          vfxRef.current.dispose();
          vfxRef.current = null;
        } catch (error) {
          console.warn('VFX-JS cleanup failed:', error);
        }
      }
    };
  }, [isVisible]);

  // * Enhanced Matrix Rain Effect
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

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
        this.speed = Math.random() * 3 + 1.5; // Slightly slower for better readability
        this.fontSize = Math.floor(
          Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE,
        );
        this.opacity = Math.random() * 0.8 + 0.2; // Better contrast range
        this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS.length);
        this.rotation = (Math.random() - 0.5) * 0.15; // Subtle rotation
        this.scale = Math.random() * 0.3 + 0.85; // More consistent sizing
        this.glitchIntensity = Math.random() * 0.2 + 0.1; // Controlled glitch
        this.pulseSpeed = Math.random() * 0.06 + 0.04; // Smoother pulsing
        
        // * Enhanced visual properties
        this.glowRadius = Math.random() * 8 + 4;
        this.shadowBlur = Math.random() * 6 + 2;
        this.brightness = Math.random() > 0.92; // Rarer bright characters
        this.isAccent = Math.random() > 0.85; // Special accent characters
        this.fadeSpeed = Math.random() * 0.02 + 0.01;
        this.wavePhase = Math.random() * Math.PI * 2;
        this.waveAmplitude = Math.random() * 2 + 1;
      }

      initializeParticles() {
        // Enhanced particle system with better visual hierarchy
        const particleCount = performanceMode === 'mobile' ? 2 : VISUAL_CONFIG.PARTICLE_COUNT;
        for (let i = 0; i < particleCount; i++) {
          this.particles.push({
            x: this.x + (Math.random() - 0.5) * 30,
            y: this.y + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            life: Math.random() * VISUAL_CONFIG.PARTICLE_LIFETIME + 20,
            maxLife: Math.random() * VISUAL_CONFIG.PARTICLE_LIFETIME + 20,
            size: Math.random() * 3 + 1.5,
            opacity: Math.random() * 0.6 + 0.4,
            glow: Math.random() * 0.5 + 0.3,
            color: this.colorIndex,
          });
        }
      }

      update() {
        this.y += this.speed;
        this.frame++;
        this.pulsePhase += this.pulseSpeed;
        this.wavePhase += VISUAL_CONFIG.PULSE_SPEED;

        // * Enhanced glitch effect with wave motion
        if (this.glitchIntensity > 0.1 && Math.random() < this.glitchIntensity) {
          this.x += (Math.random() - 0.5) * 1.5 + Math.sin(this.wavePhase) * 0.5;
        }

        // * Add subtle wave motion for more organic feel
        this.x += Math.sin(this.wavePhase * 0.5) * this.waveAmplitude * 0.1;

        // * Update particles with enhanced physics
        this.particles = this.particles.filter(particle => {
          particle.x += particle.vx + Math.sin(this.wavePhase) * 0.2;
          particle.y += particle.vy + Math.cos(this.wavePhase) * 0.2;
          particle.life--;
          particle.opacity = (particle.life / particle.maxLife) * particle.glow;
          particle.size = (particle.life / particle.maxLife) * 3 + 0.5;
          return particle.life > 0;
        });

        // * Enhanced particle generation with better distribution
        if (Math.random() < 0.12) {
          this.particles.push({
            x: this.x + (Math.random() - 0.5) * 50,
            y: this.y + (Math.random() - 0.5) * 50,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: Math.random() * VISUAL_CONFIG.PARTICLE_LIFETIME + 30,
            maxLife: Math.random() * VISUAL_CONFIG.PARTICLE_LIFETIME + 30,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.8 + 0.4,
            glow: Math.random() * 0.7 + 0.3,
            color: this.colorIndex,
          });
        }

        // * Enhanced trail system with better visual hierarchy
        this.trail.push({
          char: this.char,
          y: this.y,
          opacity: this.opacity * VISUAL_CONFIG.TRAIL_FADE,
          colorIndex: this.colorIndex,
          brightness: this.brightness,
          isAccent: this.isAccent,
          glow: this.glowRadius,
          scale: this.scale,
        });
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }

        // * Enhanced character updates with better timing
        if (this.frame >= this.changeInterval) {
          this.char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          this.frame = 0;
          this.brightness = Math.random() > 0.96; // Rarer bright characters
          this.isAccent = Math.random() > 0.88; // More accent characters
          this.colorIndex = Math.floor(Math.random() * MATRIX_COLORS.length);
          
          // * Occasionally change visual properties for variety
          if (Math.random() < 0.1) {
            this.glowRadius = Math.random() * 8 + 4;
            this.shadowBlur = Math.random() * 6 + 2;
          }
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
        context.font = `${this.fontSize}px 'Courier New', monospace`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // * Enhanced particle rendering with glow effects
        for (const particle of this.particles) {
          const color = MATRIX_COLORS[particle.color || this.colorIndex];
          const alpha = particle.opacity * (color.alpha || 1);
          
          // * Outer glow
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`;
          context.shadowBlur = particle.size * 4;
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.6})`;
          context.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
          
          // * Inner bright core
          context.shadowBlur = 0;
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
          context.fillRect(
            particle.x - particle.size / 4,
            particle.y - particle.size / 4,
            particle.size / 2,
            particle.size / 2
          );
        }

        // * Enhanced trail rendering with better visual hierarchy
        this.trail.forEach((trailItem, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * VISUAL_CONFIG.TRAIL_FADE;
          const color = MATRIX_COLORS[trailItem.colorIndex || this.colorIndex];
          const alpha = trailOpacity * (color.alpha || 1);
          const pulseEffect = Math.sin(this.pulsePhase + index * 0.3) * 0.15 + 0.85;
          const scale = trailItem.scale || this.scale;

          // * Create enhanced gradient for trail
          const gradient = context.createRadialGradient(
            this.x, trailItem.y * this.fontSize + this.fontSize / 2,
            0,
            this.x, trailItem.y * this.fontSize + this.fontSize / 2,
            this.fontSize * 3
          );

          gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * pulseEffect})`);
          gradient.addColorStop(0.3, `rgba(${color.r * 0.8}, ${color.g * 0.8}, ${color.b * 0.8}, ${alpha * 0.7 * pulseEffect})`);
          gradient.addColorStop(0.7, `rgba(${color.r * 0.5}, ${color.g * 0.5}, ${color.b * 0.5}, ${alpha * 0.4 * pulseEffect})`);
          gradient.addColorStop(1, `rgba(${color.r * 0.2}, ${color.g * 0.2}, ${color.b * 0.2}, 0)`);

          context.fillStyle = gradient;
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.4})`;
          context.shadowBlur = VISUAL_CONFIG.TRAIL_BLUR + index * 0.8;

          // * Apply enhanced transformations to trail
          context.save();
          context.translate(this.x, trailItem.y * this.fontSize + this.fontSize / 2);
          context.rotate(this.rotation * (1 - index / this.trail.length) * 0.5);
          context.scale(scale * (1 - index / this.trail.length * 0.3), scale * (1 - index / this.trail.length * 0.3));
          
          // * Add subtle wave motion to trail
          const waveOffset = Math.sin(this.wavePhase + index * 0.2) * 2;
          context.translate(waveOffset, 0);
          
          context.fillText(trailItem.char, 0, 0);
          context.restore();
        });

        // * Enhanced main character rendering with advanced visual effects
        const color = MATRIX_COLORS[this.colorIndex];
        const alpha = this.opacity * (color.alpha || 1);
        const pulseEffect = Math.sin(this.pulsePhase) * 0.25 + 0.75;
        const currentOpacity = alpha * pulseEffect;

        // * Enhanced glitch effect with wave motion
        const glitchX = Math.random() < this.glitchIntensity ? 
          (Math.random() - 0.5) * 2 + Math.sin(this.wavePhase * 2) * 1 : 0;
        const glitchY = Math.random() < this.glitchIntensity ? 
          (Math.random() - 0.5) * 2 + Math.cos(this.wavePhase * 2) * 1 : 0;

        // * Create sophisticated gradient with multiple color stops
        const gradient = context.createLinearGradient(
          this.x - this.fontSize + glitchX,
          this.y * this.fontSize + this.fontSize / 2 + glitchY,
          this.x + this.fontSize + glitchX,
          this.y * this.fontSize + this.fontSize / 2 + glitchY,
        );

        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        gradient.addColorStop(0.1, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.2})`);
        gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.8})`);
        gradient.addColorStop(0.9, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${color.r * 0.6}, ${color.g * 0.6}, ${color.b * 0.6}, ${currentOpacity * 0.7})`);

        // * Enhanced shadow and glow effects
        if (this.brightness || this.isAccent) {
          // * Bright character with intense glow
          context.shadowColor = `rgba(255, 255, 255, 0.9)`;
          context.shadowBlur = this.glowRadius + Math.sin(this.pulsePhase * 4) * 8;
          context.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 1.5})`;
        } else {
          // * Regular character with subtle glow
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.6})`;
          context.shadowBlur = this.shadowBlur + Math.sin(this.pulsePhase * 2) * 2;
          context.fillStyle = gradient;
        }

        // * Apply enhanced transformations with wave motion
        context.save();
        const waveOffsetX = Math.sin(this.wavePhase * 0.8) * this.waveAmplitude * 0.5;
        const waveOffsetY = Math.cos(this.wavePhase * 0.6) * this.waveAmplitude * 0.3;
        
        context.translate(
          this.x + glitchX + waveOffsetX, 
          this.y * this.fontSize + this.fontSize / 2 + glitchY + waveOffsetY
        );
        context.rotate(this.rotation + (Math.random() < this.glitchIntensity ? (Math.random() - 0.5) * 0.15 : 0));
        context.scale(this.scale, this.scale);
        context.fillText(this.char, 0, 0);
        context.restore();

        // * Add additional glow layers for special characters
        if (this.brightness) {
          // * Outer glow layer
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
          context.shadowBlur = this.glowRadius * 2;
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.3})`;
          context.save();
          context.translate(this.x + glitchX + waveOffsetX, this.y * this.fontSize + this.fontSize / 2 + glitchY + waveOffsetY);
          context.rotate(this.rotation);
          context.scale(this.scale * 1.5, this.scale * 1.5);
          context.fillText(this.char, 0, 0);
          context.restore();
        }

        // * Add accent character effects
        if (this.isAccent) {
          context.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
          context.shadowBlur = 8;
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.6})`;
          context.save();
          context.translate(this.x + glitchX + waveOffsetX, this.y * this.fontSize + this.fontSize / 2 + glitchY + waveOffsetY);
          context.rotate(this.rotation + Math.PI / 4);
          context.scale(this.scale * 0.8, this.scale * 0.8);
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
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    // * Performance optimization variables
    let frameCount = 0;
    let lastFPSUpdate = 0;
    const maxDrops = performanceMode === 'mobile' ? 80 : 200;

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        frameCount++;

        // * FPS calculation and performance monitoring
        if (currentTime - lastFPSUpdate >= 1000) {
          setCurrentFPS(frameCount);
          frameCount = 0;
          lastFPSUpdate = currentTime;
        }

        // * Dynamic performance adjustment with more aggressive optimization
        const performanceMultiplier = currentFPS < 25 ? 0.3 : currentFPS < 35 ? 0.5 : currentFPS < 45 ? 0.75 : 1;
        const shouldDrawScanlines = performanceMode === 'desktop' && performanceMultiplier > 0.6;
        const shouldDrawMouseEffects = performanceMultiplier > 0.4;
        const shouldDrawGlitchEffects = performanceMultiplier > 0.5;
        const shouldDrawTerminalMessages = performanceMultiplier > 0.7;

        // * Enhanced background with sophisticated fade
        const backgroundGradient = context.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        backgroundGradient.addColorStop(0, "rgba(0, 0, 0, 0.02)");
        backgroundGradient.addColorStop(0.7, "rgba(0, 0, 0, 0.05)");
        backgroundGradient.addColorStop(1, "rgba(0, 0, 0, 0.08)");
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // * Enhanced scanline effects with better visual hierarchy
        if (shouldDrawScanlines) {
          // * Horizontal scanlines with varying opacity
          context.fillStyle = `rgba(0, 255, 0, ${VISUAL_CONFIG.SCANLINE_OPACITY})`;
          for (let i = 0; i < canvas.height; i += 2) {
            const opacity = Math.sin(i * 0.1) * 0.5 + 0.5;
            context.globalAlpha = opacity * VISUAL_CONFIG.SCANLINE_OPACITY;
            context.fillRect(0, i, canvas.width, 1);
          }
          
          // * Vertical scanlines for enhanced CRT effect
          context.fillStyle = `rgba(0, 255, 0, ${VISUAL_CONFIG.SCANLINE_OPACITY * 0.5})`;
          for (let i = 0; i < canvas.width; i += 3) {
            const opacity = Math.cos(i * 0.05) * 0.3 + 0.7;
            context.globalAlpha = opacity * VISUAL_CONFIG.SCANLINE_OPACITY * 0.5;
            context.fillRect(i, 0, 1, canvas.height);
          }
          context.globalAlpha = 1;
        }

        // * Enhanced terminal-style border effects
        context.strokeStyle = "rgba(0, 255, 0, 0.15)";
        context.lineWidth = 2;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        
        // * Add vignette effect for depth
        const vignetteGradient = context.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
        );
        vignetteGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        vignetteGradient.addColorStop(0.7, "rgba(0, 0, 0, 0)");
        vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${VISUAL_CONFIG.VIGNETTE_STRENGTH})`);
        context.fillStyle = vignetteGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // * Add corner brackets for terminal aesthetic
        const bracketSize = 20;
        context.strokeStyle = "rgba(0, 255, 0, 0.3)";
        context.lineWidth = 3;

        // Top-left bracket
        context.beginPath();
        context.moveTo(10, 10);
        context.lineTo(10, 10 + bracketSize);
        context.lineTo(10 + bracketSize, 10 + bracketSize);
        context.stroke();

        // Top-right bracket
        context.beginPath();
        context.moveTo(canvas.width - 10, 10);
        context.lineTo(canvas.width - 10, 10 + bracketSize);
        context.lineTo(canvas.width - 10 - bracketSize, 10 + bracketSize);
        context.stroke();

        // Bottom-left bracket
        context.beginPath();
        context.moveTo(10, canvas.height - 10);
        context.lineTo(10, canvas.height - 10 - bracketSize);
        context.lineTo(10 + bracketSize, canvas.height - 10 - bracketSize);
        context.stroke();

        // Bottom-right bracket
        context.beginPath();
        context.moveTo(canvas.width - 10, canvas.height - 10);
        context.lineTo(canvas.width - 10, canvas.height - 10 - bracketSize);
        context.lineTo(canvas.width - 10 - bracketSize, canvas.height - 10 - bracketSize);
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

        // * Enhanced screen glitch effects with better visual hierarchy
        if (shouldDrawGlitchEffects) {
          const glitchChance = performanceMode === 'mobile' ? VISUAL_CONFIG.GLITCH_FREQUENCY * 0.5 : VISUAL_CONFIG.GLITCH_FREQUENCY;
          if (Math.random() < glitchChance) {
            // * Horizontal glitch lines with varying intensity
            const glitchIntensity = Math.random() * 0.5 + 0.5;
            context.fillStyle = `rgba(255, 255, 255, ${0.1 * glitchIntensity})`;
            const glitchY = Math.random() * canvas.height;
            context.fillRect(0, glitchY, canvas.width, Math.random() * 3 + 1);
            
            // * Vertical glitch lines with wave motion
            context.fillStyle = `rgba(0, 255, 0, ${0.15 * glitchIntensity})`;
            const glitchX = Math.random() * canvas.width;
            context.fillRect(glitchX, 0, Math.random() * 2 + 1, canvas.height);
            
            // * Random glitch blocks with better distribution
            context.fillStyle = `rgba(255, 0, 255, ${0.08 * glitchIntensity})`;
            const blockWidth = Math.random() * 60 + 10;
            const blockHeight = Math.random() * 40 + 8;
            context.fillRect(
              Math.random() * (canvas.width - blockWidth),
              Math.random() * (canvas.height - blockHeight),
              blockWidth,
              blockHeight
            );
            
            // * Add digital noise overlay
            if (Math.random() < 0.3) {
              context.fillStyle = `rgba(0, 255, 0, ${0.05 * glitchIntensity})`;
              for (let i = 0; i < 20; i++) {
                context.fillRect(
                  Math.random() * canvas.width,
                  Math.random() * canvas.height,
                  Math.random() * 3 + 1,
                  Math.random() * 3 + 1
                );
              }
            }
          }
        }

        // * Enhanced terminal-style data streams with better visual hierarchy
        if (shouldDrawTerminalMessages && Math.random() < 0.008) {
          const messages = [
            "ACCESSING MAINFRAME...",
            "DECRYPTING DATA...",
            "CONNECTION ESTABLISHED",
            "SECURITY BREACH DETECTED",
            "INITIALIZING PROTOCOL...",
            "MATRIX ONLINE",
            "SYSTEM COMPROMISED",
            "NEURAL LINK ACTIVE",
            "QUANTUM ENCRYPTION ACTIVE",
            "NEURAL NETWORK SYNC",
            "DATA STREAM OPTIMIZED",
            "SECURITY PROTOCOLS ENGAGED"
          ];
          const message = messages[Math.floor(Math.random() * messages.length)];
          const x = Math.random() * (canvas.width - 250);
          const y = Math.random() * (canvas.height - 50) + 25;
          
          // * Add glow effect to terminal messages
          context.shadowColor = "rgba(0, 255, 0, 0.5)";
          context.shadowBlur = 8;
          context.fillStyle = "rgba(0, 255, 0, 0.4)";
          context.font = "bold 14px 'Courier New', monospace";
          context.fillText(message, x, y);
          
          // * Add underline effect
          context.shadowBlur = 0;
          context.fillStyle = "rgba(0, 255, 0, 0.2)";
          context.fillRect(x, y + 2, message.length * 8, 1);
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
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      // * Memory cleanup
      drops.splice(0);
      if (context) {
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
        <form onSubmit={handleSubmit} className="password-form">
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
