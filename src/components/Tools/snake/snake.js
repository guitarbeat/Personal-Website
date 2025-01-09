import React, { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";
import profile1 from "../../../assets/images/profile1-nbg.png";
import FullscreenWrapper from "../FullscreenWrapper";

// Import Press Start 2P font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
	"https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
document.head.appendChild(fontLink);

// Theme configuration
const THEME = {
	colors: {
		background: "rgba(10, 10, 15, 0.8)",
		snake: {
			gradient: ["#7AA2F7", "#7DCFFF", "#2AC3DE"],
			glow: "#7AA2F7",
		},
		snakeHead: {
			gradient: ["#BB9AF7", "#9D7CD8"],
			glow: "#BB9AF7",
		},
		food: {
			gradient: ["#F7768E", "#FF9E64"],
			glow: "#F7768E",
		},
		border: "#24283B",
		gridLines: "rgba(255, 255, 255, 0.05)",
		text: "#A9B1D6",
		gameOver: "#F7768E",
		scoreBackground: "rgba(26, 27, 38, 0.9)",
		highScore: "#9ECE6A",
	},
	dimensions: {
		minTileSize: 15,
		maxTileSize: 30,
		borderRadius: 4,
		gridLineWidth: 1,
		shadowBlur: 20,
		glowRadius: 30,
	},
	animations: {
		snakeSpeed: {
			mobile: 120,
			desktop: 100,
		},
		fadeSpeed: 400,
		growthFactor: 1.15,
		foodPulseSpeed: 1800,
		foodPulseScale: 1.18,
		snakeGlowIntensity: 0.8,
		shadowPulseSpeed: 200,
		particleCount: 10,
		particleLifetime: 1000,
		particleSpeed: 2,
	},
};

// Game configuration
const GAME_CONFIG = {
	gridSize: 20,
	initialSnakeLength: 3,
	growthRate: 1,
	maxHighScores: 5,
	controls: {
		up: ["ArrowUp", "w", "W"],
		down: ["ArrowDown", "s", "S"],
		left: ["ArrowLeft", "a", "A"],
		right: ["ArrowRight", "d", "D"],
		pause: ["Space", "p", "P"],
		restart: ["r", "R"],
	},
	touch: {
		minDistance: 20,
		maxTime: 400,
		mobileBreakpoint: 768,
		resizeDebounce: 250,
	},
};

// Sound configuration
const SOUND_CONFIG = {
	volumes: {
		food: -10,
		gameOver: -15,
		move: -20,
		muted: Number.NEGATIVE_INFINITY,
	},
	notes: {
		food: "C5",
		gameOver: ["C4", "G3", "E3", "C3"],
		move: "G4",
	},
};

// Helper functions
const getCanvasSize = (containerWidth, containerHeight) => {
	const { minTileSize, maxTileSize } = THEME.dimensions;
	const { gridSize } = GAME_CONFIG;
	const maxPossibleCellSize = Math.min(
		Math.floor(containerWidth / gridSize),
		Math.floor(containerHeight / gridSize),
	);
	const cellSize = Math.max(
		minTileSize,
		Math.min(maxPossibleCellSize, maxTileSize),
	);
	return {
		width: cellSize * gridSize,
		height: cellSize * gridSize,
		cellSize: cellSize,
	};
};

// Sound Manager
class SoundManager {
	constructor() {
		this.foodSynth = new Tone.Synth({
			oscillator: { type: "sine" },
			envelope: {
				attack: 0.01,
				decay: 0.1,
				sustain: 0,
				release: 0.1,
			},
		}).toDestination();

		this.gameOverSynth = new Tone.PolySynth(Tone.Synth, {
			oscillator: { type: "triangle" },
			envelope: {
				attack: 0.01,
				decay: 0.3,
				sustain: 0,
				release: 0.1,
			},
		}).toDestination();

		this.moveSynth = new Tone.Synth({
			oscillator: { type: "square" },
			envelope: {
				attack: 0.01,
				decay: 0.05,
				sustain: 0,
				release: 0.05,
			},
		}).toDestination();

		this.feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
		this.gameOverSynth.connect(this.feedbackDelay);
		this.setInitialVolumes();
	}

	setInitialVolumes() {
		this.foodSynth.volume.value = SOUND_CONFIG.volumes.food;
		this.gameOverSynth.volume.value = SOUND_CONFIG.volumes.gameOver;
		this.moveSynth.volume.value = SOUND_CONFIG.volumes.move;
	}

	async initialize() {
		if (Tone.context.state !== "running") {
			try {
				await Tone.start();
				this.setInitialVolumes();
				console.log("Audio context started");
			} catch (error) {
				console.warn("Could not start audio context:", error);
			}
		}
	}

	playFoodCollect() {
		this.foodSynth.triggerAttackRelease(SOUND_CONFIG.notes.food, "16n");
	}

	playGameOver() {
		const now = Tone.now();
		this.gameOverSynth.triggerAttackRelease(
			SOUND_CONFIG.notes.gameOver,
			"8n",
			now,
		);
	}

	playMove() {
		this.moveSynth.triggerAttackRelease(SOUND_CONFIG.notes.move, "32n");
	}

	setMuted(muted) {
		const volume = muted
			? SOUND_CONFIG.volumes.muted
			: SOUND_CONFIG.volumes.food;
		this.foodSynth.volume.value = volume;
		this.gameOverSynth.volume.value = volume;
		this.moveSynth.volume.value = volume;
	}
}

const soundManager = new SoundManager();

// Direction utility
const DirectionUtil = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 },

	isOpposite(dir1, dir2) {
		return dir1.x === -dir2.x && dir1.y === -dir2.y;
	},

	getDirectionFromKey(key) {
		const directions = {
			ArrowUp: this.UP,
			ArrowDown: this.DOWN,
			ArrowLeft: this.LEFT,
			ArrowRight: this.RIGHT,
			w: this.UP,
			s: this.DOWN,
			a: this.LEFT,
			d: this.RIGHT,
		};
		return directions[key];
	},

	getDirectionFromAngle(angle) {
		const directions = [this.RIGHT, this.DOWN, this.LEFT, this.UP];
		const index = Math.round(angle / (Math.PI / 2));
		return directions[(index + 4) % 4];
	},
};

