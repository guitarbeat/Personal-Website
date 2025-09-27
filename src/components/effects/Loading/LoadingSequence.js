// LoadingSequence.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const MaskCommon = styled.div`
	position: fixed;
	left: 0;
	width: 100%;
	height: 50%;
	background: #999;
	z-index: 500; /* Lower than Matrix modal z-index values (2000s) */
	transition: transform 1s ease-in-out;
	mix-blend-mode: difference;
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

const LoadingSequence = ({ onComplete, showMatrix = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Matrix activation animation
  useEffect(() => {
    if (!showMatrix) return;

    setIsAnimating(true);
    setIsVisible(true);

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

    // Hide magic container
    if (magicContainer) {
      magicContainer.style.opacity = "0";
    }

    // Open animation (reverse of initial load)
    const t1 = setTimeout(() => {
      if (maskTop) maskTop.style.transform = "scaleY(1)";
      if (maskBottom) maskBottom.style.transform = "scaleY(1)";
    }, 100);

    // Keep magic container hidden during matrix
    const t2 = setTimeout(() => {
      if (magicContainer) {
        magicContainer.style.opacity = "0";
      }
    }, 300);

    // Clean up
    const t3 = setTimeout(() => {
      if (maskTop) maskTop.style.display = "none";
      if (maskBottom) maskBottom.style.display = "none";
      setIsAnimating(false);
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [showMatrix]);

  return (
    <>
      <MaskTop id="MaskTop" isVisible={isVisible} />
      <MaskBottom id="MaskBottom" isVisible={isVisible} />
    </>
  );
};

export default LoadingSequence;
