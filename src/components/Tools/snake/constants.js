// Theme configuration
export const THEME = {
	colors: {
		background: "rgba(10, 10, 15, 0.8)", // Darker, more opaque background
		snake: {
			gradient: ["#7AA2F7", "#7DCFFF", "#2AC3DE"], // Cool blue gradient
			glow: "#7AA2F7", // Matching glow color
		},
		snakeHead: {
			gradient: ["#BB9AF7", "#9D7CD8"], // Purple gradient
			glow: "#BB9AF7", // Matching glow color
		},
		food: {
			gradient: ["#F7768E", "#FF9E64"], // Warm gradient
			glow: "#F7768E", // Matching glow color
		},
		border: "#24283B", // Subtle border
		gridLines: "rgba(255, 255, 255, 0.05)", // Subtle grid lines
		text: "#A9B1D6", // Soft text color
		gameOver: "#F7768E", // Warm red for game over
		scoreBackground: "rgba(26, 27, 38, 0.9)", // Dark score background
		highScore: "#9ECE6A", // Green for high score
	},

	dimensions: {
		minTileSize: 20, // Minimum size for each grid cell
		maxTileSize: 32, // Maximum size for each grid cell
		borderRadius: 4, // Rounded corners for tiles
		gridLineWidth: 1,
		shadowBlur: 30,
		glowRadius: 40,
		innerShadowSize: 10,
	},

	animations: {
		snakeSpeed: {
			mobile: 100,
			desktop: 80,
		},
		fadeSpeed: 400, // Smooth fade transitions
		growthFactor: 1.15, // More pronounced growth
		foodPulseSpeed: 1800, // Slower pulse for food
		foodPulseScale: 1.18, // Larger pulse scale
		snakeGlowIntensity: 0.8, // Increased glow intensity
		shadowPulseSpeed: 200, // Speed of shadow pulse
		particleCount: 10,
		particleLifetime: 1000,
		particleGravity: 0.1,
		particleSpeed: 2,
		particleSize: 0.5,
	},
};

// Responsive configuration
export const RESPONSIVE_CONFIG = {
	mobileBreakpoint: 768, // Width threshold for mobile devices
	touchMinDistance: 30, // Minimum swipe distance to trigger direction change
	touchMaxTime: 300, // Maximum time for a swipe gesture
	resizeDebounce: 250, // Debounce time for resize events
};

// Game configuration
export const GAME_CONFIG = {
	gridSize: 20, // Number of cells in both width and height
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
};

// Helper functions
export const getCanvasSize = (containerWidth, containerHeight) => {
	const { minTileSize, maxTileSize } = THEME.dimensions;
	const { gridSize } = GAME_CONFIG;

	// Calculate the maximum possible cell size that fits in both dimensions
	const maxPossibleCellSize = Math.min(
		Math.floor(containerWidth / gridSize),
		Math.floor(containerHeight / gridSize),
	);

	// Clamp the cell size between min and max
	const cellSize = Math.max(
		minTileSize,
		Math.min(maxPossibleCellSize, maxTileSize),
	);

	// Calculate the final canvas size to ensure perfect squares
	return {
		width: cellSize * gridSize,
		height: cellSize * gridSize,
		cellSize: cellSize,
	};
};

export const getCellSize = (canvasSize) => {
	return canvasSize.cellSize;
};
