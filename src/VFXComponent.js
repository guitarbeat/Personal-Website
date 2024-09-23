import { VFX } from "https://esm.sh/@vfx-js/core";
import React, { useRef, useEffect } from "react";

/**
* Applies a visual shader effect to its children component
* @example
* <VFXComponent shader="rgbShift">{content}</VFXComponent>
* <div>{content with rgbShift effect}</div>
* @param {string} shader - The name of the shader to apply.
* @param {ReactNode} children - React components or elements to which the shader will be applied.
* @returns {ReactElement} A div element with applied visual effects wrapping its children.
* @description
*   - VFXComponent must be a child of VFXProvider to work properly.
*   - `useEffect` cleans up after the component is unmounted to prevent memory leaks.
*   - The `shader` prop changes dynamically apply different visual effects without remounting.
*   - useRef is used to get direct access to the DOM element for manipulation.
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