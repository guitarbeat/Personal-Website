import React, { memo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FullscreenTool } from "./ToolsSection";
import './styles.scss';

// Constants
const NEEDS_LEVELS = [
	{
		level: "Survival",
		emoji: "🌿",
		description: "Basic needs and health",
		emojis: ["😫", "😣", "😌", "😊", "😄"],
		color: "#FF5722",
	},
	{
		level: "Security",
		emoji: "🛡️",
		description: "Safety and stability",
		emojis: ["🛡️", "🔒", "🏰", "⚔️", "🔱"],
		color: "#2196F3",
	},
	{
		level: "Connection",
		emoji: "💝",
		description: "Relationships and belonging",
		emojis: ["💔", "❤️", "💖", "💝", "💫"],
		color: "#E91E63",
	},
	{
		level: "Esteem",
		emoji: "⭐",
		description: "Self-worth and confidence",
		emojis: ["😞", "😐", "😊", "😄", "🤩"],
		color: "#9C27B0",
	},
	{
		level: "Growth",
		emoji: "🌱",
		description: "Learning and development",
		emojis: ["🌱", "🌿", "🌳", "🌲", "🎋"],
		color: "#4CAF50",
	},
	{
		level: "Self Actualization",
		emoji: "🌟",
		description: "Reaching your full potential",
		emojis: ["😔", "🤔", "😊", "🌟", "✨"],
		color: "#FFD700",
	},
];

// Styled Components
const NeedsContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
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
	margin-bottom: 1rem;
	text-align: center;
`;

const ProgressBar = styled.div`
	width: 100%;
	max-width: 600px;
	height: 20px;
	background-color: var(--color-grey-dark-3);
	border-radius: 10px;
	overflow: hidden;
	position: relative;
	margin-bottom: 1rem;
`;

const ProgressIndicator = styled.div`
	height: 100%;
	width: ${({ $progress }) => $progress}%;
	background-color: ${({ $color }) => $color};
	border-radius: 10px;
	transition: width 0.3s ease;
`;

const ProgressText = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: var(--color-text);
	font-size: 0.8rem;
	font-weight: bold;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const NeedSection = styled.div`
	width: 100%;
	max-width: 600px;
	padding: 2rem;
	background: var(--color-grey-dark-3);
	border-radius: var(--border-radius-lg);
	margin-bottom: 2rem;
`;

const NeedTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: bold;
	color: ${({ $color }) => $color};
	margin-bottom: 1rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const NeedDescription = styled.p`
	color: var(--color-text);
	margin-bottom: 1.5rem;
`;

const EmojiScale = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.5rem;
`;

const Emoji = styled.span`
	font-size: 1.5rem;
	opacity: ${({ $active }) => ($active ? 1 : 0.3)};
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		transform: scale(1.2);
	}
`;

const ValueSlider = styled.input`
	width: 100%;
	height: 10px;
	-webkit-appearance: none;
	background: var(--color-grey-dark-2);
	border-radius: 5px;
	outline: none;
	margin: 1rem 0;

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		background: ${({ $color }) => $color};
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			transform: scale(1.2);
		}
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	margin-top: 2rem;
`;

const Button = styled.button`
	padding: 0.8rem 1.5rem;
	border: none;
	border-radius: var(--border-radius-sm);
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s;
	background: ${({ $variant, $color }) =>
		$variant === "primary" ? $color : "var(--color-grey-dark-4)"};
	color: ${({ $variant }) =>
		$variant === "primary" ? "white" : "var(--color-text)"};

	&:hover {
		transform: scale(1.05);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
`;

const LevelsList = styled.div`
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const LevelItem = styled.div`
	padding: 1rem;
	background: var(--color-grey-dark-3);
	border-radius: var(--border-radius-sm);
	cursor: pointer;
	transition: all 0.2s;
	border: 2px solid ${({ $active, $color }) =>
		$active ? $color : "transparent"};

	&:hover {
		transform: translateX(5px);
	}
