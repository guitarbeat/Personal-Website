import confetti from "canvas-confetti";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from "react";

import { SHEET_COLUMNS, callAppsScript } from "../../Core/googleApps.js";
import FullscreenWrapper from "../FullscreenWrapper.js";
import "./bingo.scss";

// BingoItem Component
const BingoItem = ({
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
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onEditComplete(index, e.target.value);
		} else if (e.key === "Escape") {
			e.preventDefault();
			onEditComplete(index, text); // Revert to original text
		}
	};

	const formattedText = text.split(/\s+/).join(' '); // Normalize whitespace

	return (
		<div
			className={`bingo-item ${checked ? "checked" : ""} ${isHovered ? "hovered" : ""} category-${category.toLowerCase().replace(/\s+/g, "-")}`}
			onClick={() => onClick(index)}
			onDoubleClick={() => onDoubleClick(index)}
			onMouseEnter={() => onHover(index)}
			onMouseLeave={() => onHover(null)}
			role={isEditing ? "textbox" : "button"}
			tabIndex={0}
			aria-checked={checked}
			aria-label={`${formattedText}${description ? `, ${description}` : ""}`}
		>
			<div className="item-content">
				{isEditing ? (
					<textarea
						ref={editRef}
						defaultValue={formattedText}
						onKeyDown={handleKeyDown}
						onBlur={(e) => onEditComplete(index, e.target.value.trim())}
						className="edit-input"
						aria-label="Edit bingo item"
						autoFocus
						maxLength={200}
					/>
				) : (
					<>
						<div className="text">{formattedText}</div>
						{description && (
							<div
								className="description"
								style={{ opacity: isHovered ? 1 : 0 }}
							>
								{description}
							</div>
						)}
						{checked && (
							<div className="checkmark" aria-hidden="true">
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
};

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

// BingoCard Component
const BingoCard = ({
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
};

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

// Main Bingo2024 Component
const Bingo2024 = () => {
	const [bingoData, setBingoData] = useState([]);
	const [checkedItems, setCheckedItems] = useState([]);
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [editIndex, setEditIndex] = useState(null);
	const [clickTimeout, setClickTimeout] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState({});

	const ROW_SIZE = 5;
	const editRef = useRef(null);

	const checkForBingo = useCallback((checked) => {
		// Check rows
		for (let i = 0; i < ROW_SIZE; i++) {
			let rowComplete = true;
			for (let j = 0; j < ROW_SIZE; j++) {
				if (!checked[i * ROW_SIZE + j]) {
					rowComplete = false;
					break;
				}
			}
			if (rowComplete) return true;
		}

		// Check columns
		for (let i = 0; i < ROW_SIZE; i++) {
			let colComplete = true;
			for (let j = 0; j < ROW_SIZE; j++) {
				if (!checked[j * ROW_SIZE + i]) {
					colComplete = false;
					break;
				}
			}
			if (colComplete) return true;
		}

		// Check diagonals
		let diagonal1 = true;
		let diagonal2 = true;
		for (let i = 0; i < ROW_SIZE; i++) {
			if (!checked[i * ROW_SIZE + i]) diagonal1 = false;
			if (!checked[i * ROW_SIZE + (ROW_SIZE - 1 - i)]) diagonal2 = false;
		}

		return diagonal1 || diagonal2;
	}, []);

	const saveEditsDebounced = useMemo(
		() => {
			const debouncedSave = debounce((resolve, reject, index, value) => {
				callAppsScript("updateSheetData", {
					tabName: "bingo",
					row: index + 2,
					column: SHEET_COLUMNS.BINGO.CHECK,
					value: value ? "1" : "0",
				})
					.then(resolve)
					.catch(reject);
			}, 1000);

			return (index, value) =>
				new Promise((resolve, reject) => {
					debouncedSave(resolve, reject, index, value);
				});
		},
		[],
	);

	const handleItemClick = useCallback(
		(index) => {
			if (clickTimeout) {
				clearTimeout(clickTimeout);
				setClickTimeout(null);
				return;
			}

			const timeout = setTimeout(() => {
				const newCheckedItems = [...checkedItems];
				newCheckedItems[index] = !checkedItems[index];
				setCheckedItems(newCheckedItems);

				if (newCheckedItems[index] && checkForBingo(newCheckedItems)) {
					confetti({
						particleCount: 100,
						spread: 70,
						origin: { y: 0.6 },
					});
				}

				saveEditsDebounced(index, !checkedItems[index]).catch((error) => {
					console.error("Failed to save change:", error);
					const revertedItems = [...newCheckedItems];
					revertedItems[index] = checkedItems[index];
					setCheckedItems(revertedItems);
				});

				setClickTimeout(null);
			}, 200);

			setClickTimeout(timeout);
		},
		[checkedItems, clickTimeout, checkForBingo, saveEditsDebounced],
	);

	const handleItemDoubleClick = useCallback((index) => {
		setEditIndex(index);
	}, []);

	const handleItemHover = useCallback((index) => {
		setHoveredIndex(index);
	}, []);

	const handleEditComplete = useCallback(
		(index, value) => {
			setEditIndex(null);
			saveEditsDebounced(index, value);
		},
		[saveEditsDebounced],
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const result = await callAppsScript("getSheetData", {
					tabName: "bingo",
				});

				if (result.success) {
					const categoryMap = {};
					const formattedData = result.data.map((row) => ({
						checked: row[SHEET_COLUMNS.BINGO.CHECK] === "1",
						category: row[SHEET_COLUMNS.BINGO.CATEGORY],
						goal: row[SHEET_COLUMNS.BINGO.GOAL],
						description: row[SHEET_COLUMNS.BINGO.DESCRIPTION],
					}));

					formattedData.forEach((item) => {
						if (item.category) {
							if (!categoryMap[item.category]) {
								categoryMap[item.category] = [];
							}
							categoryMap[item.category].push(item);
						}
					});

					setBingoData(formattedData);
					setCategories(categoryMap);
					setCheckedItems(formattedData.map((item) => item.checked));
				} else {
					throw new Error("Failed to fetch bingo data");
				}
			} catch (err) {
				console.error("Error fetching data:", err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	if (isLoading) {
		return <div className="bingo-loading">Loading...</div>;
	}

	if (error) {
		return <div className="bingo-error">Error: {error}</div>;
	}

	return (
		<FullscreenWrapper>
			<div className="bingo-container">
				<BingoCard
					bingoData={bingoData}
					checkedItems={checkedItems}
					hoveredIndex={hoveredIndex}
					editIndex={editIndex}
					onItemClick={handleItemClick}
					onItemDoubleClick={handleItemDoubleClick}
					onItemHover={handleItemHover}
					onEditComplete={handleEditComplete}
					editRef={editRef}
					categories={categories}
				/>
			</div>
		</FullscreenWrapper>
	);
};

export default Bingo2024;
