// Drop class for Matrix Rain effect
import { MATRIX_COLORS, MATRIX_RAIN, TYPOGRAPHY, ColorUtils } from './constants';

export class Drop {
  constructor(x, canvas, context, performanceMode = 'high', getTrailItem = null, returnTrailItem = null) {
    this.x = x;
    this.y = -100;
    this.canvas = canvas;
    this.context = context;
    this.performanceMode = performanceMode;
    this.char = this.getRandomChar();
    this.changeInterval = Math.random() * 50 + 15;
    this.frame = 0;
    this.brightness = Math.random() > 0.95;
    this.getTrailItem = getTrailItem;
    this.returnTrailItem = returnTrailItem;
    
    // Ultra-lightweight trail length based on performance mode
    let maxTrailLength;
    switch (performanceMode) {
      case 'minimal':
        maxTrailLength = 1;
        break;
      case 'low':
        maxTrailLength = 2;
        break;
      case 'medium':
        maxTrailLength = 3;
        break;
      default: // 'high'
        maxTrailLength = 4;
    }
    
    this.trailLength = Math.floor(Math.random() * maxTrailLength + 1);
    this.trail = [];
    this.initializeProperties();
  }

  getRandomChar() {
    return MATRIX_RAIN.ALPHABET[Math.floor(Math.random() * MATRIX_RAIN.ALPHABET.length)];
  }

  initializeProperties() {
    this.speed = Math.random() * (MATRIX_RAIN.SPEED_RANGE.max - MATRIX_RAIN.SPEED_RANGE.min) + MATRIX_RAIN.SPEED_RANGE.min;
    this.fontSize = Math.floor(Math.random() * (TYPOGRAPHY.FONT_SIZES.MAX - TYPOGRAPHY.FONT_SIZES.MIN) + TYPOGRAPHY.FONT_SIZES.MIN);
    this.opacity = Math.random() * 0.8 + 0.2;
    this.colorIndex = Math.floor(Math.random() * this.getMatrixColorsArray().length);
    
    // Animation properties
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.rotation = (Math.random() - 0.5) * 0.1;
    this.scale = 0.8 + Math.random() * 0.4;
    this.glitchIntensity = Math.random() * 0.1;
  }

  getMatrixColorsArray() {
    return [
      MATRIX_COLORS.GREEN,
      MATRIX_COLORS.DARK_GREEN,
      MATRIX_COLORS.DARKER_GREEN,
      MATRIX_COLORS.DARKEST_GREEN,
      MATRIX_COLORS.BRIGHT_GREEN,
      MATRIX_COLORS.MEDIUM_GREEN,
      MATRIX_COLORS.CYAN_GREEN,
      MATRIX_COLORS.CYAN,
      MATRIX_COLORS.WHITE,
    ];
  }

  update() {
    this.y += this.speed;
    this.frame++;

    // Update trail with object pooling for better performance
    const trailItem = {
      char: this.char,
      y: this.y,
      opacity: this.opacity,
      colorIndex: this.colorIndex,
      brightness: this.brightness
    };

    this.trail.push(trailItem);

    if (this.trail.length > this.trailLength) {
      const removedItem = this.trail.shift();
      // Return to pool if available
      if (this.returnTrailItem) {
        this.returnTrailItem(removedItem);
      }
    }

    if (this.frame >= this.changeInterval) {
      this.char = this.getRandomChar();
      this.frame = 0;
      this.brightness = Math.random() > MATRIX_RAIN.BRIGHTNESS_CHANCE;
      this.colorIndex = Math.floor(Math.random() * this.getMatrixColorsArray().length);
    }

    if (this.y * this.fontSize > this.canvas.height) {
      this.y = -100 / this.fontSize;
      this.initializeProperties();
      // Clear trail more efficiently and return items to pool
      if (this.returnTrailItem) {
        this.trail.forEach(item => this.returnTrailItem(item));
      }
      this.trail.length = 0;
    }
  }

  draw() {
    const context = this.context;
    const MATRIX_COLORS_ARRAY = this.getMatrixColorsArray();
    
    // Set font once for all operations
    context.font = `${this.fontSize}px monospace`;

    // Ultra-lightweight trail rendering based on performance mode
    if (this.performanceMode !== 'minimal' && this.trail.length > 0) {
      this.trail.forEach((trailItem, index) => {
        const trailOpacity = (index / this.trail.length) * this.opacity * 0.2;
        const color = MATRIX_COLORS_ARRAY[trailItem.colorIndex || this.colorIndex];
        
        // Ultra-simplified rendering
        context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, trailOpacity));
        context.fillText(trailItem.char, this.x, trailItem.y * this.fontSize);
      });
    }

    // Ultra-lightweight main character rendering
    const color = MATRIX_COLORS_ARRAY[this.colorIndex];
    
    if (this.brightness) {
      context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(MATRIX_COLORS.WHITE, this.opacity));
    } else {
      context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, this.opacity));
    }
    
    context.fillText(this.char, this.x, this.y * this.fontSize);
  }
}