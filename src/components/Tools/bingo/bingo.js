import confetti from "canvas-confetti";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback, useRef } from "react";

import { SHEET_COLUMNS, callAppsScript } from "../../Core/googleApps.js";
import "./bingo.scss";

// BingoItem Component
const BingoItem = ({
	index,
	text = "",
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

	const formattedText = (text || "").split(/\s+/).join(" "); // Normalize whitespace

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
	text: PropTypes.string,
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

// Main Bingo Component
const BingoApp = () => {
	const [bingoData, setBingoData] = useState([]);
	const [checkedItems, setCheckedItems] = useState([]);
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [editIndex, setEditIndex] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState({});
	const [selectedYear, setSelectedYear] = useState("2025");
	const [yearData, setYearData] = useState({});
	const [theme, setTheme] = useState("default");

	const editRef = useRef(null);

	// Load bingo data for a specific year
	const loadYearData = useCallback(
		async (year) => {
			try {
				setIsLoading(true);
				const response = await callAppsScript("getSheetData", {
					tabName: `bingo${year}`,
				});

				if (response.success && response.data) {
					const formattedData = response.data.map((item) => ({
						...item,
						check: item.check === "1",
					}));

					setYearData((prev) => ({
						...prev,
						[year]: formattedData,
					}));

					if (year === selectedYear) {
						setBingoData(formattedData);
						setCheckedItems(formattedData.map((item) => item.check));
					}

					// Organize items by category
					const categoryGroups = formattedData.reduce((acc, item) => {
						const category = item.category || "uncategorized";
						if (!acc[category]) acc[category] = [];
						acc[category].push(item);
						return acc;
					}, {});

					setCategories(categoryGroups);
				}
			} catch (err) {
				setError(err.message);
				console.error("Error loading bingo data:", err);
			} finally {
				setIsLoading(false);
			}
		},
		[selectedYear],
	);

	// Initialize data
	useEffect(() => {
		loadYearData("2024"); // Load previous year's data
		loadYearData("2025"); // Load current year's data
	}, [loadYearData]);

	// Handle year selection
	const handleYearChange = (year) => {
		setSelectedYear(year);
		if (yearData[year]) {
			setBingoData(yearData[year]);
			setCheckedItems(yearData[year].map((item) => item.check));
		}
	};

	// Save progress with year tracking
	const saveProgress = useCallback(
		async (index, value) => {
			try {
				const response = await callAppsScript("updateSheetData", {
					tabName: `bingo${selectedYear}`,
					rowIndex: index + 2,
					columnName: SHEET_COLUMNS.BINGO.CHECK,
					value: value ? "1" : "0",
				});

				if (!response.success) {
					throw new Error(response.error || "Failed to save progress");
				}

				// Update local state
				const newCheckedItems = [...checkedItems];
				newCheckedItems[index] = value;
				setCheckedItems(newCheckedItems);

				// Update year data
				setYearData((prev) => ({
					...prev,
					[selectedYear]: prev[selectedYear].map((item, idx) =>
						idx === index ? { ...item, check: value } : item,
					),
				}));

				// Celebrate milestones
				const completedCount = newCheckedItems.filter(Boolean).length;
				if (completedCount > 0 && completedCount % 5 === 0) {
					celebrateMilestone(completedCount);
				}
			} catch (err) {
				console.error("Error saving progress:", err);
				setError("Failed to save progress. Please try again.");
			}
		},
		[checkedItems, selectedYear],
	);

	// Celebrate milestones with confetti
	const celebrateMilestone = () => {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
			colors: ["#4ecdc4", "#ff6b6b", "#96ceb4"],
		});
	};

	// Inside BingoApp component, update the test function
	const testBingo = useCallback(async () => {
		try {
			setIsLoading(true);
			// First test getting data
			const getResponse = await callAppsScript("getSheetData", {
				tabName: `bingo${selectedYear}`,
			});
			console.log("Get data result:", getResponse);

			if (!getResponse.success) {
				throw new Error(getResponse.error || "Failed to get data");
			}

			// Test updating first item
			if (getResponse.data && getResponse.data.length > 0) {
				const firstItem = getResponse.data[0];
				const currentCheck = firstItem.Check === "1";

				const updateResponse = await callAppsScript("updateSheetData", {
					tabName: `bingo${selectedYear}`,
					rowIndex: 2, // First data row (after header)
					columnName: SHEET_COLUMNS.BINGO.CHECK,
					value: currentCheck ? "0" : "1",
				});
				console.log("Update result:", updateResponse);

				// Revert back to original state
				await callAppsScript("updateSheetData", {
					tabName: `bingo${selectedYear}`,
					rowIndex: 2,
					columnName: SHEET_COLUMNS.BINGO.CHECK,
					value: currentCheck ? "1" : "0",
				});

				if (updateResponse.success) {
					alert("Test successful! Check console for details.");
				} else {
					throw new Error(updateResponse.error || "Update failed");
				}
			}
		} catch (err) {
			console.error("Test error:", err);
			alert("Test error: " + err.message);
		} finally {
			setIsLoading(false);
		}
	}, [selectedYear]);

	return (
		<div className={`bingo-container theme-${theme}`}>
			<div className="bingo-header">
				<h1>Resolution Bingo {selectedYear}</h1>
				<button onClick={testBingo} style={{ marginBottom: "1rem" }}>
					Test Bingo Integration
				</button>
				<div className="year-selector">
					<button
						onClick={() => handleYearChange("2024")}
						className={selectedYear === "2024" ? "active" : ""}
					>
						2024
					</button>
					<button
						onClick={() => handleYearChange("2025")}
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
			</div>

			{isLoading ? (
				<div className="loading-spinner">Loading...</div>
			) : error ? (
				<div className="error-message">{error}</div>
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
		</div>
	);
};

export default BingoApp;
