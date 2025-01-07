import React, { useState, useEffect, useCallback, memo, useRef, useMemo, useLayoutEffect } from "react";
import styled, { css, keyframes, createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";

// Animation keyframes
const animations = {
	fadeIn: keyframes`
		from { opacity: 0; }
		to { opacity: 1; }
	`,
	scaleIn: keyframes`
		from { transform: scale(0.95); }
		to { transform: scale(1); }
	`,
	scaleOut: keyframes`
		from { transform: scale(1); }
		to { transform: scale(0.95); }
	`,
	fullscreenEnter: keyframes`
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	`,
	fullscreenExit: keyframes`
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.98);
		}
	`
};

// Animation variants for Framer Motion
const variants = {
	initial: { opacity: 0, scale: 0.95 },
	enter: { 
			opacity: 1, 
			scale: 1,
			transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
	},
	exit: { 
		opacity: 0, 
		scale: 0.95,
		transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
	}
};

// Custom hook for handling visibility
const useVisibilityObserver = (ref) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!ref?.current) return;

		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0.1 }
		);

		observer.observe(ref.current);
		return () => observer?.disconnect();
	}, [ref]);

	return isVisible;
};

// Custom hook for screen orientation
const useScreenOrientation = () => {
	const [orientation, setOrientation] = useState(
		typeof window !== 'undefined' ? window.screen.orientation.type : 'portrait-primary'
	);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleChange = () => {
			setOrientation(window.screen.orientation.type);
		};

		window.screen.orientation.addEventListener("change", handleChange);
		return () => window.screen.orientation.removeEventListener("change", handleChange);
	}, []);

	return orientation;
};