// Drawing utility
class DrawingUtil {
	constructor(ctx) {
		this.ctx = ctx;
	}

	withShadow(color, blur, callback) {
		this.ctx.save();
		this.ctx.shadowColor = color;
		this.ctx.shadowBlur = blur;
		callback();
		this.ctx.restore();
	}

	drawRect(x, y, width, height, options = {}) {
		const { fillStyle, shadowColor, shadowBlur, glow } = options;

		this.ctx.save();
		if (fillStyle) this.ctx.fillStyle = fillStyle;
		if (shadowColor) this.ctx.shadowColor = shadowColor;
		if (shadowBlur) this.ctx.shadowBlur = shadowBlur;
		if (glow) {
			this.ctx.shadowColor = glow;
			this.ctx.shadowBlur = THEME.dimensions.glowRadius;
		}

		this.ctx.fillRect(x, y, width, height);
		this.ctx.restore();
	}
}

// Power-up types
const POWER_UPS = {
	SPEED: {
		color: "#FF5F5F",
		duration: 5000,
		effect: (game) => {
			game.gameSpeed *= 0.7;
			return () => (game.gameSpeed /= 0.7);
		},
	},
	GHOST: {
		color: "#8C8CFF",
		duration: 3000,
		effect: (game) => {
			game.isGhostMode = true;
			return () => (game.isGhostMode = false);
		},
	},
	DOUBLE_POINTS: {
		color: "#FFD700",
		duration: 7000,
		effect: (game) => {
			game.scoreMultiplier = 2;
			return () => (game.scoreMultiplier = 1);
		},
	},
};

// Particle system improvements
class ParticleSystem {
	constructor() {
		this.particles = [];
	}

	createParticle(x, y, options = {}) {
		const {
			color = "#fff",
			speed = THEME.animations.particleSpeed,
			size = 2,
			life = 1,
			angle = Math.random() * Math.PI * 2,
		} = options;

		return {
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			size,
			life,
			color,
			update() {
				this.x += this.vx;
				this.y += this.vy;
				this.life -= 0.02;
				return this.life > 0;
			},
			draw(ctx) {
				ctx.fillStyle = `${this.color}${Math.floor(this.life * 255)
					.toString(16)
					.padStart(2, "0")}`;
				ctx.fillRect(this.x, this.y, this.size, this.size);
			},
		};
	}

