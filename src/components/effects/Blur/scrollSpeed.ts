import { createTimeout } from "./domUtils";
import { type Point, copyPoint, subtractPoints } from "./point";

function getElementScrollPosition(element: HTMLElement): Point {
	return {
		x: element.scrollLeft,
		y: element.scrollTop,
	};
}

// Throttle function to limit execution frequency
function throttle<T extends (...params: unknown[]) => void>(
	func: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}

export function initializeScrollSpeedWatcher(
	element: HTMLElement,
	onChange: (speed: Point) => void,
) {
	let lastPosition = getElementScrollPosition(element);
	let currentPosition = copyPoint(lastPosition);
	let speed = subtractPoints(currentPosition, lastPosition);
	let rafId: number | null = null;
	let isProgrammaticScroll = false;
	let isActive = true;

	const updateSpeed = (newSpeed: Point) => {
		speed = newSpeed;
		onChange(speed);
	};

	const clearSpeed = () => {
		updateSpeed({ x: 0, y: 0 });
	};

	let clearSpeedTimeout = createTimeout(() => { }, 50);

	// Handle programmatic scrolls from infinite scroll
	const handleProgrammaticScroll = (event: CustomEvent) => {
		if (!isActive) return;
		isProgrammaticScroll = true;
		// Smoothly transition the blur during the position reset
		const { fromY, toY } = event.detail;
		const virtualSpeed = { x: 0, y: (toY - fromY) / 4 }; // Reduced intensity
		updateSpeed(virtualSpeed);

		setTimeout(() => {
			if (isActive) {
				isProgrammaticScroll = false;
				clearSpeed();
			}
		}, 100);
	};

	// Optimized scroll handler with better performance
	const handleScroll = () => {
		if (!isActive || isProgrammaticScroll) return;

		// Cancel any existing animation frame
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}

		// Use requestAnimationFrame for the next frame only
		rafId = requestAnimationFrame(() => {
			if (!isActive) return;

			lastPosition = currentPosition;
			currentPosition = getElementScrollPosition(element);
			const newSpeed = subtractPoints(currentPosition, lastPosition);

			// Only update if there's actual movement
			if (newSpeed.x !== 0 || newSpeed.y !== 0) {
				updateSpeed(newSpeed);
				clearSpeedTimeout();
				clearSpeedTimeout = createTimeout(clearSpeed, 50); // Increased timeout for better performance
			}

			rafId = null;
		});
	};

	// Throttle scroll handler to reduce frequency
	const throttledHandleScroll = throttle(handleScroll, 16); // Increased to ~60fps

	document.addEventListener("scroll", throttledHandleScroll, { passive: true });
	window.addEventListener("programmaticScroll", handleProgrammaticScroll as EventListener);

	return () => {
		isActive = false;
		document.removeEventListener("scroll", throttledHandleScroll);
		window.removeEventListener("programmaticScroll", handleProgrammaticScroll as EventListener);
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
		clearSpeedTimeout();
	};
}
