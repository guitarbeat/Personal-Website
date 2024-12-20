import React, { useEffect, useRef, useState, useCallback } from "react";
import profile1 from "../../../assets/images/profile1-nbg.png";
import FullscreenWrapper from "../FullscreenWrapper";
import { GAME_CONFIG, RESPONSIVE_CONFIG, getCanvasSize } from "./constants";
import { SnakeScene } from "./snake";
import "./snake.scss";

const SnakeGame = () => {
	const containerRef = useRef(null);
	const canvasRef = useRef(null);
	const gameInstanceRef = useRef(null);
	const resizeTimeoutRef = useRef(null);
	const [isGameOver, setIsGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(
		Number.parseInt(localStorage.getItem("snakeHighScore")) || 0,
	);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
	const [isMobile, setIsMobile] = useState(false);
	const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

	const handleResize = useCallback(() => {
		if (resizeTimeoutRef.current) {
			clearTimeout(resizeTimeoutRef.current);
		}

		resizeTimeoutRef.current = setTimeout(() => {
			if (containerRef.current) {
				try {
					const container = containerRef.current;
					const { width, height } = container.getBoundingClientRect();
					const newSize = getCanvasSize(width, height);

					// Only update if size actually changed
					if (
						newSize.width !== canvasSize.width ||
						newSize.height !== canvasSize.height
					) {
						setCanvasSize(newSize);
						setIsMobile(width <= RESPONSIVE_CONFIG.mobileBreakpoint);

						// Update canvas size
						if (canvasRef.current) {
							canvasRef.current.width = newSize.width;
							canvasRef.current.height = newSize.height;
						}

						// Update game instance
						if (gameInstanceRef.current) {
							gameInstanceRef.current.canvasSize = newSize;
							gameInstanceRef.current.updateGridSize();
						}
					}
				} catch (error) {
					console.error("Error during resize:", error);
				}
			}
		}, 250);
	}, [canvasSize]);

	useEffect(() => {
		handleResize();

		let resizeObserver;
		try {
			resizeObserver = new ResizeObserver((entries) => {
				// Avoid infinite loops by checking if size actually changed
				const entry = entries[0];
				if (entry?.contentRect) {
					handleResize();
				}
			});

			if (containerRef.current) {
				resizeObserver.observe(containerRef.current);
			}
		} catch (error) {
			console.warn("ResizeObserver error:", error);
		}

		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);

		return () => {
			if (resizeTimeoutRef.current) {
				clearTimeout(resizeTimeoutRef.current);
			}
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
		};
	}, [handleResize]);

	useEffect(() => {
		if (
			canvasRef.current &&
			containerRef.current &&
			canvasSize.width &&
			canvasSize.height
		) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");

			// Set canvas size
			canvas.width = canvasSize.width;
			canvas.height = canvasSize.height;

			// Initialize game
			const game = new SnakeScene(isMobile);
			game.game = { context: ctx, canvas };
			game.create(canvasSize);
			gameInstanceRef.current = game;

			// Focus the canvas for keyboard input
			canvas.setAttribute("tabindex", "0");
			canvas.focus();

			// Animation loop
			let animationFrameId;
			const render = (time) => {
				if (!game.state.gameOver) {
					game.update(time);
					setScore(game.state.score);
					if (game.state.gameOver) {
						setIsGameOver(true);
						if (game.state.score > highScore) {
							setHighScore(game.state.score);
							localStorage.setItem("snakeHighScore", game.state.score);
						}
					}
					animationFrameId = window.requestAnimationFrame(render);
				}
			};
			render(0);

			// Cleanup
			return () => {
				window.cancelAnimationFrame(animationFrameId);
				if (game.cleanup) {
					game.cleanup();
				}
				gameInstanceRef.current = null;
			};
		}
	}, [canvasSize, isMobile, highScore]);

	const handleRestart = useCallback(() => {
		if (gameInstanceRef.current) {
			gameInstanceRef.current.initializeGame();
			setIsGameOver(false);
			setScore(0);
			if (canvasRef.current) {
				canvasRef.current.focus();
			}
		}
	}, []);

	const handleTouchStart = (e) => {
		const touch = e.touches[0];
		touchStartRef.current = {
			x: touch.clientX,
			y: touch.clientY,
			time: Date.now(),
		};
	};

	const handleTouchEnd = (e) => {
		const touch = e.changedTouches[0];
		const deltaX = touch.clientX - touchStartRef.current.x;
		const deltaY = touch.clientY - touchStartRef.current.y;
		const deltaTime = Date.now() - touchStartRef.current.time;

		if (deltaTime < GAME_CONFIG.touchThreshold.time) {
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			if (distance > GAME_CONFIG.touchThreshold.distance) {
				const angle = Math.atan2(deltaY, deltaX);
				const direction = Math.round(angle / (Math.PI / 2));

				if (gameInstanceRef.current) {
					switch ((direction + 4) % 4) {
						case 0:
							gameInstanceRef.current.setDirection("right");
							break;
						case 1:
							gameInstanceRef.current.setDirection("down");
							break;
						case 2:
							gameInstanceRef.current.setDirection("left");
							break;
						case 3:
							gameInstanceRef.current.setDirection("up");
							break;
						default:
							break;
					}
				}
			}
		}
	};

	return (
		<FullscreenWrapper>
			<div ref={containerRef} className="snake-tool">
				<div className="game-container">
					<div className="score-display">
						<div className="score">
							<span>Score</span>
							<span>{String(score).padStart(2, "0")}</span>
						</div>
						<div className="high-score">
							<span>Best</span>
							<span>{String(highScore).padStart(2, "0")}</span>
						</div>
						{score > 0 && score >= highScore && (
							<div className="profile-badge">
								<img src={profile1} alt="Profile" />
								<div className="badge-label">New Best!</div>
							</div>
						)}
					</div>
					<canvas
						ref={canvasRef}
						className="game-canvas"
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
					/>
					{isGameOver && (
						<div className="game-over">
							<div className="game-over-content">
								<div className="profile-container">
									<img src={profile1} alt="Profile" className="profile-image" />
									<div className="pixel-overlay" />
								</div>
								<h2 data-text="GAME OVER">GAME OVER</h2>
								<div className="score-message">
									{score === highScore && score > 0 ? (
										<>
											<div className="score-banner">
												<span className="star">★</span>
												<span className="new-record">NEW RECORD!</span>
												<span className="star">★</span>
											</div>
											<p className="score-value">
												Score: {String(score).padStart(2, "0")}
											</p>
											<p className="encouraging-text">You're unstoppable!</p>
										</>
									) : (
										<>
											<p className="score-value">
												Score: {String(score).padStart(2, "0")}
											</p>
											<p className="high-score-value">
												Best: {String(highScore).padStart(2, "0")}
											</p>
											<p className="encouraging-text">
												{score === 0
													? "Don't give up!"
													: score < 5
														? "You can do better!"
														: score < 10
															? "Getting better!"
															: score < highScore
																? "Almost there!"
																: "Great job!"}
											</p>
										</>
									)}
								</div>
								<div className="game-over-buttons">
									<button onClick={handleRestart} className="play-again-btn">
										<span className="btn-text">PLAY AGAIN</span>
										<span className="btn-icon">↺</span>
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</FullscreenWrapper>
	);
};

export default SnakeGame;
