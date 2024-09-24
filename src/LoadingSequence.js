// LoadingSequence.js
import React, { useEffect } from 'react';
import './LoadingSequence.scss';

/**
* Executes an animation sequence for a loading screen
* @example
* LoadingSequence({ onComplete: () => console.log('Animation complete') })
* <div id="MaskTop"></div>
* <div id="MaskBottom"></div>
* @param {Object} config - Configuration object for the loading sequence
* @param {function} config.onComplete - Callback function to be called after the animation completes
* @returns {ReactElement} Rendered loading animation elements
* @description
*   - Elements with IDs 'MaskTop' and 'MaskBottom' must exist in the DOM before this function is called.
*   - Do not need to specify 'document.body.style.overflow' as it is commented out.
*   - Ensures that the cleanup of animation styles is done after the animation is complete.
*   - Invokes the 'onComplete' callback after the cleanup if it is provided.
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