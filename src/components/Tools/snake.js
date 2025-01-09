import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import * as Tone from "tone";
import profile1 from "../../assets/images/profile1-nbg.png";
import { FullscreenTool } from "./ToolsSection";

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

// Styled components
const GameContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	background: ${THEME.colors.background};
	border-radius: ${THEME.dimensions.borderRadius}px;
	padding: 1rem;
	position: relative;
`;

const Canvas = styled.canvas`
	background: ${THEME.colors.background};
	border-radius: ${THEME.dimensions.borderRadius}px;
	box-shadow: 0 0 ${THEME.dimensions.shadowBlur}px ${THEME.colors.border};
`;

const ScoreContainer = styled.div`
	position: absolute;
	top: 1rem;
	left: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	font-family: "Press Start 2P", monospace;
	color: ${THEME.colors.text};
	background: ${THEME.colors.scoreBackground};
	padding: 1rem;
	border-radius: ${THEME.dimensions.borderRadius}px;
	z-index: 10;
`;

const Score = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 1rem;
`;

const HighScore = styled(Score)`
	color: ${THEME.colors.highScore};
`;

const GameOverOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.8);
	color: ${THEME.colors.gameOver};
	font-family: "Press Start 2P", monospace;
	gap: 2rem;
	z-index: 20;
`;

const RestartButton = styled.button`
	font-family: "Press Start 2P", monospace;
	background: ${THEME.colors.gameOver};
	color: white;
	border: none;
	padding: 1rem 2rem;
	border-radius: ${THEME.dimensions.borderRadius}px;
	cursor: pointer;
	transition: transform 0.2s;

	&:hover {
		transform: scale(1.1);
	}
`;

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
		this.particles = [];
		this.drawingUtil = null;
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
		if (!pos1 || !pos2) return false;
		return pos1.x === pos2.x && pos1.y === pos2.y;
	}

	moveSnake() {
		const { snake, nextDirection, food } = this.state;
		if (!snake || !snake.length || !nextDirection) return;

		const head = { ...snake[0] };
		if (!head) return;

		this.state.direction = nextDirection;
		head.x += nextDirection.x;
		head.y += nextDirection.y;

		const { width, height } = this.canvasSize;
		if (!width || !height) return;

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
		if (!snake || snake.length < 2) return false;

		const head = snake[0];
		if (!head) return false;

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

// Game content component
const SnakeContent = memo(({ isFullscreen }) => {
	const containerRef = useRef(null);
	const canvasRef = useRef(null);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(
		parseInt(localStorage.getItem("snakeHighScore")) || 0,
	);
	const [isGameOver, setIsGameOver] = useState(false);
	const gameInstanceRef = useRef(null);

	// Initialize game
	useEffect(() => {
		if (canvasRef.current && containerRef.current) {
			const container = containerRef.current;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			const { width, height } = container.getBoundingClientRect();
			const canvasSize = getCanvasSize(width, height);

			canvas.width = canvasSize.width;
			canvas.height = canvasSize.height;

			// Initialize game instance
			gameInstanceRef.current = new SnakeScene(window.innerWidth <= GAME_CONFIG.touch.mobileBreakpoint);
			gameInstanceRef.current.game = { context: ctx };
			gameInstanceRef.current.create(canvasSize);

			// Game loop
			let animationFrameId;
			const gameLoop = (timestamp) => {
				gameInstanceRef.current.update(timestamp);
				setScore(gameInstanceRef.current.state.score);
				setHighScore(gameInstanceRef.current.highScore);
				setIsGameOver(gameInstanceRef.current.state.gameOver);
				animationFrameId = requestAnimationFrame(gameLoop);
			};

			animationFrameId = requestAnimationFrame(gameLoop);

			return () => {
				cancelAnimationFrame(animationFrameId);
				gameInstanceRef.current?.cleanup();
			};
		}
	}, []);

	const handleRestart = useCallback(() => {
		if (gameInstanceRef.current) {
			gameInstanceRef.current.initializeGame();
			setIsGameOver(false);
		}
	}, []);

	return (
		<GameContainer ref={containerRef}>
			<Canvas ref={canvasRef} />
			<ScoreContainer>
				<Score>Score: {score}</Score>
				<HighScore>Best: {highScore}</HighScore>
			</ScoreContainer>
			{isGameOver && (
				<GameOverOverlay>
					<h2>Game Over!</h2>
					<p>Score: {score}</p>
					<RestartButton onClick={handleRestart}>
						Play Again
					</RestartButton>
				</GameOverOverlay>
			)}
		</GameContainer>
	);
});

SnakeContent.displayName = "SnakeContent";

// Main component
const Snake = () => {
	const location = useLocation();
	const isFullscreen = location.pathname.includes("/fullscreen");

	if (isFullscreen) {
		return (
			<FullscreenTool>
				<SnakeContent isFullscreen />
			</FullscreenTool>
		);
	}

	return <SnakeContent />;
};

export default memo(Snake);
