import React, { useState, useEffect, useRef, useCallback } from "react";
import "./emoji.css";

const EmojiSlider = ({
	emojis = ["😔", "😐", "😊", "😄", "🤩"],
	onChange,
	initialValue = 50,
	disabled = false,
}) => {
	const [value, setValue] = useState(initialValue);
	const [isDragging, setIsDragging] = useState(false);
	const sliderRef = useRef(null);
	const thumbRef = useRef(null);

	const getEmojiIndex = (val) => {
		return Math.min(Math.floor((val / 100) * emojis.length), emojis.length - 1);
	};

	const handleSliderChange = useCallback(
		(e) => {
			if (disabled) {
     return;
   }

			const rect = sliderRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const {width} = rect;
			const percentage = Math.max(0, Math.min(100, (x / width) * 100));

			setValue(percentage);
			onChange?.(percentage);
		},
		[disabled, onChange],
	);

	const handleMouseDown = useCallback(
		(e) => {
			if (!disabled) {
				setIsDragging(true);
				handleSliderChange(e);
			}
		},
		[disabled, handleSliderChange],
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (isDragging) {
				e.preventDefault();
				handleSliderChange(e);
			}
		},
		[isDragging, handleSliderChange],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const currentEmoji = emojis[getEmojiIndex(value)];

	return (
		<div className={`emoji-slider-container ${disabled ? "disabled" : ""}`}>
			<div className="emoji-display">
				<span className="current-emoji" key={currentEmoji}>
					{currentEmoji}
				</span>
			</div>
			<div
				className="slider-track"
				ref={sliderRef}
				onMouseDown={handleMouseDown}
			>
				<div
					className="slider-thumb"
					ref={thumbRef}
					style={{ left: `${value}%` }}
				/>
				<div className="slider-progress" style={{ width: `${value}%` }} />
			</div>
			<div className="emoji-markers">
				{emojis.map((emoji, index) => (
					<span
						key={emoji}
						className={`marker ${index <= getEmojiIndex(value) ? "active" : ""}`}
					>
						{emoji}
					</span>
				))}
			</div>
		</div>
	);
};

export default EmojiSlider;
