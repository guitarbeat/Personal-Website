import React from "react";

const CrossBlurComponent = ({ isVisible }) => {
	return (
		<div className="cross-blur-container">
			<svg
				style={{ position: "fixed", zIndex: 9998, pointerEvents: "none" }}
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<filter
					id="filter"
					x="-20%"
					y="-20%"
					width="140%"
					height="140%"
					filterUnits="objectBoundingBox"
					primitiveUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feGaussianBlur
						stdDeviation="0 20"
						in="SourceGraphic"
						edgeMode="none"
						result="blur"
					/>
					<feGaussianBlur
						stdDeviation="16 0"
						in="SourceGraphic"
						edgeMode="none"
						result="blur2"
					/>
					<feBlend mode="lighten" in="blur" in2="blur2" result="blend" />
					<feMerge result="merge">
						<feMergeNode in="blend" />
						<feMergeNode in="blend" />
					</feMerge>
				</filter>
			</svg>

			<div className="cross-blur-rotate">
				<div
					className="cross-blur"
					style={{ opacity: isVisible ? "1" : "0" }}
				/>
			</div>
		</div>
	);
};

export default CrossBlurComponent;
