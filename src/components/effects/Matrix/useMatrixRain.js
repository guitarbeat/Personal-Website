import { useCallback, useEffect, useRef } from 'react';
import { TYPOGRAPHY, MATRIX_RAIN, ERROR_MESSAGES } from './constants';
import { Drop } from './Drop';
import { useMobileDetection } from '../../../hooks/useMobileDetection';

export const useMatrixRain = (isVisible, matrixIntensity, isTransitioning) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dropsRef = useRef([]);
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const { isMobile, isTablet } = useMobileDetection();
  
  // Object pool for trail items to reduce allocations
  const trailItemPool = useRef([]);
  const getTrailItem = useCallback(() => {
    if (trailItemPool.current.length > 0) {
      return trailItemPool.current.pop();
    }
    return { char: '', y: 0, opacity: 0, colorIndex: 0, brightness: false };
  }, []);
  const returnTrailItem = useCallback((item) => {
    if (trailItemPool.current.length < 100) { // Limit pool size
      trailItemPool.current.push(item);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      // Clean up when not visible
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Clear drops array to free memory
      if (dropsRef.current) {
        for (const drop of dropsRef.current) {
          if (drop.trail) {
            drop.trail.length = 0;
          }
        }
        dropsRef.current.length = 0;
      }
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

    // Fallback for very old browsers
    if (!window.requestAnimationFrame) {
      console.warn('Matrix effect: requestAnimationFrame not supported, using fallback');
      return;
    }

    // Enhanced device detection and compatibility checks
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isOldBrowser = !window.requestAnimationFrame || !window.cancelAnimationFrame;
    const isSlowDevice = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isLowBattery = navigator.getBattery?.().then(battery => battery.level < 0.2);
    
    // Determine performance mode based on multiple factors
    let performanceMode = 'high';
    if (isMobile || isLowEnd || isOldBrowser || isSlowDevice) {
      performanceMode = 'low';
    } else if (isTablet) {
      performanceMode = 'medium';
    }
    
    // Additional compatibility checks
    const hasWebGL = !!canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl');
    const hasHighDPI = window.devicePixelRatio > 1.5;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Override performance mode for accessibility
    if (isReducedMotion) {
      performanceMode = 'minimal';
    }

    const resizeCanvas = () => {
      // Ultra-lightweight canvas setup
      const dpr = performanceMode === 'minimal' ? 1 : 
                  performanceMode === 'low' ? 1 : 
                  Math.min(window.devicePixelRatio || 1, hasHighDPI ? 1.5 : 1);
      
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      if (dpr !== 1) {
        context.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Ultra-conservative column calculation based on performance mode
    const baseColumns = Math.floor(canvas.width / (TYPOGRAPHY.FONT_SIZES.MIN * 1.5));
    let columns;
    let maxDrops;
    
    switch (performanceMode) {
      case 'minimal':
        columns = Math.floor(baseColumns * 0.05); // 5% of base
        maxDrops = Math.floor(columns * matrixIntensity * 0.1);
        break;
      case 'low':
        columns = Math.floor(baseColumns * 0.1); // 10% of base
        maxDrops = Math.floor(columns * matrixIntensity * 0.2);
        break;
      case 'medium':
        columns = Math.floor(baseColumns * 0.2); // 20% of base
        maxDrops = Math.floor(columns * matrixIntensity * 0.3);
        break;
      default: // 'high'
        columns = Math.floor(baseColumns * 0.3); // 30% of base
        maxDrops = Math.floor(columns * matrixIntensity * 0.4);
    }
    
    // Initialize drops array only once with object pooling
    if (dropsRef.current.length === 0) {
      dropsRef.current = Array(columns)
        .fill(null)
        .map((_, i) => {
          const drop = new Drop(i * TYPOGRAPHY.FONT_SIZES.MIN * 1.2, canvas, context, performanceMode, getTrailItem, returnTrailItem);
          drop.y = (Math.random() * canvas.height) / TYPOGRAPHY.FONT_SIZES.MIN;
          return drop;
        });
    }

    // Reduced frame rate settings for smoother, less overwhelming effect
    let baseFrameInterval;
    switch (performanceMode) {
      case 'minimal':
        baseFrameInterval = 1000 / 6; // 6 FPS max
        break;
      case 'low':
        baseFrameInterval = 1000 / 8; // 8 FPS max
        break;
      case 'medium':
        baseFrameInterval = 1000 / 12; // 12 FPS max
        break;
      default: // 'high'
        baseFrameInterval = 1000 / 15; // 15 FPS max
    }
    
    let frameInterval = baseFrameInterval;
    let lastTime = 0;
    let frameCount = 0;
    let performanceCounter = 0;
    let lastPerformanceCheck = 0;
    
    // Lightweight performance monitoring
    const performanceHistory = [];
    const maxPerformanceHistory = 5; // Reduced from 10
    
    // Disabled mouse interaction for maximum compatibility
    const mouseTrail = [];
    const mousePosition = { x: 0, y: 0 };
    const performanceMultiplier = performanceMode === 'minimal' ? 0.1 : 
                                 performanceMode === 'low' ? 0.2 : 
                                 performanceMode === 'medium' ? 0.3 : 0.4;

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        frameCount++;
        performanceCounter++;
        
        // Performance monitoring and adaptive throttling
        if (currentTime - lastPerformanceCheck > 1000) { // Check every second
          const actualFPS = performanceCounter;
          performanceHistory.push(actualFPS);
          if (performanceHistory.length > maxPerformanceHistory) {
            performanceHistory.shift();
          }
          
          const avgFPS = performanceHistory.reduce((a, b) => a + b, 0) / performanceHistory.length;
          
          // Adaptive throttling based on performance
          if (avgFPS < 10 && performanceMode === 'high') {
            frameInterval = Math.min(frameInterval * 1.2, 1000 / 10); // Cap at 10 FPS
          } else if (avgFPS > 20 && frameInterval > baseFrameInterval) {
            frameInterval = Math.max(frameInterval * 0.9, baseFrameInterval);
          }
          
          performanceCounter = 0;
          lastPerformanceCheck = currentTime;
        }
        
        // Enhanced rendering based on performance mode
        const shouldDrawEffects = performanceMode === 'high' && !isTransitioning && matrixIntensity > 0.5;
        const shouldDrawMinimalEffects = performanceMode === 'medium' && matrixIntensity > 0.3;
        
        // Dynamic background with gradient fade
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, performanceMode === 'minimal' ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)");
        gradient.addColorStop(0.5, performanceMode === 'minimal' ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.08)");
        gradient.addColorStop(1, performanceMode === 'minimal' ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Enhanced scanline effects with dynamic intensity
        if (shouldDrawEffects && frameCount % 3 === 0) {
          const scanlineIntensity = matrixIntensity * 0.02;
          context.fillStyle = `rgba(0, 255, 0, ${scanlineIntensity})`;
          const scanlineStep = performanceMode === 'minimal' ? 16 : 8;
          for (let i = 0; i < canvas.height; i += scanlineStep) {
            context.fillRect(0, i, canvas.width, 1);
          }
          
          // Add horizontal scanlines for more depth
          if (performanceMode === 'high') {
            context.fillStyle = `rgba(0, 255, 100, ${scanlineIntensity * 0.5})`;
            for (let i = 0; i < canvas.width; i += scanlineStep * 2) {
              context.fillRect(i, 0, 1, canvas.height);
            }
          }
        }

        // Enhanced border with pulsing effect
        if (performanceMode !== 'minimal' && !isTransitioning && frameCount % 5 === 0) {
          const pulseIntensity = Math.sin(frameCount * 0.1) * 0.02 + 0.05;
          context.strokeStyle = `rgba(0, 255, 0, ${pulseIntensity})`;
          context.lineWidth = 2;
          context.strokeRect(0, 0, canvas.width, canvas.height);
          
          // Add corner accents
          if (performanceMode === 'high') {
            context.strokeStyle = `rgba(0, 255, 255, ${pulseIntensity * 0.7})`;
            context.lineWidth = 1;
            const cornerSize = 20;
            context.strokeRect(0, 0, cornerSize, cornerSize);
            context.strokeRect(canvas.width - cornerSize, 0, cornerSize, cornerSize);
            context.strokeRect(0, canvas.height - cornerSize, cornerSize, cornerSize);
            context.strokeRect(canvas.width - cornerSize, canvas.height - cornerSize, cornerSize, cornerSize);
          }
        }

        // Enhanced cursor effect with blinking
        if (performanceMode !== 'minimal' && frameCount % 15 === 0) {
          const blinkPhase = Math.sin(frameCount * 0.2) * 0.5 + 0.5;
          context.fillStyle = `rgba(0, 255, 0, ${blinkPhase * 0.6})`;
          context.fillRect(canvas.width - 12, 12, 4, 8);
          
          // Add cursor trail effect
          if (performanceMode === 'high') {
            context.fillStyle = `rgba(0, 255, 0, ${blinkPhase * 0.2})`;
            context.fillRect(canvas.width - 16, 16, 2, 4);
          }
        }

        // Add particle effects for high performance mode
        if (performanceMode === 'high' && shouldDrawEffects && Math.random() < 0.1) {
          context.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.3})`;
          const particleX = Math.random() * canvas.width;
          const particleY = Math.random() * canvas.height;
          const particleSize = Math.random() * 3 + 1;
          context.fillRect(particleX, particleY, particleSize, particleSize);
        }

        // Ultra-lightweight drop rendering
        const performanceBasedMaxDrops = Math.floor(maxDrops * (performanceHistory.length > 0 ? Math.min(1, performanceHistory[performanceHistory.length - 1] / 15) : 1));
        const activeDrops = dropsRef.current.slice(0, Math.min(dropsRef.current.length, performanceBasedMaxDrops));
        
        // Reduced drop skipping for smoother effect
        let skipFactor;
        switch (performanceMode) {
          case 'minimal':
            skipFactor = 4;
            break;
          case 'low':
            skipFactor = 3;
            break;
          case 'medium':
            skipFactor = 2;
            break;
          default: // 'high'
            skipFactor = 1; // Render all drops for smoother effect
        }
        
        // Batch context operations for maximum efficiency
        context.save();
        context.globalAlpha = matrixIntensity * (performanceMode === 'minimal' ? 0.6 : 0.8);
        
        for (let i = activeDrops.length - 1; i >= 0; i -= skipFactor) {
          const drop = activeDrops[i];
          drop.update();
          drop.draw();
        }
        
        context.restore();

        // Ultra-minimal glitch effects (only on high-end devices)
        if (performanceMode === 'high' && shouldDrawMinimalEffects && Math.random() < 0.001) {
          context.fillStyle = "rgba(255, 255, 255, 0.05)";
          const glitchY = Math.random() * canvas.height;
          context.fillRect(0, glitchY, canvas.width, 1);
        }

        lastTime = currentTime;
      }
    };

    const animate = (currentTime) => {
      draw(currentTime);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Proper cleanup to prevent memory leaks
      if (dropsRef.current) {
        for (const drop of dropsRef.current) {
          if (drop.trail) {
            drop.trail.length = 0;
          }
        }
        dropsRef.current.length = 0;
      }
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Reset canvas size to free memory
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [getTrailItem, isMobile, isTablet, isVisible, matrixIntensity, isTransitioning, returnTrailItem]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (dropsRef.current) {
        for (const drop of dropsRef.current) {
          if (drop.trail) {
            drop.trail.length = 0;
          }
        }
        dropsRef.current.length = 0;
      }
    };
  }, []);

  return canvasRef;
};