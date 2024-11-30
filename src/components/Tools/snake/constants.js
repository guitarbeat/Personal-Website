// Theme configuration
export const THEME = {
  colors: {
    background: 'rgba(17, 17, 23, 0.85)',      // Semi-transparent dark background
    snake: {
      gradient: ['#7AA2F7', '#7DCFFF', '#2AC3DE'], // Cool blue gradient
      glow: '#7AA2F7'          // Matching glow color
    },
    snakeHead: {
      gradient: ['#BB9AF7', '#9D7CD8'],  // Purple gradient
      glow: '#BB9AF7'          // Matching glow color
    },
    food: {
      gradient: ['#F7768E', '#FF9E64'],  // Warm gradient
      glow: '#F7768E'          // Matching glow color
    },
    border: '#24283B',         // Subtle border
    gridLines: 'rgba(255, 255, 255, 0.05)',  // Subtle grid lines
    text: '#A9B1D6',           // Soft text color
    gameOver: '#F7768E',       // Warm red for game over
    scoreBackground: 'rgba(26, 27, 38, 0.9)',  // Dark score background
    highScore: '#9ECE6A'       // Green for high score
  },
  
  dimensions: {
    minTileSize: 20,
    maxTileSize: 32,
    borderRadius: 4,
    gridLineWidth: 1,
    aspectRatio: 1
  },
  
  animations: {
    snakeSpeed: {
      mobile: 100,
      desktop: 80
    },
    particleCount: 10,
    particleLifetime: 1000,
    particleGravity: 0.1,
    particleSpeed: 2,
    particleSize: 0.5
  }
};

// Game configuration
export const GAME_CONFIG = {
  gridSize: 20, // This will now be the number of cells in both width and height
  initialSnakeLength: 3,
  growthRate: 1,
  maxHighScores: 5,
  minGridSize: 15,  // Minimum grid size for smaller screens
  maxGridSize: 30,   // Maximum grid size for larger screens
  touchThreshold: {
    distance: 30,
    time: 200
  }
};

// Responsive configuration
export const RESPONSIVE_CONFIG = {
  mobileBreakpoint: 768,
  minSize: 300,
  maxSize: 800,
  padding: 20,
  aspectRatio: THEME.dimensions.aspectRatio
};

// Particle configuration
export const PARTICLE_CONFIG = {
  count: THEME.animations.particleCount,
  initialSize: THEME.animations.particleSize,
  speed: THEME.animations.particleSpeed,
  lifetime: THEME.animations.particleLifetime,
  gravity: THEME.animations.particleGravity
};

// WebGL Shaders
export const SHADERS = {
  vertex: /* glsl */`
    attribute vec3 position;
    attribute vec3 normal;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 color;
    
    varying vec3 vNormal;
    varying vec3 vColor;
    
    void main() {
      vNormal = normal;
      vColor = color;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragment: /* glsl */`
    precision highp float;
    
    varying vec3 vNormal;
    varying vec3 vColor;
    
    void main() {
      vec3 light = normalize(vec3(1.0, 1.0, 1.0));
      float shading = dot(vNormal, light) * 0.5 + 0.5;
      gl_FragColor = vec4(vColor * shading, 1.0);
    }
  `
};

// Game state
export const INITIAL_STATE = {
  score: 0,
  isGameOver: false,
  direction: { x: 0, y: 0 },
  snake: [],
  food: null
};

// Canvas will be set dynamically based on screen size
export const getCanvasSize = (containerWidth, containerHeight) => {
  // Use the smaller dimension to ensure a square canvas
  const size = Math.min(containerWidth, containerHeight);
  return {
    width: size,
    height: size
  };
};

export const getCellSize = (canvasSize) => {
  // Calculate cell size based on the canvas size and grid size
  return Math.floor(canvasSize.width / GAME_CONFIG.gridSize);
};
