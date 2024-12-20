// <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="filters">
// 	<defs>
// 		<filter id="blur">
// 			<feGaussianBlur in="SourceGraphic" stdDeviation="0,0" />
// 		</filter>
// 	</defs>
// </svg>

import { generateId } from "./id";
import type { Point } from "./point";

const SVG_NS = "http://www.w3.org/2000/svg";

function createSvgElement(type: string) {
	return document.createElementNS(SVG_NS, type);
}

export function createBlurSvg() {
	const svg = createSvgElement("svg");

	svg.setAttribute("version", "1.1");
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	svg.classList.add("motionblur-svg");
	// Add styles to prevent SVG from affecting layout
	svg.style.position = "absolute";
	svg.style.width = "0";
	svg.style.height = "0";
	svg.style.pointerEvents = "none";

	const defs = createSvgElement("defs");
	const filter = createSvgElement("filter");

	const filterId = generateId();

	filter.id = filterId;

	const blurFilter = createSvgElement("feGaussianBlur");

	blurFilter.setAttribute("stdDeviation", "0,0");
	blurFilter.setAttribute("edgeMode", "duplicate");
	blurFilter.setAttribute("in", "SourceGraphic");

	filter.appendChild(blurFilter);

	defs.appendChild(filter);

	svg.appendChild(defs);

	document.body.appendChild(svg);

	function destroy() {
		// Clean up SVG element when done
		svg.remove();
	}

	function setBlur({ x, y }: Point) {
		blurFilter.setAttribute("stdDeviation", `${x},${y}`);
	}

	function getId() {
		return filterId;
	}

	function applyTo(element: HTMLElement) {
		const originalFilter = element.style.filter;
		const originalTransform = element.style.transform;

		// Combine with existing filters if any
		element.style.filter = originalFilter
			? `${originalFilter} url(#${filterId})`
			: `url(#${filterId})`;

		// Preserve existing transforms
		element.style.transform = originalTransform
			? `${originalTransform} translate3d(0,0,0)`
			: "translate3d(0,0,0)";

		return function cancel() {
			element.style.filter = originalFilter;
			element.style.transform = originalTransform;
		};
	}

	return {
		destroy,
		setBlur,
		getId,
		applyTo,
	};
}
