import { AnimatePresence, motion } from "framer-motion";
import React, {
	useState,
	lazy,
	Suspense,
	useCallback,
	memo,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import { useAuth } from "../effects/Matrix/AuthContext";

// Common animation configurations
const ANIMATION_CONFIG = {
	duration: {
		default: 0.3,
		enter: 0.5,
		exit: 0.3,
	},
	ease: [0.4, 0, 0.2, 1],
};

// Common style variables
const STYLE_VARS = {
	fullscreen: {
		transitionDuration: '0.4s',
		transitionTiming: 'cubic-bezier(0.4, 0, 0.2, 1)',
		backdropBlur: '4px',
		borderRadius: '16px',
		shadowColor: 'rgba(0, 0, 0, 0.2)',
		borderColor: 'rgba(255, 255, 255, 0.05)',
		toggleSize: 'clamp(32px, 5vw, 40px)',
		headerOffset: 'max(60px, 10vh)',
	},
};

// Animation keyframes
const animations = {
	fadeIn: keyframes`
		from { opacity: 0; }
		to { opacity: 1; }
	`,
	scale: (from, to) => keyframes`
		from { transform: scale(${from}); }
		to { transform: scale(${to}); }
	`,
	fullscreen: (type) => keyframes`
		from {
			opacity: ${type === 'enter' ? 0 : 1};
			transform: scale(${type === 'enter' ? 0.98 : 1});
		}
		to {
			opacity: ${type === 'enter' ? 1 : 0};
			transform: scale(${type === 'enter' ? 1 : 0.98});
		}
	`,
	rotate: keyframes`
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	`,
};

// Animation variants
const variants = {
	initial: { opacity: 0, y: 20 },
	enter: {
		opacity: 1,
		y: 0,
		transition: { duration: ANIMATION_CONFIG.duration.enter, ease: ANIMATION_CONFIG.ease },
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: { duration: ANIMATION_CONFIG.duration.exit, ease: ANIMATION_CONFIG.ease },
	},
};

// Common styled components base
const commonButtonStyles = css`
	border: none;
	outline: none;
	cursor: pointer;
	transition: all 0.2s ease;
	-webkit-tap-highlight-color: transparent;
	touch-action: manipulation;

	&:focus-visible {
		outline: 2px solid var(--color-sage);
		outline-offset: 2px;
	}

	&:active {
		transform: scale(0.95);
	}
`;

const commonFullscreenStyles = css`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	height: 100dvh;
	z-index: 99999;
`;

// CSS Custom Properties
const GlobalStyle = createGlobalStyle`
	:root {
		${Object.entries(STYLE_VARS.fullscreen).map(
			([key, value]) => `--fullscreen-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
		).join('\n\t\t')}
	}

	body.is-fullscreen {
		overflow: hidden !important;
		touch-action: none;

		#magicContainer,
		.vignette-top,
		.vignette-bottom,
		.vignette-left,
		.vignette-right {
			display: none !important;
		}
	}
`;

// Common components
const IconButton = styled.button`
	${commonButtonStyles}
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--color-grey-dark-3);
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: var(--color-text);
	border-radius: 50%;
	width: var(--fullscreen-toggle-size);
	height: var(--fullscreen-toggle-size);

	&:hover {
		background: var(--color-grey-dark-4);
		transform: scale(1.05);
	}
`;

const FlexCenter = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ErrorContainer = styled(FlexCenter)`
	flex-direction: column;
	gap: 1rem;
	padding: 2rem;
	text-align: center;
`;

const LoadingWrapper = styled(ErrorContainer)`
	i {
		font-size: 2rem;
		animation: ${animations.rotate} 1s linear infinite;
	}
