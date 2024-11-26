import { createGameEngine } from './gameEngine';
import { COLORS, DIMENSIONS, ANIMATIONS, calculateGameDimensions, drawRoundedRect, drawGrid, drawFood } from './styles';

// Initialize game namespace
const g = window.g = {
  m: Math,
  mathProps: 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split(' '),
  rand() {
    return Math.random();
  },
  floor(n) {
    return Math.floor(n);
  },
  sin(n) {
    return Math.sin(n);
  },
  max(a, b) {
    return Math.max(a, b);
  },
  min(a, b) {
    return Math.min(a, b);
  }
};

// Copy math properties to g
for (let i = 0; i < g.mathProps.length; i++) {
  g[g.mathProps[i]] = g.m[g.mathProps[i]];
}
g.m.TWO_PI = g.m.PI * 2;

class SnakeGame {
  constructor(container) {
    // Check if container already has a game
    if (container.querySelector('canvas')) {
      console.warn('Snake game already initialized in this container');
      return;
    }

    this.container = container;
    this.engine = createGameEngine();
    
    // Initialize dimensions
    const { tileSize, gameSize } = calculateGameDimensions(
      container.clientWidth,
      container.clientHeight
    );
    this.tileSize = tileSize;
    this.gameSize = gameSize;
    
    // Initialize game state
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.getRandomPosition();
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameOver = false;
    
    // Setup canvas
    const { canvas, ctx } = this.engine.createCanvas(container, gameSize, gameSize);
    this.canvas = canvas;
    this.ctx = ctx;
    
    // Setup input handling
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right'
    };
    
    this.boundKeyPress = this.engine.createInputHandler(keyMap);
    document.addEventListener('keydown', (event) => {
      const newDirection = this.boundKeyPress(event);
      if (newDirection) {
        this.handleDirectionChange(newDirection);
      }
    });
    
    // Start game loop
    this.gameLoop();
  }

  cleanup() {
    document.removeEventListener('keydown', this.boundKeyPress);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  handleDirectionChange(newDirection) {
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    
    if (opposites[newDirection] !== this.direction) {
      // Update direction indicator on tile
      const head = this.snake[0];
      const tile = document.querySelector(`.tile-${head.x}-${head.y}`);
      if (tile) {
        tile.classList.remove('up', 'down', 'left', 'right');
        tile.classList.add(newDirection);
      }
      
      this.nextDirection = newDirection;
    }
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * DIMENSIONS.tileCount),
      y: Math.floor(Math.random() * DIMENSIONS.tileCount)
    };
  }

  update() {
    if (this.gameOver) return;

    // Update snake position
    const head = { ...this.snake[0] };
    const gridSize = Math.floor(this.canvas.width / this.tileSize);
    
    switch (this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
      default: break;
    }
    
    // Wrap around walls
    head.x = (head.x + gridSize) % gridSize;
    head.y = (head.y + gridSize) % gridSize;
    
    // Check for self collision
    const selfCollision = this.snake.some((segment, index) => 
      index !== 0 && segment.x === head.x && segment.y === head.y
    );
    
    if (selfCollision) {
      this.handleGameOver();
      return;
    }
    
    // Update snake position
    this.snake.unshift(head);
    
    // Check for food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.food = this.getRandomPosition();
      // Add visual effect for food collection
      const foodEffect = document.createElement('div');
      foodEffect.className = 'food-effect';
      foodEffect.style.left = `${head.x * this.tileSize}px`;
      foodEffect.style.top = `${head.y * this.tileSize}px`;
      this.canvas.parentElement.appendChild(foodEffect);
      setTimeout(() => foodEffect.remove(), 500);
    } else {
      this.snake.pop();
    }
    
    this.direction = this.nextDirection;
  }

  handleGameOver() {
    this.gameOver = true;
    
    // Create game over message
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = `
      <h2>Game Over!</h2>
      <p>Score: ${this.score}</p>
      <p>Press Space to restart</p>
    `;
    this.container.appendChild(gameOverDiv);
    
    // Add space key listener for restart
    const handleRestart = (event) => {
      if (event.code === 'Space') {
        document.removeEventListener('keydown', handleRestart);
        this.container.removeChild(gameOverDiv);
        this.resetGame();
      }
    };
    document.addEventListener('keydown', handleRestart);
  }

  resetGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.getRandomPosition();
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameOver = false;
    this.gameLoop();
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid
    drawGrid(this.ctx, this.canvas.width, this.canvas.height, this.tileSize);
    
    // Draw snake
    this.snake.forEach((segment, index) => {
      const x = segment.x * this.tileSize;
      const y = segment.y * this.tileSize;
      
      this.ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snake;
      drawRoundedRect(
        this.ctx,
        x + 1,
        y + 1,
        this.tileSize - 2,
        this.tileSize - 2,
        DIMENSIONS.borderRadius
      );
      this.ctx.fill();
      
      // Add gradient effect to snake segments
      const gradient = this.ctx.createLinearGradient(x, y, x + this.tileSize, y + this.tileSize);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });
    
    // Draw food with pulsing animation
    const foodX = this.food.x * this.tileSize;
    const foodY = this.food.y * this.tileSize;
    drawFood(this.ctx, foodX, foodY, this.tileSize, Date.now());
    
    // Draw score with shadow
    this.ctx.save();
    this.ctx.fillStyle = COLORS.text;
    this.ctx.font = 'bold 20px Arial';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.restore();
    
    if (this.gameOver) {
      // Draw semi-transparent overlay
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw game over text with glow effect
      this.ctx.save();
      this.ctx.fillStyle = COLORS.gameOver;
      this.ctx.font = 'bold 40px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = COLORS.gameOver;
      this.ctx.shadowBlur = 20;
      this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
      
      // Draw final score
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillStyle = COLORS.text;
      this.ctx.shadowBlur = 10;
      this.ctx.fillText(
        `Final Score: ${this.score}`,
        this.canvas.width / 2,
        this.canvas.height / 2 + 40
      );
      this.ctx.restore();
    }
  }

  gameLoop() {
    if (!this.gameOver) {
      this.update();
    }
    this.draw();
    
    if (!this.gameOver) {
      this.engine.requestFrame(() => this.gameLoop(), ANIMATIONS.moveSpeed);
    }
  }
}

export function initSnakeGame(container) {
  // Clean up any existing game
  const existingCanvas = container.querySelector('canvas');
  if (existingCanvas) {
    existingCanvas.parentNode.removeChild(existingCanvas);
  }
  
  return new SnakeGame(container);
}