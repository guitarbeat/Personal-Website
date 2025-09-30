// LoadingSequenceVariants.js
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// ===== ANIMATION KEYFRAMES =====

// Spiral reveal animation
const spiralReveal = keyframes`
  0% { 
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.8;
  }
  100% { 
    transform: scale(1) rotate(360deg);
    opacity: 0;
  }
`;

// Particle burst animation
const particleBurst = keyframes`
  0% { 
    transform: scale(0) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-20px);
    opacity: 0.7;
  }
  100% { 
    transform: scale(0.8) translateY(-100px);
    opacity: 0;
  }
`;

// Wave ripple animation
const waveRipple = keyframes`
  0% { 
    transform: scale(0);
    opacity: 1;
  }
  100% { 
    transform: scale(4);
    opacity: 0;
  }
`;

// Typewriter effect
const typewriter = keyframes`
  0% { width: 0; }
  50% { width: 100%; }
  100% { width: 0; }
`;

// Matrix rain effect
const matrixRain = keyframes`
  0% { 
    transform: translateY(-100vh);
    opacity: 1;
  }
  100% { 
    transform: translateY(100vh);
    opacity: 0;
  }
`;

// Glitch effect
const glitch = keyframes`
  0%, 100% { 
    transform: translateX(0);
    filter: hue-rotate(0deg);
  }
  10% { 
    transform: translateX(-2px);
    filter: hue-rotate(90deg);
  }
  20% { 
    transform: translateX(2px);
    filter: hue-rotate(180deg);
  }
  30% { 
    transform: translateX(-1px);
    filter: hue-rotate(270deg);
  }
  40% { 
    transform: translateX(1px);
    filter: hue-rotate(360deg);
  }
  50% { 
    transform: translateX(0);
    filter: hue-rotate(0deg);
  }
`;

// ===== STYLED COMPONENTS =====

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 500;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

// Variant 1: Spiral Reveal
const SpiralLoader = styled.div`
  width: 100px;
  height: 100px;
  border: 3px solid transparent;
  border-top: 3px solid #00ff88;
  border-right: 3px solid #0088ff;
  border-radius: 50%;
  animation: ${spiralReveal} 2s ease-in-out forwards;
`;

// Variant 2: Particle Burst
const ParticleContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Particle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${props => props.color || '#00ff88'};
  border-radius: 50%;
  animation: ${particleBurst} 1.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  left: 50%;
  top: 50%;
  margin-left: -4px;
  margin-top: -4px;
`;

// Variant 3: Wave Ripple
const WaveContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wave = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  border: 2px solid #00ff88;
  border-radius: 50%;
  animation: ${waveRipple} 2s ease-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

// Variant 4: Typewriter
const TypewriterContainer = styled.div`
  width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const TypewriterText = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 24px;
  color: #00ff88;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid #00ff88;
  animation: ${typewriter} 3s steps(20) infinite;
`;

// Variant 5: Matrix Rain
const MatrixContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const MatrixColumn = styled.div`
  position: absolute;
  top: -100px;
  left: ${props => props.left}px;
  width: 20px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, #00ff88, transparent);
  animation: ${matrixRain} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
`;

// Variant 6: Glitch Effect
const GlitchContainer = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 48px;
  font-weight: bold;
  color: #00ff88;
  text-align: center;
  animation: ${glitch} 0.3s ease-in-out infinite;
  text-shadow: 
    2px 0 #ff0088,
    -2px 0 #0088ff,
    0 2px #88ff00,
    0 -2px #ff8800;
`;

// ===== LOADING SEQUENCE VARIANTS =====

export const LoadingSequenceVariant1 = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LoadingOverlay isVisible={isVisible}>
      <SpiralLoader />
    </LoadingOverlay>
  );
};

export const LoadingSequenceVariant2 = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: ['#00ff88', '#0088ff', '#ff0088', '#ff8800'][i % 4],
    delay: `${i * 0.1}s`
  }));

  return (
    <LoadingOverlay isVisible={isVisible}>
      <ParticleContainer>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            color={particle.color}
            delay={particle.delay}
          />
        ))}
      </ParticleContainer>
    </LoadingOverlay>
  );
};

export const LoadingSequenceVariant3 = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LoadingOverlay isVisible={isVisible}>
      <WaveContainer>
        {Array.from({ length: 3 }, (_, i) => (
          <Wave key={i} delay={`${i * 0.5}s`} />
        ))}
      </WaveContainer>
    </LoadingOverlay>
  );
};

export const LoadingSequenceVariant4 = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LoadingOverlay isVisible={isVisible}>
      <TypewriterContainer>
        <TypewriterText>INITIALIZING...</TypewriterText>
      </TypewriterContainer>
    </LoadingOverlay>
  );
};

export const LoadingSequenceVariant5 = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const columns = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: i * 50,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2
  }));

  return (
    <LoadingOverlay isVisible={isVisible}>
      <MatrixContainer>
        {columns.map(column => (
          <MatrixColumn
            key={column.id}
            left={column.left}
            duration={column.duration}
            delay={column.delay}
          />
        ))}
      </MatrixContainer>
    </LoadingOverlay>
  );
};

export const LoadingSequenceVariant6 = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LoadingOverlay isVisible={isVisible}>
      <GlitchContainer>
        SYSTEM LOADING...
      </GlitchContainer>
    </LoadingOverlay>
  );
};

// ===== MAIN LOADING SEQUENCE WITH VARIANT SELECTION =====

const LoadingSequence = ({ onComplete, variant = 1, showMatrix = false, onMatrixReady }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMatrixOverlay, setShowMatrixOverlay] = useState(false);

  // Initial load animation
  useEffect(() => {
    if (isAnimating) return;

    const magicContainer = document.getElementById("magicContainer");
    if (magicContainer) {
      magicContainer.style.opacity = "0";
    }

    const t1 = setTimeout(() => {
      if (magicContainer) {
        magicContainer.style.opacity = "0.2";
      }
    }, 700);

    const t2 = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete, isAnimating]);

  // Matrix activation animation
  useEffect(() => {
    if (!showMatrix) return;

    setIsAnimating(true);
    setIsVisible(true);
    setShowMatrixOverlay(true);

    const magicContainer = document.getElementById("magicContainer");
    if (magicContainer) {
      magicContainer.style.opacity = "0";
    }

    const t1 = setTimeout(() => {
      setIsAnimating(false);
      setShowMatrixOverlay(false);
      if (onMatrixReady) {
        onMatrixReady();
      }
    }, 1800);

    return () => clearTimeout(t1);
  }, [showMatrix, onMatrixReady]);

  const renderVariant = () => {
    const commonProps = { onComplete: () => setIsVisible(false) };

    switch (variant) {
      case 1: return <LoadingSequenceVariant1 {...commonProps} />;
      case 2: return <LoadingSequenceVariant2 {...commonProps} />;
      case 3: return <LoadingSequenceVariant3 {...commonProps} />;
      case 4: return <LoadingSequenceVariant4 {...commonProps} />;
      case 5: return <LoadingSequenceVariant5 {...commonProps} />;
      case 6: return <LoadingSequenceVariant6 {...commonProps} />;
      default: return <LoadingSequenceVariant1 {...commonProps} />;
    }
  };

  return (
    <>
      {isVisible && renderVariant()}
    </>
  );
};

export default LoadingSequence;