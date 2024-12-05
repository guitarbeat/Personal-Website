// External dependencies
import { Scene } from 'phaser';
import { 
  THEME, 
  GAME_CONFIG
} from './constants';
import profile1 from '../../../assets/images/profile1-nbg.png';
import { soundManager as sound } from './sounds';

export class SnakeScene extends Scene {
  constructor(isMobile = false) {
    super({ key: 'SnakeScene' });
    this.state = {
      snake: [],
      food: null,
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 },
      score: 0,
      gameOver: false,
      lastUpdate: 0
    };
    this.particles = [];
    this.currentHue = 0;
    this.snakeHue = 180; // Starting color for snake
    this.foodHue = 0;    // Starting color for food
    this.isMobile = isMobile;
    this.gameSpeed = isMobile ? THEME.animations.snakeSpeed.mobile : THEME.animations.snakeSpeed.desktop;
    this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    this.avatar = new Image();
    this.avatar.src = profile1;
    this.boundKeyHandler = null;
  }

  async create(canvasSize) {
    this.canvasSize = canvasSize;
    this.cellSize = canvasSize.cellSize; // Use the precalculated cell size
    await sound.initialize();
    this.initializeGame();
    this.setupInput();
    this.setupEventListeners();
  }

  initializeGame() {
    const centerX = Math.floor(GAME_CONFIG.gridSize / 2) * this.cellSize;
    const centerY = Math.floor(GAME_CONFIG.gridSize / 2) * this.cellSize;
    
    this.state.snake = [{ x: centerX, y: centerY }];
    this.state.direction = { x: this.cellSize, y: 0 };
    this.state.nextDirection = { x: this.cellSize, y: 0 };
    this.spawnFood();
    this.state.score = 0;
    this.state.gameOver = false;
  }

  setupInput() {
    this.boundKeyHandler = (event) => {
      this.handleKeyPress(event.code);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', this.boundKeyHandler);
  }

  handleKeyPress(key) {
    if (this.state.gameOver) {
      if (key === 'Space' || key === 'Enter') {
        this.initializeGame();
        return;
      }
    }

    const { direction } = this.state;
    const cellSize = this.cellSize;
    
    switch(key) {
      case 'ArrowUp':
        if (direction.y === 0) {
          this.state.nextDirection = { x: 0, y: -cellSize };
        }
        break;
      case 'ArrowDown':
        if (direction.y === 0) {
          this.state.nextDirection = { x: 0, y: cellSize };
        }
        break;
      case 'ArrowLeft':
        if (direction.x === 0) {
          this.state.nextDirection = { x: -cellSize, y: 0 };
        }
        break;
      case 'ArrowRight':
        if (direction.x === 0) {
          this.state.nextDirection = { x: cellSize, y: 0 };
        }
        break;
      case 'Space':
      case 'Enter':
        if (this.state.gameOver) {
          this.initializeGame();
        }
        break;
      default:
        break;
    }
  }

  generateFoodPosition() {
    const x = Math.floor(Math.random() * (this.canvasSize.width / this.cellSize)) * this.cellSize;
    const y = Math.floor(Math.random() * (this.canvasSize.height / this.cellSize)) * this.cellSize;
    return { x, y };
  }

  isValidFoodPosition(food) {
    return !this.state.snake.some(segment => this.isCollision(segment, food));
  }

  spawnFood() {
    let newFood;
    do {
      newFood = this.generateFoodPosition();
    } while (!this.isValidFoodPosition(newFood));
    
    this.state.food = newFood;
  }

  isCollision(pos1, pos2) {
    const tolerance = this.cellSize / 4; // Add some tolerance for collision detection
    return Math.abs(pos1.x - pos2.x) < tolerance && Math.abs(pos1.y - pos2.y) < tolerance;
  }

  createParticles() {
    const { food } = this.state;
    const particleCount = 10;
    const baseHue = this.foodHue; // Use current food hue for particles
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 2;
      const size = 2 + Math.random() * 3;
      
      this.particles.push({
        x: food.x + this.cellSize / 2,
        y: food.y + this.cellSize / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life: 1,
        hue: (baseHue + Math.random() * 30) % 360,
        draw: function() {
          if (this.life <= 0) return;
          
          const ctx = this.game.context;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${this.life})`;
          ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, ${this.life})`;
          ctx.shadowBlur = 5;
          ctx.fillRect(this.x, this.y, this.size, this.size);
          ctx.shadowBlur = 0;
          
          // Update position and life
          this.x += this.vx;
          this.y += this.vy;
          this.life -= 0.05;
        }.bind(this)
      });
    }
  }

  update(time) {
    if (this.state.gameOver) {
      return;
    }

    // Update colors
    this.snakeHue = (this.snakeHue + 0.5) % 360;
    this.foodHue = (this.foodHue + 1) % 360;

    // Check if enough time has passed since last update
    if (time - this.state.lastUpdate < this.gameSpeed) {
      return;
    }
    
    this.state.lastUpdate = time;
    this.moveSnake();
    if (this.checkCollisions()) {
      return;
    }
    this.draw();
    this.updateParticles();
  }

  checkCollisions() {
    const { snake } = this.state;
    const head = snake[0];
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
      if (this.isCollision(head, snake[i])) {
        this.state.gameOver = true;
        sound.playGameOver();
        return true;
      }
    }
    return false;
  }

  moveSnake() {
    const { snake, nextDirection, food } = this.state;
    const head = { ...snake[0] };
    
    this.state.direction = nextDirection;
    head.x += nextDirection.x;
    head.y += nextDirection.y;

    // Wrap around walls
    const width = this.canvasSize.width;
    const height = this.canvasSize.height;
    
    if (head.x >= width) head.x = 0;
    if (head.x < 0) head.x = width - this.cellSize;
    if (head.y >= height) head.y = 0;
    if (head.y < 0) head.y = height - this.cellSize;

    snake.unshift(head);
    
    // Check food collision
    if (this.isCollision(head, food)) {
      // Play food collection sound
      sound.playFoodCollect();
      
      // Increment score
      this.state.score++;
      
      // Create particles
      this.createParticles();
      
      // Spawn new food
      this.spawnFood();
      
      // Update high score
      if (this.state.score > this.highScore) {
        this.highScore = this.state.score;
        localStorage.setItem('snakeHighScore', this.state.score);
      }
      
      // Don't remove tail to grow snake
    } else {
      // Remove tail if no food was eaten
      snake.pop();
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].draw();
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    const { snake, food } = this.state;
    const ctx = this.game.context;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    
    // Draw grid
    this.drawGrid();
    
    // Draw snake with color cycling
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.beginPath();
      
      // Create gradient based on position in snake
      const segmentHue = (this.snakeHue + (index * 5)) % 360;
      const baseColor = `hsl(${segmentHue}, 70%, ${isHead ? 60 : 50}%)`;
      const glowColor = `hsl(${segmentHue}, 80%, 60%)`;
      
      ctx.fillStyle = baseColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isHead ? 15 : 10;
      ctx.fillRect(segment.x, segment.y, this.cellSize - 1, this.cellSize - 1);
    });
    ctx.shadowBlur = 0;
    
    // Draw food if it exists
    if (food) {
      ctx.save();
      
      // Create color overlay
      const foodColor = `hsl(${this.foodHue}, 70%, 50%)`;
      const foodGlow = `hsl(${this.foodHue}, 80%, 60%)`;
      
      // Add glow effect
      ctx.shadowColor = foodGlow;
      ctx.shadowBlur = 15;
      
      // Draw the avatar image
      ctx.drawImage(
        this.avatar,
        food.x,
        food.y,
        this.cellSize - 1,
        this.cellSize - 1
      );
      
      // Add colored overlay
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = foodColor;
      ctx.fillRect(food.x, food.y, this.cellSize - 1, this.cellSize - 1);
      
      // Add pixelation effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      const pixelSize = 2;
      for (let x = 0; x < this.cellSize - 1; x += pixelSize) {
        for (let y = 0; y < this.cellSize - 1; y += pixelSize) {
          if ((x + y) % 4 === 0) {
            ctx.fillRect(food.x + x, food.y + y, pixelSize, pixelSize);
          }
        }
      }
      
      ctx.restore();
    }
    
    // Draw particles
    this.particles.forEach(particle => particle.draw());
  }

  drawGrid() {
    const ctx = this.game.context;
    ctx.strokeStyle = THEME.colors.gridLines;
    ctx.lineWidth = this.isMobile ? 0.5 : 1;
    
    for (let i = 0; i < GAME_CONFIG.gridSize; i++) {
      const pos = i * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, this.canvasSize.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(this.canvasSize.width, pos);
      ctx.stroke();
    }
  }

  updateGridSize() {
    // Recalculate positions based on new cell size
    this.state.snake = this.state.snake.map(segment => ({
      x: Math.round(segment.x / this.cellSize) * this.cellSize,
      y: Math.round(segment.y / this.cellSize) * this.cellSize
    }));

    if (this.state.food) {
      this.state.food = {
        x: Math.round(this.state.food.x / this.cellSize) * this.cellSize,
        y: Math.round(this.state.food.y / this.cellSize) * this.cellSize
      };
    }

    // Ensure snake and food are within bounds
    this.keepInBounds();
  }

  keepInBounds() {
    const maxX = this.canvasSize.width - this.cellSize;
    const maxY = this.canvasSize.height - this.cellSize;

    // Adjust snake segments
    this.state.snake = this.state.snake.map(segment => ({
      x: Math.max(0, Math.min(segment.x, maxX)),
      y: Math.max(0, Math.min(segment.y, maxY))
    }));

    // Adjust food if it exists
    if (this.state.food) {
      this.state.food = {
        x: Math.max(0, Math.min(this.state.food.x, maxX)),
        y: Math.max(0, Math.min(this.state.food.y, maxY))
      };
    }
  }

  setupEventListeners() {
    // Removed keyboard listener setup
  }

  cleanup() {
    // Remove keyboard event listeners
    if (this.boundKeyHandler) {
      document.removeEventListener('keydown', this.boundKeyHandler);
      this.boundKeyHandler = null;
    }

    // Clear game state
    this.state = {
      snake: [],
      food: null,
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 },
      score: 0,
      gameOver: false,
      lastUpdate: 0
    };

    // Clear particles
    this.particles = [];

    // Clear canvas if it exists
    if (this.game && this.game.context && this.canvasSize) {
      this.game.context.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    }

    // Stop any ongoing animations
    if (this.game && this.game.animationFrameId) {
      cancelAnimationFrame(this.game.animationFrameId);
      this.game.animationFrameId = null;
    }
  }
}