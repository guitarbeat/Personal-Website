import { THEME } from './constants';

export class Particle {
  constructor(pos, color, ctx, cellSize) {
    this.pos = { ...pos };
    this.color = color;
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.initialSize = cellSize * THEME.animations.particleSize;
    this.size = this.initialSize;
    this.lifetime = THEME.animations.particleLifetime;
    this.age = 0;
    
    // Calculate speed based on cell size
    const speed = THEME.animations.particleSpeed * (cellSize / 20); // Scale speed with cell size
    this.vel = {
      x: (Math.random() * 2 - 1) * speed,
      y: (Math.random() * 2 - 1) * speed
    };
  }

  draw() {
    const { x, y } = this.pos;
    const alpha = 1 - (this.age / this.lifetime);
    
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = this.size / 2;
    this.ctx.globalCompositeOperation = "lighter";
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(x - this.size/2, y - this.size/2, this.size, this.size);
    this.ctx.restore();
  }

  update(deltaTime) {
    this.age += deltaTime;
    const progress = this.age / this.lifetime;
    this.size = this.initialSize * (1 - progress);
    
    // Apply gravity
    this.vel.y += THEME.animations.particleGravity * deltaTime;
    
    // Update position
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;
    
    this.draw();
  }

  isDead() {
    return this.age >= this.lifetime;
  }
}
