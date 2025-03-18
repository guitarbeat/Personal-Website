import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import './styles/index.scss';
import { useLocation } from "react-router-dom";
import { FullscreenTool } from "../ToolsSection/FullscreenWrapper";

// Constants
const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

// Styled Components
const BingoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  overflow: auto;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const BingoHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--tool-text);
    text-align: center;
    margin: 0;
    text-transform: uppercase;
  }

  .year-selector {
    display: flex;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: var(--tool-border-radius);
      background: var(--tool-surface);
      color: var(--tool-text);
      cursor: pointer;
      transition: all 0.2s;
      will-change: transform;

      &:hover {
        background: var(--tool-border);
        transform: translateY(-2px);
      }

      &.active {
        background: var(--tool-accent);
        color: var(--color-text-light);
      }
    }
  }

  .progress-summary {
    text-align: center;
    color: var(--tool-text);

    h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      margin-top: 0;
    }
    
    p {
      margin: 0;
    }
  }
`;

const BingoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  background: var(--tool-surface);
  padding: 1.5rem;
  border-radius: var(--tool-border-radius);
  box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
  will-change: transform;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 1rem;
  }
`;

const StyledBingoItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.isChecked
    ? 'linear-gradient(135deg, var(--color-success-light), var(--color-success))'
    : 'var(--tool-surface)'};
  border: 2px solid ${props => props.isChecked
    ? 'var(--color-success)'
    : props.isHovered
      ? 'var(--tool-accent)'
      : 'var(--tool-border)'};
  transform: ${props => props.isHovered ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${props => props.isHovered
    ? '0 8px 16px rgba(0, 0, 0, 0.15)'
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  will-change: transform, box-shadow;
  
  .item-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
  }
  
  .text {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--tool-text);
    margin-bottom: 0.25rem;
  }
  
  .description {
    font-size: 0.7rem;
    color: var(--tool-text-secondary);
    opacity: 0;
    transition: opacity 0.3s ease;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5rem;
    border-radius: 0 0 0.5rem 0.5rem;
    pointer-events: none;
  }
  
  .checkmark {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    color: var(--color-success);
    font-size: 1rem;
  }
  
  .edit-input {
    width: 90%;
    padding: 0.5rem;
    border: 1px solid var(--tool-accent);
    border-radius: 0.25rem;
    background: var(--tool-background);
    color: var(--tool-text);
  }
  
  @media (max-width: 768px) {
    .text {
      font-size: 0.8rem;
    }
  }
`;

const BingoNotification = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: var(--tool-border-radius);
  background: ${props => props.type === 'full'
    ? 'linear-gradient(135deg, var(--color-success), var(--color-success-dark))'
    : 'linear-gradient(135deg, var(--tool-accent), var(--color-accent-dark))'};
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${props => props.type === 'full' ? 'bounce 1s infinite' : 'slideIn 0.5s ease-out'};
  will-change: transform;
  
  h2 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
  }
  
  ul {
    list-style-position: inside;
    margin: 0.5rem 0 0 0;
    padding: 0;
    text-align: left;
  }
`;

const ResetButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--tool-accent);
  color: white;
  border: none;
  border-radius: var(--tool-border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  will-change: transform;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background: var(--color-accent-dark);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

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

  return (
    <StyledBingoItem
      isChecked={isChecked}
      isHovered={isHovered}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
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
            autoFocus
          />
        ) : (
          <>
            <div className="text">{item.goal}</div>
            {item.description && (
              <div
                className="description"
                style={{ opacity: isHovered ? 1 : 0 }}
              >
                {item.description}
              </div>
            )}
            {isChecked && (
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
    </StyledBingoItem>
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
    <BingoGrid>
      {gridItems}
    </BingoGrid>
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
  }, [state, saveState]);

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
    <BingoContainer>
      <BingoHeader>
        <h1>Bingo Goals {year}</h1>

        <div className="year-selector">
          {years.map(y => (
            <button
              key={y}
              className={year === y ? "active" : ""}
              onClick={() => handleYearChange(y)}
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
      </BingoHeader>

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
            <BingoNotification type={bingos.length >= 3 ? "full" : "partial"}>
              <h2>
                {bingos.length >= 3
                  ? "🎉 Full Bingo! 🎉"
                  : `🎯 Bingo! (${bingos.length})`}
              </h2>
              <p>You've completed {bingos.length} bingo lines!</p>
            </BingoNotification>
          )}

          {completedCount > 0 && (
            <ResetButton onClick={handleReset}>
              Reset Progress
            </ResetButton>
          )}
        </>
      )}
    </BingoContainer>
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