`;

// Icons
const FullscreenIcon = () => (
	<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
		<path
			fill="currentColor"
			d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
		/>
	</svg>
);

const ExitFullscreenIcon = () => (
	<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
		<path
			fill="currentColor"
			d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
		/>
	</svg>
);

// Enhanced loading fallback
const LoadingFallback = memo(() => (
	<LoadingWrapper
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	>
		<motion.i 
			className="fas fa-spinner"
			animate={{ rotate: 360 }}
			transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
		/>
		<motion.span
			animate={{ opacity: [0.5, 1, 0.5] }}
			transition={{ duration: 1.5, repeat: Infinity }}
		>
			Loading...
		</motion.span>
	</LoadingWrapper>
));

LoadingFallback.displayName = "LoadingFallback";

// Tool transition hook
const useToolTransition = (initialTool, tools) => {
	const [selectedTool, setSelectedTool] = useState(initialTool);

	const handleToolSelect = useCallback((toolId) => {
		setSelectedTool(toolId);
	}, []);

	useEffect(() => {
		const handleKeyNavigation = (e) => {
			const currentIndex = tools.findIndex((tool) => tool.id === selectedTool);

			switch (e.key) {
				case "ArrowRight": {
					const nextTool = tools[(currentIndex + 1) % tools.length];
					handleToolSelect(nextTool.id);
					break;
				}
				case "ArrowLeft": {
					const prevTool =
						tools[(currentIndex - 1 + tools.length) % tools.length];
					handleToolSelect(prevTool.id);
					break;
				}
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyNavigation);
		return () => window.removeEventListener("keydown", handleKeyNavigation);
	}, [selectedTool, tools, handleToolSelect]);

	return {
		selectedTool,
		handleToolSelect,
	};
};

// Preload hints for tools
const preloadTools = () => {
	const hints = [
		{ rel: "preload", href: "./bingo/bingo.js", as: "script" },
		{ rel: "preload", href: "./needs/index.js", as: "script" },
		{ rel: "preload", href: "./snake/snake.js", as: "script" },
	];

	for (const { rel, href, as } of hints) {
		const link = document.createElement("link");
		link.rel = rel;
		link.href = href;
		link.as = as;
		document.head.appendChild(link);
	}
};

// Create a custom hook for tool loading
const createToolLoader = (importFn) => {
	return () =>
		new Promise((resolve, reject) => {
			const attempt = (attemptsLeft = 3) => {
				importFn()
					.then(resolve)
					.catch((error) => {
						if (attemptsLeft === 0) {
							reject(error);
						} else {
							setTimeout(() => attempt(attemptsLeft - 1), 1500);
						}
					});
			};
			attempt();
		});
};

// Error Boundary with retry capability
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Tool Error:", { error, errorInfo });
		this.setState({ errorInfo });

		// Report to error tracking service
		if (process.env.NODE_ENV === "production") {
			// TODO: Add error reporting service integration
		}
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null, errorInfo: null });
	};

	render() {
		const { hasError, error, errorInfo } = this.state;
		const { fallback } = this.props;

		if (hasError) {
			return typeof fallback === "function"
				? fallback({ error, errorInfo, onRetry: this.handleRetry })
				: fallback || (
						<ErrorContainer
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.i 
								className="fas fa-exclamation-triangle" 
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 0.8, loop: Infinity }}
							/>
							<h3>Tool Failed to Load</h3>
							<p>{error?.message || 'Unknown error occurred'}</p>
							<div className="error-actions">
								<button 
									type="button" 
									onClick={this.handleRetry}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Retry
								</button>
								<button 
									type="button" 
									onClick={() => window.location.reload()}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Reload Page
								</button>
							</div>
						</ErrorContainer>
					);
		}

		return this.props.children;
	}
}

// Custom hooks
const useVisibilityObserver = (ref) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!ref?.current) {
    return;
  }

		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0.1 },
		);

		observer.observe(ref.current);
		return () => observer?.disconnect();
	}, [ref]);

	return isVisible;
};

const useScreenOrientation = () => {
	const [orientation, setOrientation] = useState(
		typeof window !== "undefined"
			? window.screen.orientation.type
			: "portrait-primary",
	);

	useEffect(() => {
		if (typeof window === "undefined") {
    return;
  }

		const handleChange = () => {
			setOrientation(window.screen.orientation.type);
		};

		window.screen.orientation.addEventListener("change", handleChange);
		return () =>
			window.screen.orientation.removeEventListener("change", handleChange);
	}, []);

	return orientation;
};

// Styled components
const StyledSection = styled.section`
	padding: 4rem 0;
	position: relative;
	min-height: 100vh;
	overflow: hidden;
`;

const Container = styled.div`
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 2;
`;

const Title = styled.h1`
	margin-bottom: 3rem;
	text-align: center;
	color: var(--text-color);
	font-size: 2.5rem;
	font-weight: 700;
