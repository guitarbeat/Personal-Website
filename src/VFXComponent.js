import { VFX } from "https://esm.sh/@vfx-js/core";
import React, { useRef, useEffect } from "react";

/**
* Applies a visual effect to child elements using a specified shader
* @example
* VFXComponent({ shader: "rgbShift", children: <YourComponent /> })
* <div>[Your Component with rgbShift effect]</div>
* @param {string} shader - The name of the shader to be applied.
* @param {JSX.Element} children - The child elements to which the shader effect will be applied.
* @returns {JSX.Element} A `div` element wrapping the children with a ref attached for VFX processing.
* @description
*   - Uses a useRef hook to maintain a reference for the DOM element to which the effect is applied.
*   - The useEffect hook applies the effect on component mount and cleans up on component unmount.
*   - The VFX logic should be implemented within the VFX class (assumed to be available globally).
*   - The shader prop is being monitored for changes to reapply the effect if it changes.
*/
const VFXComponent = ({ shader = "rgbShift", children }) => {
  const vfxRef = useRef(null);

  useEffect(() => {
    const targetElement = vfxRef.current;
    if (!targetElement) return;

    const vfx = new VFX();
    vfx.add(targetElement, { shader });

    return () => {
      vfx.remove(targetElement);
    };
  }, [shader]);

  return <div ref={vfxRef}>{children}</div>;
};

export default VFXComponent;