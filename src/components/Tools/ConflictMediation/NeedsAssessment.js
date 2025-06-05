import React, { memo, useState } from "react";
import styles from "./NeedsAssessment.module.scss";

// Constants
const MASLOW_LEVELS = [
	{
		name: "Physiological",
		emoji: "🌿",
		description: "Basic needs like food, water, shelter",
		color: "#FF5722",
		bgColor: "var(--color-grey-dark-3)",
		hoverBgColor: "var(--color-grey-dark-4)",
	},
	{
		name: "Safety",
		emoji: "🛡️",
		description: "Security, safety, stability",
		color: "#2196F3",
		bgColor: "var(--color-grey-dark-3)",
		hoverBgColor: "var(--color-grey-dark-4)",
	},
	{
		name: "Love/Belonging",
		emoji: "💝",
		description: "Relationships, connection",
		color: "#E91E63",
		bgColor: "var(--color-grey-dark-3)",
		hoverBgColor: "var(--color-grey-dark-4)",
	},
	{
		name: "Esteem",
		emoji: "⭐",
		description: "Respect, recognition, status",
		color: "#FFC107",
		bgColor: "var(--color-grey-dark-3)",
		hoverBgColor: "var(--color-grey-dark-4)",
	},
	{
		name: "Self-Actualization",
		emoji: "🚀",
		description: "Growth, fulfillment, creativity",
		color: "#4CAF50",
		bgColor: "var(--color-grey-dark-3)",
		hoverBgColor: "var(--color-grey-dark-4)",
	},
];

const EMOTIONS = [
	"Happy", "Sad", "Angry", "Anxious", "Calm", "Excited", 
	"Frustrated", "Content", "Overwhelmed", "Grateful"
];

// Styles are defined in NeedsAssessment.module.scss

// Needs Content Component
const NeedsContent = memo(({ isFullscreen }) => {
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [selectedEmotion, setSelectedEmotion] = useState("");
	const [notes, setNotes] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectedLevel && selectedEmotion) {
			alert(`Check-in saved!\nLevel: ${selectedLevel.name}\nEmotion: ${selectedEmotion}\nNotes: ${notes}`);
			setSelectedLevel(null);
			setSelectedEmotion("");
			setNotes("");
		}
	};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daily Maslow Check-In</h1>

      <div className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Select Level</h2>
        <div className={styles.levelsList}>
          {MASLOW_LEVELS.map((level) => (
            <button
              key={level.name}
              type="button"
              className={`${styles.levelItem} ${selectedLevel === level ? styles.active : ''}`}
              onClick={() => setSelectedLevel(level)}
            >
              <div className={styles.levelHeader}>
                <span>{level.emoji}</span>
                <span className={styles.levelName} style={{ color: level.color }}>{level.name}</span>
              </div>
              <div className={styles.levelDescription}>{level.description}</div>
            </button>
          ))}
        </div>
      </div>

                        {selectedLevel && (
                                <div className={styles.contentSection}>
                                        <h2 className={styles.sectionTitle}>How do you feel?</h2>
                                        <div className={styles.emotionsGrid}>
                                                {EMOTIONS.map((emotion) => (
                                                        <button
                                                                key={emotion}
                                                                type="button"
                                                                className={`${styles.emotionButton} ${selectedEmotion === emotion ? styles.active : ''}`}
                                                                onClick={() => setSelectedEmotion(emotion)}
                                                        >
                                                                {emotion}
                                                        </button>
                                                ))}
                                        </div>
                                </div>
                        )}

                        {selectedLevel && selectedEmotion && (
                                <div className={styles.contentSection}>
                                        <h2 className={styles.sectionTitle}>Additional Notes</h2>
                                        <textarea
                                                className={styles.notesTextarea}
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Any thoughts or reflections..."
                                        />
                                </div>
                        )}

                        <div className={styles.contentSection}>
                                <button
                                        className={styles.submitButton}
                                        onClick={handleSubmit}
                                        disabled={!selectedLevel || !selectedEmotion}
                                >
                                        Save Check-In
                                </button>
                        </div>
                </div>
        );
});

