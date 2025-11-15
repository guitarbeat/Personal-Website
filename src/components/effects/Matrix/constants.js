// Matrix Effect Constants
// Centralized configuration for colors, timings, and other constants

// * Color Definitions - Single Source of Truth
export const MATRIX_COLORS = {
	// Primary Matrix Colors
	GREEN: { r: 0, g: 255, b: 0, alpha: 0.9 },
	DARK_GREEN: { r: 0, g: 200, b: 0, alpha: 0.8 },
	DARKER_GREEN: { r: 0, g: 150, b: 0, alpha: 0.7 },
	DARKEST_GREEN: { r: 0, g: 100, b: 0, alpha: 0.6 },
	MEDIUM_GREEN: { r: 0, g: 180, b: 0, alpha: 0.75 },
	BRIGHT_GREEN: { r: 0, g: 255, b: 0, alpha: 1.0 },

	// Accent Colors
	CYAN_GREEN: { r: 0, g: 255, b: 100, alpha: 0.8 },
	CYAN: { r: 0, g: 255, b: 255, alpha: 0.8 },
	WHITE: { r: 255, g: 255, b: 255, alpha: 0.95 },
	RED: { r: 255, g: 0, b: 0, alpha: 0.9 },
	YELLOW: { r: 255, g: 255, b: 0, alpha: 0.9 },

	// Background Colors
	BLACK: { r: 0, g: 0, b: 0, alpha: 0.85 },
	TERMINAL_BG: { r: 0, g: 0, b: 0, alpha: 0.95 },
	GLOW: { r: 0, g: 255, b: 0, alpha: 0.15 },
};

// * Animation Timing Constants (in milliseconds)
export const ANIMATION_TIMING = {
	// Flicker Effects
	MATRIX_FLICKER: 100,
	TERMINAL_FLICKER: 50,
	SCREEN_FLICKER: 100,

	// User Feedback
	SUCCESS_FEEDBACK_DURATION: 2000,
	MATRIX_MODAL_CLOSE_DELAY: 2000,
	FADE_IN_DURATION: 600,
	FADE_OUT_DURATION: 300,

	// Interactive Effects
	HOVER_TRANSITION: 300,
	FOCUS_TRANSITION: 200,
	GLITCH_DURATION: 200,

	// Performance Monitoring
	FPS_UPDATE_INTERVAL: 1000,
	MOUSE_TRAIL_UPDATE: 50,
	RATE_LIMIT_CHECK: 1000,
};

// * Z-Index Scale - Consistent Layering
export const Z_INDEX = {
	// Base layers (1000s)
	BACKGROUND: 1000,
	CANVAS: 1001,
	FEEDBACK: 1002,

	// Overlay layers (2000s)
	MODAL: 2000,
	MODAL_BACKDROP: 2001,
	MODAL_CONTENT: 2002,
	MODAL_CONTROLS: 2003,

	// Top layers (3000s)
	TOOLTIP: 3000,
	NOTIFICATION: 3001,
	DEBUG: 3002,
};

// * Performance Constants
export const PERFORMANCE = {
	// FPS Targets
	TARGET_FPS: 60,
	FRAME_INTERVAL: 1000 / 60, // ~16.67ms
};

// * Font and Sizing Constants
export const TYPOGRAPHY = {
	FONT_FAMILY: "'Courier New', 'Monaco', 'Consolas', monospace",
	FONT_SIZES: {
		MIN: 8,
		MAX: 20,
		SMALL: 10,
		MEDIUM: 11,
		LARGE: 12,
		XLARGE: 16,
		XXLARGE: 20,
		HUGE: 32,
	},
	LETTER_SPACING: {
		NORMAL: 1,
		WIDE: 2,
		WIDER: 3,
	},
};

// * Layout Constants
export const LAYOUT = {
	// Breakpoints (should match CSS media queries)
	MOBILE_BREAKPOINT: 768,
	TABLET_BREAKPOINT: 1016,
	DESKTOP_BREAKPOINT: 1200,

	// Spacing
	PADDING: {
		SMALL: 8,
		MEDIUM: 16,
		LARGE: 24,
		XLARGE: 32,
	},
	MARGIN: {
		SMALL: 8,
		MEDIUM: 16,
		LARGE: 24,
		XLARGE: 32,
	},

	// Border Radius
	BORDER_RADIUS: {
		NONE: 0,
		SMALL: 2,
		MEDIUM: 4,
		LARGE: 8,
	},
};

// * Matrix Rain Effect Constants
export const MATRIX_RAIN = {
	// Character Sets
	ALPHABET:
		"01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]()/\\|~`^+-=!@#$%^&*()_+-=[]{}|;':\",./<>?",

	// Animation Properties
	SPEED_RANGE: { min: 1, max: 3 },
	TRAIL_LENGTH_RANGE: { min: 3, max: 6 },

	// Visual Effects
	BRIGHTNESS_CHANCE: 0.95,
};

// * Security Constants
export const SECURITY = {
	RATE_LIMIT: {
		MAX_ATTEMPTS: 5,
		WINDOW_MS: 15 * 60 * 1000, // 15 minutes
		LOCKOUT_MS: 30 * 60 * 1000, // 30 minutes
	},
	SESSION: {
		DURATION_MS: 60 * 60 * 1000, // 1 hour
	},
};

// * Error Messages
export const ERROR_MESSAGES = {
	AUTH_REQUIRED: "Authentication required",
	RATE_LIMITED: "Too many attempts. Please try again later.",
	SESSION_EXPIRED: "Session expired. Please authenticate again.",
	STORAGE_ERROR: "Failed to save session data",
	AUDIO_ERROR: "Audio playback failed",
	CANVAS_ERROR: "Canvas rendering failed",
};

// * Utility Functions for Color Conversion
export const ColorUtils = {
	// Convert color object to CSS rgba string
	toRGBA: (color) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.alpha})`,

	// Convert color object to CSS rgb string
	toRGB: (color) => `rgb(${color.r}, ${color.g}, ${color.b})`,

	// Get color with custom alpha
	withAlpha: (color, alpha) => ({ ...color, alpha }),

	// Get color array for canvas context
	toArray: (color) => [color.r, color.g, color.b, color.alpha],
};

// * Performance Detection Utilities
export const PerformanceUtils = {
	// Get performance mode based on device type
	getPerformanceMode: () =>
		window.innerWidth < LAYOUT.MOBILE_BREAKPOINT ? "mobile" : "desktop",
};
