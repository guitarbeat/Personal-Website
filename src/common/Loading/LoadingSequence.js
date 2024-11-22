// LoadingSequence.js
import React, { useEffect } from 'react';
import './LoadingSequence.scss';

const LoadingSequence = ({ onComplete }) => {
  useEffect(() => {
    const maskTop = document.getElementById('MaskTop');
    const maskBottom = document.getElementById('MaskBottom');
    const magicContainer = document.getElementById('magicContainer');

    if (!maskTop || !maskBottom) {
      console.warn('Loading sequence elements not found');
      if (onComplete) onComplete();
      return;
    }

    // Initial state
    if (magicContainer) {
      magicContainer.style.opacity = '0';
    }

    // Start revealing content
    setTimeout(() => {
      if (maskTop && maskBottom) {
        maskTop.style.transform = 'scaleY(0)';
        maskBottom.style.transform = 'scaleY(0)';
      }
    }, 500);

    // Fade in magic container
    setTimeout(() => {
      if (magicContainer) {
        magicContainer.style.opacity = '0.2';
      }
    }, 700);

    // Clean up
    setTimeout(() => {
      if (maskTop && maskBottom) {
        maskTop.style.display = 'none';
        maskBottom.style.display = 'none';
      }
      document.body.style.overflow = '';
      if (onComplete) {
        onComplete();
      }
    }, 1000);

  }, [onComplete]);

  return (
    <>
      <div id="MaskTop"></div>
      <div id="MaskBottom"></div>
    </>
  );
};

export default LoadingSequence;