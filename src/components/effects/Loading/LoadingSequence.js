// LoadingSequence.js
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Simple fade animations
const simpleFade = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

// Enhanced opening animation with blend effects
const openingReveal = keyframes`
  0% { 
    transform: scaleY(1);
    mix-blend-mode: difference;
    filter: contrast(2) brightness(0.5);
  }
  50% {
    transform: scaleY(0.3);
    mix-blend-mode: difference;
    filter: contrast(1.5) brightness(0.8);
  }
  100% { 
    transform: scaleY(0);
    mix-blend-mode: normal;
    filter: contrast(1) brightness(1);
  }
`;

// Matrix activation animation with enhanced blend
const matrixActivation = keyframes`
  0% { 
    transform: scaleY(0);
    mix-blend-mode: normal;
    filter: contrast(1) brightness(1);
  }
  30% {
    transform: scaleY(0.2);
    mix-blend-mode: difference;
    filter: contrast(2) brightness(0.3);
  }
  100% { 
    transform: scaleY(1);
    mix-blend-mode: difference;
    filter: contrast(1.8) brightness(0.6);
  }
`;

const MaskCommon = styled.div`
	position: fixed;
	left: 0;
	width: 100%;
	height: 50%;
	background: rgba(0, 0, 0, 0.95);
	z-index: 500;
	transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
	display: ${props => props.isVisible ? 'block' : 'none'};
	mix-blend-mode: difference;
	animation: ${props => props.isOpening ? openingReveal : 'none'} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	animation-delay: ${props => props.delay || '0s'};
	
	/* Enhanced blend effects */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, 
			rgba(255, 255, 255, 0.1) 0%, 
			rgba(0, 0, 0, 0.3) 50%, 
			rgba(255, 255, 255, 0.1) 100%
		);
		mix-blend-mode: difference;
		opacity: 0.6;
		animation: ${props => props.isOpening ? openingReveal : 'none'} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		animation-delay: ${props => props.delay || '0s'};
	}
`;

const MaskTop = styled(MaskCommon)`
	top: 0;
	transform-origin: top;
`;

const MaskBottom = styled(MaskCommon)`
	bottom: 0;
	transform-origin: bottom;
`;

const SimpleOverlay = styled.div`
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
	mix-blend-mode: difference;
`;

const LoadingSequence = ({ onComplete, showMatrix = false, onMatrixReady }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMatrixOverlay, setShowMatrixOverlay] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Initial load animation with enhanced blend effects
  useEffect(() => {
    if (isAnimating) return;

    const maskTop = document.getElementById("MaskTop");
    const maskBottom = document.getElementById("MaskBottom");
    const magicContainer = document.getElementById("magicContainer");

    // Initial state
    if (magicContainer) {
      magicContainer.style.opacity = "0";
    }

    // Start the opening animation
    setIsOpening(true);

    // Fade in magic container with delay
    const t2 = setTimeout(() => {
      if (magicContainer) {
        magicContainer.style.opacity = "0.2";
      }
    }, 800);

    // Clean up after animation completes
    const t3 = setTimeout(() => {
      if (maskTop) maskTop.style.display = "none";
      if (maskBottom) maskBottom.style.display = "none";
      setShowMatrixOverlay(false);
      setIsOpening(false);
      document.body.style.overflow = "";
      if (onComplete) {
        onComplete();
      }
    }, 2500);

    return () => {
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

  // Matrix activation animation (simplified)
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

    // Open animation with staggered timing
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

    // Clean up and call matrix ready
    const t4 = setTimeout(() => {
      if (maskTop) maskTop.style.display = "none";
      if (maskBottom) maskBottom.style.display = "none";
      setIsAnimating(false);
      setShowMatrixOverlay(false);
      // Call onMatrixReady callback when transition completes
      if (onMatrixReady) {
        onMatrixReady();
      }
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [showMatrix, onMatrixReady]);

  return (
    <>
      <SimpleOverlay id="SimpleOverlay" isVisible={showMatrixOverlay} />
      <MaskTop
        id="MaskTop"
        isVisible={isVisible}
        isOpening={isOpening}
        delay="0s"
      />
      <MaskBottom
        id="MaskBottom"
        isVisible={isVisible}
        isOpening={isOpening}
        delay="0.1s"
      />
    </>
  );
};

export default LoadingSequence;
