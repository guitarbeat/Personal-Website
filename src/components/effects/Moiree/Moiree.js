import chroma from "chroma-js"; // Import the chroma-js library from the specified CDN
import * as ogl from "ogl"; // Import the ogl library from the specified CDN
import React, { useEffect } from "react";
import "./Moiree.css";

function Magic() {
	const { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } = ogl;

	let renderer;
	let gl;
	let camera;
        // eslint-disable-next-line no-unused-vars
	let width;
	let height;
	let wWidth;
	// let wHeight; // Remove this line
	let mouse;
	let mouseOver = false;
	let isTouchDevice = false;
	let touchActive = false;
	let lastTouchTime = 0;
	let touchCooldown = 50; // ms between touch events

	// Performance monitoring
	let frameCount = 0;
	let lastTime = 0;
	let fps = 60;
	let performanceIndicator = null;

	let gridWidth;
	let gridHeight;
	let gridRatio;
	let ripple;
	let points;
	const color1 = new Color([0.149, 0.141, 0.912]);
	const color2 = new Color([1.0, 0.833, 0.224]);
	let cameraZ = 50;

	// Enhanced performance utilities
	const debounce = (func, wait) => {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	const throttle = (func, limit) => {
		let inThrottle;
		return function (...args) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => {
					inThrottle = false;
				}, limit);
			}
		};
	};

	// Performance monitoring
	const createPerformanceIndicator = () => {
		if (performanceIndicator) return;
		
		performanceIndicator = document.createElement('div');
		performanceIndicator.className = 'moiree-performance-indicator';
		performanceIndicator.innerHTML = `FPS: ${Math.round(fps)}`;
		document.body.appendChild(performanceIndicator);
		
		// Show for 3 seconds then hide
		setTimeout(() => {
			performanceIndicator.classList.add('visible');
		}, 100);
		
		setTimeout(() => {
			if (performanceIndicator) {
				performanceIndicator.classList.remove('visible');
				setTimeout(() => {
					if (performanceIndicator && performanceIndicator.parentNode) {
						performanceIndicator.parentNode.removeChild(performanceIndicator);
						performanceIndicator = null;
					}
				}, 300);
			}
		}, 3000);
	};

	const updatePerformanceIndicator = () => {
		if (performanceIndicator) {
			performanceIndicator.innerHTML = `FPS: ${Math.round(fps)}`;
		}
	};

	// Enhanced touch detection
	const detectTouchDevice = () => {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	};

	// Enhanced coordinate normalization
	const normalizeCoordinates = (x, y) => {
		const rect = gl.canvas.getBoundingClientRect();
		const scaleX = gl.canvas.width / rect.width;
		const scaleY = gl.canvas.height / rect.height;
		
		return {
			x: (x - rect.left) * scaleX,
			y: (y - rect.top) * scaleY
		};
	};

	// Enhanced mouse/touch position calculation
	const calculateMousePosition = (e) => {
		let clientX, clientY;
		
		if (e.changedTouches?.length) {
			clientX = e.changedTouches[0].clientX;
			clientY = e.changedTouches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		const normalized = normalizeCoordinates(clientX, clientY);
		
		return {
			x: (normalized.x / gl.canvas.width) * 2 - 1,
			y: (1.0 - normalized.y / gl.canvas.height) * 2 - 1
		};
	};

	const init = () => {
		try {
			renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2) }); // Limit DPR for performance
			gl = renderer.gl;
			
			const container = document.querySelector("#magicContainer");
			if (!container) {
				console.warn("Magic container not found, creating fallback");
				const fallbackContainer = document.createElement('div');
				fallbackContainer.id = 'magicContainer';
				fallbackContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100vh;z-index:0;pointer-events:none;';
				document.body.appendChild(fallbackContainer);
				fallbackContainer.appendChild(gl.canvas);
			} else {
				container.appendChild(gl.canvas);
			}

			camera = new Camera(gl, { fov: 45 });
			camera.position.set(0, 0, cameraZ);

			resize();
			window.addEventListener("resize", debounce(resize, 250), false);

			mouse = new Vec2();
			isTouchDevice = detectTouchDevice();

			// Show performance indicator on first interaction
			let hasInteracted = false;
			const showPerformanceOnInteraction = () => {
				if (!hasInteracted) {
					hasInteracted = true;
					createPerformanceIndicator();
					// Remove listeners after first interaction
					document.body.removeEventListener('mousemove', showPerformanceOnInteraction);
					document.body.removeEventListener('touchstart', showPerformanceOnInteraction);
				}
			};
			
			document.body.addEventListener('mousemove', showPerformanceOnInteraction, { passive: true });
			document.body.addEventListener('touchstart', showPerformanceOnInteraction, { passive: true });

			initScene();
			initEventsListener();
			requestAnimationFrame(animate);
		} catch (error) {
			console.error("Failed to initialize Moirée effect:", error);
			// Fallback: show a simple message
			const container = document.querySelector("#magicContainer") || document.body;
			container.innerHTML = '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:white;text-align:center;font-family:Arial,sans-serif;"><h3>Interactive Effect Unavailable</h3><p>Your device may not support this feature.</p></div>';
		}
	};

	const initScene = () => {
		gl.clearColor(1, 1, 1, 1);
		ripple = new RippleEffect(renderer);
		initPointsMesh();
	};

	const initPointsMesh = () => {
		gridWidth = width;
		gridHeight = height;

		const ssize = isTouchDevice ? 4 : 3; // Larger points on touch devices for better visibility
		const wsize = (ssize * wWidth) / width;
		const nx = Math.floor(gridWidth / ssize) + 1;
		const ny = Math.floor(gridHeight / ssize) + 1;
		const numPoints = nx * ny;
		const ox = -wsize * (nx / 2 - 0.5);
		const oy = -wsize * (ny / 2 - 0.5);
		const positions = new Float32Array(numPoints * 3);
		const uvs = new Float32Array(numPoints * 2);
		const sizes = new Float32Array(numPoints);

		let uvx;
		let uvy;
		let uvdx;
		let uvdy;
		gridRatio = gridWidth / gridHeight;
		if (gridRatio >= 1) {
			uvx = 0;
			uvdx = 1 / nx;
			uvy = (1 - 1 / gridRatio) / 2;
			uvdy = 1 / ny / gridRatio;
		} else {
			uvx = (1 - 1 * gridRatio) / 2;
			uvdx = (1 / nx) * gridRatio;
			uvy = 0;
			uvdy = 1 / ny;
		}

		for (let i = 0; i < nx; i++) {
			const x = ox + i * wsize;
			for (let j = 0; j < ny; j++) {
				const i1 = i * ny + j;
				const i2 = i1 * 2;
				const i3 = i1 * 3;
				const y = oy + j * wsize;
				positions.set([x, y, 0], i3);
				uvs.set([uvx + i * uvdx, uvy + j * uvdy], i2);
				sizes[i1] = ssize / 2;
			}
		}

		const geometry = new Geometry(gl, {
			position: { size: 3, data: positions },
			uv: { size: 2, data: uvs },
			size: { size: 1, data: sizes },
		});

		const program = new Program(gl, {
			uniforms: {
				uTime: { value: 0 },
				uColor1: { value: color1 },
				uColor2: { value: color2 },
				tRipple: { value: ripple.gpgpu.read.texture },
			},
			vertex: `
				attribute vec3 position;
				attribute vec2 uv;
				attribute float size;
				uniform float uTime;
				varying vec2 vUv;
				varying float vSize;
				void main() {
					vUv = uv;
					vSize = size;
					vec3 pos = position;
					pos.z += sin(uTime * 2.0 + position.x * 0.1) * 0.1;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
					gl_PointSize = size * (300.0 / -pos.z);
				}
			`,
			fragment: `
				precision highp float;
				uniform sampler2D tRipple;
				uniform vec3 uColor1;
				uniform vec3 uColor2;
				varying vec2 vUv;
				varying float vSize;
				void main() {
					vec2 uv = gl_PointCoord - 0.5;
					float dist = length(uv);
					if (dist > 0.5) discard;
					
					float ripple = texture2D(tRipple, vUv).r;
					float mixFactor = sin(vUv.x * 10.0 + vUv.y * 10.0 + ripple * 5.0) * 0.5 + 0.5;
					vec3 color = mix(uColor1, uColor2, mixFactor);
					
					float alpha = 1.0 - dist * 2.0;
					alpha *= 0.8 + ripple * 0.4;
					
					gl_FragColor = vec4(color, alpha);
				}
			`,
		});

		points = new Mesh(gl, { geometry, program });
	};

	const animate = (_t) => {
		requestAnimationFrame(animate);
		
		// Performance monitoring
		frameCount++;
		const currentTime = performance.now();
		if (currentTime - lastTime >= 1000) {
			fps = frameCount * 1000 / (currentTime - lastTime);
			frameCount = 0;
			lastTime = currentTime;
			updatePerformanceIndicator();
		}
		
		camera.position.z += (cameraZ - camera.position.z) * 0.02;

		if (!mouseOver) {
			const time = Date.now() * 0.001;
			const x = Math.cos(time) * 0.2;
			const y = Math.sin(time) * 0.2;
			ripple.addDrop(x, y, 0.05, 0.05);
		}

		ripple.update();
		renderer.render({ scene: points, camera });
	};

	const randomizeColors = () => {
		color1.set(chroma.random().hex());
		color2.set(chroma.random().hex());
	};

	const getScrollPercentage = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const { scrollHeight, clientHeight } = document.documentElement;
		const maxScroll = scrollHeight - clientHeight;

		// Return 0 if page isn't scrollable
		if (maxScroll <= 0) {
			return 0;
		}

		// Ensure the percentage is between 0 and 1
		return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
	};

	const handleScroll = throttle(() => {
		cameraZ = 50 - getScrollPercentage() * 3;
	}, 16); // ~60fps

	// Enhanced touch handling
	const handleTouchStart = (e) => {
		e.preventDefault();
		touchActive = true;
		mouseOver = true;
		handleInteraction(e);
		
		// Haptic feedback for mobile devices
		if (isTouchDevice && navigator.vibrate) {
			navigator.vibrate(10); // Short vibration for touch feedback
		}
	};

	const handleTouchMove = throttle((e) => {
		if (!touchActive) return;
		e.preventDefault();
		handleInteraction(e);
	}, isTouchDevice ? 32 : 16); // Slower on touch devices for better performance

	const handleTouchEnd = (e) => {
		e.preventDefault();
		touchActive = false;
		mouseOver = false;
	};

	// Enhanced mouse handling
	const handleMouseMove = throttle((e) => {
		mouseOver = true;
		handleInteraction(e);
	}, 16);

	const handleMouseLeave = () => {
		mouseOver = false;
	};

	// Unified interaction handler
	const handleInteraction = (e) => {
		const now = Date.now();
		
		// Touch cooldown for performance
		if (isTouchDevice && now - lastTouchTime < touchCooldown) {
			return;
		}
		lastTouchTime = now;

		const pos = calculateMousePosition(e);
		mouse.set(pos.x, pos.y);

		// Adjust for grid ratio
		if (gridRatio >= 1) {
			mouse.y /= gridRatio;
		} else {
			mouse.x /= gridRatio;
		}

		// Enhanced ripple effect with device-specific parameters
		const radius = isTouchDevice ? 0.08 : 0.05;
		const strength = isTouchDevice ? 0.08 : 0.05;
		ripple.addDrop(mouse.x, mouse.y, radius, strength);
	};

	const initEventsListener = () => {
		if (isTouchDevice) {
			// Touch events with passive: false for preventDefault
			document.body.addEventListener("touchstart", handleTouchStart, { passive: false });
			document.body.addEventListener("touchmove", handleTouchMove, { passive: false });
			document.body.addEventListener("touchend", handleTouchEnd, { passive: false });
			document.body.addEventListener("touchcancel", handleTouchEnd, { passive: false });
		} else {
			// Mouse events
			document.body.addEventListener("mousemove", handleMouseMove, { passive: true });
			document.body.addEventListener("mouseleave", handleMouseLeave, { passive: true });
			document.body.addEventListener("mouseup", randomizeColors, { passive: true });
		}

		// Scroll event for both devices
		document.addEventListener("scroll", handleScroll, { passive: true });

		// Cleanup function
		return () => {
			if (isTouchDevice) {
				document.body.removeEventListener("touchstart", handleTouchStart);
				document.body.removeEventListener("touchmove", handleTouchMove);
				document.body.removeEventListener("touchend", handleTouchEnd);
				document.body.removeEventListener("touchcancel", handleTouchEnd);
			} else {
				document.body.removeEventListener("mousemove", handleMouseMove);
				document.body.removeEventListener("mouseleave", handleMouseLeave);
				document.body.removeEventListener("mouseup", randomizeColors);
			}
			document.removeEventListener("scroll", handleScroll);
		};
	};

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
		renderer.setSize(width, height);
		camera.perspective({ aspect: width / height });
		const wSize = getWorldSize(camera);
		wWidth = wSize[0];
		// wHeight = wSize[1]; // Remove this line
		if (points) {
			initPointsMesh();
		}
	};

	const getWorldSize = (cam) => {
		const vFOV = (cam.fov * Math.PI) / 180;
		const height = 2 * Math.tan(vFOV / 2) * Math.abs(cam.position.z);
		const width = height * cam.aspect;
		return [width, height];
	};

	init();
}

