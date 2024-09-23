// LoadingSequence.js
import React, { useEffect } from 'react';
import './LoadingSequence.scss';

/**
* Triggers an animation sequence for a loading effect
* @example
* loadingSequence(() => console.log('Animation complete'))
* // Outputs: 'Animation complete' after animation
* @param {Function} onComplete - Callback function to be executed after animation ends.
* @returns {JSX.Element} Rendered loading components.
* @description
*   - Uses DOM elements with specific IDs, ensure these are unique in the context.
*   - Be cautious about the use of 'document.body.style.overflow' and reset it appropriately.
*   - Cleanup function should properly remove all applied styles to prevent unexpected behavior.
*   - Ideally, this should only be run once upon initial page load due to its side effects.
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