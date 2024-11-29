import { Scene } from 'phaser';

// Constants
const GRID_SIZE = 20;
const GAME_SPEED = 85;  // Slightly faster for better responsiveness
const COLORS = {
  SNAKE_HEAD: 0x7AA2F7,  // Bright blue for head
  SNAKE_BODY: 0x9ECE6A,  // Green for body
  FOOD: 0xF7768E,       // Pink for food
  GRID: 0x24283B,       // Dark blue for grid
  BACKGROUND: 0x1A1B26  // Dark background
};

export class SnakeScene extends Scene {
  constructor() {
    super({ key: 'SnakeScene' });
    this.highScores = [];
  }

  init() {
    this.snake = [];
    this.food = null;
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.score = 0;
    this.gameOver = false;
    this.lastUpdate = 0;
    this.fetchHighScores();
  }

  preload() {
    // Ensure the scene is ready for rendering
    this.load.on('complete', () => {
      console.log('Scene assets loaded');
    });
  }

  create() {
    try {
      // Set background color
      this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);
      
      this.initializeGame();
      this.setupControls();
      this.createInitialSnake();
      this.spawnFood();
      
      // Initialize graphics objects
      this.snakeGraphics = this.add.graphics();
      this.gridGraphics = this.add.graphics();
      
      // Draw grid
      this.drawGrid();
      
      // Create score text with shadow
      this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '16px',
        fill: '#fff',
        padding: { x: 1, y: 1 },
      }).setShadow(2, 2, '#000000', 2, true, true);
      
      // Handle window resize
      window.addEventListener('resize', this.handleResize.bind(this));
    } catch (error) {
      console.error('Error in scene creation:', error);
    }
  }

  handleResize() {
    if (!this.sys.game) return;

    const canvas = this.sys.game.canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Calculate the size that maintains aspect ratio
    const size = Math.min(width, height);
    const gridDimension = Math.floor(size / GRID_SIZE) * GRID_SIZE;

    // Update game size
    this.scale.resize(gridDimension, gridDimension);
    
    // Recreate grid with new dimensions
    this.createGrid(gridDimension, gridDimension);
    
    // Update camera
    this.cameras.main.centerOn(gridDimension / 2, gridDimension / 2);
  }

  initializeGame() {
    const canvas = this.sys.game.canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Calculate the size that maintains aspect ratio
    const size = Math.min(width, height);
    const gridDimension = Math.floor(size / GRID_SIZE) * GRID_SIZE;

    // Set initial game size
    this.scale.resize(gridDimension, gridDimension);
    
    this.gridWidth = Math.floor(gridDimension / GRID_SIZE);
    this.gridHeight = this.gridWidth; // Keep it square
    
    // Create grid background with transparency
    this.createGrid(gridDimension, gridDimension);
    
    // Initialize score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '16px',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 4
    }).setScrollFactor(0).setDepth(1);
  }

  createGrid(width, height) {
    // Clear existing grid if any
    if (this.gridGraphics) {
      this.gridGraphics.destroy();
    }

    this.gridGraphics = this.add.graphics();
    this.gridGraphics.lineStyle(1, COLORS.GRID, 0.3);
    
    // Draw vertical lines
    for (let x = 0; x <= this.gridWidth; x++) {
      const xPos = x * GRID_SIZE;
      this.gridGraphics.beginPath();
      this.gridGraphics.moveTo(xPos, 0);
      this.gridGraphics.lineTo(xPos, height);
      this.gridGraphics.strokePath();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= this.gridHeight; y++) {
      const yPos = y * GRID_SIZE;
      this.gridGraphics.beginPath();
      this.gridGraphics.moveTo(0, yPos);
      this.gridGraphics.lineTo(width, yPos);
      this.gridGraphics.strokePath();
    }
  }

  drawGrid() {
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, COLORS.GRID, 0.3);
    
    // Draw vertical lines
    for (let x = 0; x <= this.gridWidth; x++) {
      this.gridGraphics.beginPath();
      this.gridGraphics.moveTo(x * GRID_SIZE, 0);
      this.gridGraphics.lineTo(x * GRID_SIZE, this.gridHeight * GRID_SIZE);
      this.gridGraphics.strokePath();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= this.gridHeight; y++) {
      this.gridGraphics.beginPath();
      this.gridGraphics.moveTo(0, y * GRID_SIZE);
      this.gridGraphics.lineTo(this.gridWidth * GRID_SIZE, y * GRID_SIZE);
      this.gridGraphics.strokePath();
    }
  }

  setupControls() {
    // Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Touch controls
    this.input.on('pointerdown', (pointer) => {
      const centerX = this.game.config.width / 2;
      const centerY = this.game.config.height / 2;
      
      // Determine swipe direction based on touch position
      if (Math.abs(pointer.x - centerX) > Math.abs(pointer.y - centerY)) {
        // Horizontal movement
        if (pointer.x > centerX && this.direction !== 'LEFT') {
          this.nextDirection = 'RIGHT';
        } else if (pointer.x < centerX && this.direction !== 'RIGHT') {
          this.nextDirection = 'LEFT';
        }
      } else {
        // Vertical movement
        if (pointer.y > centerY && this.direction !== 'UP') {
          this.nextDirection = 'DOWN';
        } else if (pointer.y < centerY && this.direction !== 'DOWN') {
          this.nextDirection = 'UP';
        }
      }
    });
  }

  createInitialSnake() {
    const startX = Math.floor(this.gridWidth / 4);
    const startY = Math.floor(this.gridHeight / 2);
    
    // Initialize snake segments array with positions
    this.snake = [
      { x: startX * GRID_SIZE, y: startY * GRID_SIZE },
      { x: (startX - 1) * GRID_SIZE, y: startY * GRID_SIZE },
      { x: (startX - 2) * GRID_SIZE, y: startY * GRID_SIZE }
    ];
    
    // Initialize graphics object for snake
    this.snakeGraphics = this.add.graphics();
    
    // Draw initial snake
    this.drawSnake();
  }

  spawnFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.gridWidth) * GRID_SIZE;
      y = Math.floor(Math.random() * this.gridHeight) * GRID_SIZE;
    } while (this.isPositionOccupied(x, y));
    
    if (this.food) {
      this.food.destroy();
    }
    
    // Create food with pulsing effect
    this.food = this.add.rectangle(
      x + GRID_SIZE / 2,
      y + GRID_SIZE / 2,
      GRID_SIZE - 2,
      GRID_SIZE - 2,
      COLORS.FOOD
    );
    
    // Add pulsing animation
    this.tweens.add({
      targets: this.food,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  isPositionOccupied(x, y) {
    return this.snake.some(segment => 
      Math.floor(segment.x) === Math.floor(x) && 
      Math.floor(segment.y) === Math.floor(y)
    );
  }

  update(time) {
    if (this.gameOver) return;

    // Only update at fixed time intervals
    if (time - this.lastUpdate > GAME_SPEED) {
      this.lastUpdate = time;

      // Get current head position
      const currentHead = { ...this.snake[0] };
      let newX = currentHead.x;
      let newY = currentHead.y;
      
      // Calculate new head position
      switch (this.direction) {
        case 'UP':
          newY = ((Math.floor(newY / GRID_SIZE) - 1 + this.gridHeight) % this.gridHeight) * GRID_SIZE;
          break;
        case 'DOWN':
          newY = ((Math.floor(newY / GRID_SIZE) + 1) % this.gridHeight) * GRID_SIZE;
          break;
        case 'LEFT':
          newX = ((Math.floor(newX / GRID_SIZE) - 1 + this.gridWidth) % this.gridWidth) * GRID_SIZE;
          break;
        case 'RIGHT':
          newX = ((Math.floor(newX / GRID_SIZE) + 1) % this.gridWidth) * GRID_SIZE;
          break;
        default:
          console.warn('Invalid direction:', this.direction);
          break;
      }

      // Create new head position
      const newHead = { x: newX, y: newY };

      // Check for collision with self
      if (this.checkCollision(newHead)) {
        this.handleGameOver();
        return;
      }

      // Update direction for next move
      this.direction = this.nextDirection;

      // Check for food collision
      const foodX = Math.floor(this.food.x / GRID_SIZE) * GRID_SIZE;
      const foodY = Math.floor(this.food.y / GRID_SIZE) * GRID_SIZE;
      
      if (newX === foodX && newY === foodY) {
        // Increase score
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Spawn new food
        this.spawnFood();
      } else {
        // Remove tail if no food was eaten
        this.snake.pop();
      }

      // Add new head
      this.snake.unshift(newHead);

      // Redraw snake
      this.drawSnake();
    }
  }

  handleInput() {
    if (this.cursors.left.isDown && this.direction !== 'RIGHT') {
      this.nextDirection = 'LEFT';
    } else if (this.cursors.right.isDown && this.direction !== 'LEFT') {
      this.nextDirection = 'RIGHT';
    } else if (this.cursors.up.isDown && this.direction !== 'DOWN') {
      this.nextDirection = 'UP';
    } else if (this.cursors.down.isDown && this.direction !== 'UP') {
      this.nextDirection = 'DOWN';
    }
  }

  drawSnake() {
    this.snakeGraphics.clear();
    
    // Draw snake body with gradient effect
    this.snake.forEach((segment, index) => {
      const isHead = index === 0;
      const color = isHead ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY;
      const size = isHead ? GRID_SIZE - 1 : GRID_SIZE - 2;
      
      // Add glow effect for head
      if (isHead) {
        this.snakeGraphics.fillStyle(color, 0.3);
        this.snakeGraphics.fillRect(
          segment.x - 1,
          segment.y - 1,
          GRID_SIZE + 2,
          GRID_SIZE + 2
        );
      }
      
      // Draw main segment
      this.snakeGraphics.fillStyle(color);
      this.snakeGraphics.fillRect(
        segment.x + (GRID_SIZE - size) / 2,
        segment.y + (GRID_SIZE - size) / 2,
        size,
        size
      );
    });
  }

  checkCollision(newHead) {
    // Check collision with snake body (skip the tail since it will move)
    return this.snake.slice(0, -1).some(segment => 
      Math.floor(segment.x) === Math.floor(newHead.x) && 
      Math.floor(segment.y) === Math.floor(newHead.y)
    );
  }

  handleGameOver() {
    this.gameOver = true;
    
    // Flash effect on game over
    this.cameras.main.flash(500, 255, 0, 0, true);
    
    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;
    
    // Create semi-transparent overlay with fade
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, this.game.config.width, this.game.config.height);
    
    this.tweens.add({
      targets: overlay,
      fillAlpha: 0.7,
      duration: 500,
      ease: 'Power2'
    });
    
    // Create game over container
    const gameOverContainer = this.add.container(centerX, centerY);
    
    // Add game over text with animation
    const gameOverText = this.add.text(0, -80, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '32px',
      fill: '#ff0000',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);
    
    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });
    
    // Add final score text
    const finalScoreText = this.add.text(0, -20, `Final Score: ${this.score}`, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '16px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Add name input prompt
    const promptText = this.add.text(0, 20, 'Enter your name:', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '16px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Create name input zone
    const inputZone = this.add.rectangle(0, 60, 200, 30, 0x333333);
    const nameText = this.add.text(-95, 50, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      fill: '#fff'
    });
    
    // Add all elements to container
    gameOverContainer.add([gameOverText, finalScoreText, promptText, inputZone, nameText]);
    
    // Handle keyboard input
    let playerName = '';
    const keyboardHandler = (event) => {
      if (!this.gameOver) return;

      if (event.key === 'Backspace' && playerName.length > 0) {
        // Handle backspace
        playerName = playerName.slice(0, -1);
      } else if (event.key === 'Enter' && playerName.length > 0) {
        // Handle enter
        this.input.keyboard.off('keydown', keyboardHandler);
        this.submitHighScore(playerName);
        return;
      } else if (event.key === 'Escape') {
        // Handle escape to skip
        this.input.keyboard.off('keydown', keyboardHandler);
        this.scene.restart();
        return;
      } else if (event.key.length === 1 && playerName.length < 10 && 
                /[a-zA-Z0-9 ]/.test(event.key)) {
        // Handle regular character input (letters, numbers, and space)
        playerName += event.key.toUpperCase();
      }
      nameText.setText(playerName);
    };

    // Add keyboard listener
    this.input.keyboard.on('keydown', keyboardHandler);
    
    // Add instruction text
    const instructionText = this.add.text(0, 100, [
      'ENTER - Submit',
      'ESC - Skip',
      'Backspace - Delete'
    ].join('\n'), {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    
    gameOverContainer.add(instructionText);
  }

  async submitHighScore(playerName) {
    try {
      const { makeApiCall } = await import('../../../config/googleApps');
      const response = await makeApiCall('updateSheetData', {
        tabName: 'SNAKE',
        playerName: playerName,
        score: this.score
      });
      
      if (response.success) {
        this.highScores = response.topScores.slice(0, 5);
        this.updateHighScoreDisplay();
        
        // Show success message and add it to the scene
        const successText = this.add.text(
          this.game.config.width / 2,
          this.game.config.height / 2 + 150,
          `Rank #${response.rank}!\nPress SPACE to restart`,
          {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            fill: '#00ff00',
            align: 'center'
          }
        ).setOrigin(0.5);
        
        // Fade out success text
        this.tweens.add({
          targets: successText,
          alpha: { from: 1, to: 0 },
          duration: 2000,
          ease: 'Power2',
          onComplete: () => {
            successText.destroy();
          }
        });
        
        // Add restart handler
        this.input.keyboard.once('keydown-SPACE', () => {
          this.scene.restart();
        });
      }
    } catch (error) {
      console.error('Error submitting high score:', error);
    }
  }

  async fetchHighScores() {
    try {
      const { makeApiCall } = await import('../../../config/googleApps');
      const response = await makeApiCall('getSheetData', { tabName: 'SNAKE' });
      if (response.success) {
        this.highScores = response.data.slice(0, 5); // Get top 5 scores
        this.updateHighScoreDisplay();
      }
    } catch (error) {
      console.error('Error fetching high scores:', error);
    }
  }

  createHighScoreDisplay() {
    // Create high score panel background
    const width = 200;
    const height = 150;
    const x = this.game.config.width - width - 16;
    const y = 16;

    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.HIGHSCORE_BG, 0.7);
    graphics.fillRect(x, y, width, height);

    // Add high score title
    this.add.text(x + 10, y + 10, 'HIGH SCORES', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      fill: '#fff'
    });

    // Create container for score texts
    this.highScoreTexts = [];
    for (let i = 0; i < 5; i++) {
      const scoreText = this.add.text(x + 10, y + 35 + (i * 22), '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        fill: '#fff'
      });
      this.highScoreTexts.push(scoreText);
    }

    this.updateHighScoreDisplay();
  }

  updateHighScoreDisplay() {
    if (!this.highScoreTexts) return;

    this.highScoreTexts.forEach((text, index) => {
      const score = this.highScores[index];
      if (score) {
        text.setText(`${index + 1}. ${score.name}: ${score.score}`);
      } else {
        text.setText(`${index + 1}. ---`);
      }
    });
  }
}