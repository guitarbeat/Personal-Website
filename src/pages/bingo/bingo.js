import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import debounce from 'lodash/debounce';
import MagicComponent from '../../Moiree';
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

  const ROW_SIZE = 5; // Assuming a 5x5 bingo card

  const exitEditMode = useCallback(() => {
    setEditIndex(null);
  }, []);

  const fetchBingoData = useCallback(async () => {
    try {
      const { data } = await axios.get(sheetDBAPI);
      const formattedData = data.map(item => ({ ...item, Check: item.Check === '1' }));
      setBingoData(formattedData);
      const storedCheckedItems = formattedData.map(item => item.Check);
      setCheckedItems(storedCheckedItems);
      localStorage.setItem('checkedItems', JSON.stringify(storedCheckedItems));
    } catch (error) {
      console.error('Error fetching bingo data:', error);
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

  const triggerBingoEffect = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
    alert("Bingo! You've completed a row!");
  };

  const toggleCheck = useCallback((index) => {
    setCheckedItems(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      localStorage.setItem('checkedItems', JSON.stringify(updated));
      if (updated[index]) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      const itemToUpdate = bingoData[index];
      const updatePayload = { Check: updated[index] ? '1' : '0' };
      axios.patch(`${sheetDBAPI}/Goal/${encodeURIComponent(itemToUpdate.Goal)}`, updatePayload)
        .catch(error => console.error('Error updating sheet:', error));

      if (checkForBingo(updated)) {
        triggerBingoEffect();
      }

      return updated;
    });
  }, [bingoData, sheetDBAPI, checkForBingo]);

  const handleClick = (index) => {
    if (clickTimeout) clearTimeout(clickTimeout);
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

  return (
    <div className="bingo-container">
      {/* Dummy elements */}
      <div id="header" style={{ display: 'none' }}></div>
      <div id="back-to-the-top" style={{ display: 'none' }}></div>

      <MagicComponent />
      <h1 className="bingo-title">2024 Bingo!</h1>
      <div className="bingo-card">
        {bingoData.map((item, index) => (
          <div
            key={index}
            className={`bingo-card__item ${checkedItems[index] ? 'checked' : ''} ${editIndex === index ? 'edit-mode' : ''}`}
            onClick={() => handleClick(index)}
            onDoubleClick={() => handleDoubleClick(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {editIndex === index ? (
              <input
                className="editable-input"
                type="text"
                value={item.Goal}
                onChange={(e) => handleChange(index, 'Goal', e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <div className="bingo-card__goal">{item.Goal}</div>
            )}
            {hoveredIndex === index && (
              editIndex === index ? (
                <textarea
                  className="editable-textarea"
                  value={item.Description}
                  onChange={(e) => handleChange(index, 'Description', e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <div className="bingo-card__description">{item.Description}</div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bingo2024;
