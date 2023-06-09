import React, { useEffect, useRef } from 'react';
import * as ogl from 'ogl';
import chroma from 'chroma-js';

const Canvas = () => {
  const renderer = useRef(null);
  const gl = useRef(null);
  const camera = useRef(null);
  const mouse = useRef(new ogl.Vec2());
  const ripple = useRef(null);
  const points = useRef(null);
  const color1 = useRef(new ogl.Color([0.149, 0.141, 0.912]));
  const color2 = useRef(new ogl.Color([1.000, 0.833, 0.224]));
  let cameraZ = 50;

  useEffect(() => {
    init();
    return () => {
      cleanup();
    };
  }, []);

  function init() {
    renderer.current = new ogl.Renderer({ dpr: 1 });
    gl.current = renderer.current.gl;
    document.body.appendChild(gl.current.canvas);

    camera.current = new ogl.Camera(gl.current, { fov: 45 });
    camera.current.position.set(0, 0, cameraZ);

    resize();
    window.addEventListener('resize', resize, false);

    mouse.current = new ogl.Vec2();

    initScene();
    initEventsListener();
    requestAnimationFrame(animate);
  }

  function initScene() {
    gl.current.clearColor(1, 1, 1, 1);
    ripple.current = new RippleEffect(renderer.current);
    initPointsMesh();
  }

  function initPointsMesh() {
    const width = gl.current.renderer.width;
    const height = gl.current.renderer.height;
    const ssize = 3; // screen space
    const wsize = ssize * width / gl.current.renderer.width;
    const nx = Math.floor(width / ssize) + 1;
    const ny = Math.floor(height / ssize) + 1;
    const numPoints = nx * ny;
    const ox = -wsize * (nx / 2 - 0.5);
    const oy = -wsize * (ny / 2 - 0.5);
    const positions = new Float32Array(numPoints * 3);
    const uvs = new Float32Array(numPoints * 2);
    const sizes = new Float32Array(numPoints);

    let uvx, uvy, uvdx, uvdy;
    const gridRatio = width / height;
    if (gridRatio >= 1) {
      uvx = 0; uvdx = 1 / nx;
      uvy = (1 - 1 / gridRatio) / 2; uvdy = (1 / ny) / gridRatio;
    } else {
      uvx = (1 - 1 * gridRatio) / 2; uvdx = (1 / nx) * gridRatio;
      uvy = 0; uvdy = 1 / ny;
    }

    for (let i = 0; i < nx; i++) {
      const x = ox + i * wsize;
      for (let j = 0; j < ny; j++) {
        const i1 = i * ny + j, i2 = i1 * 2, i3 = i1 * 3;
        const y = oy + j * wsize;
        positions.set([x, y, 0], i3);
        uvs.set([uvx + i * uvdx, uvy + j * uvdy], i2);
        sizes[i1] = ssize / 2;
      }
    }

    const geometry = new ogl.Geometry(gl.current, {
      position: { size: 3, data: positions },
      uv: { size: 2, data: uvs },
      size: { size: 1, data: sizes }
    });

    if (points.current) {
      points.current.geometry = geometry;
    } else {
      const program = new ogl.Program(gl.current, {
        uniforms: {
          hmap: { value: ripple.current.gpgpu.read.texture },
          color1: { value: color1.current },
          color2: { value: color2.current }
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
        `
      });
      points.current = new ogl.Mesh(gl.current, { geometry, program, mode: gl.current.POINTS });
    }
  }

  function animate(t) {
    requestAnimationFrame(animate);
    camera.current.position.z += (cameraZ - camera.current.position.z) * 0.02;

    if (!mouseOver) {
      const time = Date.now() * 0.001;
      const x = Math.cos(time) * 0.2;
      const y = Math.sin(time) * 0.2;
      ripple.current.addDrop(x, y, 0.05, 0.05);
    }

    ripple.current.update();
    renderer.current.render({ scene: points.current, camera: camera.current });
  }

  function initEventsListener() {
    const handleMove = (e) => {
      mouseOver = true;
      if (e.changedTouches && e.changedTouches.length) {
        e.x = e.changedTouches[0].pageX;
        e.y = e.changedTouches[0].pageY;
      }
      if (e.x === undefined) {
        e.x = e.pageX; e.y = e.pageY;
      }
      mouse.current.set(
        (e.x / gl.current.renderer.width) * 2 - 1,
        (1.0 - e.y / gl.current.renderer.height) * 2 - 1
      );

      const gridRatio = gl.current.renderer.width / gl.current.renderer.height;
      if (gridRatio >= 1) {
        mouse.current.y = mouse.current.y / gridRatio;
      } else {
        mouse.current.x = mouse.current.x / gridRatio;
      }

      ripple.current.addDrop(mouse.current.x, mouse.current.y, 0.05, 0.05);
    };

    const handleResize = () => {
      resize();
    };

    if ('ontouchstart' in window) {
      document.body.addEventListener('touchstart', handleMove, false);
      document.body.addEventListener('touchmove', handleMove, false);
      document.body.addEventListener('touchend', () => { mouseOver = false; }, false);
    } else {
      document.body.addEventListener('mousemove', handleMove, false);
      document.body.addEventListener('mouseleave', () => { mouseOver = false; }, false);
      document.body.addEventListener('mouseup', randomizeColors, false);
      document.addEventListener('scroll', () => {
        cameraZ = 50 - getScrollPercentage() * 3;
      });
    }

    window.addEventListener('resize', handleResize, false);
  }

  function cleanup() {
    window.removeEventListener('resize', resize);
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.current.setSize(width, height);
    camera.current.perspective({ aspect: width / height });
    const wSize = getWorldSize(camera.current);
    const wWidth = wSize[0];
    const wHeight = wSize[1];
    if (points.current) initPointsMesh();
  }

  function getWorldSize(cam) {
    const vFOV = (cam.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(cam.position.z);
    const width = height * cam.aspect;
    return [width, height];
  }

  function randomizeColors() {
    color1.current.set(chroma.random().hex());
    color2.current.set(chroma.random().hex());
  }

  function getScrollPercentage() {
    const topPos = document.documentElement.scrollTop;
    const remaining = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (topPos / remaining);
  }

  return (
    <div />
  );
};

export default Canvas;

/**
 * Ripple effect
 */
const RippleEffect = (function () {
  function RippleEffect(renderer) {
    const width = 512;
    const height = 512;
    Object.assign(this, {
      renderer,
      gl: renderer.gl,
      width,
      height,
      delta: new ogl.Vec2(1 / width, 1 / height),
      gpgpu: new GPGPU(renderer.gl, { width, height }),
    });
    this.initShaders();
  }

  RippleEffect.prototype.initShaders = function () {
    this.updateProgram = new ogl.Program(this.gl, {
      uniforms: { tDiffuse: { value: null }, uDelta: { value: this.delta } },
      vertex: defaultVertex,
      fragment: `
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform vec2 uDelta;
        varying vec2 vUv;
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec2 dx = vec2(uDelta.x, 0.0);
          vec2 dy = vec2(0.0, uDelta.y);
          float average = (texture2D(tDiffuse, vUv - dx).r +
                           texture2D(tDiffuse, vUv - dy).r +
                           texture2D(tDiffuse, vUv + dx).r +
                           texture2D(tDiffuse, vUv + dy).r) * 0.25;
          texel.g += (average - texel.r) * 2.0;
          texel.g *= 0.8;
          texel.r += texel.g;
          gl_FragColor = texel;
        }
      `,
    });

    this.dropProgram = new ogl.Program(this.gl, {
      uniforms: {
        tDiffuse: { value: null },
        uCenter: { value: new ogl.Vec2() },
        uRadius: { value: 0.05 },
        uStrength: { value: 0.05 },
      },
      vertex: defaultVertex,
      fragment: `
        precision highp float;
        const float PI = 3.1415926535897932384626433832795;
        uniform sampler2D tDiffuse;
        uniform vec2 uCenter;
        uniform float uRadius;
        uniform float uStrength;
        varying vec2 vUv;
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          float drop = max(0.0, 1.0 - length(uCenter * 0.5 + 0.5 - vUv) / uRadius);
          drop = 0.5 - cos(drop * PI) * 0.5;
          texel.r += drop * uStrength;
          gl_FragColor = texel;
        }
      `,
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
  function GPGPU(gl, { width, height, type }) {
    Object.assign(this, {
      gl,
      width,
      height,
      numVertexes: width * height,
      read: new RenderTarget(gl, rto(gl, width, height, type)),
      write: new RenderTarget(gl, rto(gl, width, height, type)),
      mesh: new ogl.Mesh(gl, { geometry: new ogl.Triangle(gl) }),
    });
  }

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

export default Canvas;
import React, { useEffect, useRef } from 'react';
import * as ogl from 'ogl';
import chroma from 'chroma-js';

/**
 * Ripple effect
 */
const RippleEffect = (function () )();

/**
 * GPGPU Helper
 */
const GPGPU = (function () {
  function GPGPU(gl, { width, height, type }) {
    Object.assign(this, {
      gl,
      width,
      height,
      numVertexes: width * height,
      read: new RenderTarget(gl, rto(gl, width, height, type)),
      write: new RenderTarget(gl, rto(gl, width, height, type)),
      mesh: new ogl.Mesh(gl, { geometry: new ogl.Triangle(gl) }),
    });
  }

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

const Canvas = () => ;

export default Canvas;
