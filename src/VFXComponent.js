import { VFX } from "https://esm.sh/@vfx-js/core";
import React, { useRef, useEffect } from "react";

/**
* Applies a visual effect to the contained children components
* @example
* <VFXComponent shader="rgbShift">{childElements}</VFXComponent>
* <div>[Visual Effect Wrapped Children]</div>
* @param {{ shader: string, children: React.ReactNode }} { shader, children } - Config for the VFX effect and child components.
* @returns {React.ReactNode} Rendered component with VFX applied to its children.
* @description
*   - VFX is applied on mount and removed on component unmount.
*   - The effect is tied to the component's lifecycle via the useEffect hook.
*   - useRef is used to get a reference to the DOM element for the VFX target.
*   - The shader property defines what type of visual effect is applied.
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