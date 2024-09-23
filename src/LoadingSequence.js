// LoadingSequence.js
import React, { useEffect } from 'react';
import './LoadingSequence.scss';

/**
 * Executes a loading sequence with animations for masking elements
 * @example
 * loadingSequence({ onComplete: () => console.log('Loading complete!') });
 * // Mask elements are scaled and faded out, then onComplete callback is executed.
 * @param {Object} options - Configuration object for the loading sequence
 * @param {Function} options.onComplete - Callback function called after loading sequence
 * @returns {React.Component} React fragment containing masked elements
 * @description
 *   - Ensure 'MaskTop', 'MaskBottom', and 'magicContainer' elements exist in the DOM.
 *   - Initial styles for mask elements and 'magicContainer' are set outside this function.
 *   - Animations are timed using setTimeout, which may not be in sync with other asynchronous operations.
 *   - 'document.body.style.overflow' can be controlled to prevent or allow body scrolling during the sequence.
 */
const LoadingSequence = ({ onComplete }) => {
  useEffect(() => {
    const maskTop = document.getElementById('MaskTop');
    const maskBottom = document.getElementById('MaskBottom');
    const magicContainer = document.getElementById('magicContainer');

    // Initial state
    // document.body.style.overflow = 'hidden';
    if (magicContainer) magicContainer.style.opacity = '0';

    // Start revealing content
    setTimeout(() => {
      maskTop.style.transform = 'scaleY(0)';
      maskBottom.style.transform = 'scaleY(0)';
    }, 500);

    // Fade in magic container
    setTimeout(() => {
      if (magicContainer) magicContainer.style.opacity = '0.2';
    }, 700);

    // Clean up
    setTimeout(() => {
      maskTop.style.display = 'none';
      maskBottom.style.display = 'none';
      document.body.style.overflow = '';
      if (onComplete) onComplete();
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