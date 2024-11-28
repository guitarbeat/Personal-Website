// Game styling constants
export const COLORS = {
  background: '#1A1B26',      // Rich dark background
  snake: {
    gradient: ['#7AA2F7', '#7DCFFF', '#2AC3DE'], // Cool blue gradient for snake body
    glow: '#7AA2F7'          // Matching glow color
  },
  snakeHead: {
    gradient: ['#BB9AF7', '#9D7CD8'],  // Purple gradient for head
    glow: '#BB9AF7'          // Matching glow color
  },
  food: {
    gradient: ['#F7768E', '#FF9E64'],  // Warm gradient for food
    glow: '#F7768E'          // Matching glow color
  },
  border: '#24283B',         // Subtle border
  gridLines: 'rgba(255, 255, 255, 0.05)',  // Subtle grid lines
  text: '#A9B1D6',           // Soft text color
  gameOver: '#F7768E',       // Warm red for game over
  scoreBackground: 'rgba(26, 27, 38, 0.9)',  // Dark score background
  highScore: '#9ECE6A'       // Green for high score
};

export const DIMENSIONS = {
  minTileSize: 22,           // Base tile size
  maxTileSize: 42,           // Maximum tile size
  borderRadius: 4,           // Rounded corners for tiles
  gridLineWidth: 1,
  aspectRatio: 16 / 9,       // Widescreen aspect ratio
  shadowBlur: 30,            // Increased shadow blur
  glowRadius: 40,            // Increased glow effect radius
  innerShadowSize: 10        // Size of inner shadow
};

export const ANIMATIONS = {
  moveSpeed: 85,             // Slightly faster for responsiveness
  fadeSpeed: 400,            // Smooth fade transitions
  growthFactor: 1.15,        // More pronounced growth
  foodPulseSpeed: 1800,      // Slower pulse for food
  foodPulseScale: 1.18,      // Larger pulse scale
  snakeGlowIntensity: 0.8,   // Increased glow intensity
  shadowPulseSpeed: 200      // Speed of shadow pulse
};

// Styling utilities
export const calculateGameDimensions = (containerWidth, containerHeight) => {
  // Use 95% of the container dimensions to match CSS
  const gameWidth = containerWidth * 0.95;
  const gameHeight = containerHeight * 0.95;
  const targetAspectRatio = DIMENSIONS.aspectRatio;

  let width, height;
  if (gameWidth / gameHeight > targetAspectRatio) {
    // Too wide - use height as constraint
    height = gameHeight;
    width = height * targetAspectRatio;
  } else {
    // Too tall - use width as constraint
    width = gameWidth;
    height = width / targetAspectRatio;
  }

  // Calculate tile size based on the game dimensions
  const tileSize = Math.max(
    DIMENSIONS.minTileSize,
    Math.min(
      DIMENSIONS.maxTileSize,
      Math.floor(Math.min(width / 24, height / 16)) // Adjusted for larger tiles
    )
  );

  // Calculate final dimensions
  const cols = Math.floor(width / tileSize);
  const rows = Math.floor(height / tileSize);

  return {
    tileSize,
    gameWidth: cols * tileSize,
    gameHeight: rows * tileSize,
    cols,
    rows
  };
};

// Drawing utilities
export const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};

export const drawGrid = (ctx, width, height, tileSize) => {
  ctx.strokeStyle = COLORS.gridLines;
  ctx.lineWidth = DIMENSIONS.gridLineWidth;
  
  // Draw vertical lines
  for (let x = 0; x <= width; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= height; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

export const drawFood = (ctx, x, y, size, time) => {
  ctx.save();
  
  // Calculate pulse scale
  const scale = 1 + Math.sin(time * 2 * Math.PI / ANIMATIONS.foodPulseSpeed) * 0.1;
  const scaledSize = size * scale;
  const offset = (scaledSize - size) / 2;
  
  // Create gradient
  const gradient = ctx.createRadialGradient(
    x + size/2, y + size/2, 0,
    x + size/2, y + size/2, size
  );
  gradient.addColorStop(0, COLORS.food.gradient[0]);
  gradient.addColorStop(1, COLORS.food.gradient[1]);
  
  // Draw glowing food
  ctx.shadowColor = COLORS.food.glow;
  ctx.shadowBlur = DIMENSIONS.glowRadius;
  ctx.fillStyle = gradient;
  
  drawRoundedRect(
    ctx,
    x - offset,
    y - offset,
    scaledSize,
    scaledSize,
    DIMENSIONS.borderRadius * scale
  );
  
  ctx.restore();
};

export const drawSnakeSegment = (ctx, x, y, size, isHead = false) => {
  ctx.save();
  
  // Create gradient
  const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
  const colors = isHead ? COLORS.snakeHead.gradient : COLORS.snake.gradient;
  
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  // Set shadow for glow effect
  ctx.shadowColor = isHead ? COLORS.snakeHead.glow : COLORS.snake.glow;
  ctx.shadowBlur = DIMENSIONS.glowRadius;
  ctx.fillStyle = gradient;
  
  // Draw segment with rounded corners
  drawRoundedRect(
    ctx,
    x + 1,
    y + 1,
    size - 2,
    size - 2,
    DIMENSIONS.borderRadius
  );
  
  ctx.restore();
};