	emit(x, y, count, options = {}) {
		for (let i = 0; i < count; i++) {
			this.particles.push(
				this.createParticle(x, y, {
					...options,
					angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
				}),
			);
		}
	}

	update(ctx) {
		this.particles = this.particles.filter((particle) => {
			const alive = particle.update();
			if (alive) particle.draw(ctx);
			return alive;
		});
	}
}

// Message system
class MessageSystem {
	constructor() {
		this.messages = [];
	}

	add(text, options = {}) {
		const { duration = 2000, color = "#fff", size = 20, y = 50 } = options;

		this.messages.push({
			text,
			color,
			size,
			y,
			alpha: 1,
			created: Date.now(),
			duration,
		});
	}

	update(ctx) {
		const now = Date.now();
		this.messages = this.messages.filter((msg) => {
			const age = now - msg.created;
			if (age > msg.duration) return false;

			const alpha = Math.min(
				1,
				Math.min(age / 500, (msg.duration - age) / 500),
			);
			ctx.save();
			ctx.font = `${msg.size}px "Press Start 2P"`;
			ctx.fillStyle = `${msg.color}${Math.floor(alpha * 255)
				.toString(16)
				.padStart(2, "0")}`;
			ctx.textAlign = "center";
			ctx.fillText(msg.text, ctx.canvas.width / 2, msg.y);
			ctx.restore();
			return true;
		});
	}
}

// Game Scene Class
class SnakeScene {
	constructor(isMobile = false) {
		this.state = {
			snake: [],
			food: null,
			direction: { x: 0, y: 0 },
			nextDirection: { x: 0, y: 0 },
			score: 0,
			gameOver: false,
			lastUpdate: 0,
		};
		this.particles = new ParticleSystem();
		this.messages = new MessageSystem();
		this.drawingUtil = null;
		this.activePowerUps = new Map();
		this.scoreMultiplier = 1;
		this.isGhostMode = false;
		this.currentHue = 0;
		this.snakeHue = 180;
		this.foodHue = 0;
		this.isMobile = isMobile;
		this.gameSpeed = isMobile
			? THEME.animations.snakeSpeed.mobile
			: THEME.animations.snakeSpeed.desktop;
		this.highScore =
			Number.parseInt(localStorage.getItem("snakeHighScore")) || 0;
		this.avatar = new Image();
		this.avatar.src = profile1;
		this.boundKeyHandler = null;
	}

	async create(canvasSize) {
		this.canvasSize = canvasSize;
		this.cellSize = canvasSize.cellSize;
		await soundManager.initialize();
		this.initializeGame();
		this.setupInput();
		this.drawingUtil = new DrawingUtil(this.game.context);
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
			if (
				["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)
			) {
				event.preventDefault();
			}
		};
		document.addEventListener("keydown", this.boundKeyHandler);
	}

	handleKeyPress(key) {
		if (this.state.gameOver && (key === "Space" || key === "Enter")) {
			this.initializeGame();
			return;
		}

		const direction = DirectionUtil.getDirectionFromKey(key);
		if (
			direction &&
			!DirectionUtil.isOpposite(direction, this.state.direction)
		) {
			this.state.nextDirection = {
				x: direction.x * this.cellSize,
				y: direction.y * this.cellSize,
			};
		}
	}

	generateFoodPosition() {
		const x =
			Math.floor(Math.random() * (this.canvasSize.width / this.cellSize)) *
			this.cellSize;
		const y =
			Math.floor(Math.random() * (this.canvasSize.height / this.cellSize)) *
			this.cellSize;
		return { x, y };
	}

	isValidFoodPosition(food) {
		return !this.state.snake.some((segment) => this.isCollision(segment, food));
	}

	spawnFood() {
		let newFood;
		do {
			newFood = this.generateFoodPosition();
		} while (!this.isValidFoodPosition(newFood));

		this.state.food = newFood;
	}

	isCollision(pos1, pos2) {
		return pos1.x === pos2.x && pos1.y === pos2.y;
	}

