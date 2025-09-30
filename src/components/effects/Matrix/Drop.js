// Drop class for Matrix Rain effect
import { MATRIX_COLORS, MATRIX_RAIN, TYPOGRAPHY, ColorUtils } from './constants';

export class Drop {
  constructor(x, canvas, context, performanceMode = 'high') {
    this.x = x;
    this.y = -100;
    this.canvas = canvas;
    this.context = context;
    this.performanceMode = performanceMode;
    this.char = this.getRandomChar();
    this.changeInterval = Math.random() * 50 + 15;
    this.frame = 0;
    this.brightness = Math.random() > 0.95;
    this.trailLength = Math.floor(
      Math.random() * (MATRIX_RAIN.TRAIL_LENGTH_RANGE.max - MATRIX_RAIN.TRAIL_LENGTH_RANGE.min) + 
      MATRIX_RAIN.TRAIL_LENGTH_RANGE.min
    );
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

    // Update trail
    this.trail.push({
      char: this.char,
      y: this.y,
      opacity: this.opacity,
      colorIndex: this.colorIndex,
      brightness: this.brightness
    });

    if (this.trail.length > this.trailLength) {
      this.trail.shift();
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
      this.trail = [];
    }
  }

  draw() {
    const context = this.context;
    const MATRIX_COLORS_ARRAY = this.getMatrixColorsArray();
    
    context.save();
    context.font = `${this.fontSize}px monospace`;

    // Draw trail (simplified for performance)
    this.trail.forEach((trailItem, index) => {
      const trailOpacity = (index / this.trail.length) * this.opacity * 0.4;
      const color = MATRIX_COLORS_ARRAY[trailItem.colorIndex || this.colorIndex];
      
      // Simplified rendering for low-end devices
      if (this.performanceMode === 'low') {
        context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, trailOpacity));
        context.fillText(trailItem.char, this.x, trailItem.y * this.fontSize);
      } else {
        const pulseEffect = Math.sin(this.pulsePhase + index * 0.5) * 0.1 + 0.9;

        // Create radial gradient for trail (only on high-end devices)
        const gradient = context.createRadialGradient(
          this.x, trailItem.y * this.fontSize + this.fontSize / 2,
          0,
          this.x, trailItem.y * this.fontSize + this.fontSize / 2,
          this.fontSize * 2
        );

        gradient.addColorStop(0, ColorUtils.toRGBA(ColorUtils.withAlpha(color, trailOpacity * pulseEffect)));
        gradient.addColorStop(0.5, ColorUtils.toRGBA(ColorUtils.withAlpha({ 
          ...color, 
          r: color.r * 0.7, 
          g: color.g * 0.7, 
          b: color.b * 0.7 
        }, trailOpacity * 0.6 * pulseEffect)));
        gradient.addColorStop(1, ColorUtils.toRGBA(ColorUtils.withAlpha({ 
          ...color, 
          r: color.r * 0.3, 
          g: color.g * 0.3, 
          b: color.b * 0.3 
        }, 0)));

        context.fillStyle = gradient;
        context.shadowColor = ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0.3));
        context.shadowBlur = 2 + index * 0.5;

        // Apply rotation and scale to trail
        context.save();
        context.translate(this.x, trailItem.y * this.fontSize);
        context.rotate(this.rotation * (1 - index / this.trail.length));
        context.scale(this.scale, this.scale);
        context.fillText(trailItem.char, 0, 0);
        context.restore();
      }
    });

    // Draw main character (simplified for performance)
    const color = MATRIX_COLORS_ARRAY[this.colorIndex];
    const pulseEffect = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    const currentOpacity = this.opacity * pulseEffect;

    // Simplified rendering for low-end devices
    if (this.performanceMode === 'low') {
      if (this.brightness) {
        context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(MATRIX_COLORS.WHITE, this.opacity));
      } else {
        context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, this.opacity));
      }
      context.fillText(this.char, this.x, this.y * this.fontSize);
    } else {
      // Add glitch effect to character (only on high-end devices)
      const glitchX = Math.random() < this.glitchIntensity ? (Math.random() - 0.5) * 3 : 0;
      const glitchY = Math.random() < this.glitchIntensity ? (Math.random() - 0.5) * 3 : 0;

      // Create enhanced gradient with more dramatic colors
      const gradient = context.createLinearGradient(
        this.x - this.fontSize + glitchX,
        this.y * this.fontSize + glitchY,
        this.x + this.fontSize + glitchX,
        this.y * this.fontSize + this.fontSize + glitchY,
      );

      gradient.addColorStop(0, ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0)));
      gradient.addColorStop(0.2, ColorUtils.toRGBA(ColorUtils.withAlpha(color, currentOpacity * 0.3)));
      gradient.addColorStop(0.5, ColorUtils.toRGBA(ColorUtils.withAlpha(color, currentOpacity * 0.8)));
      gradient.addColorStop(0.8, ColorUtils.toRGBA(ColorUtils.withAlpha(color, currentOpacity)));
      gradient.addColorStop(1, ColorUtils.toRGBA(ColorUtils.withAlpha({ 
        ...color, 
        r: color.r * 0.4, 
        g: color.g * 0.4, 
        b: color.b * 0.4 
      }, currentOpacity * 0.6)));

      if (this.brightness) {
        context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(MATRIX_COLORS.WHITE, this.opacity));
        context.shadowColor = ColorUtils.toRGBA(MATRIX_COLORS.WHITE);
        context.shadowBlur = 10;
      } else {
        context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, this.opacity));
        context.shadowColor = ColorUtils.toRGBA(ColorUtils.withAlpha(color, 0.5));
        context.shadowBlur = 3;
      }

      context.fillText(this.char, this.x, this.y * this.fontSize);
    }
    
    context.restore();
  }
}