import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import debounce from 'lodash/debounce';
import MagicComponent from '../../Moiree';
import BingoCard from './BingoCard';
import './bingo.scss';

const Bingo2024 = () => {
  const [bingoData, setBingoData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [completedBingos, setCompletedBingos] = useState({ rows: [], cols: [], diagonals: [] });
  const sheetDBAPI = 'https://sheetdb.io/api/v1/35dkdn3qe1piq';
  const saveEditsDebounced = useRef(debounce(saveEdits, 500)).current;
  const editRef = useRef(null); // Ref to track the editing element
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  const ROW_SIZE = 5; // Assuming a 5x5 bingo card

  const exitEditMode = useCallback(() => {
    setEditIndex(null);
  }, []);

  const fetchBingoData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axios.get(sheetDBAPI);
      const formattedData = data.map(item => ({ ...item, Check: item.Check === '1' }));
      setBingoData(formattedData);
      const storedCheckedItems = formattedData.map(item => item.Check);
      setCheckedItems(storedCheckedItems);
      localStorage.setItem('checkedItems', JSON.stringify(storedCheckedItems));
    } catch (error) {
      setError('Failed to load bingo data. Please try again later.');
      console.error('Error fetching bingo data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBingoData();
  }, [fetchBingoData]);

  const checkForBingo = useCallback((updatedCheckedItems) => {
    const isRowComplete = (rowIndex) => 
      updatedCheckedItems.slice(rowIndex * ROW_SIZE, (rowIndex + 1) * ROW_SIZE).every(Boolean);

    const isColumnComplete = (colIndex) =>
      Array.from({ length: ROW_SIZE }, (_, rowIndex) => updatedCheckedItems[rowIndex * ROW_SIZE + colIndex]).every(Boolean);

    const isDiagonalComplete = (isMainDiagonal) => 
      Array.from({ length: ROW_SIZE }, (_, i) => updatedCheckedItems[isMainDiagonal ? i * ROW_SIZE + i : (i + 1) * ROW_SIZE - i - 1]).every(Boolean);

    let bingoFound = false;

    for (let i = 0; i < ROW_SIZE; i++) {
      if (isRowComplete(i) && !completedBingos.rows.includes(i)) {
        setCompletedBingos(prev => ({ ...prev, rows: [...prev.rows, i] }));
        bingoFound = true;
        break;
      }
      if (isColumnComplete(i) && !completedBingos.cols.includes(i)) {
        setCompletedBingos(prev => ({ ...prev, cols: [...prev.cols, i] }));
        bingoFound = true;
        break;
      }
    }

    if (isDiagonalComplete(true) && !completedBingos.diagonals.includes('main')) {
      setCompletedBingos(prev => ({ ...prev, diagonals: [...prev.diagonals, 'main'] }));
      bingoFound = true;
    } else if (isDiagonalComplete(false) && !completedBingos.diagonals.includes('anti')) {
      setCompletedBingos(prev => ({ ...prev, diagonals: [...prev.diagonals, 'anti'] }));
      bingoFound = true;
    }

    return bingoFound;
  }, [completedBingos]);

  const fireConfetti = useCallback((intensity = 'small') => {
    const defaults = {
      origin: { y: 0.7 },
      spread: 70,
      startVelocity: 30,
      ticks: 300,
    };

    const effects = {
      small: { particleCount: 50 },
      medium: { particleCount: 100, spread: 100 },
      large: { 
        particleCount: 200, 
        spread: 160,
        decay: 0.91,
        scalar: 1.2
      },
      bingo: {
        particleCount: 300,
        spread: 180,
        startVelocity: 45,
        decay: 0.92,
        scalar: 1.4,
        shapes: ['star', 'circle']
      }
    };

    confetti({
      ...defaults,
      ...effects[intensity],
    });

    if (intensity === 'bingo') {
      // Fire multiple bursts for bingo
      setTimeout(() => confetti({ ...defaults, ...effects.large }), 200);
      setTimeout(() => confetti({ ...defaults, ...effects.medium }), 400);
    }
  }, []);

  useEffect(() => {
    const completed = checkedItems.filter(Boolean).length;
    const total = checkedItems.length;
    setProgress((completed / total) * 100);
  }, [checkedItems]);

  const addToHistory = useCallback((items) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), items]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCheckedItems(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCheckedItems(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const resetBoard = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the board?')) {
      const newCheckedItems = new Array(bingoData.length).fill(false);
      setCheckedItems(newCheckedItems);
      addToHistory(newCheckedItems);
      setCompletedBingos({ rows: [], cols: [], diagonals: [] });
      localStorage.setItem('checkedItems', JSON.stringify(newCheckedItems));
    }
  }, [bingoData.length, addToHistory]);

  const toggleCheck = useCallback((index) => {
    setCheckedItems(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      
      addToHistory(updated);
      
      localStorage.setItem('checkedItems', JSON.stringify(updated));
      
      if (updated[index]) {
        fireConfetti('small');
      }

      const itemToUpdate = bingoData[index];
      const updatePayload = { Check: updated[index] ? '1' : '0' };
      axios.patch(`${sheetDBAPI}/Goal/${encodeURIComponent(itemToUpdate.Goal)}`, updatePayload)
        .catch(error => console.error('Error updating sheet:', error));

      if (checkForBingo(updated)) {
        fireConfetti('bingo');
      }

      return updated;
    });
  }, [bingoData, sheetDBAPI, checkForBingo, fireConfetti, addToHistory]);

  const handleClick = (index) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    const timeoutId = setTimeout(() => {
      toggleCheck(index);
      setClickTimeout(null);
    }, 300);
    setClickTimeout(timeoutId);
  };

  const handleDoubleClick = (index) => {
    clearTimeout(clickTimeout);
    setClickTimeout(null);
    setEditIndex(index);
  };

  const handleBlur = () => {
    setEditIndex(null);
  };

  const handleChange = useCallback((index, key, value) => {
    const updatedBingoData = [...bingoData];
    updatedBingoData[index][key] = value;
    setBingoData(updatedBingoData);
    saveEditsDebounced(index, key, value);
  }, [bingoData, saveEditsDebounced]);

  function saveEdits(index, key, value) {
    const itemToUpdate = bingoData[index];
    if (itemToUpdate.ID) {
      axios.patch(`${sheetDBAPI}/ID/${itemToUpdate.ID}`, { data: { [key]: value } })
        .catch(error => console.error('Error updating sheet:', error));
    }
  }

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
    if (editIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editIndex, exitEditMode]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" || event.key === "Escape") {
        exitEditMode();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [exitEditMode]);

  if (isLoading) {
    return <div className="bingo-loading">Loading bingo card...</div>;
  }

  if (error) {
    return <div className="bingo-error">{error}</div>;
  }

  return (
    <>
      <div id="header" style={{ height: '1px', visibility: 'hidden' }}></div>
      <div id="back-to-the-top" style={{ height: '1px', visibility: 'hidden' }}></div>
      
      <div className="container">
        <div className="container__content">
          <div className="bingo-container">
            <MagicComponent />
            <h1 className="bingo-title">2024 Bingo!</h1>
            
            <div className="bingo-controls">
              <button 
                className="bingo-control-btn"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                Undo
              </button>
              <button 
                className="bingo-control-btn"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                Redo
              </button>
              <button 
                className="bingo-control-btn reset"
                onClick={resetBoard}
              >
                Reset Board
              </button>
            </div>

            <div className="bingo-progress">
              <div 
                className="bingo-progress__bar" 
                style={{ width: `${progress}%` }}
              />
              <span className="bingo-progress__text">
                {Math.round(progress)}% Complete
              </span>
            </div>

            <BingoCard
              bingoData={bingoData}
              checkedItems={checkedItems}
              editIndex={editIndex}
              hoveredIndex={hoveredIndex}
              onItemClick={handleClick}
              onItemDoubleClick={handleDoubleClick}
              onHover={setHoveredIndex}
              onEdit={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Bingo2024;
