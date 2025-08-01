import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SnakeGame.module.scss";
import profile1 from "../../../assets/images/profile1-nbg.png";
import GameBoard from "./GameBoard";
import Controls from "./Controls";
import "./styles/index.scss";

// Import from ToolsSection (will be updated later in the refactoring)
import { FullscreenTool } from "../ToolsSection";

let Tone;

// Import Press Start 2P font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
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

// Classes defined in SnakeGame.module.scss provide component styling

// Sound Manager
class SoundManager {
	constructor() {
		this.foodSynth = null;
		this.gameOverSynth = null;
		this.moveSynth = null;
		this.feedbackDelay = null;
	}

	setInitialVolumes() {
		if (this.foodSynth) {
			this.foodSynth.volume.value = SOUND_CONFIG.volumes.food;
		}
		if (this.gameOverSynth) {
			this.gameOverSynth.volume.value = SOUND_CONFIG.volumes.gameOver;
		}
		if (this.moveSynth) {
			this.moveSynth.volume.value = SOUND_CONFIG.volumes.move;
		}
	}

	async initialize() {
		if (!Tone) {
			const toneModule = await import("tone");
			Tone = toneModule.default || toneModule;
		}

		// Ensure synthesizers are properly initialized before continuing
		if (!Tone) {
			console.warn("Tone.js could not be initialized. Audio will be disabled.");
			return;
		}

		if (!this.foodSynth) {
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

		if (Tone.context.state !== "running") {
			try {
				await Tone.start();
				this.setInitialVolumes();
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

	cleanup() {
		// Dispose of Tone.js resources
		if (this.foodSynth) {
			this.foodSynth.dispose();
		}
		if (this.gameOverSynth) {
			this.gameOverSynth.dispose();
		}
		if (this.moveSynth) {
			this.moveSynth.dispose();
		}
		if (this.feedbackDelay) {
			this.feedbackDelay.dispose();
		}
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
		if (fillStyle) {
			this.ctx.fillStyle = fillStyle;
		}
		if (shadowColor) {
			this.ctx.shadowColor = shadowColor;
		}
		if (shadowBlur) {
			this.ctx.shadowBlur = shadowBlur;
		}
		if (glow) {
			this.ctx.shadowColor = glow;
			this.ctx.shadowBlur = THEME.dimensions.glowRadius;
		}

		this.ctx.fillRect(x, y, width, height);
		this.ctx.restore();
	}
}

// Game Scene Class
class SnakeScene {
	_getInitialState() {
		return {
			snake: [],
			food: null,
			direction: { x: 0, y: 0 },
			nextDirection: { x: 0, y: 0 },
			score: 0,
			gameOver: false,
			lastUpdate: 0,
		};
	}

	constructor(isMobile = false) {
		this.state = this._getInitialState();
		this.particles = [];
		this.drawingUtil = null;
		this.scoreMultiplier = 1;
		this.isGhostMode = false;
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
		if (!food || typeof food.x !== 'number' || typeof food.y !== 'number') {
			return false;
		}
		return !this.state.snake.some((segment) => this.isCollision(segment, food));
	}

	spawnFood() {
		const maxAttempts = 100; // Prevent infinite loop
		let attempts = 0;
		let newFood;

		do {
			newFood = this.generateFoodPosition();
			attempts++;

			// If we can't find a valid position after max attempts, 
			// the game is likely won or there's an issue
			if (attempts >= maxAttempts) {
				console.warn('Could not find valid food position after', maxAttempts, 'attempts');
				// Try to find any available position by checking all grid cells
				const availablePositions = this.findAvailablePositions();
				if (availablePositions.length > 0) {
					newFood = availablePositions[Math.floor(Math.random() * availablePositions.length)];
					break;
				} else {
					// Game is won - snake occupies entire grid
					this.state.gameOver = true;
					return;
				}
			}
		} while (!this.isValidFoodPosition(newFood));

		this.state.food = newFood;
	}

	findAvailablePositions() {
		const available = [];
		const snakePositions = new Set(
			this.state.snake.map(segment => `${segment.x},${segment.y}`)
		);

		for (let x = 0; x < this.canvasSize.width; x += this.cellSize) {
			for (let y = 0; y < this.canvasSize.height; y += this.cellSize) {
				const posKey = `${x},${y}`;
				if (!snakePositions.has(posKey)) {
					available.push({ x, y });
				}
			}
		}

		return available;
	}

	isCollision(pos1, pos2) {
		// Proper null/undefined checking
		if (!pos1 || !pos2 ||
			typeof pos1.x !== 'number' || typeof pos1.y !== 'number' ||
			typeof pos2.x !== 'number' || typeof pos2.y !== 'number') {
			return false;
		}
		return pos1.x === pos2.x && pos1.y === pos2.y;
	}

	moveSnake() {
		const { snake, nextDirection, food } = this.state;
		if (!snake || !snake.length || !nextDirection) {
			return;
		}

		const head = { ...snake[0] };
		if (!head) {
			return;
		}

		this.state.direction = nextDirection;
		head.x += nextDirection.x;
		head.y += nextDirection.y;

		const { width, height } = this.canvasSize;
		if (!width || !height) {
			return;
		}

		// Handle wrapping with ghost mode
		if (this.isGhostMode) {
			if (head.x >= width) {
				head.x = 0;
			}
			if (head.x < 0) {
				head.x = width - this.cellSize;
			}
			if (head.y >= height) {
				head.y = 0;
			}
			if (head.y < 0) {
				head.y = height - this.cellSize;
			}
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

		if (food && this.isCollision(head, food)) {
			soundManager.playFoodCollect();
			this.state.score += 1 * this.scoreMultiplier;
			this.spawnFood();

			if (this.state.score > this.highScore) {
				this.highScore = this.state.score;
				localStorage.setItem("snakeHighScore", this.state.score);
			}
		} else {
			snake.pop();
		}
	}

	update(time) {
		if (this.state.gameOver) {
			return;
		}

		this.snakeHue = (this.snakeHue + 0.5) % 360;
		this.foodHue = (this.foodHue + 1) % 360;

		if (time - this.state.lastUpdate < this.gameSpeed) {
			return;
		}

		this.state.lastUpdate = time;
		this.moveSnake();
		if (this.checkCollisions()) {
			return;
		}
		this.draw();
	}

	checkCollisions() {
		const { snake } = this.state;
		if (!snake || snake.length < 2) {
			return false;
		}

		const head = snake[0];
		if (!head) {
			return false;
		}

		for (let i = 1; i < snake.length; i++) {
			if (snake[i] && this.isCollision(head, snake[i])) {
				this.state.gameOver = true;
				soundManager.playGameOver();
				return true;
			}
		}
		return false;
	}

	draw() {
		const { snake, food } = this.state;
		const ctx = this.game.context;

		ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
		this.drawGrid();

		// Draw snake with improved glow effect
		snake.forEach((segment, index) => {
			const isHead = index === 0;
			const segmentHue = (this.snakeHue + index * 5) % 360;
			this.drawSnakeSegment(segment, segmentHue, isHead);
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

	drawSnakeSegment(segment, segmentHue, isHead) {
		const glowIntensity = isHead ? 1 : 0.7;

		// Main segment drawing
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
	}

	start() {
		// Start the game loop
		const gameLoop = (timestamp) => {
			if (this.game?.animationFrameId) {
				cancelAnimationFrame(this.game.animationFrameId);
			}

			this.update(timestamp);

			if (!this.state.gameOver) {
				this.game.animationFrameId = requestAnimationFrame(gameLoop);
			}
		};

		this.game.animationFrameId = requestAnimationFrame(gameLoop);
	}

	cleanup() {
		if (this.boundKeyHandler) {
			document.removeEventListener("keydown", this.boundKeyHandler);
			this.boundKeyHandler = null;
		}

		this.state = this._getInitialState();

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

// Main component
const SnakeGame = memo(() => {
	const location = useLocation();
	const isFullscreen = location.pathname.includes("/fullscreen");
	const containerRef = useRef(null);
	const canvasRef = useRef(null);
	const sceneRef = useRef(null);
	const soundManagerRef = useRef(null);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Check if device is mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Initialize sound manager
	useEffect(() => {
		soundManagerRef.current = new SoundManager();
		soundManagerRef.current.initialize();
		return () => {
			if (soundManagerRef.current) {
				soundManagerRef.current.cleanup();
			}
		};
	}, []);

	// Handle mute toggle
	const toggleMute = useCallback(() => {
		if (soundManagerRef.current) {
			const newMuted = !isMuted;
			setIsMuted(newMuted);
			soundManagerRef.current.setMuted(newMuted);
		}
	}, [isMuted]);

	// Helper function to get current canvas size from container
	const getCurrentCanvasSize = useCallback(() => {
		if (containerRef.current) {
			const { width, height } = containerRef.current.getBoundingClientRect();
			return getCanvasSize(width, height);
		}
		return null;
	}, []);

	// Handle canvas ready
	const handleCanvasReady = useCallback((canvas, ctx) => {
		canvasRef.current = { canvas, ctx };

		// Initialize game scene
		if (containerRef.current && canvasRef.current) {
			const canvasSize = getCurrentCanvasSize();

			// Create scene
			sceneRef.current = new SnakeScene(isMobile);
			sceneRef.current.game = { context: ctx };
			sceneRef.current.create(canvasSize).then(() => {
				// Set up event handlers
				sceneRef.current.onScoreChange = (newScore) => {
					setScore(newScore);
					if (newScore > highScore) {
						setHighScore(newScore);
					}
					if (soundManagerRef.current) {
						soundManagerRef.current.playFoodCollect();
					}
				};

				sceneRef.current.onGameOver = () => {
					setGameOver(true);
					if (soundManagerRef.current) {
						soundManagerRef.current.playGameOver();
					}
				};

				// Start game
				sceneRef.current.start();
			});
		}
	}, [isMobile, highScore, getCurrentCanvasSize]);

	// Handle direction change from mobile controls
	const handleDirectionChange = useCallback((direction) => {
		if (sceneRef.current) {
			sceneRef.current.handleKeyPress(direction);
		}
	}, []);

	// Handle restart
	const handleRestart = useCallback(() => {
		if (sceneRef.current) {
			sceneRef.current.initializeGame();
			setGameOver(false);
			setScore(0);
		}
	}, []);

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (sceneRef.current) {
				sceneRef.current.cleanup();
			}
		};
	}, []);

	// Resize handler
	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current && canvasRef.current && sceneRef.current) {
				const canvasSize = getCurrentCanvasSize();
				if (!canvasSize) return;

				canvasRef.current.canvas.width = canvasSize.width;
				canvasRef.current.canvas.height = canvasSize.height;

				sceneRef.current.resize(canvasSize);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [getCurrentCanvasSize]);

	return (
		<FullscreenTool isFullscreen={isFullscreen} title="Snake Game">
			<div ref={containerRef} className={`snake-game-container ${styles.container}`}>
				<GameBoard
					onCanvasReady={handleCanvasReady}
					width={800}
					height={600}
					className="snake-canvas"
				/>

				<Controls
					onDirectionChange={handleDirectionChange}
					isMobile={isMobile}
				/>

				<div className={styles.scoreDisplay}>
					<div className={styles.currentScore}>Score: {score}</div>
					<div className={styles.highScore}>High Score: {highScore}</div>
				</div>

				<button
					type="button"
					className={styles.muteButton}
					onClick={toggleMute}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							toggleMute();
						}
					}}
				>
					{isMuted ? (
						<svg viewBox="0 0 24 24">
							<title>Unmute</title>
							<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
						</svg>
					) : (
						<svg viewBox="0 0 24 24">
							<title>Mute</title>
							<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
						</svg>
					)}
				</button>

				<div className={`${styles.overlay} ${gameOver ? '' : styles.hidden}`}>
					<h2 className={styles.gameOverText}>Game Over!</h2>
					<button
						type="button"
						className={styles.restartButton}
						onClick={handleRestart}
					>
						Restart
					</button>
				</div>
			</div>
		</FullscreenTool>
	);
});

SnakeGame.displayName = "SnakeGame";

export default SnakeGame;
