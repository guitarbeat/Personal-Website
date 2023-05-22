// import * as ogl from "ogl";
// import React, { useEffect, useRef, useCallback, useState } from "react";
// import { Color } from "ogl";
// import chroma from "chroma-js";
// import RippleEffect from "./RippleEffect";

// const MoireEffect = () => {
//   const canvasRef = useRef();
//   const rippleRef = useRef();
//   const mouseRef = useRef();
//   const glRef = useRef();
//   const rendererRef = useRef();
//   const color1Ref = useRef(new Color([0.149, 0.141, 0.912]));
//   const color2Ref = useRef(new Color([1.0, 0.833, 0.224]));
//   const cameraRef = useRef();
//   const pointsRef = useRef();
//   const gridWidthRef = useRef();
//   const gridHeightRef = useRef();
//   const wWidthRef = useRef();
//   const wHeightRef = useRef();
//   const cameraZRef = useRef(50);
//   const [gridRatio, setGridRatio] = useState(1);

//   const onMove = useCallback(
//     (e) => {
//       const mouse = mouseRef.current;
//       const gl = glRef.current;

//       if (e.changedTouches && e.changedTouches.length) {
//         e.x = e.changedTouches[0].pageX;
//         e.y = e.changedTouches[0].pageY;
//       }
//       if (e.x === undefined) {
//         e.x = e.pageX;
//         e.y = e.pageY;
//       }
//       mouse.set(
//         (e.x / gl.renderer.width) * 2 - 1,
//         (1.0 - e.y / gl.renderer.height) * 2 - 1
//       );

//       if (gridRatio >= 1) {
//         mouse.y = mouse.y / gridRatio;
//       } else {
//         mouse.x = mouse.x / gridRatio;
//       }

//       rippleRef.current.addDrop(mouse.x, mouse.y, 0.05, 0.05);
//     },
//     [gridRatio]
//   );

//   const randomizeColors = useCallback(() => {
//     color1Ref.current.set(chroma.random().hex());
//     color2Ref.current.set(chroma.random().hex());
//   }, []);

//   const resize = useCallback(() => {
//     const renderer = rendererRef.current;
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     renderer.setSize(width, height);
//     cameraRef.current.perspective({ aspect: width / height });
//     const wSize = getWorldSize(cameraRef.current);
//     wWidthRef.current = wSize[0];
//     wHeightRef.current = wSize[1];
//     if (pointsRef.current) initPointsMesh();
//   }, []);

//   const getScrollPercentage = useCallback(() => {
//     const topPos = document.documentElement.scrollTop;
//     const remaining =
//       document.documentElement.scrollHeight -
//       document.documentElement.clientHeight;
//     return topPos / remaining;
//   }, []);

//   const getWorldSize = useCallback((cam) => {
//     const vFOV = (cam.fov * Math.PI) / 180;
//     const height = 2 * Math.tan(vFOV / 2) * Math.abs(cam.position.z);
//     const width = height * cam.aspect;
//     return [width, height];
//   }, []);

//   const initPointsMesh = useCallback(() => {
//     const gridWidth = gridWidthRef.current;
//     const gridHeight = gridHeightRef.current;
//     const wWidth = wWidthRef.current;
//     const wHeight = wHeightRef.current;
//     const ssize = 3; // screen space
//     const wsize = (ssize * wWidth) / width;
//     const nx = Math.floor(gridWidth / ssize) + 1;
//     const ny = Math.floor(gridHeight / ssize) + 1;
//     const numPoints = nx * ny;
//     const ox = -wsize * (nx / 2 - 0.5),
//       oy = -wsize * (ny / 2 - 0.5);
//     const positions = new Float32Array(numPoints * 3);
//     const uvs = new Float32Array(numPoints * 2);
//     const sizes = new Float32Array(numPoints);

//     let uvx, uvy, uvdx, uvdy;
//     const gridRatio = gridWidth / gridHeight;
//     if (gridRatio >= 1) {
//       uvx = 0;
//       uvdx = 1 / nx;
//       uvy = (1 - 1 / gridRatio) / 2;
//       uvdy = 1 / ny / gridRatio;
//     } else {
//       uvx = (1 - 1 * gridRatio) / 2;
//       uvdx = (1 / nx) * gridRatio;
//       uvy = 0;
//       uvdy = 1 / ny;
//     }

