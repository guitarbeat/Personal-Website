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

    // Other variables used to set up the grid.

    // Define the grid size.
    const ssize = 3; // screen space

    // Calculate the world size based on the screen size and the screen dimensions.
    const wsize = (ssize * wWidth) / width;

    // Calculate the number of grid points in the x and y dimensions, and the total number of points.
    const nx = Math.floor(gridWidth / ssize) + 1;
    const ny = Math.floor(gridHeight / ssize) + 1;
    const numPoints = nx * ny;

    // Other variables for setting up the grid.
    // ...

    // Create the geometry for the moire effect points and attach it to the points mesh.

    // ...

    // Define the vertex and fragment shaders and create a new WebGL program.
    // Create a new mesh with the program and attach it to the points mesh.
  }

  // Animate the moire effect.
  function animate(t) {
    // ...

    // Render the scene.
    renderer.render({ scene: points, camera });
  }

  // Function to randomize colors.
  function randomizeColors() {
    // ...
  }

  // Initialize event listeners.
  function initEventsListener() {
    // ...
  }

  // Function to get scroll percentage.
  function getScrollPercentage() {
    // ...
  }

  // Function to handle mouse or touch events.
  function onMove(e) {
    // ...
  }

  // Function to resize the WebGL canvas and update the moire effect when the window is resized.
  function resize() {
    // ...
  }

  // Function to get world size.
  function getWorldSize(cam) {
    // ...
  }
}

// Call the MoireEffect function to start rendering the moire effect.
MoireEffect();
