// LoadingSequence.js
import React, { useEffect } from 'react';
import './LoadingSequence.scss';

/**
* Triggers an animation sequence to reveal UI elements.
* @example
* LoadingSequence(onCompleteCallback)
* // Elements are revealed and onCompleteCallback is called after 1 second.
* @param {Function} onComplete - Callback called after the animation sequence completes.
* @returns {React.ReactElement} React fragment containing UI elements for the animation.
* @description
*   - Requires specific elements with hardcoded IDs 'MaskTop', 'MaskBottom', and 'magicContainer'.
*   - Animations are hard-coded with specific timings, making the function not reusable for different animations.
*   - The overflow property of document.body will remain unchanged if an exception occurs during animation.
*   - It's assumed that the elements with the specified IDs exist in the DOM before this component is mounted.
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