import React, { useState, useEffect, useCallback, memo, useRef, useMemo, useLayoutEffect } from "react";
import styled, { css, keyframes } from "styled-components";
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

// Styled components with modern patterns
const StyledWrapper = styled(motion.div)`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(var(--color-grey-dark-2-rgb), 0.85);
	backdrop-filter: blur(4px);
	border-radius: 16px;
	overflow: hidden;
	transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow:
		0 10px 30px -10px rgb(0 0 0 / 20%),
		0 0 0 1px rgb(255 255 255 / 5%);
	will-change: transform, opacity;
	touch-action: none;
	user-select: none;
	-webkit-user-select: none;
	-webkit-touch-callout: none;

	${props => props.$animation === 'enter' && css`
		animation: ${animations.fadeIn} 0.4s ease-out,
				   ${animations.scaleIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	`}

	${props => props.$animation === 'exit' && css`
		animation: ${animations.fadeIn} 0.4s ease-out reverse,
				   ${animations.scaleOut} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	`}

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
	`}

	${props => props.$isVisible && css`
		opacity: 1;
		transform: translateY(0);
	`}
`;

const Content = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	position: relative;
	z-index: 1;

	${props => props.$isFullscreen && css`
		padding: clamp(10px, 3vw, 20px);
		padding-top: calc(var(--header-height, 60px) + clamp(10px, 3vw, 20px));
	`}

	${props => props.$isGame && css`
		padding: 10px;
		
		canvas {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
		}

		@media (max-width: 768px) {
			padding: 5px;
		}
	`}

	@media (max-width: 768px) {
		${props => props.$isFullscreen && css`
			padding: clamp(10px, 2vw, 15px);
			padding-top: calc(var(--header-height, 60px) + clamp(10px, 2vw, 15px));
		`}
	}

	@media (max-height: 600px) {
		${props => props.$isFullscreen && css`
			padding: 10px;
			padding-top: calc(var(--header-height, 40px) + 10px);
		`}
	}
`;

const ToggleButton = styled.button`
	position: absolute;
	top: ${props => props.$isFullscreen ? 'calc(var(--header-height, 60px) + 16px)' : '16px'};
	right: 16px;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: var(--color-grey-dark-3);
	border: 1px solid rgb(255 255 255 / 10%);
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

	&:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	svg {
		width: 24px;
		height: 24px;
	}

	@media (max-width: 768px) {
		top: ${props => props.$isFullscreen ? 'calc(var(--header-height, 60px) + 8px)' : '8px'};
		right: 8px;
		width: 32px;
		height: 32px;

		svg {
			width: 20px;
			height: 20px;
		}
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
