// Drop class for Matrix Rain effect
import {
  ColorUtils,
  MATRIX_COLORS,
  MATRIX_RAIN,
  TYPOGRAPHY,
} from "./constants";

export class Drop {
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  performanceMode: string;
  char: string;
  changeInterval: number;
  frame: number;
  brightness: boolean;
  getTrailItem: (() => any) | null;
  returnTrailItem: ((item: any) => void) | null;
  trailLength: number;
  trail: any[];
  speed!: number;
  fontSize!: number;
  opacity!: number;
  colorIndex!: number;
  pulsePhase!: number;
  rotation!: number;
  scale!: number;
  glitchIntensity!: number;
  energyLevel!: number;
  colorShiftSpeed!: number;

  constructor(
    x: number,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    performanceMode: string = "high",
    getTrailItem: (() => any) | null = null,
    returnTrailItem: ((item: any) => void) | null = null,
  ) {
    this.x = x;
    this.y = -100;
    this.canvas = canvas;
    this.context = context;
    this.performanceMode = performanceMode;
    this.char = this.getRandomChar();
    this.changeInterval = Math.random() * 100 + 50; // Slower character changes
    this.frame = 0;
    this.brightness = Math.random() > 0.95;
    this.getTrailItem = getTrailItem;
    this.returnTrailItem = returnTrailItem;

    // Ultra-lightweight trail length based on performance mode
    let maxTrailLength: number;
    switch (performanceMode) {
      case "minimal":
        maxTrailLength = 1;
        break;
      case "low":
        maxTrailLength = 2;
        break;
      case "medium":
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
    return MATRIX_RAIN.ALPHABET[
      Math.floor(Math.random() * MATRIX_RAIN.ALPHABET.length)
    ];
  }

  initializeProperties() {
    this.speed =
      Math.random() *
      (MATRIX_RAIN.SPEED_RANGE.max - MATRIX_RAIN.SPEED_RANGE.min) +
      MATRIX_RAIN.SPEED_RANGE.min;
    this.fontSize = Math.floor(
      Math.random() * (TYPOGRAPHY.FONT_SIZES.MAX - TYPOGRAPHY.FONT_SIZES.MIN) +
      TYPOGRAPHY.FONT_SIZES.MIN,
    );
    this.opacity = Math.random() * 0.8 + 0.2;
    this.colorIndex = Math.floor(
      Math.random() * this.getMatrixColorsArray().length,
    );

    // Simplified animation properties - removed complex effects
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.rotation = 0; // Disabled rotation for simplicity
    this.scale = 1; // Fixed scale for simplicity
    this.glitchIntensity = Math.random() * 0.05; // Reduced glitch frequency

    // Removed complex effects: wave distortion, holographic, particle trails
    this.energyLevel = Math.random();
    this.colorShiftSpeed = Math.random() * 0.02 + 0.005; // Slower color changes
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

    // Simplified update - removed complex effects
    this.pulsePhase += 0.05; // Slower pulse
    this.colorShiftSpeed += 0.0005; // Much slower color changes

    // Update color shifting (simplified)
    this.colorIndex =
      (this.colorIndex + this.colorShiftSpeed) %
      this.getMatrixColorsArray().length;

    // Simplified trail update
    const trailItem = {
      char: this.char,
      y: this.y,
      opacity: this.opacity,
      colorIndex: this.colorIndex,
      brightness: this.brightness,
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
      this.colorIndex = Math.floor(
        Math.random() * this.getMatrixColorsArray().length,
      );
    }

    if (this.y * this.fontSize > this.canvas.height) {
      this.y = -100 / this.fontSize;
      this.initializeProperties();
      // Clear trail more efficiently and return items to pool
      if (this.returnTrailItem) {
        for (const item of this.trail) {
          this.returnTrailItem(item);
        }
      }
      this.trail.length = 0;
    }
  }

  draw() {
    const context = this.context;
    const MATRIX_COLORS_ARRAY = this.getMatrixColorsArray();

    // Set font once for all operations
    context.font = `${this.fontSize}px monospace`;

    // Simplified trail rendering - removed complex effects
    if (this.performanceMode !== "minimal" && this.trail.length > 0) {
      for (let index = 0; index < this.trail.length; index += 1) {
        const trailItem = this.trail[index];
        const trailOpacity = (index / this.trail.length) * this.opacity * 0.2; // Reduced opacity
        const color =
          MATRIX_COLORS_ARRAY[
          Math.floor(trailItem.colorIndex || this.colorIndex) %
          MATRIX_COLORS_ARRAY.length
          ];

        context.fillStyle = ColorUtils.toRGBA(
          ColorUtils.withAlpha(color, trailOpacity),
        );
        context.fillText(trailItem.char, this.x, trailItem.y * this.fontSize);
      }
    }

    // Simplified main character rendering
    const color =
      MATRIX_COLORS_ARRAY[
      Math.floor(this.colorIndex) % MATRIX_COLORS_ARRAY.length
      ];
    const finalX = this.x;
    const finalY = this.y * this.fontSize;

    // Simplified pulsing effect
    const pulseIntensity = Math.sin(this.pulsePhase) * 0.1 + 0.9; // Reduced intensity
    const finalOpacity = this.opacity * pulseIntensity;

    // Rare glitch effect
    if (Math.random() < this.glitchIntensity) {
      context.fillStyle = ColorUtils.toRGBA(
        ColorUtils.withAlpha(MATRIX_COLORS.CYAN, finalOpacity * 0.8),
      );
      context.fillText(
        this.char,
        finalX + (Math.random() - 0.5) * 1,
        finalY + (Math.random() - 0.5) * 1,
      );
    }

    if (this.brightness) {
      context.fillStyle = ColorUtils.toRGBA(
        ColorUtils.withAlpha(MATRIX_COLORS.WHITE, finalOpacity),
      );
    } else {
      context.fillStyle = ColorUtils.toRGBA(
        ColorUtils.withAlpha(color, finalOpacity),
      );
    }

    // Simple character rendering - no rotation or scaling
    context.fillText(this.char, finalX, finalY);
  }
}
