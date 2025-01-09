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
import styled, { keyframes, css } from "styled-components";
import { useAuth } from "../effects/Matrix/AuthContext";

// Animation keyframes
const rotate = keyframes`
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
`;

// Animation variants
const variants = {
	initial: { opacity: 0, y: 20 },
	enter: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
	},
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
	color: var(--color-text);
	padding: 12px;
	position: relative;
	z-index: 2;
	transition: all 0.3s var(--bezier-curve);
	cursor: pointer;
	text-transform: uppercase;
	font-size: 0.85rem;
	font-weight: 500;
	background: none;
	border: none;
	outline: none;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	border-radius: 100px;
	white-space: nowrap;

	i {
		font-size: 1.1em;
		transition: transform 0.3s var(--bezier-curve);
	}

	${(props) =>
		props.$isActive &&
		css`
		color: var(--color-text);
		font-weight: 600;
	`}

	&:hover:not([data-active="true"]) {
		color: var(--color-sage-light);
		
		i {
			transform: scale(1.1);
		}
	}

	&:focus-visible {
		outline: 2px solid var(--color-sage);
		outline-offset: 2px;
	}

	@media (max-width: 480px) {
		font-size: 0.75rem;
		padding: 10px 8px;
		
		i {
			font-size: 1em;
		}
	}
`;

const TabSelector = styled.span`
	height: calc(100% - 12px);
	width: calc(33.333% - 4px);
	display: block;
	position: absolute;
	top: 6px;
	left: 6px;
	z-index: 1;
	border-radius: 100px;
	transition: transform 0.4s var(--bezier-curve);
	background: var(--color-sage);
	transform: translateX(${(props) => {
		const position = Number.parseInt(props.$position);
		return `${position * 100}%`;
	}});
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Content = styled(motion.div)`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
	padding: 1rem;
`;

const ErrorContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem;
	text-align: center;
`;

const LoadingWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem;
	
	i {
		font-size: 2rem;
		animation: ${rotate} 1s linear infinite;
	}
`;

// Loading fallback component
const LoadingFallback = memo(() => (
	<LoadingWrapper>
		<i className="fas fa-spinner" />
		<span>Loading...</span>
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
						<ErrorContainer>
							<i className="fas fa-exclamation-triangle" />
							<h3>Oops! Something went wrong.</h3>
							<p>{error?.message}</p>
							<button type="button" onClick={this.handleRetry}>
								Try Again
							</button>
						</ErrorContainer>
					);
		}

		return this.props.children;
	}
}

const ToolsSection = () => {
	const { isUnlocked = false } = useAuth();
	const { ref: sectionRef, inView } = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});

	// Create lazy components
	const Bingo = useMemo(
		() => lazy(createToolLoader(() => import("./bingo/bingo.js"))),
		[],
	);
	const Needs = useMemo(
		() => lazy(createToolLoader(() => import("./needs/index.js"))),
		[],
	);
	const Snake = useMemo(
		() => lazy(createToolLoader(() => import("./snake/snake.js"))),
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

	const { selectedTool, handleToolSelect } = useToolTransition("bingo", tools);

	const selectedToolData = useMemo(
		() => tools.find((tool) => tool.id === selectedTool),
		[selectedTool, tools],
	);

	const selectorPosition = useMemo(
		() => tools.findIndex((tool) => tool.id === selectedTool).toString(),
		[selectedTool, tools],
	);

	if (!isUnlocked) {
		return null;
	}

	return (
		<StyledSection id="tools" ref={sectionRef} $inView={inView}>
			<Container>
				<Title>Interactive Tools</Title>

				<TabContainer role="tablist" aria-label="Tool Selection">
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
										{React.createElement(selectedToolData.component)}
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

export default memo(ToolsSection);
