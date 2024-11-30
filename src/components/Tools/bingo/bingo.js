// External imports
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import { debounce } from "lodash";

// Internal imports
import { callAppsScript, SHEET_COLUMNS } from "../../../config/googleApps";
import FullscreenWrapper from "../FullscreenWrapper";

// Component imports
import BingoCard from "./BingoCard";
import "./bingo.scss";

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

  // Check if there's a bingo (row, column, or diagonal)
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

  // Save edits with debouncing to prevent too many API calls
  const saveEditsDebounced = useMemo(
    () => {
      const debouncedSave = debounce((resolve, reject, index, value) => {
        callAppsScript("updateSheetData", {
          tabName: "bingo",
          row: index + 2, // Add 2 to account for header row and 0-based index
          column: SHEET_COLUMNS.BINGO.CHECK,
          value: value ? "1" : "0",
        })
          .then(resolve)
          .catch(reject);
      }, 1000);

      // Return a function that creates a new Promise for each call
      return (index, value) =>
        new Promise((resolve, reject) => {
          debouncedSave(resolve, reject, index, value);
        });
    },
    [] // Empty dependency array since we don't have any dependencies
  );

  const handleItemClick = useCallback(
    (index) => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
        return;
      }

      const timeout = setTimeout(() => {
        // Immediately update UI
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !checkedItems[index];
        setCheckedItems(newCheckedItems);

        // Trigger confetti immediately if bingo
        if (newCheckedItems[index] && checkForBingo(newCheckedItems)) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        // Save to backend
        saveEditsDebounced(index, !checkedItems[index])
          .catch((error) => {
            console.error("Failed to save change:", error);
            // Revert the change if save fails
            const revertedItems = [...newCheckedItems];
            revertedItems[index] = checkedItems[index];
            setCheckedItems(revertedItems);
          });

        setClickTimeout(null);
      }, 200);

      setClickTimeout(timeout);
    },
    [checkedItems, clickTimeout, checkForBingo, saveEditsDebounced]
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
    [saveEditsDebounced]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await callAppsScript("getSheetData", { tabName: "bingo" });

        if (result.success) {
          // Process the data and group by categories
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
