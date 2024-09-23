import * as ogl from "ogl"; // Import the ogl library from the specified CDN
import chroma from "chroma-js"; // Import the chroma-js library from the specified CDN
import React, { useEffect } from "react";
import "./Moiree.css";


/**
* Initializes and animates a dynamic point mesh with ripple effect
* @example
* const magic = new Magic();
* // Assuming Magic() has been invoked in the global scope
* @param {undefined} None - This function takes no arguments.
* @returns {undefined} This function does not return a value.
* @description
*   - Initiates WebGL renderer, camera, and event listeners.
*   - Creates a grid of points that respond to mouse/touch events with a ripple effect.
*   - Adjusts the camera perspective and mesh responsive to window resizing.
*   - Handles both touch and mouse events for interactivity.
*/
function Magic() {
  const { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } = ogl;

  let renderer, gl, camera;
  // eslint-disable-next-line
  let width, height, wWidth, wHeight;
  let mouse,
    mouseOver = false;

  let gridWidth, gridHeight, gridRatio;
  // let gridWWidth, gridWHeight;
  let ripple, points;
  const color1 = new Color([0.149, 0.141, 0.912]);
  const color2 = new Color([1.0, 0.833, 0.224]);
  let cameraZ = 50;

  init();

  /**
  * Initializes rendering, camera, and event listeners
  * @example
  * init()
  * undefined
  * @description
  *   - This function must be called to start the animation process.
  *   - It creates a renderer with a specific device-pixel-ratio.
  *   - It attaches the WebGL canvas to a DOM element with an ID of `magicContainer`.
  *   - Camera settings are initialized and positioned at a predetermined Z value.
  */
  function init() {
    renderer = new Renderer({ dpr: 1 });
    gl = renderer.gl;
    document.querySelector("#magicContainer").appendChild(gl.canvas);

    camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, cameraZ);

    resize();
    window.addEventListener("resize", resize, false);

    mouse = new Vec2();

    initScene();
    initEventsListener();
    requestAnimationFrame(animate);
  }

  function initScene() {
    gl.clearColor(1, 1, 1, 1);
    ripple = new RippleEffect(renderer);
    // randomizeColors();
    initPointsMesh();
  }

  /**
  * Initializes and sets up points mesh for rendering
  * @example
  * initPointsMesh()
  * // points variable will now contain an updated Mesh with new geometry and potentially new programs based on the current state.
  * @description
  *   - It calculates a grid based on the screen space and window dimensions.
  *   - It sets up the positions, UVs, and sizes for each point in the grid.
  *   - It uses a geometry shader to produce a ripple effect on the points.
  *   - If a points mesh already exists, it updates its geometry; otherwise, it creates a new points mesh with the computed geometry and shader programs.
  * @returns {void}
  */
  function initPointsMesh() {
    gridWidth = width;
    gridHeight = height;
    // gridWWidth = gridWidth * wWidth / width;
    // gridWHeight = gridHeight * wHeight / height;

    const ssize = 3; // screen space
    const wsize = (ssize * wWidth) / width;
    const nx = Math.floor(gridWidth / ssize) + 1;
    const ny = Math.floor(gridHeight / ssize) + 1;
    const numPoints = nx * ny;
    const ox = -wsize * (nx / 2 - 0.5),
      oy = -wsize * (ny / 2 - 0.5);
    const positions = new Float32Array(numPoints * 3);
    const uvs = new Float32Array(numPoints * 2);
    const sizes = new Float32Array(numPoints);

    let uvx, uvy, uvdx, uvdy;
    gridRatio = gridWidth / gridHeight;
    if (gridRatio >= 1) {
      uvx = 0;
      uvdx = 1 / nx;
      uvy = (1 - 1 / gridRatio) / 2;
      uvdy = 1 / ny / gridRatio;
    } else {
      uvx = (1 - 1 * gridRatio) / 2;
      uvdx = (1 / nx) * gridRatio;
      uvy = 0;
      uvdy = 1 / ny;
    }

    for (let i = 0; i < nx; i++) {
      const x = ox + i * wsize;
      for (let j = 0; j < ny; j++) {
        const i1 = i * ny + j,
          i2 = i1 * 2,
          i3 = i1 * 3;
        const y = oy + j * wsize;
        positions.set([x, y, 0], i3);
        uvs.set([uvx + i * uvdx, uvy + j * uvdy], i2);
        sizes[i1] = ssize / 2;
      }
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      uv: { size: 2, data: uvs },
      size: { size: 1, data: sizes },
    });

    if (points) {
      points.geometry = geometry;
    } else {
      const program = new Program(gl, {
        uniforms: {
          hmap: { value: ripple.gpgpu.read.texture },
          color1: { value: color1 },
          color2: { value: color2 },
        },
        vertex: `
          precision highp float;
          const float PI = 3.1415926535897932384626433832795;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          uniform sampler2D hmap;
          uniform vec3 color1;
          uniform vec3 color2;
          attribute vec2 uv;
          attribute vec3 position;
          attribute float size;
          varying vec4 vColor;
          void main() {
              vec3 pos = position.xyz;
              vec4 htex = texture2D(hmap, uv);
              pos.z = 10. * htex.r;

              vec3 mixPct = vec3(0.0);
              mixPct.r = smoothstep(0.0, 0.5, htex.r);
              mixPct.g = sin(htex.r * PI);
              mixPct.b = pow(htex.r, 0.5);
              vColor = vec4(mix(color1, color2, mixPct), 1.0);

              gl_PointSize = size;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragment: `
          precision highp float;
          varying vec4 vColor;
          void main() {
            gl_FragColor = vColor;
          }
        `,
      });
      points = new Mesh(gl, { geometry, program, mode: gl.POINTS });
    }
  }

  /**
  * Animates elements within a scene, with optional mouse interaction
  * @example
  * animate(performance.now());
  * // camera.position.z smoothly transitions towards cameraZ
  * @param {number} t - The current time provided by requestAnimationFrame.
  * @returns {void} Does not return a value.
  * @description
  *   - Adjusts the camera's z position based on a target value (cameraZ).
  *   - Generates a rippling effect when not interacting with the mouse.
  *   - Uses ripple and renderer methods which are assumed to be available in the scope.
  */
  function animate(t) {
    requestAnimationFrame(animate);
    camera.position.z += (cameraZ - camera.position.z) * 0.02;

    if (!mouseOver) {
      const time = Date.now() * 0.001;
      const x = Math.cos(time) * 0.2;
      const y = Math.sin(time) * 0.2;
      ripple.addDrop(x, y, 0.05, 0.05);
    }

    ripple.update();
    // ripple.update();
    renderer.render({ scene: points, camera });
  }

  function randomizeColors() {
    color1.set(chroma.random().hex());
    color2.set(chroma.random().hex());
  }

  /**
   * Initializes event listeners depending on device capabilities
   * @example
   * initEventsListener()
   * // Touch listeners attached on a mobile device or
   * // Mouse listeners attached on a non-touch-screen device
   * @description
   *   - This function does not take any arguments.
   *   - It adds touch or mouse event listeners to the document body depending on the device.
   *   - The listeners are responsible for handling user interactions like touch and mouse movements.
   *   - The function is part of the 'Moiree.js' file and should be called to enable user interaction with UI elements.
   * @returns {void} Does not return a value.
   */
  function initEventsListener() {
    if ("ontouchstart" in window) {
      document.body.addEventListener("touchstart", onMove, false);
      document.body.addEventListener("touchmove", onMove, false);
      document.body.addEventListener(
        "touchend",
        () => {
          mouseOver = false;
        },
        false
      );
    } else {
      document.body.addEventListener("mousemove", onMove, false);
      document.body.addEventListener(
        "mouseleave",
        () => {
          mouseOver = false;
        },
        false
      );
      document.body.addEventListener("mouseup", randomizeColors, false);
      document.addEventListener("scroll", (e) => {
        cameraZ = 50 - getScrollPercentage() * 3;
      });
    }
  }

  function getScrollPercentage() {
    const topPos = document.documentElement.scrollTop;
    const remaining =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    return topPos / remaining;
  }

  /**
  * Processes and translates mouse or touch events into normalized positions
  * @example
  * onMove(mouseEvent)
  * // No return value but updates mouse position and triggers a ripple
  * @param {MouseEvent|TouchEvent} e - The mouse or touch event object.
  * @description
  *   - Handles both mouse and touch events in a uniform way.
  *   - Normalizes the event coordinates to be used with WebGL.
  *   - Adjusts mouse position based on gridRatio.
  *   - Adds a ripple effect at the calculated mouse position.
  */
  function onMove(e) {
    mouseOver = true;
    if (e.changedTouches && e.changedTouches.length) {
      e.x = e.changedTouches[0].pageX;
      e.y = e.changedTouches[0].pageY;
    }
    if (e.x === undefined) {
      e.x = e.pageX;
      e.y = e.pageY;
    }
    mouse.set(
      (e.x / gl.renderer.width) * 2 - 1,
      (1.0 - e.y / gl.renderer.height) * 2 - 1
    );

    if (gridRatio >= 1) {
      mouse.y = mouse.y / gridRatio;
    } else {
      mouse.x = mouse.x / gridRatio;
    }

    ripple.addDrop(mouse.x, mouse.y, 0.05, 0.05);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    const wSize = getWorldSize(camera);
    wWidth = wSize[0];
    wHeight = wSize[1];
    if (points) initPointsMesh();
  }

  function getWorldSize(cam) {
    const vFOV = (cam.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(cam.position.z);
    const width = height * cam.aspect;
    return [width, height];
  }
}

/**
 * Ripple effect
 */
const RippleEffect = (function () {
  const { Vec2, Program } = ogl,
    defaultVertex = `attribute vec2 uv, position; varying vec2 vUv; void main() {vUv = uv; gl_Position = vec4(position, 0, 1);}`;

  /**
  * Applies a ripple effect to a rendering context
  * @example
  * const renderer = new Renderer(); // Renderer should be a valid rendering context
  * const rippleEffect = new RippleEffect(renderer);
  * // Now rippleEffect can be used to apply effects using its methods
  * @param {Renderer} renderer - The renderer responsible for drawing the effect.
  * @returns {RippleEffect} An instance of RippleEffect with initialized shaders and properties.
  * @description
  *   - This function must be called with a valid renderer that contains a WebGL context.
  *   - The Vec2 class must be defined and used to create a delta property.
  *   - The GPGPU class is instantiated with width and height to match the renderer dimensions.
  *   - The initShaders method is expected to be defined within RippleEffect to complete the setup.
  */
  function RippleEffect(renderer) {
    const width = 512,
      height = 512;
    Object.assign(this, {
      renderer,
      gl: renderer.gl,
      width,
      height,
      delta: new Vec2(1 / width, 1 / height),
      gpgpu: new GPGPU(renderer.gl, { width, height }),
    });
    this.initShaders();
  }

  RippleEffect.prototype.initShaders = function () {
    this.updateProgram = new Program(this.gl, {
      uniforms: { tDiffuse: { value: null }, uDelta: { value: this.delta } },
      vertex: defaultVertex,
      fragment: `precision highp float; uniform sampler2D tDiffuse; uniform vec2 uDelta; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); vec2 dx = vec2(uDelta.x, 0.0), dy = vec2(0.0, uDelta.y); float average = (texture2D(tDiffuse, vUv - dx).r + texture2D(tDiffuse, vUv - dy).r + texture2D(tDiffuse, vUv + dx).r + texture2D(tDiffuse, vUv + dy).r) * 0.25; texel.g += (average - texel.r) * 2.0; texel.g *= 0.8; texel.r += texel.g; gl_FragColor = texel;}`,
    });

    this.dropProgram = new Program(this.gl, {
      uniforms: {
        tDiffuse: { value: null },
        uCenter: { value: new Vec2() },
        uRadius: { value: 0.05 },
        uStrength: { value: 0.05 },
      },
      vertex: defaultVertex,
      fragment: `precision highp float; const float PI = 3.1415926535897932384626433832795; uniform sampler2D tDiffuse; uniform vec2 uCenter; uniform float uRadius; uniform float uStrength; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); float drop = max(0.0, 1.0 - length(uCenter * 0.5 + 0.5 - vUv) / uRadius); drop = 0.5 - cos(drop * PI) * 0.5; texel.r += drop * uStrength; gl_FragColor = texel;}`,
    });
  };

  RippleEffect.prototype.update = function () {
    this.updateProgram.uniforms.tDiffuse.value = this.gpgpu.read.texture;
    this.gpgpu.renderProgram(this.updateProgram);
  };
  RippleEffect.prototype.addDrop = function (x, y, radius, strength) {
    const us = this.dropProgram.uniforms;
    us.tDiffuse.value = this.gpgpu.read.texture;
    us.uCenter.value.set(x, y);
    us.uRadius.value = radius;
    us.uStrength.value = strength;
    this.gpgpu.renderProgram(this.dropProgram);
  };

  return RippleEffect;
})();

/**
 * GPGPU Helper
 */
const GPGPU = (function () {
  const { RenderTarget, Triangle, Mesh } = ogl;

  function GPGPU(gl, { width, height, type }) {
    Object.assign(this, {
      gl,
      width,
      height,
      numVertexes: width * height,
      read: new RenderTarget(gl, rto(gl, width, height, type)),
      write: new RenderTarget(gl, rto(gl, width, height, type)),
      mesh: new Mesh(gl, { geometry: new Triangle(gl) }),
    });
  }

  /**
  * Creates an object containing buffer parameters for a WebGL context
  * @example
  * createBuffer(gl, 1024, 768, gl.FLOAT)
  * {
  *   width: 1024,
  *   height: 768,
  *   type: gl.FLOAT,
  *   internalFormat: gl.RGBA32F,
  *   depth: false,
  *   unpackAlignment: 1
  * }
  * @param {WebGLRenderingContext} gl - The WebGL context.
  * @param {number} width - The width of the buffer.
  * @param {number} height - The height of the buffer.
  * @param {GLenum} [type] - The data type of the buffer, defaults to HALF_FLOAT.
  * @returns {Object} An object containing buffer attributes.
  * @description
  *   - The type parameter defaults to HALF_FLOAT type based on availability.
  *   - internalFormat is decided based on whether Webgl2 is used and the type of data.
  *   - `depth` is always set to false, meaning this buffer doesn't contain depth information.
  *   - `unpackAlignment` specifies the byte alignment for pixel row data, set to 1 for no alignment requirements.
  */
  const rto = (gl, width, height, type) => ({
    width,
    height,
    type:
      type ||
      gl.HALF_FLOAT ||
      gl.renderer.extensions["OES_texture_half_float"].HALF_FLOAT_OES,
    internalFormat: gl.renderer.isWebgl2
      ? type === gl.FLOAT
        ? gl.RGBA32F
        : gl.RGBA16F
      : gl.RGBA,
    depth: false,
    unpackAlignment: 1,
  });

  GPGPU.prototype.renderProgram = function (program) {
    this.mesh.program = program;
    this.gl.renderer.render({
      scene: this.mesh,
      target: this.write,
      clear: false,
    });
    this.swap();
  };

  GPGPU.prototype.swap = function () {
    [this.read, this.write] = [this.write, this.read];
  };

  return GPGPU;
})();

/**
* Initializes and cleans up the magic component effect
* @example
* MagicComponent()
* <div id="magicContainer"></div>
* @returns {React.Element} Renders the magic container div element.
* @description
*   - This hook should be used within a React Function Component.
*   - Make sure an element with the id 'magicContainer' exists in your DOM.
*   - The cleanup function removes innerHTML of the container to clear the effect.
*   - The Magic function should be defined elsewhere and is responsible for creating the effect.
*/
function MagicComponent() {
  useEffect(() => {
    const container = document.querySelector("#magicContainer");

    if (container) {
      // Call the Magic function to initialize the effect
      Magic(container);

      // // Handle mouse movement to adjust the mask
      // const handleMouseMove = (e) => {
      //   const x = e.pageX;
      //   const y = e.pageY;
      //   container.style.setProperty("--x", x + "px");
      //   container.style.setProperty("--y", y + "px");
      // };

      // document.addEventListener("mousemove", handleMouseMove);
      // document.addEventListener("mouseleave", handleMouseMove); // use the same handler to reset

      // Clean up the effect and event listeners on unmount
      return () => {
        container.innerHTML = "";
        // document.removeEventListener("mousemove", handleMouseMove);
        // document.removeEventListener("mouseleave", handleMouseMove);
      };
    }
  }, []);

  return <div id="magicContainer"></div>;
}

export default MagicComponent;
