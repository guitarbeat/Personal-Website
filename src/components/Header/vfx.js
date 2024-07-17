import { VFX } from "https://esm.sh/@vfx-js/core";
import React, { useState, useRef, useEffect } from "react";

const vfxRef = useRef(null);

useEffect(() => {
  const targetElement = vfxRef.current;
  if (!targetElement) return;

  const vfx = new VFX();
  vfx.add(targetElement, { shader: "rgbShift" });

  return () => vfx.remove(targetElement);
}, []);