	spawnPowerUp() {
		if (Math.random() < 0.1) {
			// 10% chance on food collection
			const types = Object.entries(POWER_UPS);
			const [type, config] = types[Math.floor(Math.random() * types.length)];
			this.state.powerUp = {
				...this.generateFoodPosition(),
				type,
				config,
			};
		}
	}

	handlePowerUp(powerUp) {
		const cleanup = powerUp.config.effect(this);
		this.messages.add(`${powerUp.type} ACTIVATED!`, {
			color: powerUp.config.color,
		});

		if (this.activePowerUps.has(powerUp.type)) {
			clearTimeout(this.activePowerUps.get(powerUp.type));
		}

		this.activePowerUps.set(
			powerUp.type,
			setTimeout(() => {
				cleanup();
				this.activePowerUps.delete(powerUp.type);
				this.messages.add(`${powerUp.type} EXPIRED`, { color: "#ff0000" });
			}, powerUp.config.duration),
		);
	}

	moveSnake() {
		const { snake, nextDirection, food, powerUp } = this.state;
		const head = { ...snake[0] };

		this.state.direction = nextDirection;
		head.x += nextDirection.x;
		head.y += nextDirection.y;

		const { width, height } = this.canvasSize;

		// Handle wrapping with ghost mode
		if (this.isGhostMode) {
			if (head.x >= width) head.x = 0;
			if (head.x < 0) head.x = width - this.cellSize;
			if (head.y >= height) head.y = 0;
			if (head.y < 0) head.y = height - this.cellSize;
		} else if (
			head.x >= width ||
			head.x < 0 ||
			head.y >= height ||
			head.y < 0
		) {
			this.state.gameOver = true;
			soundManager.playGameOver();
			return;
		}

		snake.unshift(head);

		if (this.isCollision(head, food)) {
			soundManager.playFoodCollect();
			this.state.score += 1 * this.scoreMultiplier;
			this.particles.emit(
				food.x + this.cellSize / 2,
				food.y + this.cellSize / 2,
				10,
				{
					color: THEME.colors.food.gradient[0],
				},
			);
			this.spawnFood();
			this.spawnPowerUp();

			if (this.state.score > this.highScore) {
				this.highScore = this.state.score;
				localStorage.setItem("snakeHighScore", this.state.score);
			}
		} else {
			snake.pop();
		}

		if (powerUp && this.isCollision(head, powerUp)) {
			this.handlePowerUp(powerUp);
			this.particles.emit(
				powerUp.x + this.cellSize / 2,
				powerUp.y + this.cellSize / 2,
				15,
				{
					color: powerUp.config.color,
				},
			);
			this.state.powerUp = null;
		}
	}

	update(time) {
		if (this.state.gameOver) return;

		this.snakeHue = (this.snakeHue + 0.5) % 360;
		this.foodHue = (this.foodHue + 1) % 360;

		if (time - this.state.lastUpdate < this.gameSpeed) return;

		this.state.lastUpdate = time;
		this.moveSnake();
		if (this.checkCollisions()) return;
		this.draw();
		this.updateParticles();
	}

