import { VFX } from "https://esm.sh/@vfx-js/core";
import React, { useRef, useEffect } from "react";

const VFXComponent = ({ shader = "rgbShift", children }) => {
  const vfxRef = useRef(null);

  useEffect(() => {
    const targetElement = vfxRef.current;
    if (!targetElement) {
      return;
    }

    const vfx = new VFX();
    vfx.add(targetElement, { shader });

    return () => {
      vfx.remove(targetElement);
    };
  }, [shader]);

  return <div ref={vfxRef}>{children}</div>;
};

export default VFXComponent;