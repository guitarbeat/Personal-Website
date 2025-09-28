import { useEffect, useRef } from 'react';
import { MATRIX_COLORS, TYPOGRAPHY, MATRIX_RAIN, ERROR_MESSAGES, ColorUtils } from './constants';
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

    const columns = Math.floor(canvas.width / (TYPOGRAPHY.FONT_SIZES.MIN * 0.8));
    const maxDrops = Math.floor(columns * matrixIntensity);
    const drops = Array(columns)
      .fill(null)
      .map((_, i) => {
        const drop = new Drop(i * TYPOGRAPHY.FONT_SIZES.MIN * 0.8, canvas, context);
        drop.y = (Math.random() * canvas.height) / TYPOGRAPHY.FONT_SIZES.MIN;
        return drop;
      });

    let lastTime = 0;
    const frameInterval = 1000 / 60; // 60 FPS
    let frameCount = 0;
    
    // Mouse interaction variables
    const mouseTrail = [];
    const mousePosition = { x: 0, y: 0 };
    const performanceMultiplier = 1;

    const draw = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        frameCount++;
        
        // Performance optimization: reduce effects during transition
        const shouldDrawScanlines = !isTransitioning || frameCount % 2 === 0;
        const shouldDrawTerminalMessages = !isTransitioning || frameCount % 3 === 0;
        const shouldDrawMouseEffects = !isTransitioning && matrixIntensity > 0.5;
        const shouldDrawGlitchEffects = !isTransitioning && matrixIntensity > 0.3;
        
        // Simple background fade
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

        // * Update and draw drops with performance optimization and progressive intensity
        const activeDrops = drops.slice(0, Math.min(drops.length, maxDrops));
        
        // Performance optimization: skip some drops during transition
        const skipFactor = isTransitioning ? Math.max(1, Math.floor(3 - matrixIntensity * 2)) : 1;
        
        for (let i = activeDrops.length - 1; i >= 0; i -= skipFactor) {
          const drop = activeDrops[i];
          drop.update();
          
          // Apply intensity-based opacity and effects
          context.save();
          context.globalAlpha = matrixIntensity;
          if (isTransitioning) {
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

        // * Add dramatic screen glitch effects (performance optimized)
        if (shouldDrawGlitchEffects) {
          const glitchChance = MATRIX_RAIN.GLITCH_CHANCE_DESKTOP || 0.01;
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
      drops.length = 0;
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [isVisible, matrixIntensity, isTransitioning]);

  return canvasRef;
};