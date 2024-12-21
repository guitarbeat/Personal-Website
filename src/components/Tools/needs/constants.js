// View constants
export const VIEWS = {
	ASSESSMENT: "assessment",
	HISTORY: "history",
	SETTINGS: "settings",
};

// Configuration constants
export const MINIMUM_VALUE_TO_UNLOCK = 15;
export const MAX_HISTORY_ITEMS = 50;
export const AUTO_SAVE_INTERVAL = 60000; // 1 minute

// Initial state
export const INITIAL_STATE = {
	levelValues: [],
	selectedLevel: null,
	history: [],
	userName: "",
	hoveredLevel: null,
	currentView: VIEWS.ASSESSMENT,
	lastSaved: null,
};

// Emoji configurations
export const LEVEL_EMOJIS = {
	"Self Actualization": ["😔", "🤔", "😊", "🌟", "✨"],
	"Growth": ["🌱", "🌿", "🌳", "🌲", "🎋"],
	"Esteem": ["😞", "😐", "😊", "😄", "🤩"],
	"Connection": ["💔", "❤️", "💖", "💝", "💫"],
	"Security": ["🛡️", "🔒", "🏰", "⚔️", "🔱"],
	"Survival": ["😫", "😣", "😌", "😊", "😎"],
	"default": ["😔", "😐", "🙂", "😊", "😄"]
};

// Needs levels configuration
export const NEEDS_LEVELS = [
	{
		level: "Self Actualization",
		emoji: "🌟",
		baseValue: 0,
		description: "Reaching your full potential, creativity, and purpose",
		color: "#BB9AF7",
	},
	{
		level: "Growth",
		emoji: "🌱",
		baseValue: 0,
		description: "Learning, development, and achievement",
		color: "#9ECE6A",
	},
	{
		level: "Esteem",
		emoji: "⭐",
		baseValue: 0,
		description: "Self-worth, confidence, and recognition",
		color: "#7AA2F7",
	},
	{
		level: "Connection",
		emoji: "💝",
		baseValue: 0,
		description: "Relationships, love, and belonging",
		color: "#F7768E",
	},
	{
		level: "Security",
		emoji: "🛡️",
		baseValue: 0,
		description: "Safety, stability, and resources",
		color: "#E0AF68",
	},
	{
		level: "Survival",
		emoji: "🌿",
		baseValue: 0,
		description: "Basic physical needs and health",
		color: "#73DACA",
	},
];

// Theme configuration
export const THEME = {
	colors: {
		primary: "#7AA2F7",
		success: "#9ECE6A",
		warning: "#E0AF68",
		error: "#F7768E",
		info: "#7DCFFF",
		background: "rgba(17, 17, 23, 0.85)",
		border: "rgba(255, 255, 255, 0.1)",
		text: {
			primary: "rgba(255, 255, 255, 0.9)",
			secondary: "rgba(255, 255, 255, 0.7)",
		},
		glass: {
			bg: "rgb(17 25 40 / 75%)",
			border: "rgb(255 255 255 / 12.5%)",
			hover: "rgb(255 255 255 / 20%)",
		},
		progress: {
			bg: "rgb(255 255 255 / 10%)",
		},
		confetti: {
			color0: "#4ecdc4",
			color1: "#45b7d1",
			color2: "#ff6b6b",
		},
	},
	shadows: {
		soft: "0 8px 32px 0 rgb(0 0 0 / 10%)",
		glow: "0 0 20px rgb(255 255 255 / 5%)",
		hover: "0 4px 12px rgb(0 0 0 / 10%)",
	},
	transitions: {
		default: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		smooth: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		bounce: "0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
	},
	spacing: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
	},
	borderRadius: {
		sm: "4px",
		md: "8px",
		lg: "12px",
		xl: "16px",
	},
};
