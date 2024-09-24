import { VFX } from "https://esm.sh/@vfx-js/core";
import React, { useRef, useEffect } from "react";

/**
* Applies a visual effects shader to its children components
* @example
* <VFXComponent shader="glitch">{<div>Glitched content</div>}</VFXComponent>
* <div><div>Glitched content</div></div>
* @param {string} shader - The name of the shader to apply.
* @param {ReactNode} children - React components or HTML elements to render inside the VFX container.
* @returns {ReactElement} A div element with the applied visual effect.
* @description
*   - It uses React hooks to manage effects lifecycle.
*   - It requires the VFX library to be included in the project.
*   - Ensure the shader prop name exists within the VFX library's shaders.
*   - This component should be used inside a React component render method.
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