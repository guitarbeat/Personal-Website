import { initializeScrollSpeedWatcher } from "./scrollSpeed";
import { createSpring } from "./spring";
import { createBlurSvg } from "./svg";

/**
 * Initializes a scroll-speed-based blur effect on a target element.
 * @param {HTMLElement} [targetElement=document.body] - The element to apply blur to.
 * @param {object} [options]
 * @param {number} [options.blurCap=10] - Maximum blur value.
 * @param {"x"|"y"|"both"} [options.blurAxis="y"] - Which axis to blur.
 * @returns {() => void} Cleanup function.
 */
export function initializeBodyScrollMotionBlur(
	targetElement: HTMLElement = document.body,
	options: { blurCap?: number; blurAxis?: "x" | "y" | "both" } = {}
) {
	const { blurCap = 10, blurAxis = "y" } = options;
	const bodyBlur = createBlurSvg();
	const blurSpring = createSpring(0, { damping: 30, stiffness: 1000 });

	initializeScrollSpeedWatcher(document.documentElement, (speed) => {
		let x = 0, y = 0;
		if (blurAxis === "x") {
			x = Math.min(Math.abs(speed.x / 4), blurCap);
		} else if (blurAxis === "y") {
			y = Math.min(Math.abs(speed.y / 4), blurCap);
		} else if (blurAxis === "both") {
			x = Math.min(Math.abs(speed.x / 4), blurCap);
			y = Math.min(Math.abs(speed.y / 4), blurCap);
		}
		bodyBlur.setBlur({ x, y });
		blurSpring.transitionTo(blurAxis === "x" ? speed.x : speed.y);
	});

	return bodyBlur.applyTo(targetElement);
}
