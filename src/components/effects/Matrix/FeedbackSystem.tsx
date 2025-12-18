import { useEffect, useRef, useState } from "react";
import { getVersionInfo } from "../../../utils/versionUtils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
}

interface FeedbackSystemProps {
  showSuccessFeedback: boolean;
}

const FeedbackSystem = ({ showSuccessFeedback }: FeedbackSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);

  // * Particle effect
  useEffect(() => {
    if (!showSuccessFeedback) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // * Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 50 }, (): Particle => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
      }));
    };

    initParticles();

    // * Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 2000);

    // * Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 255, 0, 0.6)";

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;

        if (particle.life > 0) {
          ctx.globalAlpha = particle.life;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      // * Add new particles
      if (particlesRef.current.length < 50) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(glitchInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [showSuccessFeedback]);

  if (!showSuccessFeedback) {
    return null;
  }

  return (
    <>
      <canvas ref={canvasRef} className="success-particles" />
      <div className={`success-message ${glitchActive ? "glitch-active" : ""}`}>
        <div className="success-text-wrapper">
          <span className="success-text success-text--main">Access</span>
          <span className="success-text success-text--main">Granted</span>
        </div>
        <div className="success-divider" />
        <div className="version-info">{getVersionInfo()}</div>
        <div className="success-scanlines" />
      </div>
    </>
  );
};

export default FeedbackSystem;
