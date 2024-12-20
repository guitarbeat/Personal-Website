import { initializeScrollSpeedWatcher } from "./scrollSpeed";
import { createSpring } from "./spring";
import { createBlurSvg } from "./svg";

export function initializeBodyScrollMotionBlur(targetElement = document.body) {
	const bodyBlur = createBlurSvg();
	const blurYSpring = createSpring(0, { damping: 30, stiffness: 1000 });

	initializeScrollSpeedWatcher(document.documentElement, (speed) => {
		// Only apply vertical blur with reduced intensity
		bodyBlur.setBlur({ x: 0, y: Math.min(Math.abs(speed.y / 4), 10) });
		blurYSpring.transitionTo(speed.y);
	});

	const cleanup = bodyBlur.applyTo(targetElement);
	return cleanup;
}
