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
    
    // Enhanced animation properties
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.rotation = (Math.random() - 0.5) * 0.2;
    this.scale = 0.8 + Math.random() * 0.4;
    this.glitchIntensity = Math.random() * 0.15;
    
    // New dynamic effects
    this.wavePhase = Math.random() * Math.PI * 2;
    this.waveAmplitude = Math.random() * 5 + 2;
    this.waveFrequency = Math.random() * 0.02 + 0.01;
    this.holographicPhase = Math.random() * Math.PI * 2;
    this.energyLevel = Math.random();
    this.distortionPhase = Math.random() * Math.PI * 2;
    this.colorShiftSpeed = Math.random() * 0.05 + 0.01;
    this.particleTrail = [];
    this.maxParticleTrail = 3;
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

    // Update dynamic effects
    this.pulsePhase += 0.1;
    this.wavePhase += this.waveFrequency;
    this.holographicPhase += 0.05;
    this.distortionPhase += 0.03;
    this.colorShiftSpeed += 0.001;

    // Update wave distortion
    this.waveOffset = Math.sin(this.wavePhase) * this.waveAmplitude;

    // Update holographic effect
    this.holographicIntensity = Math.sin(this.holographicPhase) * 0.3 + 0.7;

    // Update color shifting
    this.colorIndex = (this.colorIndex + this.colorShiftSpeed) % this.getMatrixColorsArray().length;

    // Update particle trail
    if (this.performanceMode === 'high' && Math.random() < 0.3) {
      this.particleTrail.push({
        x: this.x + this.waveOffset + (Math.random() - 0.5) * 10,
        y: this.y * this.fontSize + (Math.random() - 0.5) * 5,
        opacity: Math.random() * 0.5,
        size: Math.random() * 2 + 1,
        life: 1.0
      });

      if (this.particleTrail.length > this.maxParticleTrail) {
        this.particleTrail.shift();
      }
    }

    // Update particle trail life
    this.particleTrail.forEach(particle => {
      particle.life -= 0.05;
      particle.opacity *= 0.95;
    });

    // Remove dead particles
    this.particleTrail = this.particleTrail.filter(particle => particle.life > 0);

    // Update trail with object pooling for better performance
    const trailItem = {
      char: this.char,
      y: this.y,
      opacity: this.opacity,
      colorIndex: this.colorIndex,
      brightness: this.brightness,
      waveOffset: this.waveOffset,
      holographicIntensity: this.holographicIntensity
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
      this.particleTrail = [];
    }
  }

  draw() {
    const context = this.context;
    const MATRIX_COLORS_ARRAY = this.getMatrixColorsArray();
    
    // Set font once for all operations
    context.font = `${this.fontSize}px monospace`;

    // Draw particle trail for high performance mode
    if (this.performanceMode === 'high' && this.particleTrail.length > 0) {
      this.particleTrail.forEach(particle => {
        context.fillStyle = `rgba(0, 255, 255, ${particle.opacity * particle.life})`;
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
      });
    }

    // Enhanced trail rendering with wave distortion
    if (this.performanceMode !== 'minimal' && this.trail.length > 0) {
      this.trail.forEach((trailItem, index) => {
        const trailOpacity = (index / this.trail.length) * this.opacity * 0.3;
        const color = MATRIX_COLORS_ARRAY[Math.floor(trailItem.colorIndex || this.colorIndex) % MATRIX_COLORS_ARRAY.length];
        
        // Apply wave distortion to trail
        const trailX = this.x + (trailItem.waveOffset || 0);
        const trailY = trailItem.y * this.fontSize;
        
        // Apply holographic effect
        const holographicMultiplier = trailItem.holographicIntensity || 1;
        const finalOpacity = trailOpacity * holographicMultiplier;
        
        context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, finalOpacity));
        context.fillText(trailItem.char, trailX, trailY);
      });
    }

    // Enhanced main character rendering with dynamic effects
    const color = MATRIX_COLORS_ARRAY[Math.floor(this.colorIndex) % MATRIX_COLORS_ARRAY.length];
    const finalX = this.x + this.waveOffset;
    const finalY = this.y * this.fontSize;
    
    // Apply pulsing effect
    const pulseIntensity = Math.sin(this.pulsePhase) * 0.2 + 0.8;
    const finalOpacity = this.opacity * pulseIntensity * this.holographicIntensity;
    
    // Apply glitch effect occasionally
    if (Math.random() < this.glitchIntensity) {
      context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(MATRIX_COLORS.CYAN, finalOpacity * 0.8));
      context.fillText(this.char, finalX + (Math.random() - 0.5) * 2, finalY + (Math.random() - 0.5) * 2);
    }
    
    if (this.brightness) {
      context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(MATRIX_COLORS.WHITE, finalOpacity));
    } else {
      context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, finalOpacity));
    }
    
    // Apply rotation and scale for high performance mode
    if (this.performanceMode === 'high') {
      context.save();
      context.translate(finalX, finalY);
      context.rotate(this.rotation);
      context.scale(this.scale, this.scale);
      context.fillText(this.char, 0, 0);
      context.restore();
    } else {
      context.fillText(this.char, finalX, finalY);
    }
    
    // Add energy glow effect for high energy drops
    if (this.energyLevel > 0.8 && this.performanceMode === 'high') {
      context.shadowColor = ColorUtils.toRGBA(color);
      context.shadowBlur = 5;
      context.fillStyle = ColorUtils.toRGBA(ColorUtils.withAlpha(color, finalOpacity * 0.3));
      context.fillText(this.char, finalX, finalY);
      context.shadowBlur = 0;
    }
  }
}