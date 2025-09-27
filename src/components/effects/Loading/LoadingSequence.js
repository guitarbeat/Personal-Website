// LoadingSequence.js
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Enhanced keyframe animations
const matrixGlitch = keyframes`
  0% { filter: hue-rotate(0deg) contrast(1) brightness(1); }
  10% { filter: hue-rotate(90deg) contrast(1.2) brightness(1.1); }
  20% { filter: hue-rotate(180deg) contrast(0.8) brightness(0.9); }
  30% { filter: hue-rotate(270deg) contrast(1.1) brightness(1.05); }
  40% { filter: hue-rotate(360deg) contrast(0.9) brightness(0.95); }
  50% { filter: hue-rotate(45deg) contrast(1.3) brightness(1.2); }
  60% { filter: hue-rotate(135deg) contrast(0.7) brightness(0.8); }
  70% { filter: hue-rotate(225deg) contrast(1.1) brightness(1.1); }
  80% { filter: hue-rotate(315deg) contrast(0.9) brightness(0.9); }
  90% { filter: hue-rotate(0deg) contrast(1.05) brightness(1.02); }
  100% { filter: hue-rotate(0deg) contrast(1) brightness(1); }
`;

const matrixScanline = keyframes`
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
`;

const matrixFlicker = keyframes`
  0%, 100% { opacity: 1; }
  1% { opacity: 0.98; }
  2% { opacity: 0.99; }
  3% { opacity: 1; }
  4% { opacity: 0.97; }
  5% { opacity: 1; }
`;

const MaskCommon = styled.div`
	position: fixed;
	left: 0;
	width: 100%;
	height: 50%;
	background: linear-gradient(180deg, 
		rgba(0, 0, 0, 0.95) 0%, 
		rgba(0, 255, 0, 0.1) 50%, 
		rgba(0, 0, 0, 0.95) 100%
	);
	z-index: 500;
	transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
	mix-blend-mode: difference;
	display: ${props => props.isVisible ? 'block' : 'none'};
	backdrop-filter: blur(2px);
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(0, 255, 0, 0.1) 2px,
			rgba(0, 255, 0, 0.1) 4px
		);
		animation: ${matrixScanline} 0.1s linear infinite;
	}
	
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			circle at center,
			transparent 0%,
			rgba(0, 255, 0, 0.05) 50%,
			transparent 100%
		);
		animation: ${matrixFlicker} 0.05s infinite linear;
	}
`;

const MaskTop = styled(MaskCommon)`
	top: 0;
	transform-origin: top;
	box-shadow: 0 -10px 30px rgba(0, 255, 0, 0.3);
`;

const MaskBottom = styled(MaskCommon)`
	bottom: 0;
	transform-origin: bottom;
	box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
`;

const MatrixOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	z-index: 499;
	opacity: ${props => props.isVisible ? 1 : 0};
	transition: opacity 0.8s ease-in-out;
	pointer-events: none;
	animation: ${matrixGlitch} 0.1s infinite linear;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: 
			radial-gradient(circle at 20% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(0, 255, 0, 0.05) 0%, transparent 50%);
		animation: ${matrixFlicker} 0.2s infinite linear;
	}
`;

const LoadingSequence = ({ onComplete, showMatrix = false, onMatrixReady }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMatrixOverlay, setShowMatrixOverlay] = useState(false);

  // Initial load animation
  useEffect(() => {
    if (isAnimating) return;

    const maskTop = document.getElementById("MaskTop");
    const maskBottom = document.getElementById("MaskBottom");
    const magicContainer = document.getElementById("magicContainer");

    // Initial state
    if (magicContainer) {
      magicContainer.style.opacity = "0";
    }

    // Add subtle matrix preview effect
    const t0 = setTimeout(() => {
      setShowMatrixOverlay(true);
    }, 200);

    const t1 = setTimeout(() => {
      if (maskTop) maskTop.style.transform = "scaleY(0)";
      if (maskBottom) maskBottom.style.transform = "scaleY(0)";
    }, 500);

    // Fade in magic container
    const t2 = setTimeout(() => {
      if (magicContainer) {
        magicContainer.style.opacity = "0.2";
      }
    }, 700);

    // Clean up
    const t3 = setTimeout(() => {
      if (maskTop) maskTop.style.display = "none";
      if (maskBottom) maskBottom.style.display = "none";
      setShowMatrixOverlay(false);
      document.body.style.overflow = "";
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (maskTop) {
        maskTop.style.transform = "";
        maskTop.style.display = "";
      }
      if (maskBottom) {
        maskBottom.style.transform = "";
        maskBottom.style.display = "";
      }
    };
  }, [onComplete, isAnimating]);

  // Matrix activation animation
  useEffect(() => {
    if (!showMatrix) return;

    setIsAnimating(true);
    setIsVisible(true);
    setShowMatrixOverlay(true);

    const maskTop = document.getElementById("MaskTop");
    const maskBottom = document.getElementById("MaskBottom");
    const magicContainer = document.getElementById("magicContainer");

    // Start with masks closed (already open from initial load)
    if (maskTop) {
      maskTop.style.display = "block";
      maskTop.style.transform = "scaleY(0)";
    }
    if (maskBottom) {
      maskBottom.style.display = "block";
      maskBottom.style.transform = "scaleY(0)";
    }

    // Hide magic container immediately
    if (magicContainer) {
      magicContainer.style.opacity = "0";
    }

    // Add dramatic glitch effect before opening
    const t0 = setTimeout(() => {
      // Add screen shake effect
      document.body.style.animation = "matrixGlitch 0.1s infinite linear";
    }, 50);

    // Open animation with staggered timing for more drama
    const t1 = setTimeout(() => {
      if (maskTop) {
        maskTop.style.transform = "scaleY(1)";
        maskTop.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    }, 200);

    const t2 = setTimeout(() => {
      if (maskBottom) {
        maskBottom.style.transform = "scaleY(1)";
        maskBottom.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    }, 300);

    // Keep magic container hidden during matrix
    const t3 = setTimeout(() => {
      if (magicContainer) {
        magicContainer.style.opacity = "0";
      }
    }, 400);

    // Add matrix rain preview effect
    const t4 = setTimeout(() => {
      // Add subtle matrix rain effect to the overlay
      const overlay = document.getElementById("MatrixOverlay");
      if (overlay) {
        overlay.style.background = `
          linear-gradient(90deg, transparent 98%, rgba(0, 255, 0, 0.1) 100%),
          rgba(0, 0, 0, 0.9)
        `;
      }
    }, 600);

    // Clean up and call matrix ready
    const t5 = setTimeout(() => {
      if (maskTop) maskTop.style.display = "none";
      if (maskBottom) maskBottom.style.display = "none";
      document.body.style.animation = "";
      setIsAnimating(false);
      setShowMatrixOverlay(false);
      // Call onMatrixReady callback when transition completes
      if (onMatrixReady) {
        onMatrixReady();
      }
    }, 1800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      document.body.style.animation = "";
    };
  }, [showMatrix]);

  return (
    <>
      <MatrixOverlay id="MatrixOverlay" isVisible={showMatrixOverlay} />
      <MaskTop id="MaskTop" isVisible={isVisible} />
      <MaskBottom id="MaskBottom" isVisible={isVisible} />
    </>
  );
};

export default LoadingSequence;