`;

const LevelHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
`;

const LevelTitle = styled.span`
	font-weight: bold;
	color: ${({ $color }) => $color};
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const LevelValue = styled.span`
	color: var(--color-text);
	font-size: 0.9rem;
`;

// EmojiSlider Component

// Needs Content Component
const NeedsContent = memo(({ isFullscreen }) => {
	const [levels, setLevels] = useState(
		NEEDS_LEVELS.map((level) => ({ ...level, value: 0 })),
	);
	const [currentLevel, setCurrentLevel] = useState(0);

	const handleValueChange = useCallback((value) => {
		setLevels((prevLevels) => {
			const newLevels = [...prevLevels];
			newLevels[currentLevel] = {
				...newLevels[currentLevel],
				value: parseInt(value, 10),
			};
			return newLevels;
		});
	}, [currentLevel]);

	const handleNext = useCallback(() => {
		if (currentLevel < NEEDS_LEVELS.length - 1) {
			setCurrentLevel((prev) => prev + 1);
		}
	}, [currentLevel]);

	const handlePrev = useCallback(() => {
		if (currentLevel > 0) {
			setCurrentLevel((prev) => prev - 1);
		}
	}, [currentLevel]);

	const totalValue = levels.reduce((sum, level) => sum + level.value, 0);
	const maxPossibleValue = NEEDS_LEVELS.length * 10;
	const overallProgress = Math.round((totalValue / maxPossibleValue) * 100);

	const currentNeed = levels[currentLevel];

	return (
		<NeedsContainer>
			<Title>Needs Assessment</Title>

			<ProgressBar>
				<ProgressIndicator
					$progress={overallProgress}
					$color={currentNeed.color}
				/>
				<ProgressText>{overallProgress}% Complete</ProgressText>
			</ProgressBar>

			<NeedSection>
				<NeedTitle $color={currentNeed.color}>
					{currentNeed.emoji} {currentNeed.level}
				</NeedTitle>
				<NeedDescription>{currentNeed.description}</NeedDescription>

				<EmojiScale>
					{currentNeed.emojis.map((emoji, index) => (
						<Emoji
							key={index}
							$active={currentNeed.value >= index * 2.5}
							onClick={() => handleValueChange(index * 2.5)}
						>
							{emoji}
						</Emoji>
					))}
				</EmojiScale>

				<ValueSlider
					type="range"
					min="0"
					max="10"
					value={currentNeed.value}
					onChange={(e) => handleValueChange(e.target.value)}
					$color={currentNeed.color}
				/>

				<ButtonGroup>
					<Button
						onClick={handlePrev}
						disabled={currentLevel === 0}
						$variant="secondary"
					>
						Previous
					</Button>
					<Button
						onClick={handleNext}
						disabled={currentLevel === NEEDS_LEVELS.length - 1}
						$variant="primary"
						$color={currentNeed.color}
					>
						Next
					</Button>
				</ButtonGroup>
			</NeedSection>

			<LevelsList>
				{levels.map((level, index) => (
					<LevelItem
						key={level.level}
						$active={index === currentLevel}
						$color={level.color}
						onClick={() => setCurrentLevel(index)}
					>
						<LevelHeader>
							<LevelTitle $color={level.color}>
								{level.emoji} {level.level}
							</LevelTitle>
							<LevelValue>{level.value}/10</LevelValue>
						</LevelHeader>
					</LevelItem>
				))}
			</LevelsList>
		</NeedsContainer>
	);
});

NeedsContent.displayName = "NeedsContent";

// Main component
const NeedsAssessment = () => {
	const location = useLocation();
	const isFullscreen = location.pathname.includes("/fullscreen");

	if (isFullscreen) {
		return (
			<FullscreenTool>
				<NeedsContent isFullscreen />
			</FullscreenTool>
		);
	}

	return <NeedsContent />;
};

export default memo(NeedsAssessment);
