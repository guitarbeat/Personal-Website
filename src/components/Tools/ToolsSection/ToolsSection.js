import { AnimatePresence, motion } from "framer-motion";
import React, {
	useState,
	lazy,
	Suspense,
	useCallback,
	memo,
	useEffect,
	useMemo,
} from "react";
import { useInView } from "react-intersection-observer";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import { useAuth } from "../../effects/Matrix/AuthContext";
import { FullscreenWrapper } from "./FullscreenWrapper";
import { useKeyboardNavigation } from "../shared/hooks";
import "./styles/index.scss";

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

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
const commonFullscreenStyles = css`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	height: 100dvh;
	z-index: 99999;
`;

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
const FullscreenIcon = () => (
	<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
		<path
			fill="currentColor"
			d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
		/>
	</svg>
);

// eslint-disable-next-line no-unused-vars
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

	useKeyboardNavigation((key) => {
		const currentIndex = tools.findIndex((tool) => tool.id === selectedTool);

		if (key === "ArrowRight") {
			const nextTool = tools[(currentIndex + 1) % tools.length];
			handleToolSelect(nextTool.id);
		} else if (key === "ArrowLeft") {
			const prevTool = tools[(currentIndex - 1 + tools.length) % tools.length];
			handleToolSelect(prevTool.id);
		}
	}, ["ArrowRight", "ArrowLeft"]);

	return {
		selectedTool,
		handleToolSelect,
	};
};

// Preload hints for tools
const preloadTools = () => {
	const hints = [
		{ rel: "preload", href: "./Bingo/BingoGame.js", as: "script" },
		{ rel: "preload", href: "./Snake/SnakeGame.js", as: "script" },
		{ rel: "preload", href: "./ConflictMediation/ConflictMediation.js", as: "script" },
	];

	for (const { rel, href, as } of hints) {
		const link = document.createElement("link");
		link.rel = rel;
		link.href = href;
		link.as = as;
		document.head.appendChild(link);
	}
};

// eslint-disable-next-line no-unused-vars
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
		console.error("Tool error:", error, errorInfo);
		this.setState({ errorInfo });
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null, errorInfo: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<ErrorContainer>
					<h3>Something went wrong</h3>
					<p>
						{this.state.error?.message || "An unexpected error occurred"}
					</p>
					<button onClick={this.handleRetry}>Retry</button>
				</ErrorContainer>
			);
		}

		return this.props.children;
	}
}

// Tool card component
const ToolCard = memo(({ tool, isSelected, onSelect }) => {
	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});

	return (
		<Card
			ref={ref}
			$isSelected={isSelected}
			onClick={() => onSelect(tool.id)}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.3 }}
		>
			<CardIcon>
				<i className={tool.icon}></i>
			</CardIcon>
			<CardContent>
				<CardTitle>{tool.title}</CardTitle>
				<CardDescription>{tool.description}</CardDescription>
			</CardContent>
		</Card>
	);
});

ToolCard.displayName = "ToolCard";

// Styled components for tool cards
const Card = styled(motion.div)`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1.5rem;
	background: ${(props) =>
		props.$isSelected
			? "var(--color-grey-dark-3)"
			: "var(--color-grey-dark-2)"};
	border: 1px solid
		${(props) =>
			props.$isSelected
				? "var(--color-sage)"
				: "rgba(255, 255, 255, 0.05)"};
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.3s ease;
	height: 100%;
	box-shadow: ${(props) =>
		props.$isSelected
			? "0 8px 32px rgba(0, 0, 0, 0.3)"
			: "0 4px 16px rgba(0, 0, 0, 0.2)"};

	&:hover {
		background: var(--color-grey-dark-3);
		border-color: ${(props) =>
			props.$isSelected
				? "var(--color-sage)"
				: "rgba(255, 255, 255, 0.1)"};
	}
`;

const CardIcon = styled.div`
	font-size: 2rem;
	margin-bottom: 1rem;
	color: var(--color-sage);
`;

const CardContent = styled.div`
	text-align: center;
`;

const CardTitle = styled.h3`
	margin-bottom: 0.5rem;
	font-size: 1.2rem;
`;

const CardDescription = styled.p`
	font-size: 0.9rem;
	color: var(--color-text-light);
`;

// Tool container
const ToolContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1.5rem;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		padding: 1rem;
	}
`;

// Tool content container
const ToolContentContainer = styled.div`
	width: 100%;
	max-width: 1200px;
	margin: 2rem auto;
	min-height: 400px;
`;

// Main component
const ToolsSection = () => {
	const { isUnlocked } = useAuth();
	const [ref, inView] = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});

	// Define available tools
	const tools = useMemo(
		() => [
			{
				id: "bingo",
				title: "Bingo Game",
				icon: "fas fa-th",
				component: lazy(() => import("../Bingo")),
				description: "Create and play custom bingo games",
				keywords: ["game", "bingo", "cards", "multiplayer"],
			},
			{
				id: "snake",
				title: "Snake Game",
				icon: "fas fa-gamepad",
				component: lazy(() => import("../Snake")),
				description: "Classic snake game with modern visuals",
				keywords: ["game", "snake", "arcade", "retro"],
			},
			{
				id: "conflict-mediation",
				title: "Conflict Resolution",
				icon: "fas fa-balance-scale",
				component: lazy(() => import("../ConflictMediation")),
				description: "Tool for resolving interpersonal conflicts",
				keywords: ["conflict", "resolution", "mediation", "relationships"],
			},
		],
		[],
	);

	// Tool selection state
	const { selectedTool, handleToolSelect } = useToolTransition(
		tools[0]?.id,
		tools,
	);

	// Get the selected tool component
	const SelectedToolComponent = useMemo(() => {
		const tool = tools.find((t) => t.id === selectedTool);
		return tool?.component;
	}, [selectedTool, tools]);

	// Preload tools when section is in view and unlocked
	useEffect(() => {
		if (inView && isUnlocked) {
			preloadTools();
		}
	}, [inView, isUnlocked]);

	// Don't render anything if not unlocked
	if (!isUnlocked) {
		return null;
	}

	return (
		<section id="tools" className="section" ref={ref}>
			<div className="section-title-container">
				<h2 className="section-title">Interactive Tools</h2>
				<div className="section-subtitle">
					Explore these interactive tools and utilities
				</div>
			</div>

			<ToolContainer>
				{tools.map((tool) => (
					<ToolCard
						key={tool.id}
						tool={tool}
						isSelected={selectedTool === tool.id}
						onSelect={handleToolSelect}
					/>
				))}
			</ToolContainer>

			<ToolContentContainer>
				<AnimatePresence mode="wait">
					{SelectedToolComponent && (
						<ErrorBoundary key={selectedTool}>
							<Suspense fallback={<LoadingFallback />}>
								<FullscreenWrapper toolId={selectedTool}>
									<SelectedToolComponent />
								</FullscreenWrapper>
							</Suspense>
						</ErrorBoundary>
					)}
				</AnimatePresence>
			</ToolContentContainer>
		</section>
	);
};

export default ToolsSection;
