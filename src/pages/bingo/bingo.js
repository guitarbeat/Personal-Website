import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import './bingo.scss';
import MagicComponent from '../../Moiree';
import debounce from 'lodash/debounce';

const Bingo2024 = () => {
  const [bingoData, setBingoData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);
  const sheetDBAPI = 'https://sheetdb.io/api/v1/35dkdn3qe1piq';
  const saveEditsDebouncedRef = useRef(debounce(saveEdits, 500)).current;

  const editRef = useRef(null); // Ref to track the editing element

  // Function to exit edit mode
  const exitEditMode = useCallback(() => {
    setEditIndex(null);
  }, []);

  // Fetching bingo data from SheetDB and initializing states
  const fetchBingoData = useCallback(async () => {
    try {
      const { data } = await axios.get(sheetDBAPI);
      const formattedData = data.map((item) => ({ ...item, Check: item.Check === '1' }));
      setBingoData(formattedData);
      const storedCheckedItems = formattedData.map((item) => item.Check);
      setCheckedItems(storedCheckedItems);
      localStorage.setItem('checkedItems', JSON.stringify(storedCheckedItems));
    } catch (error) {
      console.error('Error fetching bingo data:', error);
    }
  }, []);

  useEffect(() => {
    fetchBingoData();
  }, [fetchBingoData]);

  // Toggles the check state of an item
  const toggleCheck = useCallback((index) => {
    setCheckedItems((prev) => {
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
      return updated;
    });
  }, [bingoData, sheetDBAPI]);

  // Handles single click with delay to differentiate from double-click
  const handleClick = (index) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    const timeoutId = setTimeout(() => {
      toggleCheck(index);
      setClickTimeout(null);
    }, 300);
    setClickTimeout(timeoutId);
  };

  // Enters edit mode on double-click
  const handleDoubleClick = (index) => {
    clearTimeout(clickTimeout);
    setClickTimeout(null);
    setEditIndex(index);
  };

  // Exits edit mode
  const handleBlur = () => {
    setEditIndex(null);
  };

  // Adjusted to include debouncing logic
  const handleChange = useCallback((index, key, value) => {
    const updatedBingoData = [...bingoData];
    updatedBingoData[index][key] = value;
    setBingoData(updatedBingoData);

    // Debounce the save operation
    saveEditsDebouncedRef(index, key, value);
  }, [bingoData, saveEditsDebouncedRef]);
  // New function to handle debounced save operations
  function saveEdits(index, key, value) {
    const itemToUpdate = bingoData[index];
    if (itemToUpdate.ID) {
      axios.patch(`${sheetDBAPI}/ID/${itemToUpdate.ID}`, { data: { [key]: value } })
        .catch(error => console.error('Error updating sheet:', error));
    }
  }
   // New useEffect to handle component unmount
   useEffect(() => {
    return () => {
      // Ensure all pending edits are saved when the component is unmounted
      saveEditsDebouncedRef.flush();
    };
  }, [saveEditsDebouncedRef]);

      
useEffect(() => {
  const handleClickOutside = (event) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      exitEditMode();
    }
  };

  if (editIndex !== null) { // Add listener only if in edit mode
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [editIndex, exitEditMode]);

// Handle key events for Enter (save) and Escape (cancel)
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
                // autoFocus
                // tabIndex={0}
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