/**
 * Ripple effect
 */
const RippleEffect = (() => {
	const { Vec2, Program } = ogl;
	const defaultVertex =
		"attribute vec2 uv, position; varying vec2 vUv; void main() {vUv = uv; gl_Position = vec4(position, 0, 1);}";

	class RippleEffect {
		constructor(renderer) {
			const width = 512;
			const height = 512;
			Object.assign(this, {
				renderer,
				gl: renderer.gl,
				width,
				height,
				delta: new Vec2(1 / width, 1 / height),
				gpgpu: new GPGPU(renderer.gl, { width, height }),
			});
			this.initShaders();
		}
		initShaders() {
			this.updateProgram = new Program(this.gl, {
				uniforms: { tDiffuse: { value: null }, uDelta: { value: this.delta } },
				vertex: defaultVertex,
				fragment:
					"precision highp float; uniform sampler2D tDiffuse; uniform vec2 uDelta; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); vec2 dx = vec2(uDelta.x, 0.0), dy = vec2(0.0, uDelta.y); float average = (texture2D(tDiffuse, vUv - dx).r + texture2D(tDiffuse, vUv - dy).r + texture2D(tDiffuse, vUv + dx).r + texture2D(tDiffuse, vUv + dy).r) * 0.25; texel.g += (average - texel.r) * 2.0; texel.g *= 0.8; texel.r += texel.g; gl_FragColor = texel;}",
			});

			this.dropProgram = new Program(this.gl, {
				uniforms: {
					tDiffuse: { value: null },
					uCenter: { value: new Vec2() },
					uRadius: { value: 0.05 },
					uStrength: { value: 0.05 },
				},
				vertex: defaultVertex,
				fragment:
					"precision highp float; const float PI = 3.1415926535897932384626433832795; uniform sampler2D tDiffuse; uniform vec2 uCenter; uniform float uRadius; uniform float uStrength; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); float drop = max(0.0, 1.0 - length(uCenter * 0.5 + 0.5 - vUv) / uRadius); drop = 0.5 - cos(drop * PI) * 0.5; texel.r += drop * uStrength; gl_FragColor = texel;}",
			});
		}
		update() {
			this.updateProgram.uniforms.tDiffuse.value = this.gpgpu.read.texture;
			this.gpgpu.renderProgram(this.updateProgram);
		}
		addDrop(x, y, radius, strength) {
			const us = this.dropProgram.uniforms;
			us.tDiffuse.value = this.gpgpu.read.texture;
			us.uCenter.value.set(x, y);
			us.uRadius.value = radius;
			us.uStrength.value = strength;
			this.gpgpu.renderProgram(this.dropProgram);
		}
	}

	return RippleEffect;
})();

