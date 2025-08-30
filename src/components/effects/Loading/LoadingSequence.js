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
  }, [onComplete]);

  return (
    <>
      <MaskTop id="MaskTop" />
      <MaskBottom id="MaskBottom" />
    </>
  );
};

export default LoadingSequence;
