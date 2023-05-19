import React, { useEffect, useState } from "react";
import { Renderer, Camera, Color, Vec2 } from "ogl";

// The `useWindowSize` hook uses the `resize` event to update the width and height state
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

function MoireEffect() {
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [gl, setGl] = useState(null);
  const [mouse, setMouse] = useState(new Vec2());

  const color1 = new Color([0.149, 0.141, 0.912]);
  const color2 = new Color([1.0, 0.833, 0.224]);

  let cameraZ = 50;

  const size = useWindowSize();

  useEffect(() => {
    const rendererInstance = new Renderer({ dpr: 1 });
    setRenderer(rendererInstance);
    setGl(rendererInstance.gl);
    document.body.appendChild(rendererInstance.gl.canvas);
    const cameraInstance = new Camera(rendererInstance.gl, { fov: 45 });
    cameraInstance.position.set(0, 0, cameraZ);
    setCamera(cameraInstance);

    // Initialize your scene and event listener here...
  }, []);

  useEffect(() => {
    if (renderer && camera) {
      const width = size.width;
      const height = size.height;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
      // Calculate wSize and update points mesh here...
    }
  }, [size, renderer, camera]);

  return <div id="canvas-container"></div>;
}

export default MoireEffect;
