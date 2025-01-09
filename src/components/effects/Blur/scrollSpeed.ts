import { createTimeout } from "./domUtils";
import { type Point, copyPoint, subtractPoints } from "./point";

function getElementScrollPosition(element: HTMLElement): Point {
	return {
		x: element.scrollLeft,
		y: element.scrollTop,
	};
}

// Throttle function to limit execution frequency
function throttle(func: Function, limit: number): (...args: any[]) => void {
	let inThrottle: boolean;
	return (...args: any[]) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
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

	const updateSpeed = (newSpeed: Point) => {
		speed = newSpeed;
		onChange(speed);
	};

	const clearSpeed = () => {
		updateSpeed({ x: 0, y: 0 });
	};

	let clearSpeedTimeout = createTimeout(() => {}, 50);

	// Use requestAnimationFrame for smooth updates
	const updateFrame = () => {
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
		if (rafId === null) {
			rafId = requestAnimationFrame(updateFrame);
		}
	}, 8);

	document.addEventListener("scroll", handleScroll, { passive: true });

	return () => {
		document.removeEventListener("scroll", handleScroll);
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}
		clearSpeedTimeout();
	};
}
