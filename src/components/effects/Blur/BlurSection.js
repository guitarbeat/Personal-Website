import React, { useEffect, useRef } from "react";
import { initializeBodyScrollMotionBlur } from "./bodyScroll";
import PropTypes from "prop-types";

/**
 * BlurSection wraps content and applies a scroll-speed-based blur effect.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to blur.
 * @param {string} [props.className] - Optional class name.
 * @param {object} [props.style] - Optional style object.
 * @param {string|React.ElementType} [props.as] - Element type to render as.
 * @param {boolean} [props.disabled] - Disable blur effect.
 * @param {number} [props.blurCap=10] - Maximum blur value.
 * @param {"x"|"y"|"both"} [props.blurAxis="y"] - Which axis to blur.
 * @returns {JSX.Element}
 */
const BlurSection = ({
	children,
	className,
	style = {},
	as: Component = "div",
	disabled = false,
	blurCap = 10,
	blurAxis = "y",
	...props
}) => {
	const containerRef = useRef(null);
	const cleanupRef = useRef(null);

	useEffect(() => {
		if (!disabled && containerRef.current) {
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = null;
			}
			cleanupRef.current = initializeBodyScrollMotionBlur(containerRef.current, { blurCap, blurAxis });
		}
		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = null;
			}
		};
	}, [disabled, blurCap, blurAxis]);

	return (
		<Component
			ref={containerRef}
			className={className}
			style={{
				position: "relative",
				willChange: !disabled ? "filter" : "auto",
				transition: "filter 0.15s ease-out",
				...style,
			}}
			{...props}
		>
			{children}
		</Component>
	);
};

BlurSection.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	style: PropTypes.object,
	as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
	disabled: PropTypes.bool,
	blurCap: PropTypes.number,
	blurAxis: PropTypes.oneOf(["x", "y", "both"]),
};

BlurSection.defaultProps = {
	className: undefined,
	style: {},
	as: "div",
	disabled: false,
	blurCap: 10,
	blurAxis: "y",
};

export default React.memo(BlurSection);