/**
 * GPGPU Helper
 */
const GPGPU = (() => {
	const { RenderTarget, Triangle, Mesh } = ogl;

	class GPGPU {
		constructor(gl, { width, height, type }) {
			Object.assign(this, {
				gl,
				width,
				height,
				numVertexes: width * height,
				read: new RenderTarget(gl, rto(gl, width, height, type)),
				write: new RenderTarget(gl, rto(gl, width, height, type)),
				mesh: new Mesh(gl, { geometry: new Triangle(gl) }),
			});
		}
		renderProgram(program) {
			this.mesh.program = program;
			this.gl.renderer.render({
				scene: this.mesh,
				target: this.write,
				clear: false,
			});
			this.swap();
		}
		swap() {
			[this.read, this.write] = [this.write, this.read];
		}
	}

	const rto = (gl, width, height, type) => ({
		width,
		height,
		type:
			type ||
			gl.HALF_FLOAT ||
			gl.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES,
		internalFormat: gl.renderer.isWebgl2
			? type === gl.FLOAT
				? gl.RGBA32F
				: gl.RGBA16F
			: gl.RGBA,
		depth: false,
		unpackAlignment: 1,
	});

	return GPGPU;
})();

function MagicComponent() {
	useEffect(() => {
		const container = document.querySelector("#magicContainer");

		if (container) {
			// Call the Magic function to initialize the effect
			Magic(container);

			// // Handle mouse movement to adjust the mask
			// const handleMouseMove = (e) => {
			//   const x = e.pageX;
			//   const y = e.pageY;
			//   container.style.setProperty("--x", x + "px");
			//   container.style.setProperty("--y", y + "px");
			// };

			// document.addEventListener("mousemove", handleMouseMove);
			// document.addEventListener("mouseleave", handleMouseMove); // use the same handler to reset

			// Clean up the effect and event listeners on unmount
			return () => {
				container.innerHTML = "";
				// document.removeEventListener("mousemove", handleMouseMove);
				// document.removeEventListener("mouseleave", handleMouseMove);
			};
		}
	}, []);

	return <div id="magicContainer" />;
}

export default MagicComponent;
