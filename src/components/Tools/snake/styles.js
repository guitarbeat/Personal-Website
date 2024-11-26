// Game styling constants
export const COLORS = {
  background: '#1a1a1a',
  snake: '#4CAF50',
  snakeHead: '#66BB6A',  // Slightly lighter green for the head
  food: '#FF5722',
  border: '#333333',
  gridLines: 'rgba(255, 255, 255, 0.03)',
  text: '#FFFFFF',
  gameOver: '#F44336'
};

export const DIMENSIONS = {
  tileCount: 20,
  minTileSize: 15,
  maxTileSize: 30,
  borderRadius: 4,  // Increased border radius for smoother look
  gridLineWidth: 1
};

export const ANIMATIONS = {
  moveSpeed: 100,
  fadeSpeed: 200,
  growthFactor: 1.1,
  foodPulseSpeed: 1000,  // Time in ms for one pulse cycle
  foodPulseScale: 1.2    // How much the food grows during pulse
};

// Styling utilities
export const calculateGameDimensions = (containerWidth, containerHeight) => {
  const size = Math.min(containerWidth, containerHeight);
  const tileSize = Math.max(
    DIMENSIONS.minTileSize,
    Math.min(
      DIMENSIONS.maxTileSize,
      Math.floor(size / DIMENSIONS.tileCount)
    )
  );
  
  return {
    tileSize,
    gameSize: tileSize * DIMENSIONS.tileCount
  };
};

export const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};

// New utility functions for enhanced visuals
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
  const scale = 1 + Math.sin(time / ANIMATIONS.foodPulseSpeed * Math.PI) * (ANIMATIONS.foodPulseScale - 1) / 2;
  const scaledSize = size * scale;
  const offset = (scaledSize - size) / 2;
  
  ctx.save();
  ctx.fillStyle = COLORS.food;
  drawRoundedRect(
    ctx,
    x - offset + 1,
    y - offset + 1,
    scaledSize - 2,
    scaledSize - 2,
    DIMENSIONS.borderRadius
  );
  ctx.fill();
  ctx.restore();
};