//     for (let i = 0; i < nx; i++) {
//       const x = ox + i * wsize;
//       for (let j = 0; j < ny; j++) {
//         const i1 = i * ny + j,
//           i2 = i1 * 2,
//           i3 = i1 * 3;
//         const y = oy + j * wsize;
//         positions.set([x, y, 0], i3);
//         uvs.set([uvx + i * uvdx, uvy + j * uvdy], i2);
//         sizes[i1] = ssize / 2;
//       }
//     }

//     const geometry = new ogl.Geometry(glRef.current, {
//       position: { size: 3, data: positions },
//       uv: { size: 2, data: uvs },
//       size: { size: 1, data: sizes },
//     });

//     if (pointsRef.current) {
//       pointsRef.current.geometry = geometry;
//     } else {
//       const program = new ogl.Program(glRef.current, {
//         uniforms: {
//           hmap: { value: rippleRef.current.gpgpu.read.texture },
//           color1: { value: color1Ref.current },
//           color2: { value: color2Ref.current },
//         },
//         vertex: `
//           precision highp float;
//           const float PI = 3.1415926535897932384626433832795;
//           uniform mat4 modelViewMatrix;
//           uniform mat4 projectionMatrix;
//           uniform sampler2D hmap;
//           uniform vec3 color1;
//           uniform vec3 color2;
//           attribute vec2 uv;
//           attribute vec3 position;
//           attribute float size;
//           varying vec4 vColor;
//           void main() {
//               vec3 pos = position.xyz;
//               vec4 htex = texture2D(hmap, uv);
//               pos.z = 10. * htex.r;

//               vec3 mixPct = vec3(0.0);
//               mixPct.r = smoothstep(0.0, 0.5, htex.r);
//               mixPct.g = sin(htex.r * PI);
//               mixPct.b = pow(htex.r, 0.5);
//               vColor = vec4(mix(color1, color2, mixPct), 1.0);

//               gl_PointSize = size;
//               gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//           }
//         `,
//         fragment: `
//           precision highp float;
//           varying vec4 vColor;
//           void main() {
//             gl_FragColor = vColor;
//           }
//         `,
//       });
//       pointsRef.current = new ogl.Mesh(glRef.current, {
//         geometry,
//         program,
//         mode: glRef.current.POINTS,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     const gl = new ogl.Renderer({ dpr: 1 }).gl;
//     glRef.current = gl;
//     const camera = new ogl.Camera(gl, { fov: 45 });
//     camera.position.set(0, 0, cameraZRef.current);
//     cameraRef.current = camera;
//     resize();
//     window.addEventListener("resize", resize, false);
//     initScene();
//     initEventsListener();
//     requestAnimationFrame(animate);

//     return () => {
//       window.removeEventListener("resize", resize, false);
//       window.removeEventListener("mousemove", onMove, false);
//       window.removeEventListener("touchmove", onMove, false);
//       window.removeEventListener("touchstart", onMove, false);
//       window.removeEventListener("scroll", getScrollPercentage, false);
//     };
//   }, [onMove, randomizeColors, resize, getScrollPercentage, initPointsMesh]);

//   const animate = useCallback((t) => {
//     requestAnimationFrame(animate);
//     cameraRef.current.position.z +=
//       (cameraZRef.current - cameraRef.current.position.z) * 0.02;

//     if (!mouseOverRef.current) {
//       const time = Date.now() * 0.001;
//       const x = Math.cos(time) * 0.2;
//       const y = Math.sin(time) * 0.2;
//       rippleRef.current.addDrop(x, y, 0.05, 0.05);
//     }

//     rippleRef.current.update();
//     rendererRef.current.render({
//       scene: pointsRef.current,
//       camera: cameraRef.current,
//     });
//   }, []);

//   const initScene = useCallback(() => {
//     const gl = glRef.current;
//     gl.clearColor(1, 1, 1, 1);
//     rippleRef.current = new RippleEffect(rendererRef.current);
//     initPointsMesh();
//   }, [initPointsMesh]);

//   const initEventsListener = useCallback(() => {
//     window.addEventListener("mousemove", onMove, false);
//     window.addEventListener("touchmove", onMove, false);
//     window.addEventListener("touchstart", onMove, false);
//     window.addEventListener("scroll", getScrollPercentage, false);
//   }, [onMove, getScrollPercentage]);

//   return <div ref={canvasRef}>{/* WebGL will be rendered here. */}</div>;
// };

// export default MoireEffect;