// Enhanced fullscreen state hook
const useFullscreenState = (onFullscreenChange) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const elementRef = useRef(null);

	const toggleFullscreen = useCallback(async () => {
		try {
			if (!document.fullscreenElement) {
				await elementRef.current?.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
			
			const newState = !isFullscreen;
			setIsFullscreen(newState);
			onFullscreenChange?.(newState);
		} catch (err) {
			console.warn('Fullscreen API not supported, falling back to CSS fullscreen');
			const newState = !isFullscreen;
			setIsFullscreen(newState);
			onFullscreenChange?.(newState);
		}
	}, [isFullscreen, onFullscreenChange]);

	useEffect(() => {
		const handleFullscreenChange = () => {
			const newState = !!document.fullscreenElement;
			setIsFullscreen(newState);
			onFullscreenChange?.(newState);
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
	}, [onFullscreenChange]);

	return { isFullscreen, toggleFullscreen, elementRef };
};

// CSS Custom Properties
const GlobalStyle = createGlobalStyle`
	:root {
		--fullscreen-transition-duration: 0.4s;
		--fullscreen-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
		--fullscreen-backdrop-blur: 4px;
		--fullscreen-border-radius: 16px;
		--fullscreen-shadow-color: rgba(0, 0, 0, 0.2);
		--fullscreen-border-color: rgba(255, 255, 255, 0.05);
		--fullscreen-toggle-size: clamp(32px, 5vw, 40px);
		--fullscreen-header-offset: max(60px, 10vh);
	}
`;

// Styled components with modern patterns
const StyledWrapper = styled(motion.div)`
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
	transition: 
		transform var(--fullscreen-transition-duration) var(--fullscreen-transition-timing),
		background-color var(--fullscreen-transition-duration) ease,
		border-radius var(--fullscreen-transition-duration) ease;
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

	@media (prefers-reduced-motion: reduce) {
		transition: none;
		animation: none !important;
	}

	${props => props.$isFullscreen && css`
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		border-radius: 0;
		background: var(--color-grey-dark-1);
		padding: 0;
		animation: ${animations.fullscreenEnter} var(--fullscreen-transition-duration) var(--fullscreen-transition-timing);

		&.exiting {
			animation: ${animations.fullscreenExit} var(--fullscreen-transition-duration) var(--fullscreen-transition-timing);
		}
	`}

	@media (max-width: 768px) {
		border-radius: 12px;
		contain: strict;
	}

	@media (forced-colors: active) {
		border: 2px solid ButtonText;
	}

	@media print {
		background: none;
		box-shadow: none;
		border: 1px solid #000;
	}
`;

const Content = styled.div`
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

	${props => props.$isFullscreen && css`
		padding: clamp(10px, 3vw, 20px);
		padding-top: calc(var(--fullscreen-header-offset) + clamp(10px, 3vw, 20px));
	`}

	${props => props.$isGame && css`
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

		${props.$isFullscreen && css`
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

		${props => props.$isGame && css`
			padding: 5px;
			padding-top: calc(var(--header-height, 40px) + 5px);
		`}
	}
`;

const ToggleButton = styled.button`
	position: absolute;
	top: ${props => props.$isFullscreen ? 'calc(var(--header-height, 60px) + 16px)' : '16px'};
	right: 16px;
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
	transition: 
		transform 0.2s ease,
		background-color 0.2s ease;
	-webkit-tap-highlight-color: transparent;
	touch-action: manipulation;

	svg {
		width: 60%;
		height: 60%;
		transition: transform 0.2s ease;
		fill: currentColor;

		${props => props.$isFullscreen && css`
			transform: rotate(180deg);
		`}
	}

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			background: var(--color-grey-dark-4);
			transform: scale(1.05);
		}
	}

	&:active {
		transform: scale(0.95);
	}

	&:focus-visible {
		outline: 2px solid var(--color-sage);
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		top: ${props => props.$isFullscreen ? 'calc(var(--header-height, 60px) + 8px)' : '8px'};
		right: 8px;
	}

	@media (forced-colors: active) {
		border: 1px solid ButtonText;
		background: ButtonFace;
		color: ButtonText;
		forced-color-adjust: none;
	}

	@media print {
		display: none;
	}
`;

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

const FullscreenWrapper = memo(({
	children,
	className = "",
	contentClassName = "",
	isGame = false,
	onFullscreenChange,
}) => {
	const wrapperRef = useRef(null);
	const contentRef = useRef(null);
	const isVisible = useVisibilityObserver(wrapperRef);
	const orientation = useScreenOrientation();
	const { 
		isFullscreen, 
		toggleFullscreen, 
		elementRef 
	} = useFullscreenState(onFullscreenChange);

	// Set wrapperRef to elementRef from useFullscreenState
	useEffect(() => {
		if (wrapperRef.current) {
			elementRef.current = wrapperRef.current;
		}
	}, [elementRef]);

	// Handle resize with useLayoutEffect
	useLayoutEffect(() => {
		if (!contentRef.current) return;

		const observer = new ResizeObserver((entries) => {
			if (isFullscreen) {
				window.dispatchEvent(new Event('resize'));
			}
		});

		observer.observe(contentRef.current);
		return () => observer.disconnect();
	}, [isFullscreen]);

	// Enhanced swipe handlers
	const swipeHandlers = useSwipeable({
		onSwipedDown: (eventData) => {
			if (isFullscreen && eventData.velocity > 0.5) {
				toggleFullscreen();
			}
		},
		preventDefaultTouchmoveEvent: true,
		trackMouse: true
	});

	// Double tap handler
	const handleDoubleTap = useCallback((e) => {
		if (e.detail === 2) { // Double tap/click
			toggleFullscreen();
		}
	}, [toggleFullscreen]);

	// Share handler
	const handleShare = useCallback(async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Check this out!',
					text: 'Interactive content from my website',
					url: window.location.href
				});
			} catch (err) {
				if (err.name !== 'AbortError') {
					console.warn('Share failed:', err);
				}
			}
		}
	}, []);

	// Memoize icon component
	const Icon = useMemo(() => 
		isFullscreen ? ExitFullscreenIcon : FullscreenIcon,
		[isFullscreen]
	);

	return (
		<AnimatePresence mode="wait">
			<>
				<GlobalStyle />
				<StyledWrapper 
					ref={wrapperRef}
					className={className} 
					$isFullscreen={isFullscreen}
					$isVisible={isVisible}
					$orientation={orientation}
					variants={variants}
					initial="initial"
					animate="enter"
					exit="exit"
					layout
					{...swipeHandlers}
					onClick={handleDoubleTap}
					role="region"
					aria-label={isFullscreen ? "Fullscreen content" : "Content"}
				>
					<Content 
						ref={contentRef}
						className={contentClassName}
						$isFullscreen={isFullscreen}
						$isGame={isGame}
						layout
					>
						{children}
					</Content>
					<ToggleButton
						onClick={toggleFullscreen}
						onLongPress={handleShare}
						aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
						$isFullscreen={isFullscreen}
						aria-expanded={isFullscreen}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Icon />
					</ToggleButton>
				</StyledWrapper>
			</>
		</AnimatePresence>
	);
});

FullscreenWrapper.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	contentClassName: PropTypes.string,
	isGame: PropTypes.bool,
	onFullscreenChange: PropTypes.func,
};

FullscreenWrapper.displayName = 'FullscreenWrapper';

export default FullscreenWrapper;
