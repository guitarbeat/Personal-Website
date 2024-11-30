import { THEME, GAME_CONFIG } from './constants';

// Styling utilities
export const calculateGameDimensions = (containerWidth, containerHeight) => {
  const { maxGridWidth, maxGridHeight, minTileSize } = THEME.dimensions;
  
  // Calculate maximum possible grid size based on container dimensions
  const maxWidth = Math.floor(containerWidth / minTileSize);
  const maxHeight = Math.floor(containerHeight / minTileSize);
  
  // Determine actual grid size while maintaining aspect ratio
  const gridWidth = Math.min(maxWidth, maxGridWidth);
  const gridHeight = Math.min(maxHeight, maxGridHeight);
  
  // Calculate tile size to fit the grid within container
  const tileSize = Math.min(
    Math.floor(containerWidth / gridWidth),
    Math.floor(containerHeight / gridHeight)
  );
  
  return {
    gridWidth,
    gridHeight,
    tileSize,
    canvasWidth: gridWidth * tileSize,
    canvasHeight: gridHeight * tileSize
  };
};

// Drawing utilities
export const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const drawGrid = (ctx, width, height, tileSize) => {
  const { gridLines } = THEME.colors;
  const { gridLineWidth } = THEME.dimensions;
  
  ctx.strokeStyle = gridLines;
  ctx.lineWidth = gridLineWidth;
  
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
  const { food } = THEME.colors;
  const { borderRadius, glowRadius } = THEME.dimensions;
  const { foodPulseSpeed, foodPulseScale } = THEME.animations;
  
  // Calculate pulse scale
  const scale = 1 + Math.sin(time / foodPulseSpeed) * (foodPulseScale - 1);
  const scaledSize = size * scale;
  const offset = (scaledSize - size) / 2;
  
  // Draw glow
  const gradient = ctx.createRadialGradient(
    x + size / 2, y + size / 2, 0,
    x + size / 2, y + size / 2, glowRadius
  );
  gradient.addColorStop(0, `${food.glow}40`);
  gradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x - glowRadius, y - glowRadius, size + glowRadius * 2, size + glowRadius * 2);
  
  // Draw food
  const foodGradient = ctx.createLinearGradient(x, y, x + scaledSize, y + scaledSize);
  food.gradient.forEach((color, index) => {
    foodGradient.addColorStop(index / (food.gradient.length - 1), color);
  });
  
  ctx.fillStyle = foodGradient;
  drawRoundedRect(ctx, x - offset, y - offset, scaledSize, scaledSize, borderRadius);
  ctx.fill();
};

export const drawSnakeSegment = (ctx, x, y, size, isHead = false) => {
  const colors = isHead ? THEME.colors.snakeHead : THEME.colors.snake;
  const { borderRadius, glowRadius } = THEME.dimensions;
  const { snakeGlowIntensity } = THEME.animations;
  
  // Draw glow
  const glowGradient = ctx.createRadialGradient(
    x + size / 2, y + size / 2, 0,
    x + size / 2, y + size / 2, glowRadius
  );
  glowGradient.addColorStop(0, `${colors.glow}${Math.floor(snakeGlowIntensity * 255).toString(16)}`);
  glowGradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = glowGradient;
  ctx.fillRect(x - glowRadius, y - glowRadius, size + glowRadius * 2, size + glowRadius * 2);
  
  // Draw segment
  const segmentGradient = ctx.createLinearGradient(x, y, x + size, y + size);
  colors.gradient.forEach((color, index) => {
    segmentGradient.addColorStop(index / (colors.gradient.length - 1), color);
  });
  
  ctx.fillStyle = segmentGradient;
  drawRoundedRect(ctx, x, y, size, size, borderRadius);
  ctx.fill();
};
