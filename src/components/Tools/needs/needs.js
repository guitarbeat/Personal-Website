import React, { useState, useCallback, useEffect } from "react";
import FullscreenWrapper from "../FullscreenWrapper.js";
import EmojiSlider from "../emoji/emoji.js";
import MilestoneTracker from "./MilestoneTracker.js";
import { NEEDS_LEVELS } from "./constants.js";
import { useLocalStorage } from "./index.js";
import { formatDate } from "./utils/dateUtils.js";
import "./needs.scss";

const getEmojisForLevel = (level) => {
	switch (level) {
		case "Self Actualization":
			return ["😔", "🤔", "😊", "🌟", "✨"];
		case "Growth":
			return ["🌱", "🌿", "🌳", "🌲", "🎋"];
		case "Esteem":
			return ["😞", "😐", "😊", "😄", "🤩"];
		case "Connection":
			return ["💔", "❤️", "💖", "💝", "💫"];
		case "Security":
			return ["🛡️", "🔒", "🏰", "⚔️", "🔱"];
		case "Survival":
			return ["😫", "😣", "😌", "😊", "😎"];
		default:
			return ["😔", "😐", "🙂", "😊", "😄"];
	}
};

const GrowthProgress = ({ value, onChange, notes, onNotesChange }) => {
	const handleSliderChange = (emoji, progress) => {
		onChange(progress);
	};

	return (
		<div className="growth-progress">
			<h3>Growth Progress</h3>
			<EmojiSlider
				emojis={getEmojisForLevel("Growth")}
				onChange={handleSliderChange}
				initialValue={value}
			/>
			<MilestoneTracker
				currentLevel={value}
				onMilestoneAchieved={() => console.log("Growth milestone achieved!")}
			/>
			<textarea
				className="notes-input"
				value={notes}
				onChange={(e) => onNotesChange(e.target.value)}
				placeholder="Reflect on your growth journey..."
				aria-label="Growth progress notes"
			/>
		</div>
	);
};

