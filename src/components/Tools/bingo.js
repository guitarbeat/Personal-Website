import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import confetti from "canvas-confetti";
import './styles.scss';

// Constants

// Styled Components
const BingoContainer = styled.div`
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

	&.theme-dark {
		background: var(--color-grey-dark-1);
	}

	&.theme-light {
		background: var(--color-grey-light-1);
	}

	&.theme-nature {
		background: var(--color-sage-dark);
	}
`;

const BingoHeader = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;

	h1 {
		font-size: 2rem;
		color: var(--color-text);
		text-align: center;
	}

	.year-selector {
		display: flex;
		gap: 1rem;

		button {
			padding: 0.5rem 1rem;
			border: none;
			border-radius: var(--border-radius-sm);
			background: var(--color-grey-dark-3);
			color: var(--color-text);
			cursor: pointer;
			transition: all 0.2s;

			&:hover {
				background: var(--color-grey-dark-4);
			}

			&.active {
				background: var(--color-sage);
				color: var(--color-text-light);
			}
		}
	}

	.theme-selector {
		select {
			padding: 0.5rem;
			border: none;
			border-radius: var(--border-radius-sm);
			background: var(--color-grey-dark-3);
			color: var(--color-text);
			cursor: pointer;
		}
	}

	.progress-summary {
		text-align: center;
		color: var(--color-text);

		h3 {
			font-size: 1.2rem;
			margin-bottom: 0.5rem;
		}
	}
`;

const LoadingSpinner = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	color: var(--color-text);
	font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
	color: var(--color-error);
	text-align: center;
	padding: 2rem;
`;