NeedsContent.displayName = "NeedsContent";

// Main component
const NeedsAssessment = ({ onNeedsSelected }) => {
	const [selectedNeeds, setSelectedNeeds] = useState([]);
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [needsText, setNeedsText] = useState("");

	const handleLevelClick = (level) => {
		setSelectedLevel(level);
	};

	const handleNeedClick = (need) => {
		if (selectedNeeds.includes(need)) {
			setSelectedNeeds(selectedNeeds.filter((n) => n !== need));
		} else {
			setSelectedNeeds([...selectedNeeds, need]);
		}
	};

	const handleTextChange = (e) => {
		setNeedsText(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// If onNeedsSelected is provided, call it with the selected needs
		if (onNeedsSelected) {
			onNeedsSelected({
				selectedNeeds,
				selectedLevel,
				needsText
			});
		}
	};

	return (
		<div className="needs-assessment">
			<h2>Needs Assessment</h2>
			<p className="needs-description">
				Understanding your needs is essential for effective conflict resolution. 
				Identify which needs are most important to you in this situation.
			</p>

			<div className="needs-categories">
				{MASLOW_LEVELS.map((level) => (
                                        <button
                                                key={level.name}
                                                type="button"
                                                className={`needs-category ${
                                                        selectedLevel === level ? "selected" : ""
                                                }`}
                                                onClick={() => handleLevelClick(level)}
                                        >
						<div className="category-header">
							<span className="category-emoji">{level.emoji}</span>
							<h3>{level.name}</h3>
						</div>
                                                <p>{level.description}</p>
                                        </button>
                                ))}
                        </div>

			{selectedLevel && (
				<div className="needs-list">
					<h3>
						Select specific needs related to {selectedLevel.name}:
					</h3>
					<div className="needs-grid">
						{getNeedsForLevel(selectedLevel.name).map((need) => (
                                                        <button
                                                                key={need}
                                                                className={`need-item ${
                                                                        selectedNeeds.includes(need) ? "selected" : ""
                                                                }`}
                                                                type="button"
                                                                onClick={() => handleNeedClick(need)}
                                                        >
								{need}
                                                        </button>
						))}
					</div>
				</div>
			)}

			<div className="custom-needs">
				<h3>Other needs not listed:</h3>
                                <textarea
                                        value={needsText}
                                        onChange={handleTextChange}
                                        placeholder="Describe any other needs you have in this situation..."
                                        rows={4}
                                />
			</div>

                        <button className="submit-button" type="button" onClick={handleSubmit}>
				Save Needs Assessment
			</button>
		</div>
	);
};

// Helper function to get needs for a specific level
const getNeedsForLevel = (level) => {
	switch (level) {
		case "Physiological":
			return [
				"Food",
				"Water",
				"Shelter",
				"Sleep",
				"Health",
				"Rest",
				"Exercise",
				"Comfort",
			];
		case "Safety":
			return [
				"Security",
				"Stability",
				"Freedom from fear",
				"Order",
				"Predictability",
				"Protection",
				"Financial security",
				"Health and wellbeing",
			];
		case "Love/Belonging":
			return [
				"Friendship",
				"Family",
				"Intimacy",
				"Connection",
				"Acceptance",
				"Being part of a group",
				"Giving and receiving love",
				"Communication",
			];
		case "Esteem":
			return [
				"Respect",
				"Recognition",
				"Status",
				"Strength",
				"Freedom",
				"Reputation",
				"Attention",
				"Appreciation",
				"Importance",
			];
		case "Self-Actualization":
			return [
				"Growth",
				"Creativity",
				"Fulfillment",
				"Meaning",
				"Purpose",
				"Self-development",
				"Challenge",
				"Achievement",
				"Mastery",
			];
		default:
			return [];
	}
};

export default memo(NeedsAssessment);
