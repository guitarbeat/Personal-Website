// External dependencies
import * as ogl from 'ogl';

// Local imports
import { THEME, GAME_CONFIG, SHADERS } from './constants';
import { Particle } from './Particle';

export class SnakeRenderer {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.lastTime = 0;
    
    this.initRenderer(container);
    this.createGeometry();
    this.createProgram();
  }

  initRenderer(container) {
    const { width, height } = container.getBoundingClientRect();
    
    this.renderer = new ogl.Renderer({
      width,
      height,
      dpr: Math.min(window.devicePixelRatio, 2),
      antialias: true,
      alpha: true
    });
    
    this.gl = this.renderer.gl;
    this.gl.clearColor(...this.hexToRGB(THEME.colors.background), 1);
    container.appendChild(this.gl.canvas);
    
    this.camera = new ogl.Camera(this.gl);
    this.camera.position.z = 5;
    
    this.scene = new ogl.Transform();
  }

  createGeometry() {
    this.geometry = new ogl.Box(this.gl);
  }

  createProgram() {
    this.program = new ogl.Program(this.gl, {
      vertex: SHADERS.vertex,
      fragment: SHADERS.fragment
    });
  }

  hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }

  createParticles(pos, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(pos, color, this.gl.canvas.getContext('2d'), this.cellSize));
    }
  }

  render(snake, food, deltaTime) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Update and render particles
    this.particles = this.particles.filter(particle => {
      particle.update(deltaTime);
      return !particle.isDead();
    });
    
    // Render snake
    snake.forEach((segment, i) => {
      const mesh = new ogl.Mesh(this.gl, {
        geometry: this.geometry,
        program: this.program
      });
      
      mesh.setParent(this.scene);
      mesh.position.set(
        (segment.x / GAME_CONFIG.gridSize) * 2 - 1,
        (segment.y / GAME_CONFIG.gridSize) * 2 - 1,
        0
      );
      mesh.scale.set(1 / GAME_CONFIG.gridSize);
      
      const colors = i === 0 ? THEME.colors.snakeHead.gradient : THEME.colors.snake.gradient;
      const color = colors[i % colors.length];
      mesh.program.uniforms.color.value = this.hexToRGB(color);
    });
    
    // Render food
    if (food) {
      const foodMesh = new ogl.Mesh(this.gl, {
        geometry: this.geometry,
        program: this.program
      });
      
      foodMesh.setParent(this.scene);
      foodMesh.position.set(
        (food.x / GAME_CONFIG.gridSize) * 2 - 1,
        (food.y / GAME_CONFIG.gridSize) * 2 - 1,
        0
      );
      foodMesh.scale.set(1 / GAME_CONFIG.gridSize);
      foodMesh.program.uniforms.color.value = this.hexToRGB(THEME.colors.food.gradient[0]);
    }
    
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  resize(width, height) {
    this.renderer.setSize(width, height);
    this.camera.perspective({
      aspect: width / height
    });
  }

  destroy() {
    this.renderer.destroy();
    this.program.destroy();
    this.geometry.destroy();
  }
}
