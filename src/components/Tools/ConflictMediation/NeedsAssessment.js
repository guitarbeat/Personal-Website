import React, { memo, useState } from "react";
import styled from "styled-components";

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

// Styled Components
const NeedsContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem;
	background: var(--color-grey-dark-2);
	border-radius: var(--border-radius-lg);
	box-shadow: var(--shadow-md);
	overflow: auto;
`;

const Title = styled.h1`
	font-size: 2rem;
	font-weight: bold;
	color: var(--color-text);
	margin-bottom: 2rem;
	text-align: center;
`;

const SectionTitle = styled.h2`
	font-size: 1.2rem;
	font-weight: 600;
	color: var(--color-text);
	margin-bottom: 1rem;
	width: 100%;
	max-width: 600px;
`;

const ContentSection = styled.div`
	width: 100%;
	max-width: 600px;
	margin-bottom: 2rem;
`;

const LevelsList = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const LevelItem = styled.button`
	width: 100%;
	padding: 1rem;
	background: ${({ $active, $bgColor }) => $active ? $bgColor : $bgColor};
	border-radius: var(--border-radius-sm);
	cursor: pointer;
	transition: all 0.2s;
	border: 2px solid ${({ $active, $color }) => $active ? $color : "transparent"};
	text-align: left;

	&:hover {
		background: ${({ $hoverBgColor }) => $hoverBgColor};
		transform: translateY(-2px);
	}
`;

const LevelHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.25rem;
`;

const LevelName = styled.span`
	font-weight: bold;
	color: ${({ $color }) => $color};
`;

const LevelDescription = styled.div`
	color: var(--color-text);
	font-size: 0.9rem;
`;

const EmotionsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
	width: 100%;
`;

const EmotionButton = styled.button`
	padding: 0.75rem;
	background: ${({ $active }) => $active ? "var(--color-primary)" : "var(--color-grey-dark-3)"};
	color: ${({ $active }) => $active ? "white" : "var(--color-text)"};
	border-radius: var(--border-radius-sm);
	cursor: pointer;
	transition: all 0.2s;
	border: none;

	&:hover {
		transform: translateY(-2px);
		background: ${({ $active }) => $active ? "var(--color-primary)" : "var(--color-grey-dark-4)"};
	}
`;

const NotesTextarea = styled.textarea`
	width: 100%;
	padding: 1rem;
	background: var(--color-grey-dark-3);
	border: 1px solid var(--color-grey-dark-4);
	border-radius: var(--border-radius-sm);
	color: var(--color-text);
	resize: vertical;
	min-height: 100px;
	margin-bottom: 1rem;

	&:focus {
		outline: none;
		border-color: var(--color-primary);
	}
`;

const SubmitButton = styled.button`
	width: 100%;
	padding: 1rem;
	background: var(--color-primary);
	color: white;
	border: none;
	border-radius: var(--border-radius-sm);
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		transform: translateY(-2px);
		background: var(--color-primary-dark);
	}

	&:disabled {
		background: var(--color-grey-dark-3);
		cursor: not-allowed;
		transform: none;
	}
`;

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
		<NeedsContainer>
			<Title>Daily Maslow Check-In</Title>

			<ContentSection>
				<SectionTitle>Select Level</SectionTitle>
				<LevelsList>
					{MASLOW_LEVELS.map((level) => (
						<LevelItem
							key={level.name}
							$active={selectedLevel === level}
							$color={level.color}
							$bgColor={level.bgColor}
							$hoverBgColor={level.hoverBgColor}
							onClick={() => setSelectedLevel(level)}
						>
							<LevelHeader>
								<span>{level.emoji}</span>
								<LevelName $color={level.color}>{level.name}</LevelName>
							</LevelHeader>
							<LevelDescription>{level.description}</LevelDescription>
						</LevelItem>
					))}
				</LevelsList>
			</ContentSection>

			{selectedLevel && (
				<ContentSection>
					<SectionTitle>How do you feel?</SectionTitle>
					<EmotionsGrid>
						{EMOTIONS.map((emotion) => (
							<EmotionButton
								key={emotion}
								$active={selectedEmotion === emotion}
								onClick={() => setSelectedEmotion(emotion)}
							>
								{emotion}
							</EmotionButton>
						))}
					</EmotionsGrid>
				</ContentSection>
			)}

			{selectedLevel && selectedEmotion && (
				<ContentSection>
					<SectionTitle>Additional Notes</SectionTitle>
					<NotesTextarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Any thoughts or reflections..."
					/>
				</ContentSection>
			)}

			<ContentSection>
				<SubmitButton
					onClick={handleSubmit}
					disabled={!selectedLevel || !selectedEmotion}
				>
					Save Check-In
				</SubmitButton>
			</ContentSection>
		</NeedsContainer>
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
