// LoadingSequence.js
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Simple fade animations
const simpleFade = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
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
      <MaskTop id="MaskTop" isVisible={isVisible} />
      <MaskBottom id="MaskBottom" isVisible={isVisible} />
    </>
  );
};

export default LoadingSequence;