// BingoItem Component
const BingoItem = memo(({
	index,
	text,
	description = "",
	category = "",
	checked = false,
	isHovered = false,
	isEditing = false,
	onClick = () => {},
	onDoubleClick = () => {},
	onHover = () => {},
	onEditComplete = () => {},
	editRef,
}) => {
	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === "Escape") {
			e.preventDefault();
			onEditComplete(index, e.target.value);
		}
	};

	return (
		<div
			className={`bingo-item ${checked ? "checked" : ""} ${isHovered ? "hovered" : ""} category-${category.toLowerCase().replace(/\s+/g, "-")}`}
			onClick={() => onClick(index)}
			onDoubleClick={() => onDoubleClick(index)}
			onMouseEnter={() => onHover(index)}
			onMouseLeave={() => onHover(null)}
			role="button"
			tabIndex={0}
		>
			<div className="item-content">
				{isEditing ? (
					<input
						ref={editRef}
						type="text"
						defaultValue={text}
						onKeyDown={handleKeyDown}
						onBlur={(e) => onEditComplete(index, e.target.value)}
						className="edit-input"
						autoFocus
					/>
				) : (
					<>
						<div className="text">{text}</div>
						{description && (
							<div
								className="description"
								style={{ opacity: isHovered ? 1 : 0 }}
							>
								{description}
							</div>
						)}
						{checked && (
							<div className="checkmark">
								<svg viewBox="0 0 24 24" width="24" height="24">
									<path
										fill="currentColor"
										d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
									/>
								</svg>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
});

BingoItem.displayName = "BingoItem";

BingoItem.propTypes = {
	index: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,
	description: PropTypes.string,
	category: PropTypes.string,
	checked: PropTypes.bool.isRequired,
	isHovered: PropTypes.bool.isRequired,
	isEditing: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onHover: PropTypes.func.isRequired,
	onEditComplete: PropTypes.func.isRequired,
	editRef: PropTypes.object,
};

// Bingo Card Component
const BingoCard = memo(({
	bingoData,
	checkedItems,
	hoveredIndex,
	editIndex,
	onItemClick,
	onItemDoubleClick,
	onItemHover,
	onEditComplete,
	editRef,
	categories,
}) => {
	const ROW_SIZE = 5;

	return (
		<div className="bingo-card">
			<div className="bingo-grid">
				{bingoData.slice(0, ROW_SIZE * ROW_SIZE).map((item, index) => (
					<BingoItem
						key={index}
						index={index}
						text={item.goal}
						description={item.description || ""}
						category={item.category}
						checked={checkedItems[index] || false}
						isHovered={hoveredIndex === index}
						isEditing={editIndex === index}
						onClick={onItemClick}
						onDoubleClick={onItemDoubleClick}
						onHover={onItemHover}
						onEditComplete={onEditComplete}
						editRef={editIndex === index ? editRef : null}
					/>
				))}
			</div>
		</div>
	);
});

BingoCard.displayName = "BingoCard";

BingoCard.propTypes = {
	bingoData: PropTypes.arrayOf(
		PropTypes.shape({
			check: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
			category: PropTypes.string,
			goal: PropTypes.string,
			description: PropTypes.string,
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		}),
	).isRequired,
	checkedItems: PropTypes.arrayOf(PropTypes.bool).isRequired,
	hoveredIndex: PropTypes.number,
	editIndex: PropTypes.number,
	onItemClick: PropTypes.func.isRequired,
	onItemDoubleClick: PropTypes.func.isRequired,
	onItemHover: PropTypes.func.isRequired,
	onEditComplete: PropTypes.func.isRequired,
	editRef: PropTypes.object,
	categories: PropTypes.objectOf(
		PropTypes.arrayOf(
			PropTypes.shape({
				check: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
				category: PropTypes.string,
				goal: PropTypes.string,
				description: PropTypes.string,
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			}),
		),
	).isRequired,
};

// Add localStorage integration
const useBingoState = (initialState) => {
	const [state, setState] = useState(() => {
		const saved = localStorage.getItem('bingo-state');
		return saved ? JSON.parse(saved) : initialState;
	});

	useEffect(() => {
		const saveState = () => {
			localStorage.setItem('bingo-state', JSON.stringify(state));
		};
		
		const saveOnUnload = () => saveState();
		window.addEventListener('beforeunload', saveOnUnload);
		
		// Auto-save every 30 seconds
		const interval = setInterval(saveState, 30000);
		
		return () => {
			window.removeEventListener('beforeunload', saveOnUnload);
			clearInterval(interval);
			saveState();
		};
	}, [state]);

	return [state, setState];
};

// Bingo Content Component
const BingoContent = memo(({ isFullscreen }) => {
	const [bingoData, setBingoData] = useState([]);
	const [checkedItems, setCheckedItems] = useBingoState(new Array(25).fill(false));
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [editIndex, setEditIndex] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error] = useState(null);
	const [categories, setCategories] = useState({});
	const [selectedYear, setSelectedYear] = useState("2025");
	const [theme, setTheme] = useState("default");

	const editRef = useRef(null);

	// Mock data for development
	const mockData = Array(25).fill(null).map((_, index) => ({
		id: index,
		check: false,
		category: "Category " + (index % 5),
		goal: `Goal ${index + 1}`,
		description: `Description for goal ${index + 1}`,
	}));

	// Initialize with mock data
	useEffect(() => {
		setBingoData(mockData);
		setCheckedItems(new Array(25).fill(false));
		setCategories(
			mockData.reduce((acc, item) => {
				const category = item.category || "uncategorized";
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(item);
				return acc;
			}, {}),
		);
		setIsLoading(false);
	}, [mockData, setCheckedItems]);

	// Save progress
	const saveProgress = useCallback((index, value) => {
		setCheckedItems((prev) => {
			const newCheckedItems = [...prev];
			newCheckedItems[index] = value;
			return newCheckedItems;
		});

		// Celebrate milestones
		const completedCount = checkedItems.filter(Boolean).length;
		if (completedCount > 0 && completedCount % 5 === 0) {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ["#4ecdc4", "#ff6b6b", "#96ceb4"],
			});
		}
	}, [checkedItems, setCheckedItems]);

	return (
		<BingoContainer className={`theme-${theme}`}>
			<BingoHeader>
				<h1>Resolution Bingo {selectedYear}</h1>
				<div className="year-selector">
					<button
						onClick={() => setSelectedYear("2024")}
						className={selectedYear === "2024" ? "active" : ""}
					>
						2024
					</button>
					<button
						onClick={() => setSelectedYear("2025")}
						className={selectedYear === "2025" ? "active" : ""}
					>
						2025
					</button>
				</div>
				<div className="theme-selector">
					<select value={theme} onChange={(e) => setTheme(e.target.value)}>
						<option value="default">Default Theme</option>
						<option value="dark">Dark Theme</option>
						<option value="light">Light Theme</option>
						<option value="nature">Nature Theme</option>
					</select>
				</div>
				<div className="progress-summary">
					<h3>Progress</h3>
					<p>{checkedItems.filter(Boolean).length} / 25 completed</p>
				</div>
			</BingoHeader>

			{isLoading ? (
				<LoadingSpinner>Loading...</LoadingSpinner>
			) : error ? (
				<ErrorMessage>{error}</ErrorMessage>
			) : (
				<BingoCard
					bingoData={bingoData}
					checkedItems={checkedItems}
					hoveredIndex={hoveredIndex}
					editIndex={editIndex}
					onItemClick={(index) => {
						const newValue = !checkedItems[index];
						saveProgress(index, newValue);
					}}
					onItemDoubleClick={(index) => setEditIndex(index)}
					onItemHover={setHoveredIndex}
					onEditComplete={(index, value) => {
						setEditIndex(null);
						// Handle text edit save
					}}
					editRef={editRef}
					categories={categories}
				/>
			)}
		</BingoContainer>
	);
});

BingoContent.propTypes = {
	isFullscreen: PropTypes.bool.isRequired,
};

export default BingoContent;