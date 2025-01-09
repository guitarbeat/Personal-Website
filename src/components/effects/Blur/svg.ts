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

// Reuse SVG container for all blur instances
let globalSvgContainer: SVGSVGElement | null = null;
let activeFilters = new Set<string>();

function getOrCreateSvgContainer(): SVGSVGElement {
	if (!globalSvgContainer) {
		globalSvgContainer = document.createElementNS(SVG_NS, "svg");
		globalSvgContainer.setAttribute("version", "1.1");
		globalSvgContainer.setAttribute("xmlns", SVG_NS);
		globalSvgContainer.classList.add("motionblur-svg");
		globalSvgContainer.style.cssText = "position:absolute;width:0;height:0;pointer-events:none;";
		
		const defs = document.createElementNS(SVG_NS, "defs");
		globalSvgContainer.appendChild(defs);
		document.body.appendChild(globalSvgContainer);
	}
	return globalSvgContainer;
}

function createSvgElement(type: string) {
	return document.createElementNS(SVG_NS, type);
}

export function createBlurSvg() {
	const svg = getOrCreateSvgContainer();
	const defs = svg.querySelector("defs")!;
	const filter = createSvgElement("filter");
	const filterId = generateId();
	
	filter.id = filterId;
	activeFilters.add(filterId);

	const blurFilter = createSvgElement("feGaussianBlur");
	blurFilter.setAttribute("stdDeviation", "0,0");
	blurFilter.setAttribute("edgeMode", "duplicate");
	blurFilter.setAttribute("in", "SourceGraphic");

	filter.appendChild(blurFilter);
	defs.appendChild(filter);

	// Use a WeakMap to track applied elements for cleanup
	const appliedElements = new WeakMap<HTMLElement, {
		originalFilter: string;
		originalTransform: string;
	}>();

	const destroy = () => {
		// Remove filter and clean up applied elements
		filter.remove();
		activeFilters.delete(filterId);

		// Clean up global SVG if no more filters
		if (activeFilters.size === 0 && globalSvgContainer) {
			globalSvgContainer.remove();
			globalSvgContainer = null;
		}
	};

	// Debounced blur updates
	let updateTimeout: number;
	const setBlur = ({ x, y }: Point) => {
		cancelAnimationFrame(updateTimeout);
		updateTimeout = requestAnimationFrame(() => {
			blurFilter.setAttribute("stdDeviation", `${x},${y}`);
		});
	};

	const getId = () => filterId;

	const applyTo = (element: HTMLElement) => {
		const originalFilter = element.style.filter;
		const originalTransform = element.style.transform;

		appliedElements.set(element, {
			originalFilter,
			originalTransform
		});

		// Use GPU acceleration and combine with existing filters
		element.style.filter = originalFilter
			? `${originalFilter} url(#${filterId})`
			: `url(#${filterId})`;
		
		element.style.transform = originalTransform
			? `${originalTransform} translate3d(0,0,0)`
			: "translate3d(0,0,0)";

		return () => {
			const original = appliedElements.get(element);
			if (original) {
				element.style.filter = original.originalFilter;
				element.style.transform = original.originalTransform;
				appliedElements.delete(element);
			}
		};
	};

	return {
		destroy,
		setBlur,
		getId,
		applyTo,
	};
}