	checkCollisions() {
		const { snake } = this.state;
		const head = snake[0];

		for (let i = 1; i < snake.length; i++) {
			if (this.isCollision(head, snake[i])) {
				this.state.gameOver = true;
				soundManager.playGameOver();
				return true;
			}
		}
		return false;
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
		const { snake, food, powerUp } = this.state;
		const ctx = this.game.context;

		ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
		this.drawGrid();

		// Draw snake with improved glow effect
		snake.forEach((segment, index) => {
			const isHead = index === 0;
			const segmentHue = (this.snakeHue + index * 5) % 360;
			const glowIntensity = isHead ? 1 : 0.7;

			this.drawingUtil.drawRect(
				segment.x,
				segment.y,
				this.cellSize - 1,
				this.cellSize - 1,
				{
					fillStyle: `hsl(${segmentHue}, 70%, ${isHead ? 60 : 50}%)`,
					glow: `hsl(${segmentHue}, 80%, 60%)`,
					shadowBlur: isHead ? 20 : 15,
					opacity: glowIntensity,
				},
			);

			// Add extra glow for head
			if (isHead) {
				this.drawingUtil.drawRect(
					segment.x,
					segment.y,
					this.cellSize - 1,
					this.cellSize - 1,
					{
						fillStyle: "transparent",
						glow: `hsl(${segmentHue}, 90%, 70%)`,
						shadowBlur: 30,
					},
				);
			}
		});

		// Draw food with enhanced effects
		if (food) {
			const pulseScale = 1 + Math.sin(Date.now() / 500) * 0.1;
			const size = (this.cellSize - 1) * pulseScale;
			const offset = (size - (this.cellSize - 1)) / 2;

			this.drawingUtil.withShadow(`hsl(${this.foodHue}, 80%, 60%)`, 20, () => {
				// Draw base glow
				ctx.beginPath();
				ctx.arc(
					food.x + this.cellSize / 2,
					food.y + this.cellSize / 2,
					this.cellSize / 2,
					0,
					Math.PI * 2,
				);
				ctx.fillStyle = `hsla(${this.foodHue}, 70%, 50%, 0.3)`;
				ctx.fill();

				// Draw avatar with color overlay
				ctx.drawImage(
					this.avatar,
					food.x - offset,
					food.y - offset,
					size,
					size,
				);

				ctx.globalCompositeOperation = "overlay";
				ctx.fillStyle = `hsla(${this.foodHue}, 70%, 50%, 0.5)`;
				ctx.fillRect(food.x - offset, food.y - offset, size, size);
			});
		}

		// Draw power-up with enhanced effects
		if (powerUp) {
			const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.1;
			const size = (this.cellSize - 1) * pulseScale;
			const offset = (size - (this.cellSize - 1)) / 2;

			// Draw glow effect
			this.drawingUtil.drawRect(
				powerUp.x - offset - 5,
				powerUp.y - offset - 5,
				size + 10,
				size + 10,
				{
					fillStyle: powerUp.config.color + "33",
					glow: powerUp.config.color,
					shadowBlur: 30,
				},
			);

			// Draw power-up
			this.drawingUtil.drawRect(
				powerUp.x - offset,
				powerUp.y - offset,
				size,
				size,
				{
					fillStyle: powerUp.config.color + "cc",
					glow: powerUp.config.color,
					shadowBlur: 20,
				},
			);

			// Draw power-up icon
			ctx.save();
			ctx.font = `bold ${Math.floor(this.cellSize * 0.5)}px 'Press Start 2P'`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#fff";
			ctx.fillText(
				powerUp.type[0],
				powerUp.x + this.cellSize / 2,
				powerUp.y + this.cellSize / 2,
			);
			ctx.restore();
		}

		// Update particles and messages
		this.particles.update(ctx);
		this.messages.update(ctx);

		// Draw active power-ups with enhanced styling
		if (this.activePowerUps.size > 0) {
			const powerUpDisplay = document.createElement("div");
			powerUpDisplay.className = "power-up-display";

			for (const [type, timeout] of this.activePowerUps) {
				const timeLeft = Math.ceil(
					(timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000,
				);
				const powerUpItem = document.createElement("div");
				powerUpItem.className = "power-up-item";

				const icon = document.createElement("div");
				icon.className = "icon";
				icon.style.backgroundColor = POWER_UPS[type].color;

				const label = document.createElement("span");
				label.textContent = type;

				const timer = document.createElement("span");
				timer.className = "timer";
				timer.textContent = `${timeLeft}s`;

				powerUpItem.appendChild(icon);
				powerUpItem.appendChild(label);
				powerUpItem.appendChild(timer);
				powerUpDisplay.appendChild(powerUpItem);
			}

			// Remove existing power-up display if any
			const existingDisplay = document.querySelector(".power-up-display");
			if (existingDisplay) {
				existingDisplay.remove();
			}

			document.querySelector(".game-container").appendChild(powerUpDisplay);
		} else {
			const existingDisplay = document.querySelector(".power-up-display");
			if (existingDisplay) {
				existingDisplay.remove();
			}
		}
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
		this.state.snake = this.state.snake.map((segment) => ({
			x: Math.round(segment.x / this.cellSize) * this.cellSize,
			y: Math.round(segment.y / this.cellSize) * this.cellSize,
		}));

		if (this.state.food) {
			this.state.food = {
				x: Math.round(this.state.food.x / this.cellSize) * this.cellSize,
				y: Math.round(this.state.food.y / this.cellSize) * this.cellSize,
			};
		}

		this.keepInBounds();
	}

	keepInBounds() {
		const maxX = this.canvasSize.width - this.cellSize;
		const maxY = this.canvasSize.height - this.cellSize;

		this.state.snake = this.state.snake.map((segment) => ({
			x: Math.max(0, Math.min(segment.x, maxX)),
			y: Math.max(0, Math.min(segment.y, maxY)),
		}));

		if (this.state.food) {
			this.state.food = {
				x: Math.max(0, Math.min(this.state.food.x, maxX)),
				y: Math.max(0, Math.min(this.state.food.y, maxY)),
			};
		}
	}

	setDirection(direction) {
		const directionVector = {
			up: DirectionUtil.UP,
			down: DirectionUtil.DOWN,
			left: DirectionUtil.LEFT,
			right: DirectionUtil.RIGHT,
		}[direction];

		if (
			directionVector &&
			!DirectionUtil.isOpposite(directionVector, this.state.direction)
		) {
			this.state.nextDirection = {
				x: directionVector.x * this.cellSize,
				y: directionVector.y * this.cellSize,
			};
		}
	}

	cleanup() {
		if (this.boundKeyHandler) {
			document.removeEventListener("keydown", this.boundKeyHandler);
			this.boundKeyHandler = null;
		}

		this.state = {
			snake: [],
			food: null,
			direction: { x: 0, y: 0 },
			nextDirection: { x: 0, y: 0 },
			score: 0,
			gameOver: false,
			lastUpdate: 0,
		};

		this.particles = [];

		if (this.game?.context && this.canvasSize) {
			this.game.context.clearRect(
				0,
				0,
				this.canvasSize.width,
				this.canvasSize.height,
			);
		}

		if (this.game?.animationFrameId) {
			cancelAnimationFrame(this.game.animationFrameId);
			this.game.animationFrameId = null;
		}
	}
}

// Score Display Component
const ScoreDisplay = React.memo(({ score, highScore, profile1 }) => (
	<div className="score-display" role="status" aria-live="polite">
		<div className="score">
			<span>Score</span>
			<span aria-label={`Current score: ${score}`}>
				{String(score).padStart(2, "0")}
			</span>
		</div>
		<div className="high-score">
			<span>Best</span>
			<span aria-label={`High score: ${highScore}`}>
				{String(highScore).padStart(2, "0")}
			</span>
		</div>
		{score > 0 && score >= highScore && (
			<div className="profile-badge" aria-label="New high score achievement">
				<img src={profile1} alt="Profile" />
				<div className="badge-label">New Best!</div>
			</div>
		)}
	</div>
));

ScoreDisplay.displayName = "ScoreDisplay";

// Main Game Component
const SnakeGame = () => {
	const containerRef = useRef(null);
	const canvasRef = useRef(null);
	const gameInstanceRef = useRef(null);
	const resizeTimeoutRef = useRef(null);
	const [isGameOver, setIsGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(
		Number.parseInt(localStorage.getItem("snakeHighScore")) || 0,
	);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
	const [isMobile, setIsMobile] = useState(false);
	const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

	const handleResize = useCallback(() => {
		if (resizeTimeoutRef.current) {
			clearTimeout(resizeTimeoutRef.current);
		}

		resizeTimeoutRef.current = setTimeout(() => {
			if (containerRef.current) {
				try {
					const container = containerRef.current;
					const { width, height } = container.getBoundingClientRect();
					const newSize = getCanvasSize(width, height);

					if (
						newSize.width !== canvasSize.width ||
						newSize.height !== canvasSize.height
					) {
						setCanvasSize(newSize);
						setIsMobile(width <= GAME_CONFIG.touch.mobileBreakpoint);

						if (canvasRef.current) {
							canvasRef.current.width = newSize.width;
							canvasRef.current.height = newSize.height;
						}

						if (gameInstanceRef.current) {
							gameInstanceRef.current.canvasSize = newSize;
							gameInstanceRef.current.updateGridSize();
						}
					}
				} catch (error) {
					console.error("Error during resize:", error);
				}
			}
		}, GAME_CONFIG.touch.resizeDebounce);
	}, [canvasSize]);

	useEffect(() => {
		handleResize();

		let resizeObserver;
		try {
			resizeObserver = new ResizeObserver((entries) => {
				const entry = entries[0];
				if (entry?.contentRect) {
					handleResize();
				}
			});

			if (containerRef.current) {
				resizeObserver.observe(containerRef.current);
			}
		} catch (error) {
			console.warn("ResizeObserver error:", error);
		}

		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);

		return () => {
			if (resizeTimeoutRef.current) {
				clearTimeout(resizeTimeoutRef.current);
			}
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
		};
	}, [handleResize]);

	useEffect(() => {
		if (
			canvasRef.current &&
			containerRef.current &&
			canvasSize.width &&
			canvasSize.height
		) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");

			canvas.width = canvasSize.width;
			canvas.height = canvasSize.height;

			const game = new SnakeScene(isMobile);
			game.game = { context: ctx, canvas };
			game.create(canvasSize);
			gameInstanceRef.current = game;

			canvas.setAttribute("tabindex", "0");
			canvas.focus();

			let animationFrameId;
			const render = (time) => {
				if (!game.state.gameOver) {
					game.update(time);
					setScore(game.state.score);
					if (game.state.gameOver) {
						setIsGameOver(true);
						if (game.state.score > highScore) {
							setHighScore(game.state.score);
							localStorage.setItem("snakeHighScore", game.state.score);
						}
					}
					animationFrameId = window.requestAnimationFrame(render);
				}
			};
			render(0);

			return () => {
				window.cancelAnimationFrame(animationFrameId);
				if (game.cleanup) {
					game.cleanup();
				}
				gameInstanceRef.current = null;
			};
		}
	}, [canvasSize, isMobile, highScore]);

