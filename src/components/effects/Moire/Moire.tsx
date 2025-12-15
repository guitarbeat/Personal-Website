import * as ogl from "ogl";
import React, { useEffect, useRef } from "react";
import chroma from "chroma-js"; // Import the chroma-js library from the specified CDN
import { throttle } from "../../../utils/throttle.ts";
import "./Moire.css";

function Magic(containerEl) {
  const { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } = ogl;

  let renderer;
  let gl;
  let camera;
  // eslint-disable-next-line no-unused-vars
  let width;
  let height;
  let wWidth;
  // let wHeight; // Remove this line
  let mouse;
  let mouseOver = false;

  let gridWidth;
  let gridHeight;
  let gridRatio;
  let ripple;
  let points;
  const color1 = new Color([0.149, 0.141, 0.912]);
  const color2 = new Color([1.0, 0.833, 0.224]);
  let cameraZ = 50;

  const init = () => {
    renderer = new Renderer({ dpr: 1 });
    gl = renderer.gl;
    const mount = containerEl || document.querySelector("#magicContainer");
    if (!mount) return;
    mount.appendChild(gl.canvas);

    camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, cameraZ);

    resize();
    window.addEventListener("resize", resize, false);

    mouse = new Vec2();

    initScene();
    // store the listeners cleanup function on the renderer so the main cleanup can call it
    renderer._listenersCleanup = initEventListeners();
    requestAnimationFrame(animate);
  };

  const initScene = () => {
    gl.clearColor(1, 1, 1, 1);
    ripple = new RippleEffect(renderer);
    initPointsMesh();
  };

  const initPointsMesh = () => {
    gridWidth = width;
    gridHeight = height;

    const ssize = 3; // screen space
    const wsize = (ssize * wWidth) / width;
    const nx = Math.floor(gridWidth / ssize) + 1;
    const ny = Math.floor(gridHeight / ssize) + 1;
    const numPoints = nx * ny;
    const ox = -wsize * (nx / 2 - 0.5);
    const oy = -wsize * (ny / 2 - 0.5);
    const positions = new Float32Array(numPoints * 3);
    const uvs = new Float32Array(numPoints * 2);
    const sizes = new Float32Array(numPoints);

    let uvx;
    let uvy;
    let uvdx;
    let uvdy;
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
        const i1 = i * ny + j;
        const i2 = i1 * 2;
        const i3 = i1 * 3;
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
  };

  const animate = (_t) => {
    requestAnimationFrame(animate);
    camera.position.z += (cameraZ - camera.position.z) * 0.02;

    if (!mouseOver) {
      const time = Date.now() * 0.001;
      const x = Math.cos(time) * 0.2;
      const y = Math.sin(time) * 0.2;
      ripple.addDrop(x, y, 0.05, 0.05);
    }

    ripple.update();
    renderer.render({ scene: points, camera });
  };

  const randomizeColors = () => {
    color1.set(chroma.random().hex());
    color2.set(chroma.random().hex());
  };

  const getScrollPercentage = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const { scrollHeight, clientHeight } = document.documentElement;
    const maxScroll = scrollHeight - clientHeight;

    // Return 0 if page isn't scrollable
    if (maxScroll <= 0) {
      return 0;
    }

    // Ensure the percentage is between 0 and 1
    return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
  };

  const handleScroll = throttle((event) => {
    cameraZ = 50 - getScrollPercentage() * 3;
  }, 16); // ~60fps

  // Create a properly typed scroll handler for TypeScript compatibility
  const scrollHandler = (event) => handleScroll(event);

  const initEventListeners = () => {
    const isTouch = "ontouchstart" in window;
    // Named handlers so removeEventListener can match the same function reference
    const onLeave = () => {
      mouseOver = false;
    };
    const onTouchEnd = () => {
      mouseOver = false;
    };

    if (isTouch) {
      document.body.addEventListener("touchstart", onMove, false);
      document.body.addEventListener("touchmove", onMove, false);
      document.body.addEventListener("touchend", onTouchEnd, false);
    } else {
      document.body.addEventListener("mousemove", onMove, false);
      document.body.addEventListener("mouseleave", onLeave, false);
      document.body.addEventListener("mouseup", randomizeColors, false);
      document.addEventListener("scroll", scrollHandler, { passive: true });
    }

    // Cleanup function (removes exactly what was added)
    return () => {
      if (isTouch) {
        document.body.removeEventListener("touchstart", onMove);
        document.body.removeEventListener("touchmove", onMove);
        document.body.removeEventListener("touchend", onTouchEnd);
      } else {
        document.body.removeEventListener("mousemove", onMove);
        document.body.removeEventListener("mouseleave", onLeave);
        document.body.removeEventListener("mouseup", randomizeColors);
        document.removeEventListener("scroll", scrollHandler);
      }
    };
  };

  const onMove = (e) => {
    mouseOver = true;
    if (e.changedTouches?.length) {
      e.x = e.changedTouches[0].pageX;
      e.y = e.changedTouches[0].pageY;
    }
    if (e.x === undefined) {
      e.x = e.pageX;
      e.y = e.pageY;
    }
    mouse.set(
      (e.x / gl.renderer.width) * 2 - 1,
      (1.0 - e.y / gl.renderer.height) * 2 - 1,
    );

    if (gridRatio >= 1) {
      mouse.y /= gridRatio;
    } else {
      mouse.x /= gridRatio;
    }

    ripple.addDrop(mouse.x, mouse.y, 0.05, 0.05);
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    const wSize = getWorldSize(camera);
    wWidth = wSize[0];
    // wHeight = wSize[1]; // Remove this line
    if (points) {
      initPointsMesh();
    }
  };

  const getWorldSize = (cam) => {
    const vFOV = (cam.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(cam.position.z);
    const width = height * cam.aspect;
    return [width, height];
  };

  init();

  // return cleanup
  return () => {
    try {
      window.removeEventListener("resize", resize);
      document.removeEventListener("scroll", scrollHandler);
      document.body.removeEventListener("mousemove", onMove);
      // call stored listeners cleanup if present (fallback to removing mouse listeners)
      if (renderer && typeof renderer._listenersCleanup === "function") {
        try {
          renderer._listenersCleanup();
        } catch {}
      } else {
        document.body.removeEventListener("mousemove", onMove);
        document.body.removeEventListener("mouseup", randomizeColors);
      }
    } catch {}
    if (gl?.canvas?.parentNode) {
      gl.canvas.parentNode.removeChild(gl.canvas);
    }
  };
}

