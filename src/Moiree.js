import * as ogl from "ogl"; // Import the ogl library from the specified CDN
import chroma from "chroma-js"; // Import the chroma-js library from the specified CDN
import React, { useEffect } from "react";
import "./Moiree.css";


/**
* Instantiates a magic OGL scene with a rippling effect
* @example
* // Assuming `Magic` is instantiated with no arguments
* const magic = new Magic();
* // The actual example output would depend on real-time interaction and rendering
* @description
*   - The code sample provided shows a complex OGL scene setup with interactive elements and animations.
*   - The init function sets up the renderer, camera, and core events.
*   - The initScene builds the 3D scene with rippling effects.
*   - The initPointsMesh sets up the mesh vertices, scales, and positions for rendering.
* @returns {void} Does not return anything as it's meant to set up and handle a visual component.
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
  * Initializes the rendering context, camera, and event listeners
  * @example
  * init()
  * Initialization does not have a return value
  * @param {Renderer} renderer - The Renderer instance for WebGL context.
  * @param {Camera} camera - Camera instance to view the scene.
  * @param {Vec2} mouse - Two-dimensional vector for mouse tracking.
  * @returns {void}
  * @description
  *   - This function must be invoked to start the rendering process.
  *   - Properly resizes the canvas on window resize.
  *   - Attaches the rendering canvas to the #magicContainer div.
  *   - Kicks off the animation loop by invoking `requestAnimationFrame`.
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
  * Initializes a mesh of points to create a moiré pattern effect
  * @example
  * initPointsMesh()
  * // Initializes and sets up the points mesh with the moiré effect
  * @description
  *   - Creates a grid of points based on the screen and world dimensions.
  *   - Adjusts UV mapping based on the grid's aspect ratio.
  *   - Handles the creation or update of geometry for the points.
  *   - Uses a vertex shader to apply effects based on heightmap data.
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
  * Animates elements on the screen with a ripples effect
  * @example
  * animate(timestamp)
  * // may initiate an animation frame and update camera positions and ripples
  * @param {number} t - The timestamp of the current frame, provided by requestAnimationFrame.
  * @returns {void} No return value, as it's meant to be called repeatedly by requestAnimationFrame.
  * @description
  *   - The function needs to be bound to the render loop of the browser.
  *   - It relies on external 'camera', 'cameraZ', 'mouseOver', 'ripple', and 'renderer' objects.
  *   - Adjusts the camera position smoothly to create a zooming effect.
  *   - Generates a ripple effect when the mouse is not over the scene.
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
  * Initializes touch or mouse events for body movement interaction
  * @example
  * initEventsListener()
  * // Body will now react to touch or mouse events
  * @description
  *   - Binds touch events if supported, otherwise binds mouse events.
  *   - `onMove` is assumed to be a predefined function handling movement.
  *   - `randomizeColors` is a function triggered upon `mouseup`.
  *   - `getScrollPercentage` returns the scroll progress as a percentage.
  *   - No parameters and no return value as this function only sets up event listeners.
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
  * Processes a mouse or touch move event and updates mouse position
  * @example
  * onMove(mouseMoveEvent)
  * // mouse coordinates are updated and ripple effect is triggered
  * @param {MouseEvent|TouchEvent} e - The mouse or touch event.
  * @returns {void} Does not return a value; updates mouse positions and triggers ripple effect.
  * @description
  *   - Normalizes touch/mouse position to be relative to WebGL coordinates.
  *   - Adjusts mouse coordinates based on the aspect ratio of the grid.
  *   - Triggers a ripple effect at the current mouse position.
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
  * Creates a RippleEffect with specific renderer properties
  * @example
  * const renderer = { gl: WebGLRenderingContext, ... };
  * const rippleEffect = new RippleEffect(renderer);
  * // rippleEffect now contains initialized properties for rendering
  * @param {Object} renderer - The renderer object containing WebGL context.
  * @returns {RippleEffect} An instance of RippleEffect with the initialized properties.
  * @description
  *   - This function initializes a RippleEffect object for use in a WebGL context.
  *   - It assigns the dimensions, delta for texture coordinates, and initializes the GPGPU setup.
  *   - `initShaders` method is called to setup shaders required for the effect.
  *   - It is part of the 'src/Moiree.js' module and is typically used for visual effects in WebGL.
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
  * Creates a texture configuration object with specified parameters
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
  * @param {number} width - The width of the texture.
  * @param {number} height - The height of the texture.
  * @param {GLenum} [type] - The data type of the texture, optional.
  * @returns {Object} Returns a texture configuration object.
  * @description
  *   - The function defaults the `type` to HALF_FLOAT if not provided.
  *   - `internalFormat` is determined by WebGL version and specified `type`.
  *   - The `depth` and `unpackAlignment` properties are set to false and 1 respectively, and are not configurable.
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
* Initializes and cleans up the magic effect for a component
* @example
* const magicComponentInstance = <MagicComponent />;
* // The component mounts and the magic effect is initialized
* // The component unmounts and the magic effect is cleaned up
* @description
*   - This MagicComponent must be placed within an HTML structure where #magicContainer can be selected.
*   - The Magic function should be defined and callable, as it initializes the effect.
*   - The cleanup function clears the innerHTML of the container and removes event listeners if any were added.
*   - It uses the useEffect hook with empty dependency array to run only on mount and unmount.
* @returns {JSX.Element} A JSX element with the ID #magicContainer for the magic effect.
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
