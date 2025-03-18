import React, { useEffect, useRef, useState, useCallback } from "react";
import { initializeBodyScrollMotionBlur } from "./bodyScroll";

const MOBILE_BREAKPOINT = 768;
const isMobileDevice = () => window.innerWidth <= MOBILE_BREAKPOINT;

const BlurSection = ({
	children,
	className,
	style = {},
	as: Component = "div",
	disabled = false,
	...props
}) => {
	const containerRef = useRef(null);
	const cleanupRef = useRef(null);
	const [isMobile, setIsMobile] = useState(isMobileDevice());
	const resizeTimeoutRef = useRef(null);

	const handleResize = useCallback(() => {
		// Clear any existing resize timeout
		if (resizeTimeoutRef.current) {
			clearTimeout(resizeTimeoutRef.current);
		}

		// Wait for resize to finish before updating mobile state
		resizeTimeoutRef.current = setTimeout(() => {
			const wasMobile = isMobile;
			const nowMobile = isMobileDevice();
			
			if (wasMobile !== nowMobile) {
				setIsMobile(nowMobile);
			}
		}, 250); // Longer debounce for resize events
	}, [isMobile]);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			if (resizeTimeoutRef.current) {
				clearTimeout(resizeTimeoutRef.current);
			}
		};
	}, [handleResize]);

	useEffect(() => {
		if (!disabled && containerRef.current && !isMobile) {
			// Clean up previous effect if it exists
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = null;
			}

			cleanupRef.current = initializeBodyScrollMotionBlur(containerRef.current);
		}

		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = null;
			}
		};
	}, [isMobile, disabled]);

	return (
		<Component
			ref={containerRef}
			className={className}
			style={{
				position: "relative",
				willChange: !disabled && !isMobile ? "filter" : "auto",
				transition: "filter 0.15s ease-out", // Smooth transition for blur changes
				...style,
			}}
			{...props}
		>
			{children}
		</Component>
	);
};

export default React.memo(BlurSection);