`;

const TabContainer = styled.div`
	display: inline-flex;
	background: rgba(var(--color-grey-dark-2-rgb), 0.3);
	padding: 6px;
	border-radius: 100px;
	position: relative;
	box-shadow: var(--shadow-dark);
	margin-bottom: 3rem;
	width: min(400px, 90vw);
	backdrop-filter: blur(10px);
`;

const TabList = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	width: 100%;
	position: relative;
	z-index: 2;
	gap: 4px;
`;

const TabButton = styled.button`
	${commonButtonStyles}
	color: var(--color-text);
	padding: 12px;
	position: relative;
	z-index: 2;
	transition: all 0.3s var(--bezier-curve);
	text-transform: uppercase;
	font-size: 0.85rem;
	font-weight: 500;
	background: none;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	border-radius: 100px;
	white-space: nowrap;
	overflow: hidden;

	i {
		font-size: 1.1em;
		transition: transform 0.3s var(--bezier-curve);
	}

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 2px;
		background: var(--color-sage);
		transition: all 0.3s var(--bezier-curve);
	}

	&:hover::after {
		width: 50%;
		left: 25%;
	}

	${(props) =>
		props.$isActive &&
		css`
		color: var(--color-text);
		font-weight: 600;
		&::after {
			width: 80%;
			left: 10%;
		}
	`}

	&:hover:not([data-active="true"]) {
		color: var(--color-sage-light);
		
		i {
			transform: scale(1.1);
		}
	}

	@media (max-width: 480px) {
		font-size: 0.75rem;
		padding: 10px 8px;
		
		i {
			font-size: 1em;
		}
	}
`;

const TabSelector = styled(motion.span)`
	height: calc(100% - 12px);
	width: calc(33.333% - 4px);
	background: var(--color-sage);
	border-radius: 100px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Content = styled(motion.div)`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
	padding: 1rem;
`;

const FullscreenContent = styled(motion.div)`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--color-grey-dark-2-rgb), 0.85);
	backdrop-filter: blur(var(--fullscreen-backdrop-blur));
	-webkit-backdrop-filter: blur(var(--fullscreen-backdrop-blur));
	border-radius: var(--fullscreen-border-radius);
	overflow: hidden;
	transition: all var(--fullscreen-transition-duration) var(--fullscreen-transition-timing);
	transform-origin: center;
	will-change: transform, background-color, border-radius;
	box-shadow:
		0 10px 30px -10px var(--fullscreen-shadow-color),
		0 0 0 1px var(--fullscreen-border-color);
	contain: content;
	touch-action: none;
	user-select: none;
	-webkit-user-select: none;
	-webkit-touch-callout: none;

	${(props) =>
		props.$isFullscreen &&
		css`
		${commonFullscreenStyles}
		background: var(--color-grey-dark-1);
		border-radius: 0;
		padding: 0;
		animation: ${animations.fullscreen('enter')} var(--fullscreen-transition-duration) var(--fullscreen-transition-timing);

		&.exiting {
			animation: ${animations.fullscreen('exit')} var(--fullscreen-transition-duration) var(--fullscreen-transition-timing);
		}
	`}

	@media (max-width: 768px) {
		border-radius: 12px;
		contain: strict;
	}
`;

const ToolContent = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: clamp(10px, 2vw, 20px);
	position: relative;
	z-index: 1;
	transition: padding 0.3s ease;
	contain: layout style;

	${(props) =>
		props.$isFullscreen &&
		css`
		padding: clamp(10px, 3vw, 20px);
		padding-top: calc(var(--fullscreen-header-offset) + clamp(10px, 3vw, 20px));
		height: 100vh;
		height: 100dvh;
	`}

	${(props) =>
		props.$isGame &&
		css`
		padding: clamp(5px, 1.5vw, 10px);
		
		canvas {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
			image-rendering: pixelated;
			image-rendering: crisp-edges;
			backface-visibility: hidden;
			transform: translateZ(0);
		}

		${props.$isFullscreen &&
		css`
			padding: clamp(5px, 2vw, 10px);
			padding-top: calc(var(--fullscreen-header-offset) + clamp(5px, 2vw, 10px));
		`}
	`}

	@media (max-width: 768px) {
		padding: clamp(8px, 1.5vw, 15px);
	}

	@media (max-height: 600px) and (orientation: landscape) {
		padding: 10px;
		padding-top: calc(var(--header-height, 40px) + 10px);

		${(props) =>
			props.$isGame &&
			css`
			padding: 5px;
			padding-top: calc(var(--header-height, 40px) + 5px);
		`}
	}
`;

