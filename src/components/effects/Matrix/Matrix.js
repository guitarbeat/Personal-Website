// Third-party imports
import React, { useEffect, useRef, useState } from "react";

// Context imports
import { useAuth } from "./AuthContext";

// Asset imports
import incorrectGif from "../../../assets/images/nu-uh-uh.webp";

// Styles
import "./matrix.scss";

const Matrix = ({ isVisible, onSuccess }) => {
	const canvasRef = useRef(null);
	const formRef = useRef(null);
	const [password, setPassword] = useState("");
	const {
		checkPassword,
		showIncorrectFeedback,
		showSuccessFeedback,
		dismissFeedback,
	} = useAuth();

	const MIN_FONT_SIZE = 12;
	const MAX_FONT_SIZE = 16;
	const ALPHABET =
		"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		const success = checkPassword(password);
		if (success) {
			setTimeout(() => {
				onSuccess?.();
			}, 2000); // Match the animation duration
		}
		setPassword("");
	};

	// Handle container clicks
	const handleContainerClick = (e) => {
		if (e.target !== canvasRef.current) {
			return;
		}

		if (showIncorrectFeedback || showSuccessFeedback) {
			return;
		}

		onSuccess?.();
	};

	// Handle keypress for incorrect feedback
	useEffect(() => {
		if (!isVisible) {
			return;
		}

		const handleKeyPress = () => {
			if (showIncorrectFeedback) {
				dismissFeedback();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [isVisible, showIncorrectFeedback, dismissFeedback]);

	// Matrix Rain Effect
	useEffect(() => {
		if (!isVisible) {
			return;
		}

		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		class Drop {
			constructor(x) {
				this.x = x;
				this.y = -100; // Start above the screen
				this.speed = Math.random() * 1.5 + 0.5; // Slower speed
				this.fontSize = Math.floor(
					Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE,
				);
				this.char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
				this.changeInterval = Math.random() * 40 + 10;
				this.frame = 0;
				this.opacity = Math.random() * 0.5 + 0.2; // Random opacity for each drop
			}

			update() {
				this.y += this.speed;
				this.frame++;

				if (this.frame >= this.changeInterval) {
					this.char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
					this.frame = 0;
				}

				if (this.y * this.fontSize > canvas.height) {
					this.y = -100 / this.fontSize; // Reset to above screen
					this.speed = Math.random() * 1.5 + 0.5;
					this.fontSize = Math.floor(
						Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE,
					);
					this.opacity = Math.random() * 0.5 + 0.2;
				}
			}

			draw() {
				context.font = `${this.fontSize}px monospace`;

				// Create gradient for each character
				const gradient = context.createLinearGradient(
					this.x,
					this.y,
					this.x,
					this.y + this.fontSize,
				);
				gradient.addColorStop(0, `rgba(0, 255, 0, ${this.opacity})`);
				gradient.addColorStop(1, `rgba(0, 170, 0, ${this.opacity * 0.7})`);

				// Determine if this should be a bright character (less frequently now)
				const isBright = Math.random() > 0.97;

				if (isBright) {
					context.fillStyle = `rgba(255, 255, 255, ${this.opacity * 1.2})`;
					context.shadowColor = "rgba(255, 255, 255, 0.5)";
					context.shadowBlur = 5;
				} else {
					context.fillStyle = gradient;
					context.shadowColor = "rgba(0, 255, 0, 0.3)";
					context.shadowBlur = 2;
				}

				context.fillText(this.char, this.x, this.y * this.fontSize);
				context.shadowBlur = 0;
			}
		}

		const columns = Math.floor(canvas.width / MIN_FONT_SIZE);
		const drops = Array(columns)
			.fill(null)
			.map((_, i) => {
				const drop = new Drop(i * MIN_FONT_SIZE);
				drop.y = (Math.random() * canvas.height) / MIN_FONT_SIZE; // Random initial positions
				return drop;
			});

		const draw = () => {
			context.fillStyle = "rgba(0, 0, 0, 0.02)"; // More transparent trail
			context.fillRect(0, 0, canvas.width, canvas.height);

			drops.forEach((drop) => {
				drop.update();
				drop.draw();
			});
		};

		let animationFrameId;
		const animate = () => {
			draw();
			animationFrameId = window.requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			window.cancelAnimationFrame(animationFrameId);
		};
	}, [isVisible]);

	if (!isVisible) {
		return null;
	}

	return (
		<div
			className={`matrix-container ${isVisible ? "visible" : ""}`}
			onClick={handleContainerClick}
		>
			<button className="matrix-close-btn" onClick={onSuccess}>
				EXIT
			</button>
			<canvas ref={canvasRef} className="matrix-canvas" />

			{showIncorrectFeedback && (
				<div
					className="feedback-container glitch-effect"
					onClick={dismissFeedback}
				>
					<img
						src={incorrectGif}
						alt="Incorrect password"
						className="incorrect-gif"
					/>
					<div className="feedback-hint">Press any key to continue</div>
				</div>
			)}

			{showSuccessFeedback && (
				<div className="success-message">
					<span className="success-text">Access Granted</span>
				</div>
			)}

			{!showSuccessFeedback && !showIncorrectFeedback && (
				<form ref={formRef} onSubmit={handleSubmit} className="password-form">
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter password"
						className="password-input"
					/>
				</form>
			)}
		</div>
	);
};

export default Matrix;
