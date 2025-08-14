// LoadingSequence.js
import React, { useEffect } from "react";
import styled from "styled-components";

const MaskCommon = styled.div`
	position: fixed;
	left: 0;
	width: 100%;
	height: 50%;
	background: #999;
	z-index: 20000;
	transition: transform 1s ease-in-out;
	mix-blend-mode: difference;
`;

const MaskTop = styled(MaskCommon)`
	top: 0;
	transform-origin: top;
`;

const MaskBottom = styled(MaskCommon)`
	bottom: 0;
	transform-origin: bottom;
`;

const LoadingSequence = ({ onComplete }) => {
  useEffect(() => {
    const maskTop = document.getElementById("MaskTop");
    const maskBottom = document.getElementById("MaskBottom");
    const magicContainer = document.getElementById("magicContainer");

    // Initial state
    if (magicContainer) {
      magicContainer.style.opacity = "0";
    }

    // Start revealing content
    setTimeout(() => {
      maskTop.style.transform = "scaleY(0)";
      maskBottom.style.transform = "scaleY(0)";
    }, 500);

    // Fade in magic container
    setTimeout(() => {
      if (magicContainer) {
        magicContainer.style.opacity = "0.2";
      }
    }, 700);

    // Clean up
    setTimeout(() => {
      maskTop.style.display = "none";
      maskBottom.style.display = "none";
      document.body.style.overflow = "";
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  }, [onComplete]);

  return (
    <>
      <MaskTop id="MaskTop" />
      <MaskBottom id="MaskBottom" />
    </>
  );
};

export default LoadingSequence;
