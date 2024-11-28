import { createGameEngine } from './gameEngine';
import { COLORS, ANIMATIONS, calculateGameDimensions, drawGrid, drawSnakeSegment, drawFood } from './styles';
import { SnakeAudio } from './audio';

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
    if (!container) {
      console.error('Container element is null or undefined');
      return null;
    }
    
    // Check if container already has a game
    if (container.querySelector('canvas')) {
      console.warn('Snake game already initialized in this container');
      return null;
    }

    this.container = container;
    this.engine = createGameEngine();
    
    // Initialize audio with proper error handling
    try {
      this.audio = new SnakeAudio();
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
      this.audio = null;
    }
    
    // Initialize dimensions
    const { tileSize, gameWidth, gameHeight, cols, rows } = calculateGameDimensions(
      container.clientWidth,
      container.clientHeight
    );
    this.tileSize = tileSize;
    this.cols = cols;
    this.rows = rows;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    
    // Initialize game state
    this.snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    this.food = this.getRandomPosition();
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameOver = false;
    
    // Setup canvas
    const { canvas, ctx } = this.engine.createCanvas(container, gameWidth, gameHeight);
    this.canvas = canvas;
    this.ctx = ctx;
    
    // Touch handling variables
    this.touchStartX = null;
    this.touchStartY = null;
    
    // Setup input handling
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right',
      'm': 'mute'
    };
    
    this.boundKeyPress = this.engine.createInputHandler(keyMap);
    document.addEventListener('keydown', (event) => {
      const newDirection = this.boundKeyPress(event);
      if (newDirection) {
        this.handleDirectionChange(newDirection);
      }
    });

    // Add touch event listeners for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Initialization successful
    return this;
  }

  cleanup() {
    // Remove game over message if it exists
    const gameOverDiv = this.container.querySelector('.game-over');
    if (gameOverDiv) {
      gameOverDiv.parentNode.removeChild(gameOverDiv);
    }

    // Remove score display if it exists
    const scoreDiv = this.container.querySelector('.score');
    if (scoreDiv) {
      scoreDiv.parentNode.removeChild(scoreDiv);
    }

    // Remove event listeners
    document.removeEventListener('keydown', this.boundKeyPress);
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
      this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
      
      // Remove canvas
      if (this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }

    // Clear any pending animation frames
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    // Clear game state
    this.snake = [];
    this.food = null;
    this.gameOver = true;
  }

  handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  handleTouchMove(event) {
    event.preventDefault();
    if (!this.touchStartX || !this.touchStartY) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    // Only change direction if the swipe is long enough
    const minSwipeDistance = 30;
    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.handleDirectionChange('right');
        } else {
          this.handleDirectionChange('left');
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.handleDirectionChange('down');
        } else {
          this.handleDirectionChange('up');
        }
      }
      // Reset touch start coordinates after direction change
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    }
  }

  handleTouchEnd(event) {
    event.preventDefault();
    this.touchStartX = null;
    this.touchStartY = null;
  }

  handleDirectionChange(newDirection) {
    if (!newDirection) return;

    if (newDirection === 'mute') {
      this.toggleSound();
      return;
    }

    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    
    // Only change direction if it's not opposite to current direction
    // and the game is not over
    if (!this.gameOver && opposites[newDirection] !== this.direction) {
      this.playSound('turn');
      this.nextDirection = newDirection;
    }
  }

  // Audio methods with null checks
  playSound(name) {
    if (this.audio) {
      this.audio.play(name);
    }
  }

  toggleSound() {
    if (this.audio) {
      this.audio.toggleSound();
    }
  }

  getRandomPosition() {
    const isPositionOccupied = (pos, snake) => 
      snake.some(segment => segment.x === pos.x && segment.y === pos.y);
    
    let newPosition;
    do {
      newPosition = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows)
      };
    } while (isPositionOccupied(newPosition, this.snake));
    
    return newPosition;
  }

  update() {
    if (this.gameOver) return;

    // Update snake position
    const head = { ...this.snake[0] };
    
    switch (this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
      default: break;
    }
    
    // Wrap around walls
    head.x = (head.x + this.cols) % this.cols;
    head.y = (head.y + this.rows) % this.rows;
    
    // Check for self collision
    const selfCollision = this.snake.some((segment, index) => 
      index !== 0 && segment.x === head.x && segment.y === head.y
    );

    if (selfCollision) {
      this.die();
      return;
    }

    // Check for food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.eat();
    } else {
      this.snake.pop();
    }

    this.snake.unshift(head);
    this.direction = this.nextDirection;
  }

  die() {
    this.gameOver = true;
    this.playSound('die');
  }

  eat() {
    this.score += 10;
    this.food = this.getRandomPosition();
    this.playSound('eat');
  }

  handleGameOver() {
    if (!this.gameOver) {
      this.gameOver = true;
      
      // Create game over message
      const gameOverDiv = document.createElement('div');
      gameOverDiv.className = 'game-over';
      gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
        <p>Score: ${this.score}</p>
        <p>Press Space to restart</p>
        <p>Press Escape to exit</p>
      `;
      this.container.appendChild(gameOverDiv);
      
      // Add keyboard listeners for restart and exit
      const handleKeydown = (event) => {
        if (event.code === 'Space') {
          document.removeEventListener('keydown', handleKeydown);
          this.container.removeChild(gameOverDiv);
          this.resetGame();
        } else if (event.code === 'Escape') {
          document.removeEventListener('keydown', handleKeydown);
          this.cleanup();
          // Remove the game over message if it exists
          if (gameOverDiv.parentNode) {
            gameOverDiv.parentNode.removeChild(gameOverDiv);
          }
        }
      };
      document.addEventListener('keydown', handleKeydown);
    }
  }

  resetGame() {
    this.snake = [{ x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) }];
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
      drawSnakeSegment(this.ctx, x, y, this.tileSize, index === 0);
    });
    
    // Draw food
    const foodX = this.food.x * this.tileSize;
    const foodY = this.food.y * this.tileSize;
    drawFood(this.ctx, foodX, foodY, this.tileSize, Date.now());
    
    // Draw score
    if (!this.gameOver) {
      const scoreDiv = this.container.querySelector('.score') || document.createElement('div');
      if (!scoreDiv.classList.contains('score')) {
        scoreDiv.className = 'score';
        this.container.appendChild(scoreDiv);
      }
      scoreDiv.textContent = `Score: ${this.score}`;
    }
  }

  gameLoop() {
    if (!this.gameOver) {
      this.update();
    }
    this.draw();
    
    if (!this.gameOver) {
      this.animationFrame = this.engine.requestFrame(() => this.gameLoop(), ANIMATIONS.moveSpeed);
    }
  }
}

export function initSnakeGame(container) {
  // Clean up any existing game
  const existingCanvas = container.querySelector('canvas');
  if (existingCanvas) {
    existingCanvas.parentNode.removeChild(existingCanvas);
  }
  
  const game = new SnakeGame(container);
  if (game) {
    game.gameLoop();
    return game;
  }
  return null;
}