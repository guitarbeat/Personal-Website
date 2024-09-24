import * as ogl from "ogl"; // Import the ogl library from the specified CDN
import chroma from "chroma-js"; // Import the chroma-js library from the specified CDN
import React, { useEffect } from "react";
import "./Moiree.css";


/**
* Initializes and animates an interactive point mesh with ripple effect
* @example
* const moireeEffect = new Magic();
* // Initializes the effect within an element with id 'magicContainer'
* @returns {void} Does not return a value.
* @description
*   - Usage requires an HTML element with the id 'magicContainer' to append the WebGL canvas.
*   - The effect includes mouse or touch interactions to trigger ripples in the mesh.
*   - This function is expected to be instantiated rather than used as a standalone function.
*   - The animate function within Magic is called recursively to create an animation loop.
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
  * Initializes the rendering environment, camera, and event listeners
  * @example
  * init()
  * // Canvas is appended to #magicContainer and animation loop starts
  * @description
  *   - Initializes the renderer with a specified device pixel ratio.
  *   - Sets up a camera with a field of view of 45 degrees.
  *   - Attaches the canvas to the DOM and sets up the resizing logic.
  *   - Starts the animation loop.
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
  * Initializes a mesh of points for rendering
  * @example
  * initPointsMesh()
  * // Mesh is created and initialized without explicit return value
  * @description
  *   - This function initializes a mesh grid with specific screen and world sizes.
  *   - It calculates UV coordinates based on the aspect ratio of the grid.
  *   - Attributes for position, UV, and size are constructed and set to the geometry.
  *   - Creates a mesh object with a custom shader program if this is the first call, otherwise updates the existing mesh geometry.
  *   - The 'points' variable is assumed to be existing in a broader scope (global or closure).
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
  * Animates and updates the ripple effect and camera positions
  * @example
  * animate(timestamp)
  * This function doesn't explicitly return a value but is part of a requestAnimationFrame loop
  * @param {number} t - The timestamp of when the animation is called.
  * @returns {void} Does not return a value; it's used for animation effects.
  * @description
  *   - It recursively calls itself to create an animation loop.
  *   - Adjusts the camera position smoothly towards a target value.
  *   - Conditionally creates a ripple effect based on mouse interaction.
  *   - Renders the scene with updated states each animation frame.
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
  * Initializes event listeners for touch and mouse interactions
  * @example
  * initEventsListener()
  * // Listeners for touchstart, touchmove, touchend, mousemove, mouseleave, and mouseup are added.
  * @description
  *   - This function adds different event listeners based on the device's capability (touch or mouse).
  *   - For touch-enabled devices, it listens for 'touchstart', 'touchmove', and 'touchend' events.
  *   - For non-touch devices, it listens for 'mousemove', 'mouseleave', 'mouseup', and 'scroll' events.
  *   - The function assumes that variables such as 'mouseOver', 'cameraZ', and the function 'randomizeColors' are available in the scope.
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
  * Processes mouse movement and touch events to update effects
  * @example
  * onMove(mouseEvent)
  * // mouseOver is set to true and possibly triggers a ripple effect based on position
  * @param {MouseEvent|TouchEvent} e - The event object from mouse movement or touch.
  * @returns {void} Does not return a value; updates internal state and triggers visual effects.
  * @description
  *   - Normalizes different event types into a consistent format.
  *   - Calculates the mouse position relative to the WebGL rendering context.
  *   - Updates the global mouse variable with normalized coordinates.
  *   - Triggers a ripple effect at the calculated mouse position.
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
  * Initializes a RippleEffect object with a given renderer
  * @example
  * let renderer = new Renderer();
  * let rippleEffect = new RippleEffect(renderer);
  * // rippleEffect is now an instance with the renderer's context and properties setup for the ripple effect
  * @param {Renderer} renderer - Renderer instance to use with the ripple effect.
  * @returns {void}
  * @description
  *   - Initializes width, height and other properties specific to the ripple effect.
  *   - GPGPU instance is created and assigned to the ripple effect for GPU-based computations.
  *   - Vec2 is a utility for working with 2D vectors, and here it represents the delta step for the effect.
  *   - initShaders method is assumed to prepare WebGL shaders necessary for the effect.
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
  * Creates a texture configuration object for WebGL context
  * @example
  * const textureConfig = createTextureConfig(gl, 1024, 768)
  * {
  *   width: 1024,
  *   height: 768,
  *   type: undefined,
  *   internalFormat: gl.RGBA,
  *   depth: false,
  *   unpackAlignment: 1,
  * }
  * @param {WebGLRenderingContext|WebGL2RenderingContext} gl - The WebGL context.
  * @param {number} width - The width of the texture.
  * @param {number} height - The height of the texture.
  * @param {GLenum} [type] - The data type of the texture. Optional.
  * @returns {Object} A texture configuration object with properties for WebGL texture creation.
  * @description
  *   - The 'type' field defaults to HALF_FLOAT if not provided and it's supported, otherwise uses 'OES_texture_half_float'.
  *   - 'internalFormat' is determined based on the WebGL version and provided 'type'.
  *   - 'depth' is set as false, this configuration is not meant for depth textures.
  *   - For WebGL2, 'unpackAlignment' is set to 1 which is useful for pixel storage operations.
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
* Initializes a magic effect on a container component when it mounts
* @example
* MagicComponent()
* <div id="magicContainer"></div>
* @returns {JSX.Element} Renders a div that acts as the container for the magic effect.
* @description
*   - The magic effect is applied to the div with the id 'magicContainer'.
*   - The effect initialization and cleanup are managed by React's useEffect hook.
*   - This component is located in 'src/Moiree.js' file.
*   - Uncomment the mouse event listeners and clean-up logic if interaction is desired.
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
