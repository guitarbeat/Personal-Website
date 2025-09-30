import { useEffect, useRef } from 'react';
import { TYPOGRAPHY, MATRIX_RAIN, ERROR_MESSAGES } from './constants';
import { Drop } from './Drop';

export const useMatrixRain = (isVisible, matrixIntensity, isTransitioning) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dropsRef = useRef([]);
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (!isVisible) {
      // Clean up when not visible
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Clear drops array to free memory
      if (dropsRef.current) {
        dropsRef.current.forEach(drop => {
          if (drop.trail) {
            drop.trail.length = 0;
          }
        });
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

    // Performance detection with more conservative settings
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const performanceMode = isMobile || isLowEnd ? 'low' : 'high';

    const resizeCanvas = () => {
      const dpr = performanceMode === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // More conservative column calculation
    const baseColumns = Math.floor(canvas.width / (TYPOGRAPHY.FONT_SIZES.MIN * 1.2));
    const columns = performanceMode === 'low' ? Math.floor(baseColumns * 0.3) : Math.floor(baseColumns * 0.6);
    const maxDrops = Math.floor(columns * matrixIntensity * (performanceMode === 'low' ? 0.4 : 0.7));
    
    // Initialize drops array only once
    if (dropsRef.current.length === 0) {
      dropsRef.current = Array(columns)
        .fill(null)
        .map((_, i) => {
          const drop = new Drop(i * TYPOGRAPHY.FONT_SIZES.MIN * 1.2, canvas, context, performanceMode);
          drop.y = (Math.random() * canvas.height) / TYPOGRAPHY.FONT_SIZES.MIN;
          return drop;
        });
    }

    // More conservative frame rate with adaptive throttling
    const baseFrameInterval = performanceMode === 'low' ? 1000 / 15 : 1000 / 25; // 15-25 FPS max
    let frameInterval = baseFrameInterval;
    let lastTime = 0;
    let frameCount = 0;
    let performanceCounter = 0;
    let lastPerformanceCheck = 0;
    
    // Performance monitoring
    const performanceHistory = [];
    const maxPerformanceHistory = 10;
    
    // Simplified mouse interaction (disabled for performance)
    const mouseTrail = [];
    const mousePosition = { x: 0, y: 0 };
    const performanceMultiplier = performanceMode === 'low' ? 0.2 : 0.4;

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
        
        // Simplified performance optimization
        const shouldDrawEffects = performanceMode === 'high' && !isTransitioning && matrixIntensity > 0.5;
        const shouldDrawMinimalEffects = performanceMode === 'high' && matrixIntensity > 0.3;
        
        // Simple background fade (reduced opacity for better performance)
        context.fillStyle = "rgba(0, 0, 0, 0.08)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Minimal scanline effect (only on high-end devices)
        if (shouldDrawEffects && frameCount % 2 === 0) {
          context.fillStyle = "rgba(0, 255, 0, 0.015)";
          const scanlineStep = 8;
          for (let i = 0; i < canvas.height; i += scanlineStep) {
            context.fillRect(0, i, canvas.width, 1);
          }
        }

        // Simplified border (only when not transitioning)
        if (!isTransitioning) {
          context.strokeStyle = "rgba(0, 255, 0, 0.1)";
          context.lineWidth = 1;
          context.strokeRect(0, 0, canvas.width, canvas.height);
        }

        // Minimal cursor effect (reduced frequency)
        if (frameCount % 10 === 0) {
          context.fillStyle = "rgba(0, 255, 0, 0.6)";
          context.fillRect(canvas.width - 15, 15, 6, 10);
        }

        // Update and draw drops with aggressive optimization
        const performanceBasedMaxDrops = Math.floor(maxDrops * (performanceHistory.length > 0 ? Math.min(1, performanceHistory[performanceHistory.length - 1] / 20) : 1));
        const activeDrops = dropsRef.current.slice(0, Math.min(dropsRef.current.length, performanceBasedMaxDrops));
        
        // Skip more drops for better performance
        const skipFactor = performanceMode === 'low' ? 4 : (isTransitioning ? 3 : 2);
        
        // Batch context operations for better performance
        context.save();
        context.globalAlpha = matrixIntensity * 0.8;
        
        for (let i = activeDrops.length - 1; i >= 0; i -= skipFactor) {
          const drop = activeDrops[i];
          drop.update();
          drop.draw();
        }
        
        context.restore();

        // Minimal glitch effects (very rare)
        if (shouldDrawMinimalEffects && Math.random() < 0.002) {
          context.fillStyle = "rgba(255, 255, 255, 0.1)";
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
        dropsRef.current.forEach(drop => {
          if (drop.trail) {
            drop.trail.length = 0;
          }
        });
        dropsRef.current.length = 0;
      }
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Reset canvas size to free memory
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [isVisible, matrixIntensity, isTransitioning]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (dropsRef.current) {
        dropsRef.current.forEach(drop => {
          if (drop.trail) {
            drop.trail.length = 0;
          }
        });
        dropsRef.current.length = 0;
      }
    };
  }, []);

  return canvasRef;
};