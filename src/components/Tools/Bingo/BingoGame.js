import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import styles from "./BingoGame.module.scss";
import confetti from "canvas-confetti";
import './styles/index.scss';
import { useLocation } from "react-router-dom";
import { FullscreenTool } from "../ToolsSection/FullscreenWrapper";

// Constants
const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

// CSS module class helpers are defined in BingoGame.module.scss

// BingoItem Component - Optimized with memo
const BingoItem = memo(({
  index,
  item,
  isChecked,
  isHovered,
  isEditing,
  onItemClick,
  onItemDoubleClick,
  onItemHover,
  onEditComplete,
  editRef
}) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      onEditComplete(index, e.target.value);
    }
  }, [index, onEditComplete]);

  const handleClick = useCallback(() => {
    onItemClick(index);
  }, [index, onItemClick]);

  const handleDoubleClick = useCallback(() => {
    onItemDoubleClick(index);
  }, [index, onItemDoubleClick]);

  const handleMouseEnter = useCallback(() => {
    onItemHover(index);
  }, [index, onItemHover]);

  const handleMouseLeave = useCallback(() => {
    onItemHover(null);
  }, [onItemHover]);

  const handleBlur = useCallback((e) => {
    onEditComplete(index, e.target.value);
  }, [index, onEditComplete]);

  const itemClasses = `${styles.item} ${isChecked ? styles.checked : ''} ${
    isHovered ? styles.hovered : ''
  }`;

  return (
    <button
      className={itemClasses}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type="button"
      aria-pressed={isChecked}
    >
      <div className="item-content">
        {isEditing ? (
          <input
            ref={editRef}
            type="text"
            defaultValue={item.goal}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="edit-input"
          />
        ) : (
          <>
            <div className="text">{item.goal}</div>
            {item.description && (
              <div
                className="description"
              >
                {item.description}
              </div>
            )}
            {isChecked && (
              <div className="checkmark">
                <svg viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="Checked">
                  <title>Checked</title>
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
    </button>
  );
});

BingoItem.displayName = "BingoItem";

// BingoGrid Component - Optimized with memo
const BingoGridComponent = memo(({
  bingoData,
  checkedItems,
  hoveredIndex,
  editIndex,
  onItemClick,
  onItemDoubleClick,
  onItemHover,
  onEditComplete,
  editRef
}) => {
  // Only render items that are in the grid
  const gridItems = useMemo(() =>
    bingoData.slice(0, TOTAL_CELLS).map((item, index) => (
      <BingoItem
        key={`${item.id || index}-${item.goal}`}
        index={index}
        item={item}
        isChecked={checkedItems[index] || false}
        isHovered={hoveredIndex === index}
        isEditing={editIndex === index}
        onItemClick={onItemClick}
        onItemDoubleClick={onItemDoubleClick}
        onItemHover={onItemHover}
        onEditComplete={onEditComplete}
        editRef={editIndex === index ? editRef : null}
      />
    )),
    [bingoData, checkedItems, hoveredIndex, editIndex, onItemClick, onItemDoubleClick, onItemHover, onEditComplete, editRef]
  );

  return (
    <div className={styles.grid}>
      {gridItems}
    </div>
  );
});

BingoGridComponent.displayName = "BingoGridComponent";

// Optimized state management hook
const useBingoState = (key, initialState) => {
  // Use lazy initialization for performance
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.warn("Error loading state from localStorage:", error);
      return initialState;
    }
  });

  // Debounced save to localStorage
  const saveState = useCallback(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn("Error saving state to localStorage:", error);
    }
  }, [key, state]);

  // Debounce the save operation
  useEffect(() => {
    const timeoutId = setTimeout(saveState, 500);
    return () => clearTimeout(timeoutId);
  }, [saveState]);

  // Save on unload
  useEffect(() => {
    const saveOnUnload = () => saveState();
    window.addEventListener("beforeunload", saveOnUnload);
    return () => window.removeEventListener("beforeunload", saveOnUnload);
  }, [saveState]);

  return [state, setState];
};

