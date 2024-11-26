// Third-party imports
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { debounce } from 'lodash';

// Local imports
import FullscreenWrapper from "../FullscreenWrapper";
import BingoCard from "./BingoCard";
import "./bingo.scss";

const Bingo2024 = () => {
  const [bingoData, setBingoData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);
  const sheetDBAPI = "https://sheetdb.io/api/v1/35dkdn3qe1piq";
  const saveEditsDebounced = useRef(debounce(saveEdits, 500)).current;
  const editRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const ROW_SIZE = 5;

  const exitEditMode = useCallback(() => {
    setEditIndex(null);
  }, []);

  const fireConfetti = useCallback((x, y) => {
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 50,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    };

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }, []);

  const checkForBingo = useCallback(
    (items, clickX, clickY) => {
      const newBingos = {
        rows: [],
        cols: [],
        diagonals: [],
      };

      let foundNewBingo = false;

      // Check rows
      for (let i = 0; i < ROW_SIZE; i++) {
        const row = items.slice(i * ROW_SIZE, (i + 1) * ROW_SIZE);
        if (row.every(Boolean)) {
          newBingos.rows.push(i);
          foundNewBingo = true;
        }
      }

      // Check columns
      for (let i = 0; i < ROW_SIZE; i++) {
        const col = Array.from(
          { length: ROW_SIZE },
          (_, j) => items[i + j * ROW_SIZE]
        );
        if (col.every(Boolean)) {
          newBingos.cols.push(i);
          foundNewBingo = true;
        }
      }

      // Check diagonals
      const mainDiag = Array.from(
        { length: ROW_SIZE },
        (_, i) => items[i * ROW_SIZE + i]
      );
      const antiDiag = Array.from(
        { length: ROW_SIZE },
        (_, i) => items[(i + 1) * ROW_SIZE - (i + 1)]
      );

      if (mainDiag.every(Boolean)) {
        newBingos.diagonals.push(0);
        foundNewBingo = true;
      }
      if (antiDiag.every(Boolean)) {
        newBingos.diagonals.push(1);
        foundNewBingo = true;
      }

      if (foundNewBingo && clickX && clickY) {
        fireConfetti(clickX, clickY);
      }

      return foundNewBingo;
    },
    [ROW_SIZE, fireConfetti]
  );

  const addToHistory = useCallback(
    (items) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), items]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCheckedItems(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCheckedItems(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the board?")) {
      const newCheckedItems = new Array(bingoData.length).fill(false);
      setCheckedItems(newCheckedItems);
      addToHistory(newCheckedItems);
      localStorage.setItem("checkedItems", JSON.stringify(newCheckedItems));
    }
  }, [bingoData.length, addToHistory]);

  const handleItemClick = useCallback(
    (index, event) => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }

      setCheckedItems((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        addToHistory(updated);

        // Update localStorage and sheet
        localStorage.setItem("checkedItems", JSON.stringify(updated));
        const itemToUpdate = bingoData[index];
        const updatePayload = { Check: updated[index] ? "1" : "0" };
        axios
          .patch(
            `${sheetDBAPI}/Goal/${encodeURIComponent(itemToUpdate.Goal)}`,
            updatePayload
          )
          .catch((error) => console.error("Error updating sheet:", error));

        // Check for bingo after updating
        if (updated[index]) {
          const rect = event.currentTarget.getBoundingClientRect();
          const clickX = rect.left + rect.width / 2;
          const clickY = rect.top + rect.height / 2;
          checkForBingo(updated, clickX, clickY);
        }

        return updated;
      });
    },
    [clickTimeout, addToHistory, bingoData, sheetDBAPI, checkForBingo]
  );

  const handleItemDoubleClick = useCallback((index) => {
    setEditIndex(index);
  }, []);

  const handleEdit = useCallback(
    (index, key, value) => {
      const updatedBingoData = [...bingoData];
      updatedBingoData[index][key] = value;
      setBingoData(updatedBingoData);
      saveEditsDebounced(index, key, value);
    },
    [bingoData, saveEditsDebounced]
  );

  function saveEdits(index, key, value) {
    const itemToUpdate = bingoData[index];
    if (itemToUpdate.ID) {
      axios
        .patch(`${sheetDBAPI}/ID/${itemToUpdate.ID}`, {
          data: { [key]: value },
        })
        .catch((error) => console.error("Error updating sheet:", error));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get(sheetDBAPI);
        const formattedData = data.map((item) => ({
          ...item,
          Check: item.Check === "1",
        }));
        setBingoData(formattedData);

        // Load checked items from localStorage or initialize new
        const storedCheckedItems = localStorage.getItem("checkedItems");
        const initialCheckedItems = storedCheckedItems
          ? JSON.parse(storedCheckedItems)
          : new Array(formattedData.length).fill(false);

        setCheckedItems(initialCheckedItems);
        addToHistory(initialCheckedItems);
        setError(null); // Clear any previous errors after successful load
      } catch (error) {
        console.error("Error fetching bingo data:", error);
        if (!bingoData.length) {
          setError("Failed to load bingo data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [addToHistory, bingoData.length]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && editIndex !== null) {
        exitEditMode();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [exitEditMode, editIndex]);

  useEffect(() => {
    return () => {
      saveEditsDebounced.flush();
    };
  }, [saveEditsDebounced]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        exitEditMode();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editIndex, exitEditMode]);

  return (
    <FullscreenWrapper>
      <div className="bingo-container">
        <div className="bingo-content">
          {error && <div className="error-message">{error}</div>}
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="bingo-board">
                <BingoCard
                  bingoData={bingoData}
                  checkedItems={checkedItems}
                  editIndex={editIndex}
                  hoveredIndex={hoveredIndex}
                  onItemClick={handleItemClick}
                  onItemDoubleClick={handleItemDoubleClick}
                  onHover={setHoveredIndex}
                  onEdit={handleEdit}
                  onBlur={exitEditMode}
                />
              </div>
              <div className="bingo-controls">
                <button onClick={handleUndo} disabled={historyIndex <= 0}>
                  Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                >
                  Redo
                </button>
                <button onClick={handleReset}>Reset</button>
              </div>
            </>
          )}
        </div>
      </div>
    </FullscreenWrapper>
  );
};

export default Bingo2024;
