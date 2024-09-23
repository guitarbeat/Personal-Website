import React, { useEffect, useRef } from 'react';
import './CrossBlur.css';

/**
* Attaches a pointermove event to document to move a div according to the pointer position
* @example
* const myComponent = (<YourComponent isVisible={true} />);
* // The div within YourComponent will follow the pointer movements.
* @param {Object} props - Object containing the component's props.
* @param {boolean} props.isVisible - Controls the visibility of the floating div.
* @returns {React.ReactElement} Rendered div element that follows the pointer movements when visible.
* @description
*   - The hook adds and cleans up the 'pointermove' event when the component renders and unmounts respectively.
*   - useRef is used to reference the div that needs to follow the pointer.
*   - The visibility of the div is toggled using the 'isVisible' property.
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