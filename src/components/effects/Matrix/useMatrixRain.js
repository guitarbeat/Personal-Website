import { useEffect, useRef } from 'react';
import { TYPOGRAPHY, MATRIX_RAIN, ERROR_MESSAGES } from './constants';
import { Drop } from './Drop';

export const useMatrixRain = (isVisible, matrixIntensity, isTransitioning) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

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

    // Performance detection
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const performanceMode = isMobile || isLowEnd ? 'low' : 'high';

    const resizeCanvas = () => {
      const dpr = performanceMode === 'low' ? 1 : (window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Reduced columns for better performance
    const baseColumns = Math.floor(canvas.width / (TYPOGRAPHY.FONT_SIZES.MIN * 0.8));
    const columns = performanceMode === 'low' ? Math.floor(baseColumns * 0.5) : baseColumns;
    const maxDrops = Math.floor(columns * matrixIntensity * (performanceMode === 'low' ? 0.6 : 1));
    const drops = Array(columns)
      .fill(null)
      .map((_, i) => {
        const drop = new Drop(i * TYPOGRAPHY.FONT_SIZES.MIN * 0.8, canvas, context, performanceMode);
        drop.y = (Math.random() * canvas.height) / TYPOGRAPHY.FONT_SIZES.MIN;
        return drop;
      });

    let lastTime = 0;
    // Reduced frame rate for better performance
    const frameInterval = performanceMode === 'low' ? 1000 / 30 : 1000 / 45; // 30-45 FPS instead of 60
    let frameCount = 0;
    
    // Mouse interaction variables (disabled on low-end devices)
    const mouseTrail = performanceMode === 'low' ? [] : [];
    const mousePosition = { x: 0, y: 0 };
    const performanceMultiplier = performanceMode === 'low' ? 0.5 : 1;

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        frameCount++;
        
        // Performance optimization: reduce effects during transition and on low-end devices
        const shouldDrawScanlines = performanceMode === 'high' && (!isTransitioning || frameCount % 3 === 0);
        const shouldDrawTerminalMessages = performanceMode === 'high' && (!isTransitioning || frameCount % 5 === 0);
        const shouldDrawMouseEffects = performanceMode === 'high' && !isTransitioning && matrixIntensity > 0.5;
        const shouldDrawGlitchEffects = performanceMode === 'high' && !isTransitioning && matrixIntensity > 0.3;
        
        // Simple background fade
        context.fillStyle = "rgba(0, 0, 0, 0.05)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // * Add scanline effect (simplified for performance)
        if (shouldDrawScanlines) {
          context.fillStyle = "rgba(0, 255, 0, 0.02)";
          const scanlineStep = performanceMode === 'low' ? 6 : 3;
          for (let i = 0; i < canvas.height; i += scanlineStep) {
            context.fillRect(0, i, canvas.width, 1);
          }

          // Add horizontal scanlines for CRT effect (reduced frequency)
          context.fillStyle = "rgba(0, 255, 0, 0.01)";
          const hScanlineStep = performanceMode === 'low' ? 8 : 4;
          for (let i = 0; i < canvas.width; i += hScanlineStep) {
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

        // * Update and draw drops with performance optimization and progressive intensity
        const activeDrops = drops.slice(0, Math.min(drops.length, maxDrops));
        
        // Performance optimization: skip more drops on low-end devices and during transition
        const baseSkipFactor = performanceMode === 'low' ? 2 : 1;
        const skipFactor = isTransitioning ? Math.max(baseSkipFactor, Math.floor(3 - matrixIntensity * 2)) : baseSkipFactor;
        
        for (let i = activeDrops.length - 1; i >= 0; i -= skipFactor) {
          const drop = activeDrops[i];
          drop.update();
          
          // Apply intensity-based opacity and effects (simplified for performance)
          context.save();
          context.globalAlpha = matrixIntensity;
          if (isTransitioning && performanceMode === 'high') {
            context.filter = `contrast(${0.5 + matrixIntensity * 0.5}) brightness(${0.3 + matrixIntensity * 0.7})`;
          }
          drop.draw();
          context.restore();
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

        // * Add simplified glitch effects (performance optimized)
        if (shouldDrawGlitchEffects) {
          const glitchChance = performanceMode === 'low' ? 0.005 : 0.01;
          if (Math.random() < glitchChance) {
            // Simplified glitch effects
            context.fillStyle = "rgba(255, 255, 255, 0.2)";
            const glitchY = Math.random() * canvas.height;
            context.fillRect(0, glitchY, canvas.width, 2);

            // Reduced glitch blocks for performance
            if (performanceMode === 'high') {
              context.fillStyle = "rgba(0, 255, 0, 0.3)";
              const glitchX = Math.random() * canvas.width;
              context.fillRect(glitchX, 0, 1, canvas.height);
            }
          }
        }

        // * Add simplified terminal messages (performance optimized)
        if (shouldDrawTerminalMessages && Math.random() < 0.01) {
          context.fillStyle = "rgba(0, 255, 0, 0.4)";
          context.font = "10px 'Courier New', monospace";
          const messages = performanceMode === 'low' ? [
            "MATRIX ONLINE",
            "CONNECTION ESTABLISHED",
            "SYSTEM COMPROMISED",
            "NEURAL LINK ACTIVE"
          ] : [
            "MATRIX ONLINE",
            "CONNECTION ESTABLISHED", 
            "SECURITY BREACH DETECTED",
            "SYSTEM COMPROMISED",
            "NEURAL LINK ACTIVE",
            "ACCESSING MAINFRAME...",
            "DECRYPTING DATA..."
          ];
          const message = messages[Math.floor(Math.random() * messages.length)];
          context.fillText(message, Math.random() * (canvas.width - 200), Math.random() * canvas.height);
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
      drops.forEach(drop => {
        if (drop.trail) {
          drop.trail.length = 0;
        }
      });
      drops.length = 0;
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Reset canvas size to free memory
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [isVisible, matrixIntensity, isTransitioning]);

  return canvasRef;
};