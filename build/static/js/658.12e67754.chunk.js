"use strict";
(self.webpackChunkportfolio = self.webpackChunkportfolio || []).push([
	[658],
	{
		7658: (e, t, s) => {
			s.r(t), s.d(t, { default: () => f });
			var i = s(5043),
				a = s(9899),
				n = s(9620);
			const r = {
					background: "rgba(10, 10, 15, 0.8)",
					snake: {
						gradient: ["#7AA2F7", "#7DCFFF", "#2AC3DE"],
						glow: "#7AA2F7",
					},
					snakeHead: { gradient: ["#BB9AF7", "#9D7CD8"], glow: "#BB9AF7" },
					food: { gradient: ["#F7768E", "#FF9E64"], glow: "#F7768E" },
					border: "#24283B",
					gridLines: "rgba(255, 255, 255, 0.05)",
					text: "#A9B1D6",
					gameOver: "#F7768E",
					scoreBackground: "rgba(26, 27, 38, 0.9)",
					highScore: "#9ECE6A",
				},
				o = {
					minTileSize: 20,
					maxTileSize: 32,
					borderRadius: 4,
					gridLineWidth: 1,
					shadowBlur: 30,
					glowRadius: 40,
					innerShadowSize: 10,
				},
				c = {
					snakeSpeed: { mobile: 100, desktop: 80 },
					fadeSpeed: 400,
					growthFactor: 1.15,
					foodPulseSpeed: 1800,
					foodPulseScale: 1.18,
					snakeGlowIntensity: 0.8,
					shadowPulseSpeed: 200,
					particleCount: 10,
					particleLifetime: 1e3,
					particleGravity: 0.1,
					particleSpeed: 2,
					particleSize: 0.5,
				},
				l = 768,
				h = {
					gridSize: 20,
					initialSnakeLength: 3,
					growthRate: 1,
					maxHighScores: 5,
					controls: {
						up: ["ArrowUp", "w", "W"],
						down: ["ArrowDown", "s", "S"],
						left: ["ArrowLeft", "a", "A"],
						right: ["ArrowRight", "d", "D"],
						pause: ["Space", "p", "P"],
						restart: ["r", "R"],
					},
				};
			var d = s(2555),
				u = s(1289),
				g = s(9352);
			const m = new (class {
					constructor() {
						(this.foodSynth = new g.RG({
							oscillator: { type: "sine" },
							envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
						}).toDestination()),
							(this.gameOverSynth = new g.Bh(g.RG, {
								oscillator: { type: "triangle" },
								envelope: {
									attack: 0.01,
									decay: 0.3,
									sustain: 0,
									release: 0.1,
								},
							}).toDestination()),
							(this.moveSynth = new g.RG({
								oscillator: { type: "square" },
								envelope: {
									attack: 0.01,
									decay: 0.05,
									sustain: 0,
									release: 0.05,
								},
								volume: -20,
							}).toDestination()),
							(this.feedbackDelay = new g.F("8n", 0.5).toDestination()),
							this.gameOverSynth.connect(this.feedbackDelay);
					}
					async initialize() {
						if ("running" !== g._O.state)
							try {
								await g.ni(), console.log("Audio context started");
							} catch (e) {
								console.warn("Could not start audio context:", e);
							}
					}
					playFoodCollect() {
						this.foodSynth.triggerAttackRelease("C5", "16n");
					}
					playGameOver() {
						const e = g.tB();
						this.gameOverSynth.triggerAttackRelease(
							["C4", "G3", "E3", "C3"],
							"8n",
							e,
						);
					}
					playMove() {
						this.moveSynth.triggerAttackRelease("G4", "32n");
					}
				})(),
				S = (e, t) => e.x === t.x && e.y === t.y;
			class p extends u.Scene {
				constructor() {
					let e =
						arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
					super({ key: "SnakeScene" }),
						(this.state = {
							snake: [],
							food: null,
							direction: { x: 0, y: 0 },
							nextDirection: { x: 0, y: 0 },
							score: 0,
							gameOver: !1,
							lastUpdate: 0,
						}),
						(this.particles = []),
						(this.currentHue = 0),
						(this.snakeHue = 180),
						(this.foodHue = 0),
						(this.isMobile = e),
						(this.gameSpeed = e ? c.snakeSpeed.mobile : c.snakeSpeed.desktop),
						(this.highScore =
							Number.parseInt(localStorage.getItem("snakeHighScore")) || 0),
						(this.avatar = new Image()),
						(this.avatar.src = a),
						(this.boundKeyHandler = null);
				}
				async create(e) {
					(this.canvasSize = e),
						(this.cellSize = e.cellSize),
						await m.initialize(),
						this.initializeGame(),
						this.setupInput(),
						this.setupEventListeners();
				}
				initializeGame() {
					const e = Math.floor(h.gridSize / 2) * this.cellSize,
						t = Math.floor(h.gridSize / 2) * this.cellSize;
					(this.state.snake = [{ x: e, y: t }]),
						(this.state.direction = { x: this.cellSize, y: 0 }),
						(this.state.nextDirection = { x: this.cellSize, y: 0 }),
						this.spawnFood(),
						(this.state.score = 0),
						(this.state.gameOver = !1);
				}
				setupInput() {
					(this.boundKeyHandler = (e) => {
						this.handleKeyPress(e.code),
							["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
								e.code,
							) && e.preventDefault();
					}),
						document.addEventListener("keydown", this.boundKeyHandler);
				}
				handleKeyPress(e) {
					if (this.state.gameOver && ("Space" === e || "Enter" === e))
						return void this.initializeGame();
					const { direction: t } = this.state,
						{ cellSize: s } = this;
					switch (e) {
						case "ArrowUp":
							0 === t.y && (this.state.nextDirection = { x: 0, y: -s });
							break;
						case "ArrowDown":
							0 === t.y && (this.state.nextDirection = { x: 0, y: s });
							break;
						case "ArrowLeft":
							0 === t.x && (this.state.nextDirection = { x: -s, y: 0 });
							break;
						case "ArrowRight":
							0 === t.x && (this.state.nextDirection = { x: s, y: 0 });
							break;
						case "Space":
						case "Enter":
							this.state.gameOver && this.initializeGame();
					}
				}
				generateFoodPosition() {
					return {
						x:
							Math.floor(
								Math.random() * (this.canvasSize.width / this.cellSize),
							) * this.cellSize,
						y:
							Math.floor(
								Math.random() * (this.canvasSize.height / this.cellSize),
							) * this.cellSize,
					};
				}
				isValidFoodPosition(e) {
					return !this.state.snake.some((t) => this.isCollision(t, e));
				}
				spawnFood() {
					let e;
					do {
						e = this.generateFoodPosition();
					} while (!this.isValidFoodPosition(e));
					this.state.food = e;
				}
				isCollision(e, t) {
					return S(e, t);
				}
				createParticles() {
					const { food: e } = this.state,
						t = this.foodHue;
					for (let s = 0; s < 10; s++) {
						const i = (2 * Math.PI * s) / 10,
							a = 2 + 2 * Math.random(),
							n = 2 + 3 * Math.random();
						this.particles.push({
							x: e.x + this.cellSize / 2,
							y: e.y + this.cellSize / 2,
							vx: Math.cos(i) * a,
							vy: Math.sin(i) * a,
							size: n,
							life: 1,
							hue: (t + 30 * Math.random()) % 360,
							draw: function () {
								if (this.life <= 0) return;
								const e = this.game.context;
								e.beginPath(),
									(e.fillStyle = "hsla("
										.concat(this.hue, ", 70%, 50%, ")
										.concat(this.life, ")")),
									(e.shadowColor = "hsla("
										.concat(this.hue, ", 80%, 60%, ")
										.concat(this.life, ")")),
									(e.shadowBlur = 5),
									e.fillRect(this.x, this.y, this.size, this.size),
									(e.shadowBlur = 0),
									(this.x += this.vx),
									(this.y += this.vy),
									(this.life -= 0.05);
							}.bind(this),
						});
					}
				}
				update(e) {
					this.state.gameOver ||
						((this.snakeHue = (this.snakeHue + 0.5) % 360),
						(this.foodHue = (this.foodHue + 1) % 360),
						e - this.state.lastUpdate < this.gameSpeed ||
							((this.state.lastUpdate = e),
							this.moveSnake(),
							this.checkCollisions() || (this.draw(), this.updateParticles())));
				}
				checkCollisions() {
					const { snake: e } = this.state,
						t = e[0];
					for (let s = 1; s < e.length; s++)
						if (S(t, e[s]))
							return (this.state.gameOver = !0), m.playGameOver(), !0;
					return !1;
				}
				moveSnake() {
					const { snake: e, nextDirection: t, food: s } = this.state,
						i = (0, d.A)({}, e[0]);
					(this.state.direction = t), (i.x += t.x), (i.y += t.y);
					const { width: a, height: n } = this.canvasSize;
					i.x >= a && (i.x = 0),
						i.x < 0 && (i.x = a - this.cellSize),
						i.y >= n && (i.y = 0),
						i.y < 0 && (i.y = n - this.cellSize),
						e.unshift(i),
						S(i, s)
							? (m.playFoodCollect(),
								this.state.score++,
								this.createParticles(),
								this.spawnFood(),
								this.state.score > this.highScore &&
									((this.highScore = this.state.score),
									localStorage.setItem("snakeHighScore", this.state.score)))
							: e.pop();
				}
				updateParticles() {
					for (let e = this.particles.length - 1; e >= 0; e--)
						this.particles[e].draw(),
							this.particles[e].life <= 0 && this.particles.splice(e, 1);
				}
				draw() {
					const { snake: e, food: t } = this.state,
						s = this.game.context;
					s.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height),
						this.drawGrid();
					for (const [i, a] of e.entries()) {
						const e = 0 === i;
						s.beginPath();
						const t = (this.snakeHue + 5 * i) % 360,
							n = "hsl(".concat(t, ", 70%, ").concat(e ? 60 : 50, "%)"),
							r = "hsl(".concat(t, ", 80%, 60%)");
						(s.fillStyle = n),
							(s.shadowColor = r),
							(s.shadowBlur = e ? 15 : 10),
							s.fillRect(a.x, a.y, this.cellSize - 1, this.cellSize - 1);
					}
					if (((s.shadowBlur = 0), t)) {
						s.save();
						const e = "hsl(".concat(this.foodHue, ", 70%, 50%)"),
							i = "hsl(".concat(this.foodHue, ", 80%, 60%)");
						(s.shadowColor = i),
							(s.shadowBlur = 15),
							s.drawImage(
								this.avatar,
								t.x,
								t.y,
								this.cellSize - 1,
								this.cellSize - 1,
							),
							(s.globalCompositeOperation = "overlay"),
							(s.fillStyle = e),
							s.fillRect(t.x, t.y, this.cellSize - 1, this.cellSize - 1),
							(s.globalCompositeOperation = "source-over"),
							(s.fillStyle = "rgba(255, 255, 255, 0.1)");
						const a = 2;
						for (let n = 0; n < this.cellSize - 1; n += a)
							for (let e = 0; n < this.cellSize - 1; e += a)
								(n + e) % 4 === 0 && s.fillRect(t.x + n, t.y + e, a, a);
						s.restore();
					}
					for (const i of this.particles) i.draw();
				}
				drawGrid() {
					const e = this.game.context;
					(e.strokeStyle = r.gridLines),
						(e.lineWidth = this.isMobile ? 0.5 : 1);
					for (let t = 0; t < h.gridSize; t++) {
						const s = t * this.cellSize;
						e.beginPath(),
							e.moveTo(s, 0),
							e.lineTo(s, this.canvasSize.height),
							e.stroke(),
							e.beginPath(),
							e.moveTo(0, s),
							e.lineTo(this.canvasSize.width, s),
							e.stroke();
					}
				}
				updateGridSize() {
					(this.state.snake = this.state.snake.map((e) => ({
						x: Math.round(e.x / this.cellSize) * this.cellSize,
						y: Math.round(e.y / this.cellSize) * this.cellSize,
					}))),
						this.state.food &&
							(this.state.food = {
								x:
									Math.round(this.state.food.x / this.cellSize) * this.cellSize,
								y:
									Math.round(this.state.food.y / this.cellSize) * this.cellSize,
							}),
						this.keepInBounds();
				}
				keepInBounds() {
					const e = this.canvasSize.width - this.cellSize,
						t = this.canvasSize.height - this.cellSize;
					(this.state.snake = this.state.snake.map((s) => ({
						x: Math.max(0, Math.min(s.x, e)),
						y: Math.max(0, Math.min(s.y, t)),
					}))),
						this.state.food &&
							(this.state.food = {
								x: Math.max(0, Math.min(this.state.food.x, e)),
								y: Math.max(0, Math.min(this.state.food.y, t)),
							});
				}
				setupEventListeners() {}
				cleanup() {
					var e, t;
					this.boundKeyHandler &&
						(document.removeEventListener("keydown", this.boundKeyHandler),
						(this.boundKeyHandler = null)),
						(this.state = {
							snake: [],
							food: null,
							direction: { x: 0, y: 0 },
							nextDirection: { x: 0, y: 0 },
							score: 0,
							gameOver: !1,
							lastUpdate: 0,
						}),
						(this.particles = []),
						null !== (e = this.game) &&
							void 0 !== e &&
							e.context &&
							this.canvasSize &&
							this.game.context.clearRect(
								0,
								0,
								this.canvasSize.width,
								this.canvasSize.height,
							),
						null !== (t = this.game) &&
							void 0 !== t &&
							t.animationFrameId &&
							(cancelAnimationFrame(this.game.animationFrameId),
							(this.game.animationFrameId = null));
				}
			}
			var x = s(579);
			const f = () => {
				const e = (0, i.useRef)(null),
					t = (0, i.useRef)(null),
					s = (0, i.useRef)(null),
					r = (0, i.useRef)(null),
					[c, d] = (0, i.useState)(!1),
					[u, g] = (0, i.useState)(0),
					[m, S] = (0, i.useState)(
						Number.parseInt(localStorage.getItem("snakeHighScore")) || 0,
					),
					[f, v] = (0, i.useState)({ width: 0, height: 0 }),
					[w, y] = (0, i.useState)(!1),
					z = (0, i.useRef)({ x: 0, y: 0, time: 0 }),
					k = (0, i.useCallback)(() => {
						r.current && clearTimeout(r.current),
							(r.current = setTimeout(() => {
								if (e.current)
									try {
										const i = e.current,
											{ width: a, height: n } = i.getBoundingClientRect(),
											r = ((e, t) => {
												const { minTileSize: s, maxTileSize: i } = o,
													{ gridSize: a } = h,
													n = Math.min(Math.floor(e / a), Math.floor(t / a)),
													r = Math.max(s, Math.min(n, i));
												return { width: r * a, height: r * a, cellSize: r };
											})(a, n);
										(r.width === f.width && r.height === f.height) ||
											(v(r),
											y(a <= l),
											t.current &&
												((t.current.width = r.width),
												(t.current.height = r.height)),
											s.current &&
												((s.current.canvasSize = r),
												s.current.updateGridSize()));
									} catch (i) {
										console.error("Error during resize:", i);
									}
							}, 250));
					}, [f]);
				(0, i.useEffect)(() => {
					let t;
					k();
					try {
						(t = new ResizeObserver((e) => {
							const t = e[0];
							t && t.contentRect && k();
						})),
							e.current && t.observe(e.current);
					} catch (s) {
						console.warn("ResizeObserver error:", s);
					}
					return (
						window.addEventListener("resize", k),
						window.addEventListener("orientationchange", k),
						() => {
							r.current && clearTimeout(r.current),
								t && t.disconnect(),
								window.removeEventListener("resize", k),
								window.removeEventListener("orientationchange", k);
						}
					);
				}, [k]),
					(0, i.useEffect)(() => {
						if (t.current && e.current && f.width && f.height) {
							const e = t.current,
								i = e.getContext("2d");
							(e.width = f.width), (e.height = f.height);
							const a = new p(w);
							let n;
							(a.game = { context: i, canvas: e }),
								a.create(f),
								(s.current = a),
								e.setAttribute("tabindex", "0"),
								e.focus();
							const r = (e) => {
								a.state.gameOver ||
									(a.update(e),
									g(a.state.score),
									a.state.gameOver &&
										(d(!0),
										a.state.score > m &&
											(S(a.state.score),
											localStorage.setItem("snakeHighScore", a.state.score))),
									(n = window.requestAnimationFrame(r)));
							};
							return (
								r(0),
								() => {
									window.cancelAnimationFrame(n),
										a.cleanup && a.cleanup(),
										(s.current = null);
								}
							);
						}
					}, [f, w, m]);
				const b = (0, i.useCallback)(() => {
					s.current &&
						(s.current.initializeGame(),
						d(!1),
						g(0),
						t.current && t.current.focus());
				}, []);
				return (0, x.jsx)(n.A, {
					children: (0, x.jsx)("div", {
						ref: e,
						className: "snake-tool",
						children: (0, x.jsxs)("div", {
							className: "game-container",
							children: [
								(0, x.jsxs)("div", {
									className: "score-display",
									children: [
										(0, x.jsxs)("div", {
											className: "score",
											children: [
												(0, x.jsx)("span", { children: "Score" }),
												(0, x.jsx)("span", {
													children: String(u).padStart(2, "0"),
												}),
											],
										}),
										(0, x.jsxs)("div", {
											className: "high-score",
											children: [
												(0, x.jsx)("span", { children: "Best" }),
												(0, x.jsx)("span", {
													children: String(m).padStart(2, "0"),
												}),
											],
										}),
										u > 0 &&
											u >= m &&
											(0, x.jsxs)("div", {
												className: "profile-badge",
												children: [
													(0, x.jsx)("img", { src: a, alt: "Profile" }),
													(0, x.jsx)("div", {
														className: "badge-label",
														children: "New Best!",
													}),
												],
											}),
									],
								}),
								(0, x.jsx)("canvas", {
									ref: t,
									className: "game-canvas",
									onTouchStart: (e) => {
										const t = e.touches[0];
										z.current = {
											x: t.clientX,
											y: t.clientY,
											time: Date.now(),
										};
									},
									onTouchEnd: (e) => {
										const t = e.changedTouches[0],
											i = t.clientX - z.current.x,
											a = t.clientY - z.current.y;
										if (Date.now() - z.current.time < h.touchThreshold.time) {
											if (
												Math.sqrt(i * i + a * a) > h.touchThreshold.distance
											) {
												const e = Math.atan2(a, i),
													t = Math.round(e / (Math.PI / 2));
												if (s.current)
													switch ((t + 4) % 4) {
														case 0:
															s.current.setDirection("right");
															break;
														case 1:
															s.current.setDirection("down");
															break;
														case 2:
															s.current.setDirection("left");
															break;
														case 3:
															s.current.setDirection("up");
													}
											}
										}
									},
								}),
								c &&
									(0, x.jsx)("div", {
										className: "game-over",
										children: (0, x.jsxs)("div", {
											className: "game-over-content",
											children: [
												(0, x.jsxs)("div", {
													className: "profile-container",
													children: [
														(0, x.jsx)("img", {
															src: a,
															alt: "Profile",
															className: "profile-image",
														}),
														(0, x.jsx)("div", { className: "pixel-overlay" }),
													],
												}),
												(0, x.jsx)("h2", {
													"data-text": "GAME OVER",
													children: "GAME OVER",
												}),
												(0, x.jsx)("div", {
													className: "score-message",
													children:
														u === m && u > 0
															? (0, x.jsxs)(x.Fragment, {
																	children: [
																		(0, x.jsxs)("div", {
																			className: "score-banner",
																			children: [
																				(0, x.jsx)("span", {
																					className: "star",
																					children: "\u2605",
																				}),
																				(0, x.jsx)("span", {
																					className: "new-record",
																					children: "NEW RECORD!",
																				}),
																				(0, x.jsx)("span", {
																					className: "star",
																					children: "\u2605",
																				}),
																			],
																		}),
																		(0, x.jsxs)("p", {
																			className: "score-value",
																			children: [
																				"Score: ",
																				String(u).padStart(2, "0"),
																			],
																		}),
																		(0, x.jsx)("p", {
																			className: "encouraging-text",
																			children: "You're unstoppable!",
																		}),
																	],
																})
															: (0, x.jsxs)(x.Fragment, {
																	children: [
																		(0, x.jsxs)("p", {
																			className: "score-value",
																			children: [
																				"Score: ",
																				String(u).padStart(2, "0"),
																			],
																		}),
																		(0, x.jsxs)("p", {
																			className: "high-score-value",
																			children: [
																				"Best: ",
																				String(m).padStart(2, "0"),
																			],
																		}),
																		(0, x.jsx)("p", {
																			className: "encouraging-text",
																			children:
																				0 === u
																					? "Don't give up!"
																					: u < 5
																						? "You can do better!"
																						: u < 10
																							? "Getting better!"
																							: u < m
																								? "Almost there!"
																								: "Great job!",
																		}),
																	],
																}),
												}),
												(0, x.jsx)("div", {
													className: "game-over-buttons",
													children: (0, x.jsxs)("button", {
														onClick: b,
														className: "play-again-btn",
														children: [
															(0, x.jsx)("span", {
																className: "btn-text",
																children: "PLAY AGAIN",
															}),
															(0, x.jsx)("span", {
																className: "btn-icon",
																children: "\u21ba",
															}),
														],
													}),
												}),
											],
										}),
									}),
							],
						}),
					}),
				});
			};
		},
	},
]);
//# sourceMappingURL=658.12e67754.chunk.js.map
