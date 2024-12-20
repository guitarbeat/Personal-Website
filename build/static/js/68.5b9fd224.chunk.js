"use strict";
(self.webpackChunkportfolio = self.webpackChunkportfolio || []).push([
	[68],
	{
		9759: (e, t, n) => {
			n.r(t), n.d(t, { default: () => Me });
			var s = n(5173),
				o = n.n(s),
				a = n(5043),
				r = n(9712),
				i = n(2134);
			var c = n(2555),
				l = n(3986);
			function d(e, t) {
				const n = setTimeout(e, t);
				return function () {
					clearTimeout(n);
				};
			}
			function u(e, t) {
				return { x: e.x - t.x, y: e.y - t.y };
			}
			function m(e) {
				return console.log(e.scrollTop), { x: e.scrollLeft, y: e.scrollTop };
			}
			function h(e, t) {
				let n = m(e),
					s = ((o = n), (0, c.A)({}, o));
				var o;
				let a = u(s, n);
				function r(e) {
					(a = e), t(a);
				}
				function i() {
					r({ x: 0, y: 0 });
				}
				let l = d(() => {}, 100);
				function h() {
					l(), (n = s), (s = m(e));
					r(u(s, n)), (l = d(i, 50));
				}
				return (
					document.addEventListener("scroll", h),
					function () {
						document.removeEventListener("scroll", h);
					}
				);
			}
			function v() {
				let e =
						arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 5,
					t =
						arguments.length > 1 && void 0 !== arguments[1]
							? arguments[1]
							: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				return Array.from({ length: e })
					.map(() =>
						(function (e) {
							return e.charAt(Math.floor(Math.random() * e.length));
						})(t),
					)
					.join("");
			}
			function p(e) {
				return document.createElementNS("http://www.w3.org/2000/svg", e);
			}
			function f() {
				let e =
					arguments.length > 0 && void 0 !== arguments[0]
						? arguments[0]
						: document.body;
				const t = (function () {
						const e = p("svg");
						e.setAttribute("version", "1.1"),
							e.setAttribute("xmlns", "http://www.w3.org/2000/svg"),
							e.classList.add("motionblur-svg"),
							(e.style.position = "absolute"),
							(e.style.width = "0"),
							(e.style.height = "0"),
							(e.style.pointerEvents = "none");
						const t = p("defs"),
							n = p("filter"),
							s = v();
						n.id = s;
						const o = p("feGaussianBlur");
						return (
							o.setAttribute("stdDeviation", "0,0"),
							o.setAttribute("edgeMode", "duplicate"),
							o.setAttribute("in", "SourceGraphic"),
							n.appendChild(o),
							t.appendChild(n),
							e.appendChild(t),
							document.body.appendChild(e),
							{
								destroy: function () {
									e.remove();
								},
								setBlur: function (e) {
									let { x: t, y: n } = e;
									o.setAttribute("stdDeviation", "".concat(t, ",").concat(n));
								},
								getId: function () {
									return s;
								},
								applyTo: function (e) {
									const t = e.style.filter,
										n = e.style.transform;
									return (
										(e.style.filter = t
											? "".concat(t, " url(#").concat(s, ")")
											: "url(#".concat(s, ")")),
										(e.style.transform = n
											? "".concat(n, " translate3d(0,0,0)")
											: "translate3d(0,0,0)"),
										function () {
											(e.style.filter = t), (e.style.transform = n);
										}
									);
								},
							}
						);
					})(),
					n = (function () {
						let e =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: 0,
							{
								stiffness: t = 200,
								damping: n = 10,
								precision: s = 100,
							} = arguments.length > 1 && void 0 !== arguments[1]
								? arguments[1]
								: {},
							o = e,
							a = 0;
						const r = 1 / 60;
						let i,
							c = 0,
							l = (e) => {},
							d = (e) => {};
						const u = () => {
							const e = c + (t * (a - o) - n * c) * r,
								m = o + e * r,
								h = Math.abs(e) < 1 / s && Math.abs(m - a) < 1 / s;
							(o = h ? a : m),
								(c = e),
								l(o),
								h ? d(o) : (i = requestAnimationFrame(u));
						};
						return {
							get value() {
								return o;
							},
							get velocity() {
								return c;
							},
							setValue: function () {
								let e =
									arguments.length > 0 && void 0 !== arguments[0]
										? arguments[0]
										: 0;
								cancelAnimationFrame(i), (o = a = e), l(o);
							},
							transitionTo: function () {
								let e =
									arguments.length > 0 && void 0 !== arguments[0]
										? arguments[0]
										: 0;
								cancelAnimationFrame(i),
									(a = e),
									(i = requestAnimationFrame(u));
							},
							onUpdate: function () {
								let e =
									arguments.length > 0 && void 0 !== arguments[0]
										? arguments[0]
										: (e) => {};
								(l = e), e(o);
							},
							onRest: function () {
								d =
									arguments.length > 0 && void 0 !== arguments[0]
										? arguments[0]
										: (e) => {};
							},
							destroy: () => {
								cancelAnimationFrame(i), (l = () => {}), (d = () => {});
							},
						};
					})(0, { damping: 30, stiffness: 1e3 });
				h(document.documentElement, (e) => {
					t.setBlur({ x: 0, y: Math.min(Math.abs(e.y / 4), 10) }),
						n.transitionTo(e.y);
				});
				return t.applyTo(e);
			}
			var g = n(579);
			const x = ["children", "className", "style", "as"],
				w = () => window.innerWidth <= 768,
				b = (e) => {
					let { children: t, className: n, style: s = {}, as: o = "div" } = e,
						r = (0, l.A)(e, x);
					const i = (0, a.useRef)(null),
						[d, u] = (0, a.useState)(w());
					return (
						(0, a.useEffect)(() => {
							const e = () => {
								u(w());
							};
							return (
								window.addEventListener("resize", e),
								() => window.removeEventListener("resize", e)
							);
						}, []),
						(0, a.useEffect)(() => {
							if (i.current && !d) {
								const e = f(i.current);
								return () => {
									null === e || void 0 === e || e();
								};
							}
						}, [d]),
						(0, g.jsx)(
							o,
							(0, c.A)(
								(0, c.A)(
									{
										ref: i,
										className: n,
										style: (0, c.A)({ position: "relative" }, s),
									},
									r,
								),
								{},
								{ children: t },
							),
						)
					);
				},
				y = {
					apiKey: "AIzaSyBeKUeUWLmgbvcqggGItv9BPrQN1yyxRbE",
					discoveryDocs: [
						"https://sheets.googleapis.com/$discovery/rest?version=v4",
					],
					spreadsheetId: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
					dataLoading: { component: () => null },
				},
				j = { About: "/#about", Projects: "/#projects", Work: "/#work" },
				k = (e) => {
					let { onComplete: t } = e;
					return (
						(0, a.useEffect)(() => {
							const e = document.getElementById("MaskTop"),
								n = document.getElementById("MaskBottom"),
								s = document.getElementById("magicContainer");
							s && (s.style.opacity = "0"),
								setTimeout(() => {
									(e.style.transform = "scaleY(0)"),
										(n.style.transform = "scaleY(0)");
								}, 500),
								setTimeout(() => {
									s && (s.style.opacity = "0.2");
								}, 700),
								setTimeout(() => {
									(e.style.display = "none"),
										(n.style.display = "none"),
										(document.body.style.overflow = ""),
										t && t();
								}, 2e3);
						}, [t]),
						(0, g.jsxs)(g.Fragment, {
							children: [
								(0, g.jsx)("div", { id: "MaskTop" }),
								(0, g.jsx)("div", { id: "MaskBottom" }),
							],
						})
					);
				},
				N =
					n.p +
					"static/media/didn't-say-the-magic-word.da620a39acf228ccc11d.mp3",
				C = (0, a.createContext)(),
				E = (e) => {
					let { children: t } = e;
					const [n, s] = (0, a.useState)(() => {
							const e = new URLSearchParams(window.location.search).get(
								"password",
							);
							return (
								"aaron" ===
								(null === e || void 0 === e ? void 0 : e.toLowerCase())
							);
						}),
						[o, r] = (0, a.useState)(!1),
						[i, c] = (0, a.useState)(!1),
						l = a.useRef(null);
					return (0, g.jsxs)(C.Provider, {
						value: {
							isUnlocked: n,
							checkPassword: (e) =>
								"aaron" === e.toLowerCase()
									? (s(!0), c(!0), setTimeout(() => c(!1), 2e3), !0)
									: (r(!0),
										l.current &&
											((l.current.currentTime = 0),
											(l.current.loop = !0),
											l.current.play()),
										!1),
							showIncorrectFeedback: o,
							showSuccessFeedback: i,
							dismissFeedback: () => {
								r(!1),
									l.current && (l.current.pause(), (l.current.currentTime = 0));
							},
						},
						children: [
							(0, g.jsx)("audio", {
								ref: l,
								src: N,
								style: { display: "none" },
								children: (0, g.jsx)("track", {
									kind: "captions",
									srcLang: "en",
									label: "English",
								}),
							}),
							t,
						],
					});
				},
				S = () => {
					const e = (0, a.useContext)(C);
					if (!e)
						throw new Error("useAuth must be used within an AuthProvider");
					return e;
				},
				_ = n.p + "static/media/nu-uh-uh.aea10a59a426161a4ee6.webp",
				A = (e) => {
					let { isVisible: t, onSuccess: n } = e;
					const s = (0, a.useRef)(null),
						o = (0, a.useRef)(null),
						[r, i] = (0, a.useState)(""),
						{
							checkPassword: c,
							showIncorrectFeedback: l,
							showSuccessFeedback: d,
							dismissFeedback: u,
						} = S(),
						m =
							"\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e6\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
					return (
						(0, a.useEffect)(() => {
							if (!t) return;
							const e = () => {
								l && u();
							};
							return (
								window.addEventListener("keydown", e),
								() => window.removeEventListener("keydown", e)
							);
						}, [t, l, u]),
						(0, a.useEffect)(() => {
							if (!t) return;
							const e = s.current,
								n = e.getContext("2d"),
								o = () => {
									(e.width = window.innerWidth),
										(e.height = window.innerHeight),
										(n.font = "".concat(18, "px monospace")),
										(n.textAlign = "center"),
										(n.textBaseline = "middle");
								};
							o(), window.addEventListener("resize", o);
							const a = Math.floor(e.width / 18),
								r = Array(a).fill(1);
							let i;
							const c = () => {
								(n.fillStyle = "rgba(0, 0, 0, 0.05)"),
									n.fillRect(0, 0, e.width, e.height),
									(n.font = "".concat(18, "px monospace")),
									(n.textAlign = "center"),
									(n.textBaseline = "middle"),
									r.forEach((t, s) => {
										const o = m[Math.floor(82 * Math.random())],
											a = 18 * s,
											i = 18 * t;
										(n.fillStyle = Math.random() > 0.92 ? "#FFF" : "#0F0"),
											(n.shadowColor = n.fillStyle),
											(n.shadowBlur = 10),
											n.fillText(o, a, i),
											i > e.height && Math.random() > 0.975 && (r[s] = 0),
											r[s]++;
									}),
									(i = window.requestAnimationFrame(c));
							};
							return (
								c(),
								() => {
									window.removeEventListener("resize", o),
										window.cancelAnimationFrame(i);
								}
							);
						}, [t]),
						t
							? (0, g.jsxs)("div", {
									className: "matrix-container ".concat(t ? "visible" : ""),
									onClick: (e) => {
										e.target === s.current && (l || d || (n && n()));
									},
									children: [
										(0, g.jsx)("button", {
											className: "matrix-close-btn",
											onClick: n,
											children: "EXIT",
										}),
										(0, g.jsx)("canvas", {
											ref: s,
											className: "matrix-canvas",
										}),
										l &&
											(0, g.jsxs)("div", {
												className: "feedback-container glitch-effect",
												onClick: u,
												children: [
													(0, g.jsx)("img", {
														src: _,
														alt: "Incorrect password",
														className: "incorrect-gif",
													}),
													(0, g.jsx)("div", {
														className: "feedback-hint",
														children: "Press any key to continue",
													}),
												],
											}),
										d &&
											(0, g.jsx)("div", {
												className: "success-message",
												children: (0, g.jsx)("span", {
													className: "success-text",
													children: "Access Granted",
												}),
											}),
										!d &&
											!l &&
											(0, g.jsx)("form", {
												ref: o,
												onSubmit: (e) => {
													e.preventDefault();
													c(r) &&
														setTimeout(() => {
															n && n();
														}, 2e3),
														i("");
												},
												className: "password-form",
												children: (0, g.jsx)("input", {
													type: "password",
													value: r,
													onChange: (e) => i(e.target.value),
													placeholder: "Enter password",
													autoFocus: !0,
													className: "password-input",
												}),
											}),
									],
								})
							: null
					);
				};
			var M,
				L,
				T = n(7528),
				I = n(5464);
			const D = I.I4.div(
					M ||
						(M = (0, T.A)([
							"\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100vh;\n  border: 7px solid #999; /* Base frame that covers corners */\n  box-sizing: border-box;\n  z-index: var(--z-index-frame);\n  -webkit-user-select: none;\n  user-select: none;\n  pointer-events: none;\n  mix-blend-mode: difference;\n\n  &::after {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    border: 7px solid #999;\n    border-radius: 20px;\n    margin: -7px;\n  }\n",
						])),
				),
				P = I.I4.div(
					L ||
						(L = (0, T.A)([
							"\n  position: relative;\n  z-index: 1;\n  pointer-events: auto;\n",
						])),
				),
				F = (e) => {
					let { children: t } = e;
					return (0, g.jsxs)("div", {
						className: "frame",
						children: [(0, g.jsx)(P, { children: t }), (0, g.jsx)(D, {})],
					});
				};
			var R = n(2629),
				O = n(1957);
			function z() {
				const { A4: e, i7: t, V2: n, BP: s, e: o, Q1: a, ZY: r } = O;
				let i,
					c,
					l,
					d,
					u,
					m,
					h,
					v,
					p,
					f,
					g,
					x,
					w,
					b = !1;
				const y = new a([0.149, 0.141, 0.912]),
					j = new a([1, 0.833, 0.224]);
				let k = 50;
				const N = () => {
						c.clearColor(1, 1, 1, 1), (x = new B(i)), C();
					},
					C = () => {
						(p = d), (f = u);
						const e = (3 * m) / d,
							t = Math.floor(p / 3) + 1,
							a = Math.floor(f / 3) + 1,
							r = t * a,
							i = -e * (t / 2 - 0.5),
							l = -e * (a / 2 - 0.5),
							h = new Float32Array(3 * r),
							v = new Float32Array(2 * r),
							b = new Float32Array(r);
						let k, N, C, E;
						(g = p / f),
							g >= 1
								? ((k = 0), (C = 1 / t), (N = (1 - 1 / g) / 2), (E = 1 / a / g))
								: ((k = (1 - 1 * g) / 2),
									(C = (1 / t) * g),
									(N = 0),
									(E = 1 / a));
						for (let n = 0; n < t; n++) {
							const t = i + n * e;
							for (let s = 0; s < a; s++) {
								const o = n * a + s,
									r = 2 * o,
									i = 3 * o,
									c = l + s * e;
								h.set([t, c, 0], i),
									v.set([k + n * C, N + s * E], r),
									(b[o] = 1.5);
							}
						}
						const S = new n(c, {
							position: { size: 3, data: h },
							uv: { size: 2, data: v },
							size: { size: 1, data: b },
						});
						if (w) w.geometry = S;
						else {
							const e = new s(c, {
								uniforms: {
									hmap: { value: x.gpgpu.read.texture },
									color1: { value: y },
									color2: { value: j },
								},
								vertex:
									"\n          precision highp float;\n          const float PI = 3.1415926535897932384626433832795;\n          uniform mat4 modelViewMatrix;\n          uniform mat4 projectionMatrix;\n          uniform sampler2D hmap;\n          uniform vec3 color1;\n          uniform vec3 color2;\n          attribute vec2 uv;\n          attribute vec3 position;\n          attribute float size;\n          varying vec4 vColor;\n          void main() {\n              vec3 pos = position.xyz;\n              vec4 htex = texture2D(hmap, uv);\n              pos.z = 10. * htex.r;\n\n              vec3 mixPct = vec3(0.0);\n              mixPct.r = smoothstep(0.0, 0.5, htex.r);\n              mixPct.g = sin(htex.r * PI);\n              mixPct.b = pow(htex.r, 0.5);\n              vColor = vec4(mix(color1, color2, mixPct), 1.0);\n\n              gl_PointSize = size;\n              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n          }\n        ",
								fragment:
									"\n          precision highp float;\n          varying vec4 vColor;\n          void main() {\n            gl_FragColor = vColor;\n          }\n        ",
							});
							w = new o(c, { geometry: S, program: e, mode: c.POINTS });
						}
					},
					E = (e) => {
						if (
							(requestAnimationFrame(E),
							(l.position.z += 0.02 * (k - l.position.z)),
							!b)
						) {
							const e = 0.001 * Date.now(),
								t = 0.2 * Math.cos(e),
								n = 0.2 * Math.sin(e);
							x.addDrop(t, n, 0.05, 0.05);
						}
						x.update(), i.render({ scene: w, camera: l });
					},
					S = () => {
						y.set(R.Ay.random().hex()), j.set(R.Ay.random().hex());
					},
					_ = ((e, t) => {
						let n;
						return function () {
							if (!n) {
								for (
									var s = arguments.length, o = new Array(s), a = 0;
									a < s;
									a++
								)
									o[a] = arguments[a];
								e.apply(this, o), (n = !0), setTimeout(() => (n = !1), t);
							}
						};
					})(() => {
						k =
							50 -
							3 *
								(() => {
									const e =
											window.scrollY || document.documentElement.scrollTop,
										t =
											document.documentElement.scrollHeight -
											document.documentElement.clientHeight;
									return t <= 0 ? 0 : Math.min(Math.max(e / t, 0), 1);
								})();
					}, 16),
					A = () => (
						"ontouchstart" in window
							? (document.body.addEventListener("touchstart", M, !1),
								document.body.addEventListener("touchmove", M, !1),
								document.body.addEventListener(
									"touchend",
									() => {
										b = !1;
									},
									!1,
								))
							: (document.body.addEventListener("mousemove", M, !1),
								document.body.addEventListener(
									"mouseleave",
									() => {
										b = !1;
									},
									!1,
								),
								document.body.addEventListener("mouseup", S, !1),
								document.addEventListener("scroll", _, { passive: !0 })),
						() => {
							"ontouchstart" in window ||
								(document.body.removeEventListener("mousemove", M),
								document.body.removeEventListener("mouseleave", () => {
									b = !1;
								}),
								document.body.removeEventListener("mouseup", S),
								document.removeEventListener("scroll", _));
						}
					),
					M = (e) => {
						(b = !0),
							e.changedTouches &&
								e.changedTouches.length &&
								((e.x = e.changedTouches[0].pageX),
								(e.y = e.changedTouches[0].pageY)),
							void 0 === e.x && ((e.x = e.pageX), (e.y = e.pageY)),
							v.set(
								(e.x / c.renderer.width) * 2 - 1,
								2 * (1 - e.y / c.renderer.height) - 1,
							),
							g >= 1 ? (v.y /= g) : (v.x /= g),
							x.addDrop(v.x, v.y, 0.05, 0.05);
					},
					L = () => {
						(d = window.innerWidth),
							(u = window.innerHeight),
							i.setSize(d, u),
							l.perspective({ aspect: d / u });
						const e = T(l);
						(m = e[0]), (h = e[1]), w && C();
					},
					T = (e) => {
						const t = (e.fov * Math.PI) / 180,
							n = 2 * Math.tan(t / 2) * Math.abs(e.position.z);
						return [n * e.aspect, n];
					};
				(i = new e({ dpr: 1 })),
					(c = i.gl),
					document.querySelector("#magicContainer").appendChild(c.canvas),
					(l = new t(c, { fov: 45 })),
					l.position.set(0, 0, k),
					L(),
					window.addEventListener("resize", L, !1),
					(v = new r()),
					N(),
					A(),
					requestAnimationFrame(E);
			}
			const B = (() => {
					const { ZY: e, BP: t } = O,
						n =
							"attribute vec2 uv, position; varying vec2 vUv; void main() {vUv = uv; gl_Position = vec4(position, 0, 1);}";
					return class {
						constructor(t) {
							Object.assign(this, {
								renderer: t,
								gl: t.gl,
								width: 512,
								height: 512,
								delta: new e(1 / 512, 1 / 512),
								gpgpu: new V(t.gl, { width: 512, height: 512 }),
							}),
								this.initShaders();
						}
						initShaders() {
							(this.updateProgram = new t(this.gl, {
								uniforms: {
									tDiffuse: { value: null },
									uDelta: { value: this.delta },
								},
								vertex: n,
								fragment:
									"precision highp float; uniform sampler2D tDiffuse; uniform vec2 uDelta; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); vec2 dx = vec2(uDelta.x, 0.0), dy = vec2(0.0, uDelta.y); float average = (texture2D(tDiffuse, vUv - dx).r + texture2D(tDiffuse, vUv - dy).r + texture2D(tDiffuse, vUv + dx).r + texture2D(tDiffuse, vUv + dy).r) * 0.25; texel.g += (average - texel.r) * 2.0; texel.g *= 0.8; texel.r += texel.g; gl_FragColor = texel;}",
							})),
								(this.dropProgram = new t(this.gl, {
									uniforms: {
										tDiffuse: { value: null },
										uCenter: { value: new e() },
										uRadius: { value: 0.05 },
										uStrength: { value: 0.05 },
									},
									vertex: n,
									fragment:
										"precision highp float; const float PI = 3.1415926535897932384626433832795; uniform sampler2D tDiffuse; uniform vec2 uCenter; uniform float uRadius; uniform float uStrength; varying vec2 vUv; void main() {vec4 texel = texture2D(tDiffuse, vUv); float drop = max(0.0, 1.0 - length(uCenter * 0.5 + 0.5 - vUv) / uRadius); drop = 0.5 - cos(drop * PI) * 0.5; texel.r += drop * uStrength; gl_FragColor = texel;}",
								}));
						}
						update() {
							(this.updateProgram.uniforms.tDiffuse.value =
								this.gpgpu.read.texture),
								this.gpgpu.renderProgram(this.updateProgram);
						}
						addDrop(e, t, n, s) {
							const o = this.dropProgram.uniforms;
							(o.tDiffuse.value = this.gpgpu.read.texture),
								o.uCenter.value.set(e, t),
								(o.uRadius.value = n),
								(o.uStrength.value = s),
								this.gpgpu.renderProgram(this.dropProgram);
						}
					};
				})(),
				V = (() => {
					const { O0: e, lM: t, e: n } = O;
					const s = (e, t, n, s) => ({
						width: t,
						height: n,
						type:
							s ||
							e.HALF_FLOAT ||
							e.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES,
						internalFormat: e.renderer.isWebgl2
							? s === e.FLOAT
								? e.RGBA32F
								: e.RGBA16F
							: e.RGBA,
						depth: !1,
						unpackAlignment: 1,
					});
					return class {
						constructor(o, a) {
							let { width: r, height: i, type: c } = a;
							Object.assign(this, {
								gl: o,
								width: r,
								height: i,
								numVertexes: r * i,
								read: new e(o, s(o, r, i, c)),
								write: new e(o, s(o, r, i, c)),
								mesh: new n(o, { geometry: new t(o) }),
							});
						}
						renderProgram(e) {
							(this.mesh.program = e),
								this.gl.renderer.render({
									scene: this.mesh,
									target: this.write,
									clear: !1,
								}),
								this.swap();
						}
						swap() {
							[this.read, this.write] = [this.write, this.read];
						}
					};
				})();
			const G = function () {
					return (
						(0, a.useEffect)(() => {
							const e = document.querySelector("#magicContainer");
							if (e)
								return (
									z(),
									() => {
										e.innerHTML = "";
									}
								);
						}, []),
						(0, g.jsx)("div", { id: "magicContainer" })
					);
				},
				Y = (0, a.lazy)(() => Promise.resolve().then(n.bind(n, 9591))),
				U = (0, a.lazy)(() => Promise.resolve().then(n.bind(n, 9695))),
				H = (0, a.lazy)(() =>
					Promise.all([n.e(232), n.e(658)]).then(n.bind(n, 7658)),
				),
				K = () => {
					const { isUnlocked: e } = S(),
						[t, n] = (0, a.useState)("bingo");
					if (!e) return null;
					const s = [
							{
								id: "bingo",
								title: "Bingo",
								icon: "fas fa-dice",
								component: Y,
							},
							{
								id: "needs",
								title: "Needs",
								icon: "fas fa-chart-radar",
								component: U,
							},
							{
								id: "snake",
								title: "Snake",
								icon: "fas fa-gamepad",
								component: H,
							},
						],
						o = s.find((e) => e.id === t),
						r = "".concat(
							{ bingo: "0", needs: "33.333333", snake: "66.666667" }[t],
							"%",
						);
					return (0, g.jsx)("section", {
						id: "tools",
						className: "tools",
						children: (0, g.jsxs)("div", {
							className: "container__content",
							children: [
								(0, g.jsx)("h1", { children: "Interactive Tools" }),
								(0, g.jsxs)("div", {
									className: "tools__tabs",
									children: [
										s.map((e) =>
											(0, g.jsxs)(
												"button",
												{
													className: t === e.id ? "active" : "",
													onClick: () => n(e.id),
													children: [
														(0, g.jsx)("i", { className: e.icon }),
														e.title,
													],
												},
												e.id,
											),
										),
										(0, g.jsx)("span", {
											className: "selector",
											style: { left: r },
										}),
									],
								}),
								(0, g.jsx)("div", {
									className: "tools__content",
									children: (0, g.jsx)(a.Suspense, {
										fallback: (0, g.jsxs)("div", {
											className: "tools__loading",
											children: [
												(0, g.jsx)("i", {
													className: "fas fa-spinner fa-spin",
												}),
												(0, g.jsx)("span", { children: "Loading..." }),
											],
										}),
										children: o && a.createElement(o.component),
									}),
								}),
							],
						}),
					});
				};
			var q = n(9591),
				W = n(9695),
				J = n(9899);
			const Z = n.p + "static/media/profile2-nbg.7ab0bf00af2707f3fee1.png";
			const X = function (e) {
				(0, a.useEffect)(() => {
					window.innerWidth > 768 &&
						(e.current.querySelectorAll("h1,h2,h3").forEach((e) => {
							const t = e.innerText.split("");
							(e.innerText = ""),
								t.forEach((t, n) => {
									const s = document.createElement("span");
									(s.className = "letter"),
										" " === t ? (s.innerHTML = "&nbsp;") : (s.textContent = t),
										e.appendChild(s);
								});
						}),
						e.current.querySelectorAll(".letter").forEach((e) => {
							const t = (e, t) => Math.floor(Math.random() * (t - e + 1)) + e;
							e.addEventListener("mouseover", (e) => {
								e.target.style.setProperty("--x", "".concat(t(-10, 10), "px")),
									e.target.style.setProperty(
										"--y",
										"".concat(t(-10, 10), "px"),
									),
									e.target.style.setProperty(
										"--r",
										"".concat(t(-10, 10), "deg"),
									);
							}),
								e.addEventListener("mouseout", (e) => {
									e.target.style.setProperty("--x", "0px"),
										e.target.style.setProperty("--y", "0px"),
										e.target.style.setProperty("--r", "0deg");
								});
						}));
				}, [e]);
			};
			function Q(e) {
				let { keyword: t, icon: n, link: s, tooltip: o } = e;
				const a = (e) => {
					e.preventDefault(), window.open(s, "_blank");
				};
				return (0, g.jsxs)("div", {
					className: "social__icon tooltip",
					children: [
						(0, g.jsx)("button", {
							type: "button",
							onClick: a,
							"aria-describedby": "tooltip-".concat(t),
							onKeyDown: (e) => {
								("Enter" !== e.key && " " !== e.key) || a(e);
							},
							children: (0, g.jsx)("i", {
								className: n,
								title: t,
								"aria-label": "Go to ".concat(t),
							}),
						}),
						(0, g.jsx)("span", {
							id: "tooltip-".concat(t),
							className: "tooltiptext tooltip-bottom",
							role: "tooltip",
							"aria-hidden": "true",
							children: o,
						}),
					],
				});
			}
			const $ = (e) => {
					let { part: t } = e;
					return (0, g.jsx)("div", { className: "bub-part-".concat(t) });
				},
				ee = () =>
					(0, g.jsx)("div", {
						className: "speech-arrow",
						children: ["w", "x", "y", "z"].map((e) =>
							(0, g.jsx)("div", { className: "arrow-".concat(e) }, e),
						),
					}),
				te = (e) => {
					let { isVisible: t } = e;
					const [n, s] = (0, a.useState)(0),
						o = (e) => {
							e.stopPropagation(), s((e) => (e < 2 ? e + 1 : e));
						};
					return (0, g.jsxs)("div", {
						className: "chat-bubble "
							.concat(t ? "visible" : "", " ")
							.concat(n > 0 ? "level-".concat(n) : ""),
						onClick: o,
						onKeyUp: (e) => "Enter" === e.key && o(),
						tabIndex: 0,
						children: [
							["a", "b", "c"].map((e) => (0, g.jsx)($, { part: e }, e)),
							(0, g.jsxs)("div", {
								className: "speech-txt",
								children: [
									(0, g.jsxs)("div", {
										className: "hint-section initial ".concat(
											n >= 0 ? "visible" : "",
										),
										children: [
											(0, g.jsx)("span", {
												className: "hint-text",
												children: "Whispers of a hidden realm echo...",
											}),
											(0, g.jsx)("div", { className: "hint-divider" }),
										],
									}),
									(0, g.jsxs)("div", {
										className: "hint-section first ".concat(
											n >= 1 ? "visible" : "",
										),
										children: [
											(0, g.jsxs)("span", {
												className: "hint-text",
												children: [
													"Where light meets dark in rhythmic dance,",
													(0, g.jsx)("br", {}),
													"Five times shall break the mystic trance.",
												],
											}),
											(0, g.jsx)("div", { className: "hint-divider" }),
										],
									}),
									(0, g.jsx)("div", {
										className: "hint-section second ".concat(
											n >= 2 ? "visible" : "",
										),
										children: (0, g.jsxs)("span", {
											className: "hint-text",
											children: [
												"Then speak the word that starts my name,",
												(0, g.jsx)("br", {}),
												"To enter realms beyond the frame.",
											],
										}),
									}),
									n < 2 &&
										(0, g.jsx)("div", {
											className: "hint-prompt",
											children:
												0 === n
													? "Tap for more..."
													: "One more secret remains...",
										}),
								],
							}),
							["c", "b", "a"].map((e) =>
								(0, g.jsx)($, { part: e }, "bottom-".concat(e)),
							),
							(0, g.jsx)(ee, {}),
						],
					});
				},
				ne = (e) => {
					let { type: t, items: n, separator: s } = e;
					const o = "name" === t ? "h1" : "h2";
					return (0, g.jsxs)(g.Fragment, {
						children: [
							n.map((e, t) =>
								(0, g.jsxs)(
									a.Fragment,
									{
										children: [
											(0, g.jsx)(o, { children: e }),
											s &&
												t < n.length - 1 &&
												(0, g.jsx)("h2", { children: s }),
										],
									},
									e,
								),
							),
							(0, g.jsx)("br", {}),
						],
					});
				},
				se = [
					{ type: "name", items: ["Aaron", "Lorenzo", "Woods"] },
					{
						type: "roles",
						items: ["Engineer", "Artist", "Scientist"],
						separator: " | ",
					},
					{
						type: "title",
						items: ["Biomedical", "Engineering", "Doctoral", "Student"],
					},
				],
				oe = [
					{
						keyword: "Email",
						icon: "fas fa-envelope-square",
						link: "mailto:alwoods@utexas.edu",
						tooltip: "Email: alwoods@utexas.edu",
					},
					{
						keyword: "LinkedIn",
						icon: "fab fa-linkedin",
						link: "https://www.linkedin.com/in/woods-aaron/",
						tooltip: "LinkedIn: woods-aaron",
					},
					{
						keyword: "Github",
						icon: "fab fa-github",
						link: "https://github.com/guitarbeat",
						tooltip: "Github: guitarbeat",
					},
					{
						keyword: "Instagram",
						icon: "fab fa-instagram",
						link: "https://www.instagram.com/guitarbeat/",
						tooltip: "Instagram @ guitarbeat",
					},
					{
						keyword: "Twitter",
						icon: "fab fa-twitter",
						link: "https://twitter.com/WoodsResearch",
						tooltip: "Twitter @ WoodsResearch",
					},
					{
						keyword: "CV",
						icon: "fas fa-file-alt",
						link: "/cv.pdf",
						tooltip: "Download my CV",
					},
					{
						keyword: "Google Scholar",
						icon: "fas fa-graduation-cap",
						link: "https://scholar.google.com/citations?user=85U8cEoAAAAJ&hl=en&authuser=1",
						tooltip: "View my Google Scholar profile",
					},
				];
			const ae = function () {
				const e = (0, a.useRef)(null),
					[t, n] = (0, a.useState)(!1),
					[s, o] = (0, a.useState)(!1),
					r = (0, a.useRef)(null);
				return (
					X(e),
					(0, a.useEffect)(
						() => () => {
							r.current && clearTimeout(r.current);
						},
						[],
					),
					(0, g.jsx)("div", {
						className: "container",
						id: "header",
						ref: e,
						children: (0, g.jsx)("div", {
							className: "container__content",
							children: (0, g.jsxs)("div", {
								className: "header",
								children: [
									(0, g.jsxs)("div", {
										className: "header__image-container",
										onMouseEnter: () => {
											r.current = setTimeout(() => {
												o(!0);
											}, 3e3);
										},
										onMouseLeave: () => {
											r.current &&
												(clearTimeout(r.current), (r.current = null)),
												o(!1);
										},
										children: [
											(0, g.jsxs)("button", {
												type: "button",
												onClick: () => n(!t),
												children: [
													(0, g.jsx)("img", {
														className: "avatar ".concat(t ? "" : "active"),
														src: J,
														alt: "image1",
													}),
													(0, g.jsx)("img", {
														className: "avatar ".concat(t ? "active" : ""),
														src: Z,
														alt: "image2",
													}),
												],
											}),
											(0, g.jsx)(te, { isVisible: s }),
										],
									}),
									(0, g.jsxs)("div", {
										className: "header__text",
										children: [
											se.map((e) => (0, g.jsx)(ne, (0, c.A)({}, e), e.type)),
											(0, g.jsx)("div", {
												className: "social",
												children: oe.map((e) =>
													(0, g.jsx)(Q, (0, c.A)({}, e), e.keyword),
												),
											}),
										],
									}),
								],
							}),
						}),
					})
				);
			};
			var re = n(6178),
				ie = n.n(re);
			function ce(e) {
				let {
					first_year: t,
					job_bars: n,
					activeCards: s,
					hoveredJob: o,
					jobs: a,
				} = e;
				const r = n.map((e, t) => {
					let [n, s] = e;
					return (0, g.jsx)(
						"div",
						{
							className: "work__timeline__subbar",
							style: { height: n + "%", bottom: s + "%" },
						},
						t,
					);
				});
				return (0, g.jsxs)("div", {
					className: "work__timeline",
					children: [
						(0, g.jsx)("p", {
							className: "work__timeline__now",
							children: "Now",
						}),
						o &&
							(0, g.jsx)("div", {
								className: "work__timeline__duration",
								style: {
									bottom: "".concat(o.bar_start + o.bar_height / 2, "%"),
									visibility: o ? "visible" : "hidden",
								},
								children: ((e) => {
									const t = Math.floor(e / 12),
										n = e % 12,
										s = (e, t, n) => {
											if (0 === e) return "";
											const s = ((e) =>
												e <= 12
													? [
															"One",
															"Two",
															"Three",
															"Four",
															"Five",
															"Six",
															"Seven",
															"Eight",
															"Nine",
															"Ten",
															"Eleven",
															"Twelve",
														][e - 1]
													: e.toString())(e);
											return "".concat(s, " ").concat(1 === e ? t : n);
										};
									if (0 === t) return s(n, "Month", "Months");
									if (0 === n) return s(t, "Year", "Years");
									const o = s(t, "Year", "Years"),
										a = s(n, "Month", "Months").toLowerCase();
									return "".concat(o, ", ").concat(a);
								})(o.duration),
							}),
						(0, g.jsx)("p", {
							className: "work__timeline__start",
							children: t,
						}),
						r,
						Array.from(s).map((e) => {
							const t = a.find((t) => t.slug === e);
							return (
								t &&
								(0, g.jsx)(
									"div",
									{
										className: "work__timeline__bar",
										style: {
											height: t.bar_height + "%",
											bottom: t.bar_start + "%",
										},
									},
									e,
								)
							);
						}),
					],
				});
			}
			const le = a.memo(ce);
			const de = (0, r.Ue)("work")(function (e) {
				let { db: t } = e;
				const [n, s] = (0, a.useState)(new Set()),
					[o, r] = (0, a.useState)(null),
					i = (e) => {
						s((t) => {
							const n = new Set(t);
							return n.has(e) ? n.delete(e) : n.add(e), n;
						});
					},
					c = (e) => {
						r(e);
					},
					l = t.work.map((e) => ({
						title: e.title,
						company: e.company,
						place: e.place,
						from: e.from,
						to: e.to,
						description: e.description,
						slug: e.slug,
					}));
				let d = ie()();
				l.forEach((e) => {
					const t = e.to ? ie()(e.to, "MM-YYYY") : ie()(),
						n = ie()(e.from, "MM-YYYY"),
						s = t.diff(n, "months");
					(e.from = n.format("MMM YYYY")),
						(e.to = e.to ? t.format("MMM YYYY") : "Now"),
						(e._from = n),
						(e._to = t),
						(e.date = 0 === s ? e.from : "".concat(e.from, " - ").concat(e.to)),
						(e.duration = 0 === s ? 1 : s),
						d.diff(n) > 0 && (d = n);
				});
				const u = ie()().diff(d, "months");
				l.forEach((e) => {
					(e.bar_start = (100 * e._from.diff(d, "months")) / u),
						(e.bar_height = (100 * e.duration) / u);
				});
				const m = l.map((e) => [e.bar_height, e.bar_start]),
					[h, v] = (0, a.useState)(!1),
					p = (0, a.useRef)(null);
				return (
					(0, a.useEffect)(() => {
						const e = new IntersectionObserver(
							(t) => {
								let [n] = t;
								n.isIntersecting && (v(!0), e.disconnect());
							},
							{ threshold: 0.1 },
						);
						return p.current && e.observe(p.current), () => e.disconnect();
					}, []),
					(0, g.jsx)(a.Fragment, {
						children: (0, g.jsx)("div", {
							className: "container",
							id: "work",
							ref: p,
							children: (0, g.jsxs)("div", {
								className: "container__content",
								children: [
									(0, g.jsx)("h1", { children: "My career so far" }),
									(0, g.jsxs)("div", {
										className: "work ".concat(h ? "visible" : ""),
										children: [
											(0, g.jsx)(le, {
												first_year: d.format("YYYY"),
												job_bars: m,
												activeCards: n,
												hoveredJob: l.find((e) => e.slug === o),
												jobs: l,
											}),
											(0, g.jsx)("div", {
												className: "work__items",
												children: l.map((e) => {
													const t = n.has(e.slug);
													return (0, g.jsxs)(
														"div",
														{
															className: "work__item ".concat(
																t ? "active" : "",
															),
															onClick: () => i(e.slug),
															onMouseEnter: () => c(e.slug),
															onMouseLeave: () => c(null),
															tabIndex: 0,
															role: "button",
															"aria-expanded": t,
															onKeyPress: (t) => {
																("Enter" !== t.key && " " !== t.key) ||
																	i(e.slug);
															},
															children: [
																(0, g.jsxs)("p", {
																	className: "work__item__place ".concat(
																		t ? "show-text" : "",
																	),
																	children: [
																		(0, g.jsx)("i", {
																			className: "fa fa-map-marker-alt",
																			"aria-hidden": "true",
																		}),
																		" ",
																		e.place,
																	],
																}),
																(0, g.jsx)("h2", { children: e.title }),
																(0, g.jsx)("h3", {
																	className: "company-name",
																	children: e.company,
																}),
																(0, g.jsx)("p", {
																	className: "work__item__date ".concat(
																		t ? "show-text" : "",
																	),
																	children: e.date,
																}),
																(0, g.jsx)("p", {
																	className: t ? "show-text" : "",
																	children: e.description,
																}),
															],
														},
														e.slug,
													);
												}),
											}),
										],
									}),
								],
							}),
						}),
					})
				);
			});
			function ue(e) {
				let {
					title: t,
					content: n,
					slug: s,
					link: o,
					keyword: r,
					date: i,
					image: c,
					tagColor: l,
					className: d,
				} = e;
				const [u, m] = (0, a.useState)(!1),
					h = o
						? (0, g.jsx)("div", {
								className: "projects__card__label projects__card__link",
								children: "Link",
							})
						: null;
				return (0, g.jsxs)(
					"a",
					{
						href: o,
						target: "_blank",
						rel: "noreferrer",
						className: "projects__card ".concat(d),
						onClick: (e) => {
							u || (e.preventDefault(), m(!0));
						},
						children: [
							(0, g.jsxs)("div", {
								className: "projects__card__keywords",
								children: [
									h,
									(0, g.jsx)("div", {
										className: "projects__card__label",
										style: { backgroundColor: l },
										children: r,
									}),
								],
							}),
							(0, g.jsx)("h3", { children: t }),
							(0, g.jsx)("p", {
								className: "date ".concat(u ? "show-text" : ""),
								style: {
									fontStyle: "italic",
									color: "var(--color-sage-light)",
								},
								children: i,
							}),
							(0, g.jsx)("p", { className: u ? "show-text" : "", children: n }),
							c &&
								(0, g.jsx)("img", {
									src: c,
									className: "project-image",
									alt: "Project",
								}),
						],
					},
					s,
				);
			}
			const me = (0, r.Ue)("projects")(function (e) {
					const [t, n] = (0, a.useState)([]),
						[s, o] = (0, a.useState)({});
					(0, a.useEffect)(() => {
						const t = [...new Set(e.db.projects.map((e) => e.keyword))],
							s = [
								"#386FA4",
								"#DE7254",
								"#67a286",
								"#A267AC",
								"#67A2AC",
								"#AC6767",
								"#AC8A67",
							],
							a = t.reduce((e, t, n) => ((e[t] = s[n % s.length]), e), {});
						o(a), n(t);
					}, [e.db.projects]);
					const r = e.db.projects
						.map((e) => ({
							title: e.title,
							slug: e.slug,
							date: e.date,
							keyword: e.keyword,
							link: e.link,
							content: e.content,
							image: e.image,
						}))
						.map((e) => {
							const n = !t.includes(e.keyword);
							return (0, g.jsx)(
								ue,
								(0, c.A)(
									(0, c.A)({}, e),
									{},
									{
										tagColor: s[e.keyword],
										className: "projects__card ".concat(
											n ? "filtered-out" : "",
										),
									},
								),
								e.slug,
							);
						})
						.sort((e, t) => (e.props.date > t.props.date ? -1 : 1));
					return (0, g.jsx)("div", {
						className: "container",
						id: "projects",
						children: (0, g.jsxs)("div", {
							className: "container__content",
							children: [
								(0, g.jsx)("h1", { children: "Some of my Projects" }),
								(0, g.jsx)("div", {
									className: "filter-buttons",
									children: Object.keys(s).map((e) =>
										(0, g.jsx)(
											"button",
											{
												onClick: () =>
													((e) => {
														t.includes(e)
															? 1 === t.length
																? n([...Object.keys(s)])
																: n(t.filter((t) => t !== e))
															: n([...t, e]);
													})(e),
												className: "tag ".concat(t.includes(e) ? "active" : ""),
												style: {
													borderColor: t.includes(e)
														? s[e]
														: "rgba(255, 255, 255, 0.2)",
													color: t.includes(e)
														? "white"
														: "rgba(255, 255, 255, 0.7)",
													backgroundColor: t.includes(e)
														? s[e]
														: "rgba(255, 255, 255, 0.2)",
													opacity: t.includes(e) ? 1 : 0.7,
												},
												children: e,
											},
											e,
										),
									),
								}),
								(0, g.jsx)("div", {
									className: "projects",
									children: (0, g.jsx)("div", {
										className: "projects__cards_container",
										children: r,
									}),
								}),
							],
						}),
					});
				}),
				he = n.p + "static/media/shell.bc8c6117e75fa0167f2f.png";
			function ve(e) {
				let { text: t } = e;
				const n = t.split(" ");
				return (0, g.jsx)(g.Fragment, {
					children: n.map((e, t) =>
						(0, g.jsxs)(
							"span",
							{ className: "hover-color-change", children: [e, " "] },
							t,
						),
					),
				});
			}
			const pe = (0, r.Ue)("about")(function (e) {
				let { db: t } = e;
				const [n, s] = (0, a.useState)(null),
					o = t.about
						? t.about.map((e) => ({
								category: e.category,
								description: e.description,
							}))
						: [],
					r = (e) => {
						s(n === e ? null : e);
					};
				return (0, g.jsx)("div", {
					id: "about",
					className: "container",
					children: (0, g.jsx)("div", {
						className: "container__content",
						children: (0, g.jsxs)("div", {
							className: "about-me",
							children: [
								(0, g.jsx)("h1", { children: "About Me" }),
								(0, g.jsxs)("div", {
									className: "about-me__content",
									children: [
										(0, g.jsx)("div", {
											className: "about-me__text-container",
											children:
												((i = o),
												i.map((e) => {
													let { category: t, description: s } = e;
													return (0, g.jsx)(
														"div",
														{
															className: "about-me__text ".concat(
																n === t ? "expanded" : "",
															),
															onClick: () => r(t),
															role: "button",
															tabIndex: 0,
															onKeyPress: (e) => {
																("Enter" !== e.key && " " !== e.key) || r(t);
															},
															children: (0, g.jsxs)("div", {
																className: "text-background",
																children: [
																	(0, g.jsx)("h2", { children: t }),
																	(0, g.jsx)("p", {
																		children: (0, g.jsx)(ve, { text: s }),
																	}),
																	(0, g.jsx)("div", {
																		className: "expand-indicator",
																		"aria-hidden": "true",
																		children: n === t ? "\u2212" : "+",
																	}),
																],
															}),
														},
														t,
													);
												})),
										}),
										(0, g.jsx)("div", {
											className: "about-me__spotify",
											children: (0, g.jsx)("a", {
												href: "https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&redirect=true",
												children: (0, g.jsx)("img", {
													src: "https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_offline=true&background_color=121212&interchange=true&bar_color=53b14f&bar_color_cover=true",
													alt: "Spotify GitHub profile",
												}),
											}),
										}),
									],
								}),
								(0, g.jsx)("div", {
									className: "about-me__img",
									children: (0, g.jsx)("img", {
										src: he,
										alt: "shell background",
									}),
								}),
							],
						}),
					}),
				});
				var i;
			});
			const fe = function (e) {
					let { items: t, onMatrixActivate: n } = e;
					const [s, o] = (0, a.useState)(!1),
						[r, i] = (0, a.useState)([]),
						{ isUnlocked: l } = S(),
						d = (0, c.A)((0, c.A)({}, t), l && { Tools: "/#tools" });
					(0, a.useEffect)(() => {
						const e = () => {
							o(window.scrollY > 300);
						};
						e();
						let t = null;
						const n = () => {
							null === t &&
								(t = setTimeout(() => {
									e(), (t = null);
								}, 100));
						};
						return (
							window.addEventListener("scroll", n),
							() => {
								window.removeEventListener("scroll", n), t && clearTimeout(t);
							}
						);
					}, []);
					const u = Object.keys(d)
						.reverse()
						.map((e, t) =>
							(0, g.jsx)(
								"li",
								{
									className: "navbar__item",
									children: (0, g.jsx)("a", {
										href: d[e],
										onClick: (e) => {
											e.preventDefault();
											const { href: t } = e.target;
											t.startsWith("#")
												? (window.location.href = ""
														.concat(window.location.origin)
														.concat(t))
												: (window.location.href = t);
										},
										children: e,
									}),
								},
								t,
							),
						);
					return (0, g.jsxs)("ul", {
						className: "navbar",
						children: [
							u,
							(0, g.jsx)("div", {
								className: "theme-switch",
								onClick: () => {
									const e = Date.now(),
										t = [...r, e].filter((t) => e - t < 2e3);
									i(t), t.length >= 5 && (i([]), n && n());
								},
								children: (0, g.jsx)("div", { className: "switch" }),
							}),
							(0, g.jsx)("button", {
								className: "scroll-to-top ".concat(s ? "visible" : ""),
								onClick: () => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								},
								"aria-label": "Scroll to top",
								"aria-hidden": !s,
								children: "\u2191",
							}),
						],
					});
				},
				ge = (0, a.lazy)(() => n.e(587).then(n.bind(n, 6587))),
				xe = (e) => {
					let { isVisible: t } = e;
					return (0, g.jsx)(a.Suspense, {
						fallback: null,
						children: (0, g.jsx)(ge, { isVisible: t }),
					});
				},
				we = "light",
				be = "dark",
				ye = "theme",
				je = "light-theme",
				ke = { START: 7, END: 17 },
				Ne = () => {
					const e = localStorage.getItem(ye);
					if (e) return e === we;
					const t = new Date().getHours();
					return t >= ke.START && t < ke.END;
				},
				Ce = () => {
					const [e, t] = (0, a.useState)(Ne),
						[n, s] = (0, a.useState)(!1),
						o = (0, a.useCallback)(() => {
							t((e) => {
								const t = !e;
								return localStorage.setItem(ye, t ? we : be), t;
							});
						}, []),
						r = (0, a.useCallback)((e) => {
							e.target.closest("button, a, input, .theme-switch, .navbar") ||
								s((e) => !e);
						}, []),
						i = (0, a.useCallback)((e, t, n) => {
							null !== e &&
								void 0 !== e &&
								e.classList &&
								e.classList[n ? "add" : "remove"](t);
						}, []);
					return (
						(0, a.useEffect)(() => {
							var e, t;
							const n = {
								themeSwitch: document.querySelector(".theme-switch"),
								mainContent: document.querySelector("main"),
							};
							return (
								null === (e = n.themeSwitch) ||
									void 0 === e ||
									e.addEventListener("click", o),
								null === (t = n.mainContent) ||
									void 0 === t ||
									t.addEventListener("dblclick", r),
								() => {
									var e, t;
									null === (e = n.themeSwitch) ||
										void 0 === e ||
										e.removeEventListener("click", o),
										null === (t = n.mainContent) ||
											void 0 === t ||
											t.removeEventListener("dblclick", r);
								}
							);
						}, [o, r]),
						(0, a.useEffect)(() => {
							const t = {
								body: document.body,
								themeSwitch: document.querySelector(".theme-switch"),
							};
							i(t.body, je, e),
								i(t.themeSwitch, je, e),
								((e) => {
									const t = document.querySelector("meta#theme-color");
									t && (t.content = e ? "#ffffff" : "#1a1a1a");
								})(e);
						}, [e, i]),
						(0, a.useEffect)(() => {
							const e = document.querySelector(".theme-switch");
							i(e, "cross-blur-active", n);
						}, [n, i]),
						(0, g.jsx)(xe, { isVisible: n })
					);
				},
				Ee = () =>
					(0, g.jsx)("div", {
						id: "magicContainer",
						children: (0, g.jsx)(G, {}),
					});
			Ee.displayName = "CustomLoadingComponent";
			const Se = (0, a.memo)((e) => {
				let { children: t, navItems: n, onMatrixActivate: s } = e;
				return (0, g.jsxs)("div", {
					className: "app-layout",
					children: [
						(0, g.jsx)(k, {}),
						(0, g.jsx)("div", { className: "vignette-top" }),
						(0, g.jsx)("div", { className: "vignette-bottom" }),
						(0, g.jsx)("div", { className: "vignette-left" }),
						(0, g.jsx)("div", { className: "vignette-right" }),
						(0, g.jsx)(fe, { items: n, onMatrixActivate: s }),
						(0, g.jsx)(F, { children: t }),
						(0, g.jsx)("div", {
							id: "magicContainer",
							children: (0, g.jsx)(G, {}),
						}),
					],
				});
			});
			(Se.displayName = "Layout"),
				(Se.propTypes = {
					children: o().node.isRequired,
					navItems: o().objectOf(o().string).isRequired,
					onMatrixActivate: o().func,
				});
			const _e = () =>
					(0, g.jsxs)(b, {
						as: "main",
						children: [
							(0, g.jsx)(ae, {}),
							(0, g.jsx)(pe, {}),
							(0, g.jsx)(me, {}),
							(0, g.jsx)(de, {}),
							(0, g.jsx)(K, {}),
						],
					}),
				Ae = () => {
					const [e, t] = (0, a.useState)(!1);
					(0, a.useEffect)(() => {
						const e = new URLSearchParams(window.location.search);
						if (e.has("password")) {
							e.delete("password");
							const t =
								window.location.pathname +
								(e.toString() ? "?".concat(e.toString()) : "");
							window.history.replaceState({}, "", t);
						}
					}, []);
					const n = (0, a.useCallback)(() => {
							t(!0);
						}, []),
						s = (0, a.useCallback)(() => {
							t(!1);
						}, []);
					return (0, g.jsxs)(g.Fragment, {
						children: [
							(0, g.jsx)(A, { isVisible: e, onSuccess: s }),
							(0, g.jsx)(i.Kd, {
								children: (0, g.jsx)(a.Suspense, {
									fallback: (0, g.jsx)(Ee, {}),
									children: (0, g.jsxs)(i.BV, {
										children: [
											(0, g.jsx)(i.qh, {
												exact: !0,
												path: "/",
												element: (0, g.jsx)(Se, {
													navItems: j,
													onMatrixActivate: n,
													children: (0, g.jsx)(_e, {}),
												}),
											}),
											(0, g.jsx)(i.qh, {
												path: "/bingo",
												element: (0, g.jsx)(Se, {
													navItems: j,
													onMatrixActivate: n,
													children: (0, g.jsx)(q.default, {}),
												}),
											}),
											(0, g.jsx)(i.qh, {
												path: "/needs",
												element: (0, g.jsx)(Se, {
													navItems: j,
													onMatrixActivate: n,
													children: (0, g.jsx)(W.default, {}),
												}),
											}),
											(0, g.jsx)(i.qh, {
												path: "*",
												element: (0, g.jsx)(i.C5, { to: "/", replace: !0 }),
											}),
										],
									}),
								}),
							}),
						],
					});
				},
				Me = () =>
					(0, g.jsx)(r.Ay, {
						config: y,
						children: (0, g.jsxs)(E, {
							children: [(0, g.jsx)(Ce, {}), (0, g.jsx)(Ae, {})],
						}),
					});
		},
		9620: (e, t, n) => {
			n.d(t, { A: () => a });
			var s = n(5043),
				o = n(579);
			const a = (e) => {
				let { children: t, className: n = "", contentClassName: a = "" } = e;
				const [r, i] = (0, s.useState)(!1);
				return (
					(0, s.useEffect)(() => {
						const e = (e) => {
							"Escape" === e.key && r && i(!1);
						};
						return (
							window.addEventListener("keydown", e),
							() => window.removeEventListener("keydown", e)
						);
					}, [r]),
					(0, s.useEffect)(() => {
						const e = () => {
							window.dispatchEvent(new Event("resize"));
						};
						return (
							r && (window.addEventListener("resize", e), e()),
							() => window.removeEventListener("resize", e)
						);
					}, [r]),
					(0, o.jsxs)("div", {
						className: "fullscreen-wrapper "
							.concat(r ? "fullscreen" : "", " ")
							.concat(n),
						children: [
							(0, o.jsx)("div", {
								className: "fullscreen-content ".concat(a),
								children: t,
							}),
							(0, o.jsx)("button", {
								className: "fullscreen-toggle",
								onClick: () => {
									i(!r);
								},
								"aria-label": r ? "Exit fullscreen" : "Enter fullscreen",
								children: r
									? (0, o.jsx)("svg", {
											viewBox: "0 0 24 24",
											width: "24",
											height: "24",
											children: (0, o.jsx)("path", {
												fill: "currentColor",
												d: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z",
											}),
										})
									: (0, o.jsx)("svg", {
											viewBox: "0 0 24 24",
											width: "24",
											height: "24",
											children: (0, o.jsx)("path", {
												fill: "currentColor",
												d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
											}),
										}),
							}),
						],
					})
				);
			};
		},
		9591: (e, t, n) => {
			n.r(t), n.d(t, { default: () => p });
			var s = n(8838),
				o = n(3536),
				a = n(5043);
			const r =
					"https://script.google.com/macros/s/AKfycbyBhGbMdj2e7FOfioUNrnTJcpG8ZM0MAsD5iWfO2ZO1Ucx-FUo-SZO9M-PvyHu8o2c/exec",
				i = r,
				c = {
					BINGO: {
						CHECK: "Check",
						CATEGORY: "Category",
						GOAL: "Goal",
						DESCRIPTION: "Description",
						ID: "ID",
					},
					ABOUT: { TITLE: "Title", CONTENT: "Content" },
					PROJECTS: {
						NAME: "Name",
						DESCRIPTION: "Description",
						LINK: "Link",
						IMAGE: "Image",
					},
					WORK: {
						COMPANY: "Company",
						ROLE: "Role",
						PERIOD: "Period",
						DESCRIPTION: "Description",
					},
				},
				l = function (e) {
					let t =
						arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
					return new Promise((n, s) => {
						const o =
							"googleAppsCallback_" + Math.random().toString(36).substr(2, 9);
						let a, r;
						window[o] = (e) => {
							clearTimeout(a), c(), e.error ? s(new Error(e.error)) : n(e);
						};
						const c = () => {
							r && r.parentNode && r.parentNode.removeChild(r),
								delete window[o];
						};
						a = setTimeout(() => {
							c(), s(new Error("Request timed out"));
						}, 1e4);
						try {
							const n = new URLSearchParams({
								action: e,
								data: JSON.stringify(t),
								callback: o,
							});
							(r = ((e) => {
								const t = document.createElement("script");
								return (t.src = e), (t.async = !0), t;
							})("".concat(i, "?").concat(n))),
								document.body.appendChild(r),
								(r.onerror = () => {
									clearTimeout(a), c(), s(new Error("Failed to load script"));
								});
						} catch (l) {
							clearTimeout(a), c(), s(l);
						}
					});
				},
				d = async () => {
					try {
						console.log("Testing Bingo data fetch...");
						const e = await l("getSheetData", { tabName: "bingo" });
						if (
							(console.log("Bingo data:", e), e.success && e.data.length > 0)
						) {
							const t = e.data[0];
							console.log("Testing update on first item...");
							const n = "1" === t[c.BINGO.CHECK],
								s = await l("updateSheetData", {
									tabName: "bingo",
									rowIndex: 0,
									columnName: c.BINGO.CHECK,
									value: n ? "0" : "1",
								});
							return (
								console.log("Update result:", s),
								await l("updateSheetData", {
									tabName: "bingo",
									rowIndex: 0,
									columnName: c.BINGO.CHECK,
									value: n ? "1" : "0",
								}),
								{ success: !0, message: "All tests passed!" }
							);
						}
						return { success: !1, message: "No data found in bingo sheet" };
					} catch (e) {
						return (
							console.log("Test failed:", e),
							{ success: !1, message: e.message }
						);
					}
				};
			"undefined" !== typeof window &&
				(window.googleAppsTest = {
					testIntegration: d,
					callAppsScript: l,
					SHEET_COLUMNS: c,
				});
			var u = n(9620),
				m = n(579);
			const h = (e) => {
					let {
						index: t,
						text: n,
						description: s = "",
						category: o = "",
						checked: a = !1,
						isHovered: r = !1,
						isEditing: i = !1,
						onClick: c = () => {},
						onDoubleClick: l = () => {},
						onHover: d = () => {},
						onEditComplete: u = () => {},
						editRef: h,
					} = e;
					return (0, m.jsx)("div", {
						className: "bingo-item "
							.concat(a ? "checked" : "", " ")
							.concat(r ? "hovered" : "", " category-")
							.concat(o.toLowerCase().replace(/\s+/g, "-")),
						onClick: () => c(t),
						onDoubleClick: () => l(t),
						onMouseEnter: () => d(t),
						onMouseLeave: () => d(null),
						role: "button",
						tabIndex: 0,
						children: (0, m.jsx)("div", {
							className: "item-content",
							children: i
								? (0, m.jsx)("input", {
										ref: h,
										type: "text",
										defaultValue: n,
										onKeyDown: (e) => {
											("Enter" !== e.key && "Escape" !== e.key) ||
												(e.preventDefault(), u(t, e.target.value));
										},
										onBlur: (e) => u(t, e.target.value),
										className: "edit-input",
										autoFocus: !0,
									})
								: (0, m.jsxs)(m.Fragment, {
										children: [
											(0, m.jsx)("div", { className: "text", children: n }),
											s &&
												(0, m.jsx)("div", {
													className: "description",
													style: { opacity: r ? 1 : 0 },
													children: s,
												}),
											a &&
												(0, m.jsx)("div", {
													className: "checkmark",
													children: (0, m.jsx)("svg", {
														viewBox: "0 0 24 24",
														width: "24",
														height: "24",
														children: (0, m.jsx)("path", {
															fill: "currentColor",
															d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
														}),
													}),
												}),
										],
									}),
						}),
					});
				},
				v = (e) => {
					let {
						bingoData: t,
						checkedItems: n,
						hoveredIndex: s,
						editIndex: o,
						onItemClick: a,
						onItemDoubleClick: r,
						onItemHover: i,
						onEditComplete: c,
						editRef: l,
						categories: d,
					} = e;
					return (0, m.jsx)("div", {
						className: "bingo-card",
						children: (0, m.jsx)("div", {
							className: "bingo-grid",
							children: t.slice(0, 25).map((e, t) =>
								(0, m.jsx)(
									h,
									{
										index: t,
										text: e.goal,
										description: e.description || "",
										category: e.category,
										checked: n[t] || !1,
										isHovered: s === t,
										isEditing: o === t,
										onClick: a,
										onDoubleClick: r,
										onHover: i,
										onEditComplete: c,
										editRef: o === t ? l : null,
									},
									t,
								),
							),
						}),
					});
				},
				p = () => {
					const [e, t] = (0, a.useState)([]),
						[n, r] = (0, a.useState)([]),
						[i, d] = (0, a.useState)(null),
						[h, p] = (0, a.useState)(null),
						[f, g] = (0, a.useState)(null),
						[x, w] = (0, a.useState)(!0),
						[b, y] = (0, a.useState)(null),
						[j, k] = (0, a.useState)({}),
						N = (0, a.useRef)(null),
						C = (0, a.useCallback)((e) => {
							for (let s = 0; s < 5; s++) {
								let t = !0;
								for (let n = 0; n < 5; n++)
									if (!e[5 * s + n]) {
										t = !1;
										break;
									}
								if (t) return !0;
							}
							for (let s = 0; s < 5; s++) {
								let t = !0;
								for (let n = 0; n < 5; n++)
									if (!e[5 * n + s]) {
										t = !1;
										break;
									}
								if (t) return !0;
							}
							let t = !0,
								n = !0;
							for (let s = 0; s < 5; s++)
								e[5 * s + s] || (t = !1), e[5 * s + (4 - s)] || (n = !1);
							return t || n;
						}, []),
						E = (0, a.useMemo)(() => {
							const e = (0, o.debounce)((e, t, n, s) => {
								l("updateSheetData", {
									tabName: "bingo",
									row: n + 2,
									column: c.BINGO.CHECK,
									value: s ? "1" : "0",
								})
									.then(e)
									.catch(t);
							}, 1e3);
							return (t, n) =>
								new Promise((s, o) => {
									e(s, o, t, n);
								});
						}, []),
						S = (0, a.useCallback)(
							(e) => {
								if (f) return clearTimeout(f), void g(null);
								const t = setTimeout(() => {
									const t = [...n];
									(t[e] = !n[e]),
										r(t),
										t[e] &&
											C(t) &&
											(0, s.A)({
												particleCount: 100,
												spread: 70,
												origin: { y: 0.6 },
											}),
										E(e, !n[e]).catch((s) => {
											console.error("Failed to save change:", s);
											const o = [...t];
											(o[e] = n[e]), r(o);
										}),
										g(null);
								}, 200);
								g(t);
							},
							[n, f, C, E],
						),
						_ = (0, a.useCallback)((e) => {
							p(e);
						}, []),
						A = (0, a.useCallback)((e) => {
							d(e);
						}, []),
						M = (0, a.useCallback)(
							(e, t) => {
								p(null), E(e, t);
							},
							[E],
						);
					return (
						(0, a.useEffect)(() => {
							(async () => {
								try {
									w(!0);
									const e = await l("getSheetData", { tabName: "bingo" });
									if (!e.success) throw new Error("Failed to fetch bingo data");
									{
										const n = {},
											s = e.data.map((e) => ({
												checked: "1" === e[c.BINGO.CHECK],
												category: e[c.BINGO.CATEGORY],
												goal: e[c.BINGO.GOAL],
												description: e[c.BINGO.DESCRIPTION],
											}));
										s.forEach((e) => {
											e.category &&
												(n[e.category] || (n[e.category] = []),
												n[e.category].push(e));
										}),
											t(s),
											k(n),
											r(s.map((e) => e.checked));
									}
								} catch (e) {
									console.error("Error fetching data:", e), y(e.message);
								} finally {
									w(!1);
								}
							})();
						}, []),
						x
							? (0, m.jsx)("div", {
									className: "bingo-loading",
									children: "Loading...",
								})
							: b
								? (0, m.jsxs)("div", {
										className: "bingo-error",
										children: ["Error: ", b],
									})
								: (0, m.jsx)(u.A, {
										children: (0, m.jsx)("div", {
											className: "bingo-container",
											children: (0, m.jsx)(v, {
												bingoData: e,
												checkedItems: n,
												hoveredIndex: i,
												editIndex: h,
												onItemClick: S,
												onItemDoubleClick: _,
												onItemHover: A,
												onEditComplete: M,
												editRef: N,
												categories: j,
											}),
										}),
									})
					);
				};
		},
		9695: (e, t, n) => {
			n.r(t), n.d(t, { default: () => f });
			var s = n(2555),
				o = n(5043),
				a = n(9620),
				r = n(579);
			const i = (e) => {
					let {
						emojis: t = [
							"\ud83d\ude14",
							"\ud83d\ude10",
							"\ud83d\ude0a",
							"\ud83d\ude04",
							"\ud83e\udd29",
						],
						onChange: n,
						initialValue: s = 50,
						disabled: a = !1,
					} = e;
					const [i, c] = (0, o.useState)(s),
						[l, d] = (0, o.useState)(!1),
						u = (0, o.useRef)(null),
						m = (0, o.useRef)(null),
						h = (e) => Math.min(Math.floor((e / 100) * t.length), t.length - 1),
						v = (0, o.useCallback)(
							(e) => {
								if (a) return;
								const t = u.current.getBoundingClientRect(),
									s = e.clientX - t.left,
									o = t.width,
									r = Math.max(0, Math.min(100, (s / o) * 100));
								c(r), null === n || void 0 === n || n(r);
							},
							[a, n],
						),
						p = (0, o.useCallback)(
							(e) => {
								a || (d(!0), v(e));
							},
							[a, v],
						),
						f = (0, o.useCallback)(
							(e) => {
								l && (e.preventDefault(), v(e));
							},
							[l, v],
						),
						g = (0, o.useCallback)(() => {
							d(!1);
						}, []);
					(0, o.useEffect)(() => {
						if (l)
							return (
								document.addEventListener("mousemove", f),
								document.addEventListener("mouseup", g),
								() => {
									document.removeEventListener("mousemove", f),
										document.removeEventListener("mouseup", g);
								}
							);
					}, [l, f, g]),
						(0, o.useEffect)(() => {
							c(s);
						}, [s]);
					const x = t[h(i)];
					return (0, r.jsxs)("div", {
						className: "emoji-slider-container ".concat(a ? "disabled" : ""),
						children: [
							(0, r.jsx)("div", {
								className: "emoji-display",
								children: (0, r.jsx)(
									"span",
									{ className: "current-emoji", children: x },
									x,
								),
							}),
							(0, r.jsxs)("div", {
								className: "slider-track",
								ref: u,
								onMouseDown: p,
								children: [
									(0, r.jsx)("div", {
										className: "slider-thumb",
										ref: m,
										style: { left: "".concat(i, "%") },
									}),
									(0, r.jsx)("div", {
										className: "slider-progress",
										style: { width: "".concat(i, "%") },
									}),
								],
							}),
							(0, r.jsx)("div", {
								className: "emoji-markers",
								children: t.map((e, t) =>
									(0, r.jsx)(
										"span",
										{
											className: "marker ".concat(t <= h(i) ? "active" : ""),
											children: e,
										},
										e,
									),
								),
							}),
						],
					});
				},
				c = (e) => {
					let { currentLevel: t, onMilestoneAchieved: n } = e;
					const [s, a] = (0, o.useState)(!1),
						[i, c] = (0, o.useState)(!1);
					return (
						(0, o.useEffect)(() => {
							t >= 100 && !s
								? (a(!0),
									c(!0),
									null === n || void 0 === n || n(),
									setTimeout(() => c(!1), 3e3))
								: t < 100 && s && a(!1);
						}, [t, s, n]),
						(0, r.jsxs)("div", {
							className: "milestone-tracker",
							children: [
								(0, r.jsx)("div", {
									className: "milestone-progress",
									children: (0, r.jsx)("div", {
										className: "milestone-fill",
										style: {
											width: "".concat(Math.min(100, Math.max(0, t)), "%"),
											transition: "width 0.3s ease-out",
										},
									}),
								}),
								i &&
									(0, r.jsx)("div", {
										className: "confetti-container",
										children: Array.from({ length: 50 }).map((e, t) =>
											(0, r.jsx)(
												"div",
												{
													className: "confetti",
													style: {
														"--delay": "".concat(3 * Math.random(), "s"),
														"--rotation": "".concat(360 * Math.random(), "deg"),
														"--position": "".concat(100 * Math.random(), "%"),
													},
												},
												t,
											),
										),
									}),
							],
						})
					);
				};
			c.defaultProps = { currentLevel: 0, onMilestoneAchieved: () => {} };
			const l = c,
				d = [
					{
						level: "Self Actualization",
						emoji: "\ud83c\udf1f",
						baseValue: 0,
						description:
							"Reaching your full potential, creativity, and purpose",
						color: "#BB9AF7",
					},
					{
						level: "Growth",
						emoji: "\ud83c\udf31",
						baseValue: 0,
						description: "Learning, development, and achievement",
						color: "#9ECE6A",
					},
					{
						level: "Esteem",
						emoji: "\u2b50",
						baseValue: 0,
						description: "Self-worth, confidence, and recognition",
						color: "#7AA2F7",
					},
					{
						level: "Connection",
						emoji: "\ud83d\udc9d",
						baseValue: 0,
						description: "Relationships, love, and belonging",
						color: "#F7768E",
					},
					{
						level: "Security",
						emoji: "\ud83d\udee1\ufe0f",
						baseValue: 0,
						description: "Safety, stability, and resources",
						color: "#E0AF68",
					},
					{
						level: "Survival",
						emoji: "\ud83c\udf3f",
						baseValue: 0,
						description: "Basic physical needs and health",
						color: "#73DACA",
					},
				],
				u = () => {
					try {
						const e = window.localStorage,
							t = "__storage_test__";
						return e.setItem(t, t), e.removeItem(t), !0;
					} catch (e) {
						return !1;
					}
				},
				m = (e, t) => {
					const [n, s] = (0, o.useState)(() => {
						if (!u()) return t;
						try {
							const n = window.localStorage.getItem(e);
							return n ? JSON.parse(n) : t;
						} catch (n) {
							return console.error("Error reading from localStorage:", n), t;
						}
					});
					return (
						(0, o.useEffect)(() => {
							if (u())
								try {
									window.localStorage.setItem(e, JSON.stringify(n));
								} catch (t) {
									console.error("Error writing to localStorage:", t);
								}
						}, [e, n]),
						[n, s]
					);
				},
				h = (e) => {
					try {
						return new Date(e).toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						});
					} catch (t) {
						return console.error("Error formatting date:", t), "Invalid Date";
					}
				},
				v = (e) => {
					switch (e) {
						case "Self Actualization":
							return [
								"\ud83d\ude14",
								"\ud83e\udd14",
								"\ud83d\ude0a",
								"\ud83c\udf1f",
								"\u2728",
							];
						case "Growth":
							return [
								"\ud83c\udf31",
								"\ud83c\udf3f",
								"\ud83c\udf33",
								"\ud83c\udf32",
								"\ud83c\udf8b",
							];
						case "Esteem":
							return [
								"\ud83d\ude1e",
								"\ud83d\ude10",
								"\ud83d\ude0a",
								"\ud83d\ude04",
								"\ud83e\udd29",
							];
						case "Connection":
							return [
								"\ud83d\udc94",
								"\u2764\ufe0f",
								"\ud83d\udc96",
								"\ud83d\udc9d",
								"\ud83d\udcab",
							];
						case "Security":
							return [
								"\ud83d\udee1\ufe0f",
								"\ud83d\udd12",
								"\ud83c\udff0",
								"\u2694\ufe0f",
								"\ud83d\udd31",
							];
						case "Survival":
							return [
								"\ud83d\ude2b",
								"\ud83d\ude23",
								"\ud83d\ude0c",
								"\ud83d\ude0a",
								"\ud83d\ude0e",
							];
						default:
							return [
								"\ud83d\ude14",
								"\ud83d\ude10",
								"\ud83d\ude42",
								"\ud83d\ude0a",
								"\ud83d\ude04",
							];
					}
				},
				p = (e) => {
					let { value: t, onChange: n, notes: s, onNotesChange: o } = e;
					return (0, r.jsxs)("div", {
						className: "growth-progress",
						children: [
							(0, r.jsx)("h3", { children: "Growth Progress" }),
							(0, r.jsx)(i, {
								emojis: v("Growth"),
								onChange: (e, t) => {
									n(t);
								},
								initialValue: t,
							}),
							(0, r.jsx)(l, {
								currentLevel: t,
								onMilestoneAchieved: () =>
									console.log("Growth milestone achieved!"),
							}),
							(0, r.jsx)("textarea", {
								className: "notes-input",
								value: s,
								onChange: (e) => o(e.target.value),
								placeholder: "Reflect on your growth journey...",
								"aria-label": "Growth progress notes",
							}),
						],
					});
				},
				f = () => {
					const [e, t] = m("needs-levels", d),
						[n, c] = m("growth-notes", ""),
						[u, f] = m("growth-value", 0),
						[g, x] = (0, o.useState)(null),
						[w, b] = (0, o.useState)({ show: !1, message: "", type: "" }),
						[y, j] = (0, o.useState)([
							{ levels: e, growthNotes: n, growthValue: u },
						]),
						[k, N] = (0, o.useState)(0),
						C = (0, o.useCallback)(function (e) {
							b({
								show: !0,
								message: e,
								type:
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: "info",
							}),
								setTimeout(() => b({ show: !1, message: "", type: "" }), 3e3);
						}, []),
						E = (0, o.useCallback)(
							(e) => {
								const t = y.slice(0, k + 1);
								j([...t, e]), N(k + 1);
							},
							[y, k],
						),
						S = (0, o.useCallback)(() => {
							if (k > 0) {
								const e = y[k - 1];
								t(e.levels),
									c(e.growthNotes),
									f(e.growthValue),
									N(k - 1),
									C("Undo successful", "info");
							}
						}, [k, y, t, c, f, C]),
						_ = (0, o.useCallback)(() => {
							if (k < y.length - 1) {
								const e = y[k + 1];
								t(e.levels),
									c(e.growthNotes),
									f(e.growthValue),
									N(k + 1),
									C("Redo successful", "info");
							}
						}, [k, y, t, c, f, C]);
					(0, o.useEffect)(() => {
						const e = (e) => {
							(!e.metaKey && !e.ctrlKey) ||
								"z" !== e.key ||
								e.shiftKey ||
								(e.preventDefault(), S()),
								(e.metaKey || e.ctrlKey) &&
									("y" === e.key || ("z" === e.key && e.shiftKey)) &&
									(e.preventDefault(), _());
						};
						return (
							window.addEventListener("keydown", e),
							() => window.removeEventListener("keydown", e)
						);
					}, [S, _]);
					const A = (0, o.useCallback)(() => {
						const e = new Date();
						try {
							x(e), C("Progress saved successfully", "success");
						} catch (t) {
							console.error("Error saving data:", t),
								C("Failed to save progress", "error");
						}
					}, [C]);
					(0, o.useEffect)(() => {
						const e = setInterval(A, 3e4);
						return () => clearInterval(e);
					}, [A]);
					const M = (0, o.useCallback)(
							(e, o) => {
								t((t) => {
									const a = t.map((t, n) =>
										n === e
											? (0, s.A)(
													(0, s.A)({}, t),
													{},
													{ value: Math.max(0, Math.min(100, o)) },
												)
											: t,
									);
									return E({ levels: a, growthNotes: n, growthValue: u }), a;
								});
							},
							[t, E, n, u],
						),
						L = (0, o.useCallback)(
							(t) => {
								c(t), E({ levels: e, growthNotes: t, growthValue: u });
							},
							[c, E, e, u],
						),
						T = (0, o.useCallback)(
							(t) => {
								f(t), E({ levels: e, growthNotes: n, growthValue: t });
							},
							[f, E, e, n],
						),
						I = (0, o.useCallback)(
							(t, n) => {
								var s;
								const o =
										0 === n ||
										(null === (s = e[n - 1]) || void 0 === s
											? void 0
											: s.value) >= 50,
									a = v(t.level),
									c = a[Math.floor((t.value / 100) * (a.length - 1))];
								return (0, r.jsxs)(
									"div",
									{
										className: "pyramid-section ".concat(
											o ? "available" : "locked",
										),
										style: {
											"--delay": "".concat(0.1 * n, "s"),
											"--level-index": n,
											"--progress": "".concat(t.value, "%"),
										},
										children: [
											(0, r.jsxs)("h3", {
												children: [
													c,
													" ",
													t.level,
													(0, r.jsxs)("span", {
														className: "level-progress",
														children: ["(", Math.round(t.value), "%)"],
													}),
												],
											}),
											(0, r.jsx)(i, {
												emojis: a,
												onChange: (e, t) => M(n, t),
												initialValue: t.value,
												disabled: !o,
											}),
											(0, r.jsx)(l, {
												currentLevel: t.value,
												onMilestoneAchieved: () =>
													C(
														"".concat(
															t.level,
															" milestone achieved! \ud83c\udf89",
														),
														"success",
													),
											}),
											!o &&
												(0, r.jsx)("div", {
													className: "level-lock-message",
													children: "Complete previous level to unlock",
												}),
										],
									},
									t.level,
								);
							},
							[e, M, C],
						);
					return (0, r.jsx)(a.A, {
						children: (0, r.jsxs)("div", {
							className: "needs-tool",
							children: [
								(0, r.jsxs)("header", {
									className: "header",
									children: [
										(0, r.jsx)("h2", { children: "Personal Growth Tracker" }),
										g &&
											(0, r.jsxs)("span", {
												className: "last-update",
												children: ["Last updated: ", h(g)],
											}),
									],
								}),
								(0, r.jsx)("div", {
									className: "pyramid-container",
									children: e.map((e, t) => I(e, t)),
								}),
								(0, r.jsx)(p, {
									value: u,
									onChange: T,
									notes: n,
									onNotesChange: L,
								}),
								(0, r.jsxs)("div", {
									className: "tool-controls",
									children: [
										(0, r.jsx)("button", {
											onClick: S,
											disabled: 0 === k,
											title: "Undo (Ctrl/Cmd + Z)",
											className: "control-button",
											children: "\u21a9\ufe0f Undo",
										}),
										(0, r.jsx)("button", {
											onClick: _,
											disabled: k === y.length - 1,
											title: "Redo (Ctrl/Cmd + Shift + Z)",
											className: "control-button",
											children: "\u21aa\ufe0f Redo",
										}),
									],
								}),
								w.show &&
									(0, r.jsx)("div", {
										className: "notification ".concat(w.type),
										children: w.message,
									}),
							],
						}),
					});
				};
		},
		9899: (e, t, n) => {
			e.exports = n.p + "static/media/profile1-nbg.f788ae03d5f60e93a0f6.png";
		},
	},
]);
//# sourceMappingURL=68.5b9fd224.chunk.js.map