// Main component
const BingoContent = memo(({ isFullscreen }) => {
  // State hooks
  const [year, setYear] = useBingoState("bingo-year", "2023");
  const [checkedItems, setCheckedItems] = useBingoState("bingo-checked-items", {});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [bingoData, setBingoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const editRef = useRef(null);

  // Memoized data
  const years = useMemo(() => ["2023", "2022", "2021"], []);

  // Load bingo data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 300));

        // Generate mock data
        const mockData = Array.from({ length: TOTAL_CELLS }, (_, i) => ({
          id: `${year}-${i}`,
          goal: `Goal ${i + 1} for ${year}`,
          description: `Description for goal ${i + 1}`,
          category: ["Work", "Personal", "Health", "Finance", "Relationships"][
            Math.floor(Math.random() * 5)
          ],
        }));

        setBingoData(mockData);
        setError(null);
      } catch (err) {
        console.error("Error loading bingo data:", err);
        setError("Failed to load bingo data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [year]);

  // Event handlers - memoized with useCallback
  const handleYearChange = useCallback((selectedYear) => {
    setYear(selectedYear);
    // Reset checked items when year changes
    setCheckedItems({});
  }, [setYear, setCheckedItems]);

  const handleItemClick = useCallback((index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, [setCheckedItems]);

  const handleItemDoubleClick = useCallback((index) => {
    setEditIndex(index);
  }, []);

  const handleEditComplete = useCallback((index, value) => {
    if (value.trim()) {
      setBingoData(prev =>
        prev.map((item, i) =>
          i === index ? { ...item, goal: value.trim() } : item
        )
      );
    }
    setEditIndex(null);
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      setCheckedItems({});
    }
  }, [setCheckedItems]);

  // Calculate bingos
  const { bingos, completedCount, totalCount } = useMemo(() => {
    const checkBingos = () => {
      const rows = Array(GRID_SIZE).fill().map((_, i) =>
        Array(GRID_SIZE).fill().map((_, j) => i * GRID_SIZE + j)
      );

      const cols = Array(GRID_SIZE).fill().map((_, i) =>
        Array(GRID_SIZE).fill().map((_, j) => j * GRID_SIZE + i)
      );

      const diag1 = Array(GRID_SIZE).fill().map((_, i) => i * GRID_SIZE + i);
      const diag2 = Array(GRID_SIZE).fill().map((_, i) => (i + 1) * GRID_SIZE - (i + 1));

      const lines = [...rows, ...cols, diag1, diag2];

      return lines.filter(line =>
        line.every(index => checkedItems[index])
      );
    };

    const bingos = checkBingos();
    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = TOTAL_CELLS;

    return { bingos, completedCount, totalCount };
  }, [checkedItems]);

  // Trigger confetti effect when a new bingo is completed
  useEffect(() => {
    if (bingos.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [bingos.length]);

  // Render
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Bingo Goals {year}</h1>

        <div className="year-selector">
          {years.map(y => (
            <button
              key={y}
              type="button"
              className={year === y ? "active" : ""}
              onClick={() => handleYearChange(y)}
              aria-label={`Select ${y}`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="progress-summary">
          <h3>Your Progress</h3>
          <p>
            {completedCount} of {totalCount} goals completed ({Math.round((completedCount / totalCount) * 100)}%)
          </p>
          {bingos.length > 0 && (
            <p>Bingos: {bingos.length}</p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <BingoGridComponent
            bingoData={bingoData}
            checkedItems={checkedItems}
            hoveredIndex={hoveredIndex}
            editIndex={editIndex}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onItemHover={setHoveredIndex}
            onEditComplete={handleEditComplete}
            editRef={editRef}
          />

          {bingos.length > 0 && (
            <div
              className={`${styles.notification} ${
                bingos.length >= 3 ? styles.full : styles.partial
              }`}
            >
              <h2>
                {bingos.length >= 3
                  ? "🎉 Full Bingo! 🎉"
                  : `🎯 Bingo! (${bingos.length})`}
              </h2>
              <p>You've completed {bingos.length} bingo lines!</p>
            </div>
          )}

          {completedCount > 0 && (
            <button className={styles.resetButton} onClick={handleReset}>
              Reset Progress
            </button>
          )}
        </>
      )}
    </div>
  );
});

BingoContent.displayName = "BingoContent";

// Export the component with React.memo for performance
export default memo(function BingoGame({ isFullscreen }) {
  const location = useLocation();
  const isFullscreenMode = location.pathname.includes('/fullscreen');

  return (
    <FullscreenTool isFullscreen={isFullscreenMode} title="Bingo Game">
      <BingoContent isFullscreen={isFullscreenMode} />
    </FullscreenTool>
  );
}); 