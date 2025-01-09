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

	const handleResize = useCallback(() => {
		const wasMobile = isMobile;
		const nowMobile = isMobileDevice();
		
		if (wasMobile !== nowMobile) {
			setIsMobile(nowMobile);
		}
	}, [isMobile]);

	useEffect(() => {
		// Debounced resize handler
		let resizeTimeout;
		const debouncedResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(handleResize, 100);
		};

		window.addEventListener("resize", debouncedResize);
		return () => {
			window.removeEventListener("resize", debouncedResize);
			clearTimeout(resizeTimeout);
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
				...style,
			}}
			{...props}
		>
			{children}
		</Component>
	);
};

export default React.memo(BlurSection);