const ToggleButton = styled(IconButton)`
	position: absolute;
	top: ${(props) => (props.$isFullscreen ? "calc(var(--header-height, 60px) + 16px)" : "16px")};
	right: 16px;
	z-index: 2;

	svg {
		width: 60%;
		height: 60%;
		transition: transform 0.2s ease;
		fill: currentColor;
		${(props) => props.$isFullscreen && css`transform: rotate(180deg);`}
	}

	@media (max-width: 768px) {
		top: ${(props) => (props.$isFullscreen ? "calc(var(--header-height, 60px) + 8px)" : "8px")};
		right: 8px;
	}
`;

// Add a new component for fullscreen mode
export const FullscreenTool = memo(
	({
		children,
		className = "",
		contentClassName = "",
		isGame = false,
		onExit,
	}) => {
		const navigate = useNavigate();

		const handleExit = useCallback(() => {
			navigate("/tools");
			onExit?.();
		}, [navigate, onExit]);

		// Handle escape key
		useEffect(() => {
			const handleEscKey = (e) => {
				if (e.key === "Escape") {
					handleExit();
				}
			};

			window.addEventListener("keydown", handleEscKey);
			return () => window.removeEventListener("keydown", handleEscKey);
		}, [handleExit]);

		return (
			<div className="fullscreen-tool">
				<div className="fullscreen-tool-content">
					{children}
				</div>
				<button
					className="exit-fullscreen-btn"
					onClick={handleExit}
					aria-label="Exit fullscreen"
				>
					<ExitFullscreenIcon />
				</button>
			</div>
		);
	},
);

FullscreenTool.displayName = "FullscreenTool";

// Add styles for the fullscreen tool
const FullscreenToolStyles = createGlobalStyle`
	.fullscreen-tool {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		background: var(--color-grey-dark-1);
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fullscreen-tool-content {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(10px, 3vw, 20px);
		padding-top: calc(var(--fullscreen-header-offset) + clamp(10px, 3vw, 20px));
	}

	.exit-fullscreen-btn {
		position: fixed;
		top: 1rem;
		right: 1rem;
		width: var(--fullscreen-toggle-size);
		height: var(--fullscreen-toggle-size);
		border-radius: 50%;
		background: var(--color-grey-dark-3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: var(--color-text);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		z-index: 2;
		transition: all 0.2s ease;

		&:hover {
			background: var(--color-grey-dark-4);
			transform: scale(1.05);
		}

		&:active {
			transform: scale(0.95);
		}
	}
`;

// Fullscreen wrapper component
const FullscreenWrapper = memo(
	({
		children,
		className = "",
		contentClassName = "",
		isGame = false,
		toolId = "",
	}) => {
		const navigate = useNavigate();
		const wrapperRef = useRef(null);
		const contentRef = useRef(null);
		const isVisible = useVisibilityObserver(wrapperRef);
		const orientation = useScreenOrientation();

		const handleFullscreen = useCallback(() => {
			navigate(`/tools/${toolId}/fullscreen`);
		}, [navigate, toolId]);

		return (
			<AnimatePresence mode="wait">
				<>
					<GlobalStyle />
					<FullscreenContent
						ref={wrapperRef}
						className={className}
						$isVisible={isVisible}
						$orientation={orientation}
						variants={variants}
						initial="initial"
						animate="enter"
						exit="exit"
						layout
					>
						<ToolContent
							ref={contentRef}
							className={contentClassName}
							$isGame={isGame}
							layout
						>
							{children}
						</ToolContent>
						<ToggleButton
							onClick={handleFullscreen}
							aria-label="Enter fullscreen"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<FullscreenIcon />
						</ToggleButton>
					</FullscreenContent>
				</>
			</AnimatePresence>
		);
	},
);

FullscreenWrapper.displayName = "FullscreenWrapper";

