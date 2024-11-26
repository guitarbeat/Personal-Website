// LoadingSequence.js
import React, { useEffect } from 'react';
import './LoadingSequence.scss';

const LoadingSequence = ({ onComplete }) => {
  useEffect(() => {
    const maskTop = document.getElementById('MaskTop');
    const maskBottom = document.getElementById('MaskBottom');
    const magicContainer = document.getElementById('magicContainer');

    // Ensure masks are interactive
    if (maskTop) maskTop.style.pointerEvents = 'none';
    if (maskBottom) maskBottom.style.pointerEvents = 'none';

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
    const cleanup = () => {
      if (maskTop) {
        maskTop.style.display = 'none';
        maskTop.style.transform = 'scaleY(0)';
      }
      if (maskBottom) {
        maskBottom.style.display = 'none';
        maskBottom.style.transform = 'scaleY(0)';
      }
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    };

    const timer = setTimeout(cleanup, 1000);

    // Ensure cleanup happens even if component unmounts early
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [onComplete]);

  return (
    <>
      <div id="MaskTop"></div>
      <div id="MaskBottom"></div>
    </>
  );
};

export default LoadingSequence;