	const handleRestart = useCallback(() => {
		if (gameInstanceRef.current) {
			gameInstanceRef.current.initializeGame();
			setIsGameOver(false);
			setScore(0);
			if (canvasRef.current) {
				canvasRef.current.focus();
			}
		}
	}, []);

	const handleTouchStart = (e) => {
		const touch = e.touches[0];
		touchStartRef.current = {
			x: touch.clientX,
			y: touch.clientY,
			time: Date.now(),
		};
	};

	const handleTouchEnd = (e) => {
		const touch = e.changedTouches[0];
		const deltaX = touch.clientX - touchStartRef.current.x;
		const deltaY = touch.clientY - touchStartRef.current.y;
		const deltaTime = Date.now() - touchStartRef.current.time;

		if (deltaTime < GAME_CONFIG.touch.maxTime) {
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			if (distance > GAME_CONFIG.touch.minDistance) {
				const angle = Math.atan2(deltaY, deltaX);
				const direction = DirectionUtil.getDirectionFromAngle(angle);

				if (gameInstanceRef.current && direction) {
					const directionName = {
						[DirectionUtil.UP]: "up",
						[DirectionUtil.DOWN]: "down",
						[DirectionUtil.LEFT]: "left",
						[DirectionUtil.RIGHT]: "right",
					}[direction];

					gameInstanceRef.current.setDirection(directionName);
				}
			}
		}
	};

