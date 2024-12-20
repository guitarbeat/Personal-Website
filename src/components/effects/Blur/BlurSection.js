import React, { useEffect, useRef, useState } from "react";
import { initializeBodyScrollMotionBlur } from "./bodyScroll";

const isMobileDevice = () => window.innerWidth <= 768;

const BlurSection = ({
	children,
	className,
	style = {},
	as: Component = "div",
	...props
}) => {
	const containerRef = useRef(null);
	const [isMobile, setIsMobile] = useState(isMobileDevice());

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(isMobileDevice());
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (containerRef.current && !isMobile) {
			const cleanup = initializeBodyScrollMotionBlur(containerRef.current);
			return () => {
				cleanup?.();
			};
		}
	}, [isMobile]);

	return (
		<Component
			ref={containerRef}
			className={className}
			style={{
				position: "relative",
				...style,
			}}
			{...props}
		>
			{children}
		</Component>
	);
};

export default BlurSection;
