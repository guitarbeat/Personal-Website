import React, { useEffect, useRef } from 'react';
import './CrossBlur.css';

/**
* Moves an element to the position of the mouse pointer
* @example
* useMouseMovable({ isVisible: true })
* (returns a component that moves with the mouse pointer)
* @param {Object} { isVisible: boolean } - Object containing a visibility boolean.
* @returns {React.Element} A React Element positioned according to the mouse pointer.
* @description
*   - This is a custom React hook used within functional React components.
*   - It requires the component to be mounted for the effect to initialize.
*   - The element's visibility is controlled by the `isVisible` prop.
*   - The hook should be used with a ref attached to the movable element.
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