	return (
		<FullscreenWrapper>
			<div ref={containerRef} className="snake-tool">
				<div className="game-container">
					<ScoreDisplay
						score={score}
						highScore={highScore}
						profile1={profile1}
					/>
					<canvas
						ref={canvasRef}
						className="game-canvas"
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
					/>
					{isGameOver && (
						<div className="game-over">
							<div className="game-over-content">
								<div className="profile-container">
									<img src={profile1} alt="Profile" className="profile-image" />
									<div className="pixel-overlay" />
								</div>
								<h2 data-text="GAME OVER">GAME OVER</h2>
								<div className="score-message">
									{score === highScore && score > 0 ? (
										<>
											<div className="score-banner">
												<span className="star" role="img" aria-label="star">
													★
												</span>
												<span className="new-record">NEW RECORD!</span>
												<span className="star" role="img" aria-label="star">
													★
												</span>
											</div>
											<p className="score-value">
												Score: {String(score).padStart(2, "0")}
											</p>
											<p className="encouraging-text">You're unstoppable!</p>
										</>
									) : (
										<>
											<p className="score-value">
												Score: {String(score).padStart(2, "0")}
											</p>
											<p className="high-score-value">
												Best: {String(highScore).padStart(2, "0")}
											</p>
											<p className="encouraging-text">
												{score === 0
													? "Don't give up!"
													: score < 5
														? "You can do better!"
														: score < 10
															? "Getting better!"
															: score < highScore
																? "Almost there!"
																: "Great job!"}
											</p>
										</>
									)}
								</div>
								<div className="game-over-buttons">
									<button
										onClick={handleRestart}
										className="play-again-btn"
										aria-label="Play again"
									>
										<span className="btn-text">PLAY AGAIN</span>
										<span className="btn-icon" aria-hidden="true">
											↺
										</span>
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</FullscreenWrapper>
	);
};

// Styles
const styles = `
	.snake-tool {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--tool-padding);
		background: var(--tool-background);
		min-height: 100vh;
	}

	.snake-tool .game-container {
		position: relative;
		max-width: 100%;
		max-height: 100vh;
		width: 100%;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(10px);
		padding-bottom: 100%;
		touch-action: none;
		-webkit-touch-callout: none;
		user-select: none;
	}

	@supports (aspect-ratio: 1) {
		.snake-tool .game-container {
			padding-bottom: initial;
			aspect-ratio: 1;
		}
	}

	@media (width <= 768px) {
		.snake-tool .game-container {
			padding: 5px;
		}
	}

	.snake-tool .game-container > * {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.snake-tool .game-canvas {
		width: 100%;
		height: 100%;
		background: var(--tool-surface);
		border: 1px solid var(--tool-border);
		box-shadow: 0 0 20px rgba(var(--tool-accent-rgb), 0.2);
		border-radius: 8px;
		position: relative;
		image-rendering: pixelated;
		touch-action: none;
		user-select: none;
	}

	@media (width <= 768px) {
		.snake-tool .game-canvas {
			border-width: 1px;
		}
	}

	.snake-tool .game-over {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		justify-content: center;
		align-items: center;
		animation: fadeIn 0.5s ease-out;
	}

	.snake-tool .game-over .game-over-content {
		text-align: center;
		color: #fff;
		padding: 2rem;
		max-width: 90%;
		width: 400px;
		animation: slideIn 0.5s ease-out;
	}

	@media (width <= 768px) {
		.snake-tool .game-over .game-over-content {
			padding: 1rem;
		}

		.snake-tool .game-over .game-over-content h2 {
			font-size: 2rem;
		}

		.snake-tool .game-over .game-over-content .score-value,
		.snake-tool .game-over .game-over-content .high-score-value {
			font-size: 1.2rem;
		}

		.snake-tool .game-over .game-over-content .play-again-btn {
			padding: 0.8rem 1.6rem;
			font-size: 0.9rem;
		}
	}

	.snake-tool .game-over .game-over-content .play-again-btn {
		background: #4ecca3;
		border: none;
		padding: 1rem 2rem;
		font-family: "Press Start 2P", cursive;
		font-size: 1rem;
		color: #fff;
		cursor: pointer;
		border-radius: 5px;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 2rem auto 0;
	}

	.snake-tool .game-over .game-over-content .play-again-btn:hover {
		transform: scale(1.05);
		background: #3db892;
		box-shadow: 0 0 15px rgba(78, 204, 163, 0.5);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideIn {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.profile-container {
		width: 48px;
		height: 48px;
		margin: 0 auto 1rem;
		position: relative;
	}

	.profile-container .profile-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		image-rendering: pixelated;
		border-radius: 4px;
	}

	.profile-container .pixel-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.1) 25%,
			transparent 25%,
			transparent 75%,
			rgba(255, 255, 255, 0.1) 75%
		);
		background-size: 4px 4px;
		pointer-events: none;
	}

	.score-banner {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.score-banner .star {
		color: #ffd700;
		animation: rotate 2s linear infinite;
	}

	.score-banner .new-record {
		color: #ff0;
		text-shadow: 0 0 5px #ff0;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes pulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}
`;

// Create and append styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default SnakeGame;
