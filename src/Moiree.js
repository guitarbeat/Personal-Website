import * as ogl from "ogl"; // Import the ogl library from the specified CDN
import chroma from "chroma-js"; // Import the chroma-js library from the specified CDN
import React, { useEffect } from "react";
import "./Moiree.css";


/**
* Initializes and animates an interactive grid with ripple effects
* @example
* const magicInstance = new Magic();
* // There is no direct interaction with the instance,
* // it self-initializes and runs the animation loop internally.
* @returns {void} No return value, as constructor initializes the effect.
* @description
*   - The function is an encapsulation of a graphical effect setup with initialization,
*     animation loop, and event handling for canvas-based visuals.
*   - The renderer is attached to an element with id 'magicContainer'.
*   - It reacts to mouse/touch move events by adding ripple effects on the grid.
*   - Resize events are handled to adjust the canvas and grid dimensions.
*   - Scroll and mouse/touch events alter the camera position and response of the visualization.
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
  * Initializes the Moiree scene renderer, camera, and event listeners
  * @example
  * init()
  * // Canvas with the rendered scene is appended to the container with the ID "magicContainer"
  * @param {Renderer} renderer - An instance of Renderer initialized with a device pixel ratio.
  * @param {WebGLRenderingContext} gl - The WebGL context obtained from the renderer instance.
  * @param {Camera} camera - A Camera instance configured with the desired field of view.
  * @param {number} cameraZ - The initial position of the camera on the Z-axis.
  * @param {HTMLDivElement} magicContainer - The DOM element where the canvas will be appended.
  * @param {Vec2} mouse - A two-dimensional vector to manage mouse position.
  * @returns {undefined} Does not return a value; its job is to initialize components of the scene.
  * @description
  *   - Assumes the existence of certain globals: renderer, gl, camera, and mouse which are not explicitly passed.
  *   - The canvas created by the Renderer is appended to the "#magicContainer" implicitly.
  *   - Initializes scene-specific objects by calling `initScene` (not shown in the snippet).
  *   - Sets up animation loop by calling `requestAnimationFrame` with `animate` (not shown in the snippet).
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
  * Initializes a points mesh and updates geometry for rendering
  * @example
  * initPointsMesh()
  * // Initializes the mesh and associates the geometry with OpenGL context
  * @description
  *   - This function relies on external variables such as width, height, and a WebGL context gl.
  *   - It dynamically calculates positions, UVs, and sizes for the mesh points based on the screen size.
  *   - The constructed geometry is used for a points-based mesh in WebGL.
  *   - It conditionally creates a new Program and Mesh or updates the existing ones for rendering.
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
  * Animates a ripple effect in the scene based on time and mouse interaction
  * @example
  * animate(timestamp)
  * // No explicit return value, but it updates the scene rendering and camera position
  * @param {number} t - The timestamp provided by requestAnimationFrame.
  * @returns {void} This function does not return a value; it's called recursively to create an animation loop.
  * @description
  *   - This function is expected to be called within a requestAnimationFrame loop.
  *   - It adjusts the camera's z-position to move towards a predefined cameraZ value.
  *   - If the mouse is not currently interacting with the scene, it creates a ripple effect based on a sine wave over time.
  *   - Make sure `cameraZ`, `mouseOver`, `ripple`, and `renderer` are accessible in the scope.
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
  * Initializes event listeners for user interactions
  * @example
  * initEventsListener();
  * // Touch or mouse events are now handled
  * @description
  *   - This function adds touch events if supported, otherwise mouse events.
  *   - The events are bound to the document body.
  *   - `onMove` function is expected to be defined to handle touch/move and mousemove events.
  *   - `randomizeColors` and `getScrollPercentage` functions need to be defined for mouseup and scroll events respectively.
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
  * Handles mouse or touch move events and triggers a ripple effect
  * @example
  * onMove(event)
  * // mouseOver set to true, mouse coordinates updated and ripple effect triggered
  * @param {object} e - The event object from the mouse or touch move event.
  * @returns {void} No return value.
  * @description
  *   - This function is designed to be an event handler for mousemove or touchmove events.
  *   - It normalizes touch events to have the same properties as mouse events.
  *   - The mouse position is scaled and translated to be used with WebGL's coordinate system.
  *   - Depending on the gridRatio, it may adjust the x or y position of the ripple.
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
  * Applies a ripple effect using GPGPU
  * @example
  * let renderer = new Renderer();
  * let ripple = new RippleEffect(renderer);
  * // Assume the renderer and the WebGL context are correctly initialized
  * @param {Renderer} renderer - The renderer with an associated WebGL context.
  * @returns {RippleEffect} An instance of RippleEffect with properties initialized for the effect.
  * @description
  *   - Vec2 is a utility for two-dimensional vector operations.
  *   - GPGPU is an abstraction for general-purpose computing on GPUs.
  *   - initShaders is assumed to initialize necessary WebGL shaders for the ripple effect.
  *   - The actual effect rendering is performed elsewhere, not within this constructor function.
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
  * Create a texture configuration object for a Moiree renderer
  * @example
  * createTextureConfig(gl, 1024, 768, gl.FLOAT)
  * {
  *   width: 1024,
  *   height: 768,
  *   type: gl.FLOAT,
  *   internalFormat: gl.RGBA32F,
  *   depth: false,
  *   unpackAlignment: 1
  * }
  * @param {WebGLRenderingContext | WebGL2RenderingContext} gl - The WebGL context.
  * @param {number} width - Texture width in pixels.
  * @param {number} height - Texture height in pixels.
  * @param {number} [type] - Optional texture data type, defaults to HALF_FLOAT if not provided.
  * @returns {object} Returns a texture configuration object with properties required for Moiree rendering.
  * @description
  *   - The type defaults to HALF_FLOAT if it's not provided and the context doesn't support FLOAT.
  *   - The internalFormat is set to RGBA32F or RGBA16F for WebGL2 contexts based on the type, and to RGBA for WebGL contexts.
  *   - The depth property is hardcoded to false, since the textures are not meant to have a depth component.
  *   - unpackAlignment is set to 1, which means byte alignment, this is important for texture uploads to prevent padding issues.
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
* Initializes and cleans up the 'Magic' effect for a component
* @example
* MagicComponent()
* <div id="magicContainer"></div>
* @returns {JSX.Element} A div element with an id of 'magicContainer.'
* @description
*   - Assumes the existence of a global 'Magic' function.
*   - Component must be mounted for the useEffect to run.
*   - Effect cleanup is essential to prevent memory leaks.
*   - The component uses a div with an id to hook the 'Magic' effect.
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
