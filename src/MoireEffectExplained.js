import { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } from 'ogl';

// MoireEffect function - the main WebGL code that renders a moire effect on the web page.
function MoireEffect() {
  // Extract required classes from the ogl library.
  const { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } = ogl;
  // Declare variables that will hold references to the WebGL renderer, WebGL context, and camera.
  let renderer, gl, camera;
  // Variables for screen dimensions and world dimensions.
  let width, height, wWidth, wHeight;
  // Mouse event variables.
  let mouse,
    mouseOver = false;
  // Variables for the grid that will render the moire effect.
  let gridWidth, gridHeight, gridRatio;
  // Ripple effect reference and points for the moire effect.
  let ripple, points;
  // Define two colors for the moire effect.
  const color1 = new Color([0.149, 0.141, 0.912]);
  const color2 = new Color([1.0, 0.833, 0.224]);
  // Camera's z-coordinate.
  let cameraZ = 50;
  // Call the init function to initialize WebGL, the camera, and the moire effect.
  init();

  // Initialize WebGL, the camera, and the moire effect.
  function init() {
    // Create a new WebGL renderer and get a reference to the WebGL context.
    renderer = new Renderer({ dpr: 1 });
    gl = renderer.gl;

    // Append the WebGL canvas to the HTML body.
    document.body.appendChild(gl.canvas);

    // Initialize the camera with a field of view of 45 degrees.
    camera = new Camera(gl, { fov: 45 });

    // Set the camera's initial position.
    camera.position.set(0, 0, cameraZ);

    // Call the resize function and add it as a listener for the window's resize event.
    resize();
    window.addEventListener("resize", resize, false);

    // Initialize the mouse as a 2D vector.
    mouse = new Vec2();

    // Initialize the moire effect scene and event listeners.
    initScene();
    initEventsListener();

    // Call the animate function at the next available frame.
    requestAnimationFrame(animate);
  }

  // Initialize the moire effect scene.
  function initScene() {
    // Set the clear color to white.
    gl.clearColor(1, 1, 1, 1);

    // Initialize the ripple effect.
    ripple = new RippleEffect(renderer);

    // Initialize the mesh of points for the moire effect.
    initPointsMesh();
  }

  // Initialize the mesh of points for the moire effect.
  function initPointsMesh() {
    // Grid dimensions are equal to screen dimensions.
    gridWidth = width;
    gridHeight = height;

    // Define the grid size.
    const ssize = 3; // screen space

    // Calculate the world size based on the screen size and the screen dimensions.
    const wsize = (ssize * wWidth) / width;

    // Calculate the number of grid points in the x and y dimensions, and the total number of points.
    const nx = Math.floor(gridWidth / ssize) + 1;
    const ny = Math.floor(gridHeight / ssize) + 1;
    const numPoints = nx * ny;

    // Other variables for setting up the grid.
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

  // Animate the moire effect.
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

    // Render the scene.
    renderer.render({ scene: points, camera });
  }

  // Function to randomize colors.
  function randomizeColors() {
    color1.set(chroma.random().hex());
    color2.set(chroma.random().hex());
  }

  // Initialize event listeners.
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

  // Function to get scroll percentage.
  function getScrollPercentage() {
    const topPos = document.documentElement.scrollTop;
    const remaining =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    return topPos / remaining;
  }

  // Function to handle mouse or touch events.
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

  // Function to resize the WebGL canvas and update the moire effect when the window is resized.
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

// Call the MoireEffect function to start rendering the moire effect.
MoireEffect();
