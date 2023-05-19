function MoireEffect() {
  const { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } = ogl;

  let renderer, gl, camera;
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

  function init() {
    renderer = new Renderer({ dpr: 1 });
    gl = renderer.gl;
    document.body.appendChild(gl.canvas);

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

MoireEffect();
