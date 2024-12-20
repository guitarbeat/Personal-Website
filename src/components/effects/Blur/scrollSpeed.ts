import { createTimeout } from "./domUtils";
import { type Point, copyPoint, subtractPoints } from "./point";

function getElementScrollPosition(element: HTMLElement): Point {
	console.log(element.scrollTop);
	return {
		x: element.scrollLeft,
		y: element.scrollTop,
	};
}

export function initializeScrollSpeedWatcher(
	element: HTMLElement,
	onChange: (speed: Point) => void,
) {
	let lastPosition = getElementScrollPosition(element);
	let currentPosition = copyPoint(lastPosition);
	let speed = subtractPoints(currentPosition, lastPosition);

	const updateSpeed = (newSpeed: Point) => {
		speed = newSpeed;
		onChange(speed);
	};

	const clearSpeed = () => {
		updateSpeed({ x: 0, y: 0 });
	};

	let clearSpeedTimeout = createTimeout(() => {}, 100);

	const handleScroll = () => {
		clearSpeedTimeout();
		lastPosition = currentPosition;
		currentPosition = getElementScrollPosition(element);

		const newSpeed = subtractPoints(currentPosition, lastPosition);

		updateSpeed(newSpeed);

		clearSpeedTimeout = createTimeout(clearSpeed, 50);
	};

	document.addEventListener("scroll", handleScroll);

	return () => {
 		document.removeEventListener("scroll", handleScroll);
 	};
}