const NeedsAssessment = () => {
	const [levels, setLevels] = useLocalStorage("needs-levels", NEEDS_LEVELS);
	const [growthNotes, setGrowthNotes] = useLocalStorage("growth-notes", "");
	const [growthValue, setGrowthValue] = useLocalStorage("growth-value", 0);
	const [lastUpdate, setLastUpdate] = useState(null);
	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "",
	});

	// Add history state for undo/redo
	const [history, setHistory] = useState([
		{ levels, growthNotes, growthValue },
	]);
	const [currentIndex, setCurrentIndex] = useState(0);

	const AUTO_SAVE_INTERVAL = 30000;
	const MINIMUM_VALUE_TO_UNLOCK = 50;

	const showNotification = useCallback((message, type = "info") => {
		setNotification({ show: true, message, type });
		setTimeout(
			() => setNotification({ show: false, message: "", type: "" }),
			3000,
		);
	}, []);

	// Add undo/redo functions
	const addToHistory = useCallback(
		(newState) => {
			const newHistory = history.slice(0, currentIndex + 1);
			setHistory([...newHistory, newState]);
			setCurrentIndex(currentIndex + 1);
		},
		[history, currentIndex],
	);

	const undo = useCallback(() => {
		if (currentIndex > 0) {
			const prevState = history[currentIndex - 1];
			setLevels(prevState.levels);
			setGrowthNotes(prevState.growthNotes);
			setGrowthValue(prevState.growthValue);
			setCurrentIndex(currentIndex - 1);
			showNotification("Undo successful", "info");
		}
	}, [
		currentIndex,
		history,
		setLevels,
		setGrowthNotes,
		setGrowthValue,
		showNotification,
	]);

	const redo = useCallback(() => {
		if (currentIndex < history.length - 1) {
			const nextState = history[currentIndex + 1];
			setLevels(nextState.levels);
			setGrowthNotes(nextState.growthNotes);
			setGrowthValue(nextState.growthValue);
			setCurrentIndex(currentIndex + 1);
			showNotification("Redo successful", "info");
		}
	}, [
		currentIndex,
		history,
		setLevels,
		setGrowthNotes,
		setGrowthValue,
		showNotification,
	]);

	// Add keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Undo: Cmd/Ctrl + Z
			if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
				e.preventDefault();
				undo();
			}
			// Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
			if (
				(e.metaKey || e.ctrlKey) &&
				(e.key === "y" || (e.key === "z" && e.shiftKey))
			) {
				e.preventDefault();
				redo();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [undo, redo]);

	const handleSave = useCallback(() => {
		const timestamp = new Date();
		try {
			setLastUpdate(timestamp);
			showNotification("Progress saved successfully", "success");
		} catch (error) {
			console.error("Error saving data:", error);
			showNotification("Failed to save progress", "error");
		}
	}, [showNotification]);

	useEffect(() => {
		const autoSaveInterval = setInterval(handleSave, AUTO_SAVE_INTERVAL);
		return () => clearInterval(autoSaveInterval);
	}, [handleSave]);

	const handleLevelChange = useCallback(
		(index, newValue) => {
			setLevels((prev) => {
				const newLevels = prev.map((level, i) =>
					i === index
						? { ...level, value: Math.max(0, Math.min(100, newValue)) }
						: level,
				);
				// Add to history when levels change
				addToHistory({ levels: newLevels, growthNotes, growthValue });
				return newLevels;
			});
		},
		[setLevels, addToHistory, growthNotes, growthValue],
	);

	const handleGrowthNotesChange = useCallback(
		(newNotes) => {
			setGrowthNotes(newNotes);
			addToHistory({ levels, growthNotes: newNotes, growthValue });
		},
		[setGrowthNotes, addToHistory, levels, growthValue],
	);

	const handleGrowthValueChange = useCallback(
		(newValue) => {
			setGrowthValue(newValue);
			addToHistory({ levels, growthNotes, growthValue: newValue });
		},
		[setGrowthValue, addToHistory, levels, growthNotes],
	);

	const renderPyramidSection = useCallback(
		(level, index) => {
			const isAvailable =
				index === 0 || levels[index - 1]?.value >= MINIMUM_VALUE_TO_UNLOCK;
			const levelEmojis = getEmojisForLevel(level.level);
			const currentEmojiIndex = Math.floor(
				(level.value / 100) * (levelEmojis.length - 1),
			);
			const currentEmoji = levelEmojis[currentEmojiIndex];

			return (
				<div
					key={level.level}
					className={`pyramid-section ${isAvailable ? "available" : "locked"}`}
					style={{
						"--delay": `${index * 0.1}s`,
						"--level-index": index,
						"--progress": `${level.value}%`,
					}}
				>
					<h3>
						{currentEmoji} {level.level}
						<span className="level-progress">({Math.round(level.value)}%)</span>
					</h3>
					<EmojiSlider
						emojis={levelEmojis}
						onChange={(_, progress) => handleLevelChange(index, progress)}
						initialValue={level.value}
						disabled={!isAvailable}
					/>
					<MilestoneTracker
						currentLevel={level.value}
						onMilestoneAchieved={() =>
							showNotification(
								`${level.level} milestone achieved! 🎉`,
								"success",
							)
						}
					/>
					{!isAvailable && (
						<div className="level-lock-message">
							Complete previous level to unlock
						</div>
					)}
				</div>
			);
		},
		[levels, handleLevelChange, showNotification],
	);

	return (
		<FullscreenWrapper>
			<div className="needs-tool">
				<header className="header">
					<h2>Personal Growth Tracker</h2>
					{lastUpdate && (
						<span className="last-update">
							Last updated: {formatDate(lastUpdate)}
						</span>
					)}
				</header>

				<div className="pyramid-container">
					{levels.map((level, index) => renderPyramidSection(level, index))}
				</div>

				<GrowthProgress
					value={growthValue}
					onChange={handleGrowthValueChange}
					notes={growthNotes}
					onNotesChange={handleGrowthNotesChange}
				/>

				<div className="tool-controls">
					<button
						onClick={undo}
						disabled={currentIndex === 0}
						title="Undo (Ctrl/Cmd + Z)"
						className="control-button"
					>
						↩️ Undo
					</button>
					<button
						onClick={redo}
						disabled={currentIndex === history.length - 1}
						title="Redo (Ctrl/Cmd + Shift + Z)"
						className="control-button"
					>
						↪️ Redo
					</button>
				</div>

				{notification.show && (
					<div className={`notification ${notification.type}`}>
						{notification.message}
					</div>
				)}
			</div>
		</FullscreenWrapper>
	);
};

export default NeedsAssessment;