const ToolsSection = () => {
	const { isUnlocked = false } = useAuth();
	const { ref: sectionRef, inView } = useInView({
		threshold: 0.1,
		triggerOnce: true,
		rootMargin: '200px 0px' // Load earlier
	});

	// Create lazy components
	const Bingo = useMemo(
		() => lazy(createToolLoader(() => import("./bingo.js"))),
		[],
	);
	const Needs = useMemo(
		() => lazy(createToolLoader(() => import("./needs.js"))),
		[],
	);
	const Snake = useMemo(
		() => lazy(createToolLoader(() => import("./snake.js"))),
		[],
	);

	// Define tools
	const tools = useMemo(
		() => [
			{
				id: "bingo",
				title: "Bingo",
				icon: "fas fa-dice",
				component: Bingo,
				description: "Interactive bingo game",
				keywords: ["game", "multiplayer", "interactive"],
			},
			{
				id: "needs",
				title: "Needs",
				icon: "fas fa-chart-radar",
				component: Needs,
				description: "Needs assessment tool",
				keywords: ["assessment", "analysis", "chart"],
			},
			{
				id: "snake",
				title: "Snake",
				icon: "fas fa-gamepad",
				component: Snake,
				description: "Classic snake game",
				keywords: ["game", "arcade", "classic"],
			},
		],
		[Bingo, Needs, Snake],
	);

	// Preload tools when section comes into view
	useEffect(() => {
		if (inView) {
			preloadTools();
		}
	}, [inView]);

	// Add prefetching
	useEffect(() => {
		if (inView) {
			tools.forEach(tool => {
				const component = tool.component;
				if (component?.preload) component.preload();
			});
		}
	}, [inView, tools]);

	const { selectedTool, handleToolSelect } = useToolTransition("bingo", tools);

	const selectedToolData = useMemo(
		() => tools.find((tool) => tool.id === selectedTool),
		[selectedTool, tools],
	);

	const selectorPosition = useMemo(
		() => tools.findIndex((tool) => tool.id === selectedTool).toString(),
		[selectedTool, tools],
	);

	// Add performance markers
	useEffect(() => {
		if ('performance' in window) {
			performance.mark(`${selectedTool}-start`);
		}
		
		return () => {
			if ('performance' in window) {
				performance.mark(`${selectedTool}-end`);
				performance.measure(
					`${selectedTool}-duration`,
					`${selectedTool}-start`,
					`${selectedTool}-end`
				);
			}
		};
	}, [selectedTool]);

	if (!isUnlocked) {
		return null;
	}

	return (
		<StyledSection id="tools" ref={sectionRef} $inView={inView}>
			<Container>
				<Title>Interactive Tools</Title>

				<TabContainer 
					role="tablist" 
					aria-label="Tool Selection"
					onKeyDown={(e) => {
						// Add arrow key navigation
						const key = e.key;
						if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
							e.preventDefault();
							// Implement keyboard navigation logic
						}
					}}
				>
					<TabList>
						{tools.map((tool) => (
							<TabButton
								key={tool.id}
								$isActive={selectedTool === tool.id}
								onClick={() => handleToolSelect(tool.id)}
								data-active={selectedTool === tool.id}
								role="tab"
								aria-selected={selectedTool === tool.id}
								aria-controls={`${tool.id}-panel`}
								aria-label={tool.description}
							>
								<i className={tool.icon} />
								{tool.title}
							</TabButton>
						))}
					</TabList>
					<TabSelector $position={selectorPosition} aria-hidden="true" />
				</TabContainer>

				<AnimatePresence mode="wait">
					<Content
						key={selectedTool}
						role="tabpanel"
						id={`${selectedTool}-panel`}
						aria-labelledby={selectedTool}
						variants={variants}
						initial="initial"
						animate="enter"
						exit="exit"
					>
						<ErrorBoundary
							fallback={({ error, onRetry }) => (
								<ErrorContainer>
									<i className="fas fa-exclamation-triangle" />
									<h3>Oops! Something went wrong.</h3>
									<p>{error?.message}</p>
									<button type="button" onClick={onRetry}>
										Try Again
									</button>
								</ErrorContainer>
							)}
						>
							<Suspense fallback={<LoadingFallback />}>
								{selectedToolData && (
									<motion.section
										aria-label={selectedToolData.description}
										layout
										variants={variants}
										initial="initial"
										animate="enter"
										exit="exit"
										style={{ width: "100%" }}
									>
										<FullscreenWrapper toolId={selectedTool}>
											{React.createElement(selectedToolData.component)}
										</FullscreenWrapper>
									</motion.section>
								)}
							</Suspense>
						</ErrorBoundary>
					</Content>
				</AnimatePresence>
			</Container>
		</StyledSection>
	);
};

export { FullscreenWrapper, FullscreenToolStyles };
export default memo(ToolsSection);