/**
 * Ripple effect
 */
const RippleEffect = (() => {
  const { Vec2, Program } = ogl;
  const defaultVertex =
    "attribute vec2 uv, position; varying vec2 vUv; void main() {vUv = uv; gl_Position = vec4(position, 0, 1);}";

  class RippleEffect {
    constructor(renderer) {
      const width = 512;
      const height = 512;
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
    initShaders() {
      this.updateProgram = new Program(this.gl, {
        uniforms: { tDiffuse: { value: null }, uDelta: { value: this.delta } },
        vertex: defaultVertex,
        fragment:
          "precision highp float; uniform sampler2D tDiffuse; uniform vec2 uDelta; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); vec2 dx = vec2(uDelta.x, 0.0), dy = vec2(0.0, uDelta.y); float average = (texture2D(tDiffuse, vUv - dx).r + texture2D(tDiffuse, vUv - dy).r + texture2D(tDiffuse, vUv + dx).r + texture2D(tDiffuse, vUv + dy).r) * 0.25; texel.g += (average - texel.r) * 2.0; texel.g *= 0.8; texel.r += texel.g; gl_FragColor = texel;}",
      });

      this.dropProgram = new Program(this.gl, {
        uniforms: {
          tDiffuse: { value: null },
          uCenter: { value: new Vec2() },
          uRadius: { value: 0.05 },
          uStrength: { value: 0.05 },
        },
        vertex: defaultVertex,
        fragment:
          "precision highp float; const float PI = 3.1415926535897932384626433832795; uniform sampler2D tDiffuse; uniform vec2 uCenter; uniform float uRadius; uniform float uStrength; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); float drop = max(0.0, 1.0 - length(uCenter * 0.5 + 0.5 - vUv) / uRadius); drop = 0.5 - cos(drop * PI) * 0.5; texel.r += drop * uStrength; gl_FragColor = texel;}",
      });
    }
    update() {
      this.updateProgram.uniforms.tDiffuse.value = this.gpgpu.read.texture;
      this.gpgpu.renderProgram(this.updateProgram);
    }
    addDrop(x, y, radius, strength) {
      const us = this.dropProgram.uniforms;
      us.tDiffuse.value = this.gpgpu.read.texture;
      us.uCenter.value.set(x, y);
      us.uRadius.value = radius;
      us.uStrength.value = strength;
      this.gpgpu.renderProgram(this.dropProgram);
    }
  }

  return RippleEffect;
})();

/**
 * GPGPU Helper
 */
const GPGPU = (() => {
  const { RenderTarget, Triangle, Mesh } = ogl;

  class GPGPU {
    constructor(gl, { width, height, type }) {
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
    renderProgram(program) {
      this.mesh.program = program;
      this.gl.renderer.render({
        scene: this.mesh,
        target: this.write,
        clear: false,
      });
      this.swap();
    }
    swap() {
      [this.read, this.write] = [this.write, this.read];
    }
  }

  const rto = (gl, width, height, type) => ({
    width,
    height,
    type:
      type ||
      gl.HALF_FLOAT ||
      gl.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES,
    internalFormat: gl.renderer.isWebgl2
      ? type === gl.FLOAT
        ? gl.RGBA32F
        : gl.RGBA16F
      : gl.RGBA,
    depth: false,
    unpackAlignment: 1,
  });

  return GPGPU;
})();

function MagicComponent() {
  const containerRef = useRef(null);

  useEffect(() => {
    const { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } = ogl;
    const state = {};
    const containerEl = containerRef.current;
    if (!containerEl) return;

    state.renderer = new Renderer({ dpr: 1 });
    state.gl = state.renderer.gl;
    containerEl.appendChild(state.gl.canvas);

    state.camera = new Camera(state.gl, { fov: 45 });
    state.camera.position.set(0, 0, 50);

    state.mouse = new Vec2();
    state.mouseOver = false;

    state.color1 = new Color([0.149, 0.141, 0.912]);
    state.color2 = new Color([1.0, 0.833, 0.224]);
    state.cameraZ = 50;

    const resize = () => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      state.renderer.setSize(state.width, state.height);
      state.camera.perspective({ aspect: state.width / state.height });

      const vFOV = (state.camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFOV / 2) * Math.abs(state.camera.position.z);
      const width = height * state.camera.aspect;
      state.wWidth = width;

      if (state.points) initPointsMesh();
    };

    const initScene = () => {
      state.gl.clearColor(1, 1, 1, 1);
      state.ripple = new RippleEffect(state.renderer);
      initPointsMesh();
    };

    const initPointsMesh = () => {
      const ssize = 3; // screen space
      const wsize = (ssize * state.wWidth) / state.width;
      const nx = Math.floor(state.width / ssize) + 1;
      const ny = Math.floor(state.height / ssize) + 1;
      const numPoints = nx * ny;
      const ox = -wsize * (nx / 2 - 0.5);
      const oy = -wsize * (ny / 2 - 0.5);
      const positions = new Float32Array(numPoints * 3);
      const uvs = new Float32Array(numPoints * 2);
      const sizes = new Float32Array(numPoints);

      state.gridRatio = state.width / state.height;
      let uvx, uvy, uvdx, uvdy;
      if (state.gridRatio >= 1) {
        uvx = 0;
        uvdx = 1 / nx;
        uvy = (1 - 1 / state.gridRatio) / 2;
        uvdy = 1 / ny / state.gridRatio;
      } else {
        uvx = (1 - 1 * state.gridRatio) / 2;
        uvdx = (1 / nx) * state.gridRatio;
        uvy = 0;
        uvdy = 1 / ny;
      }

      for (let i = 0; i < nx; i++) {
        const x = ox + i * wsize;
        for (let j = 0; j < ny; j++) {
          const i1 = i * ny + j;
          positions.set([x, oy + j * wsize, 0], i1 * 3);
          uvs.set([uvx + i * uvdx, uvy + j * uvdy], i1 * 2);
          sizes[i1] = ssize / 2;
        }
      }

      const geometry = new Geometry(state.gl, {
        position: { size: 3, data: positions },
        uv: { size: 2, data: uvs },
        size: { size: 1, data: sizes },
      });

      if (state.points) {
        state.points.geometry = geometry;
      } else {
        const program = new Program(state.gl, {
          uniforms: {
            hmap: { value: state.ripple.gpgpu.read.texture },
            color1: { value: state.color1 },
            color2: { value: state.color2 },
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
        state.points = new Mesh(state.gl, {
          geometry,
          program,
          mode: state.gl.POINTS,
        });
      }
    };

    const animate = () => {
      state.animationFrameId = requestAnimationFrame(animate);

      state.camera.position.z +=
        (state.cameraZ - state.camera.position.z) * 0.02;

      if (!state.mouseOver) {
        const time = Date.now() * 0.001;
        const x = Math.cos(time) * 0.2;
        const y = Math.sin(time) * 0.2;
        state.ripple.addDrop(x, y, 0.05, 0.05);
      }

      state.ripple.update();
      state.renderer.render({ scene: state.points, camera: state.camera });
    };

    resize();
    initScene();
    animate();

    const getScrollPercentage = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const { scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return 0;
      return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    };

    const handleScroll = throttle(() => {
      state.cameraZ = 50 - getScrollPercentage() * 3;
    }, 16);

    // Event listeners are set up here, and will be cleaned up in the return function
    window.addEventListener("resize", resize, false);
    document.addEventListener("scroll", handleScroll, { passive: true });

    const onMove = (e) => {
      state.mouseOver = true;
      const touchX = e.changedTouches?.[0]?.pageX;
      const touchY = e.changedTouches?.[0]?.pageY;
      const pageX = e.x === undefined ? e.pageX : e.x;
      const pageY = e.y === undefined ? e.pageY : e.y;

      const x = touchX || pageX;
      const y = touchY || pageY;

      state.mouse.set(
        (x / state.gl.renderer.width) * 2 - 1,
        (1.0 - y / state.gl.renderer.height) * 2 - 1,
      );

      if (state.gridRatio >= 1) {
        state.mouse.y /= state.gridRatio;
      } else {
        state.mouse.x /= state.gridRatio;
      }

      state.ripple.addDrop(state.mouse.x, state.mouse.y, 0.05, 0.05);
    };

    const handleMouseLeave = () => {
      state.mouseOver = false;
    };

    if ("ontouchstart" in window) {
      document.body.addEventListener("touchstart", onMove, false);
      document.body.addEventListener("touchmove", onMove, false);
      document.body.addEventListener("touchend", handleMouseLeave, false);
    } else {
      document.body.addEventListener("mousemove", onMove, false);
      document.body.addEventListener("mouseleave", handleMouseLeave, false);
    }

    return () => {
      window.removeEventListener("resize", resize, false);
      document.removeEventListener("scroll", handleScroll, { passive: true });
      if ("ontouchstart" in window) {
        document.body.removeEventListener("touchstart", onMove, false);
        document.body.removeEventListener("touchmove", onMove, false);
        document.body.removeEventListener("touchend", handleMouseLeave, false);
      } else {
        document.body.removeEventListener("mousemove", onMove, false);
        document.body.removeEventListener("mouseleave", handleMouseLeave, false);
      }
    };
  }, []);

  return <div id="magicContainer" ref={containerRef} />;
}

export default MagicComponent;
