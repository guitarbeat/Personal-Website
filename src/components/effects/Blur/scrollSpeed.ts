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
		isProgrammaticScroll = true;
		// Smoothly transition the blur during the position reset
		const { fromY, toY } = event.detail;
		const virtualSpeed = { x: 0, y: (toY - fromY) / 4 }; // Reduced intensity
		updateSpeed(virtualSpeed);

		setTimeout(() => {
			isProgrammaticScroll = false;
			clearSpeed();
		}, 100);
	};

	// Use requestAnimationFrame for smooth updates
	const updateFrame = () => {
		if (isProgrammaticScroll) return;

		lastPosition = currentPosition;
		currentPosition = getElementScrollPosition(element);
		const newSpeed = subtractPoints(currentPosition, lastPosition);

		// Only update if there's actual movement
		if (newSpeed.x !== 0 || newSpeed.y !== 0) {
			updateSpeed(newSpeed);
			clearSpeedTimeout();
			clearSpeedTimeout = createTimeout(clearSpeed, 30);
		}

		rafId = requestAnimationFrame(updateFrame);
	};

	// Throttle scroll handler to run at most every 8ms for more responsive updates
	const handleScroll = throttle(() => {
		if (rafId === null && !isProgrammaticScroll) {
			rafId = requestAnimationFrame(updateFrame);
		}
	}, 8);

	document.addEventListener("scroll", handleScroll, { passive: true });
	window.addEventListener("programmaticScroll", handleProgrammaticScroll as EventListener);

	return () => {
		document.removeEventListener("scroll", handleScroll);
		window.removeEventListener("programmaticScroll", handleProgrammaticScroll as EventListener);
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}
		clearSpeedTimeout();
	};
}
