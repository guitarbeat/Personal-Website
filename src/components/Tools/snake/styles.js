import { COLORS, DIMENSIONS, ANIMATIONS } from './constants';

// Game styling constants
export const COLORS = {
  background: 'rgba(17, 17, 23, 0.85)',      // Semi-transparent dark background
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
  minTileSize: 20,           // Slightly smaller base tile size
  maxTileSize: 32,           // Reduced maximum tile size for better scaling
  borderRadius: 4,           // Rounded corners for tiles
  gridLineWidth: 1,
  aspectRatio: 4 / 3,       // More compact aspect ratio
  shadowBlur: 30,
  glowRadius: 40,
  innerShadowSize: 10,
  maxGridWidth: 40,         // Maximum number of tiles horizontally
  maxGridHeight: 30         // Maximum number of tiles vertically
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
  // Use available space efficiently
  const maxWidth = Math.min(containerWidth * 0.95, 1200); // Cap maximum width
  const maxHeight = Math.min(containerHeight * 0.95, 900); // Cap maximum height

  // Calculate dimensions maintaining aspect ratio
  let gameWidth, gameHeight, tileSize;

  // First try to fit by width
  gameWidth = maxWidth;
  gameHeight = gameWidth / DIMENSIONS.aspectRatio;

  // If too tall, fit by height instead
  if (gameHeight > maxHeight) {
    gameHeight = maxHeight;
    gameWidth = gameHeight * DIMENSIONS.aspectRatio;
  }

  // Calculate tile size based on available space and grid constraints
  const horizontalTiles = DIMENSIONS.maxGridWidth;
  const verticalTiles = DIMENSIONS.maxGridHeight;
  
  const widthBasedTileSize = gameWidth / horizontalTiles;
  const heightBasedTileSize = gameHeight / verticalTiles;
  
  // Use the smaller of the two to ensure tiles fit both dimensions
  tileSize = Math.min(
    widthBasedTileSize,
    heightBasedTileSize,
    DIMENSIONS.maxTileSize
  );

  // Ensure minimum tile size
  tileSize = Math.max(tileSize, DIMENSIONS.minTileSize);

  // Recalculate final dimensions based on tile size
  gameWidth = tileSize * horizontalTiles;
  gameHeight = tileSize * verticalTiles;

  return {
    width: gameWidth,
    height: gameHeight,
    tileSize: Math.floor(tileSize)
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
