(self.webpackChunkportfolio = self.webpackChunkportfolio || []).push([
	[587],
	{
		6587: (e, s, i) => {
			i.r(s), i.d(s, { default: () => n });
			i(5043);
			var r = i(579);
			const n = (e) => {
				const { isVisible: s } = e;
				return (0, r.jsxs)("div", {
					className: "cross-blur-container",
					children: [
						(0, r.jsx)("svg", {
							style: { position: "fixed", zIndex: 9998, pointerEvents: "none" },
							xmlns: "http://www.w3.org/2000/svg",
							"aria-hidden": "true",
							children: (0, r.jsxs)("filter", {
								id: "filter",
								x: "-20%",
								y: "-20%",
								width: "140%",
								height: "140%",
								filterUnits: "objectBoundingBox",
								primitiveUnits: "userSpaceOnUse",
								colorInterpolationFilters: "sRGB",
								children: [
									(0, r.jsx)("feGaussianBlur", {
										stdDeviation: "0 20",
										in: "SourceGraphic",
										edgeMode: "none",
										result: "blur",
									}),
									(0, r.jsx)("feGaussianBlur", {
										stdDeviation: "16 0",
										in: "SourceGraphic",
										edgeMode: "none",
										result: "blur2",
									}),
									(0, r.jsx)("feBlend", {
										mode: "lighten",
										in: "blur",
										in2: "blur2",
										result: "blend",
									}),
									(0, r.jsxs)("feMerge", {
										result: "merge",
										children: [
											(0, r.jsx)("feMergeNode", { in: "blend" }),
											(0, r.jsx)("feMergeNode", { in: "blend" }),
										],
									}),
								],
							}),
						}),
						(0, r.jsx)("div", {
							className: "cross-blur-rotate",
							children: (0, r.jsx)("div", {
								className: "cross-blur",
								style: { opacity: s ? "1" : "0" },
							}),
						}),
					],
				});
			};
		},
	},
]);
//# sourceMappingURL=587.1fc6e08c.chunk.js.map
