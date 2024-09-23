import React, { useEffect, useRef } from 'react';
import './CrossBlur.css';

/**
* Takes an `isVisible` prop and applies a custom pointermove event on the Component
* @example
* Component({ isVisible: true })
* <svg style={{...}}>...</svg>
* @param {boolean} isVisible - Controls the visibility of the blur effect.
* @returns {JSX.Element} A React component with pointermove effects and visibility control.
* @description
*   - The function uses a `divRef` to reference a DOM element for manipulation.
*   - It sets up an effect to move the div based on pointer (mouse) movements.
*   - A cleanup function is provided to remove the event listener on component unmount.
*   - The provided SVG and div are used for a blur effect when the component is visible.
*/
const CrossBlur = ({ isVisible }) => {
  const divRef = useRef(null);

  useEffect(() => {
    const moveDiv = (event) => {
      if (divRef.current) {
        divRef.current.style.left = `${event.clientX}px`;
        divRef.current.style.top = `${event.clientY}px`;
      }
    };

    document.addEventListener("pointermove", moveDiv);

    return () => {
      document.removeEventListener("pointermove", moveDiv);
    };
  }, []);

  return (
    <>
      <svg style={{ position: 'fixed', zIndex: 9998, pointerEvents: 'none' }} xmlns='http://www.w3.org/2000/svg'>
        <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation="0 20" in="SourceGraphic" edgeMode="none" result="blur" />
          <feGaussianBlur stdDeviation="16 0" in="SourceGraphic" edgeMode="none" result="blur2" />
          <feBlend mode="lighten" in="blur" in2="blur1" result="blend" />
          <feMerge result="merge">
            <feMergeNode in="blend" />
            <feMergeNode in="blend" />
          </feMerge>
        </filter>
      </svg>
      <div ref={divRef} className={`filter ${isVisible ? 'visible' : ''}`}></div>
    </>
  );
};

export default CrossBlur;