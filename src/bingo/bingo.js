

  import React, { useState, useEffect, useCallback } from 'react';
  import axios from 'axios';
  import confetti from 'canvas-confetti';
  import './bingo.scss';
  
  const Bingo2024 = () => {
    const [bingoData, setBingoData] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const sheetDBAPI = 'https://sheetdb.io/api/v1/xtm26jygyqjac/'; // Replace with your SheetDB API URL
  
    // Fetching bingo data from SheetDB
    const fetchBingoData = useCallback(async () => {
      try {
        const response = await axios.get(sheetDBAPI);
        if (response.data) {
          const formattedData = response.data.map((item, index) => ({
            ...item,
            Check: item.Check === '1', // Convert 'Check' to boolean
          }));
          setBingoData(formattedData);
  
          // Initialize checked items from fetched data
          const storedCheckedItems = formattedData.map(item => item.Check);
          setCheckedItems(storedCheckedItems);
  
          // Synchronize with localStorage
          localStorage.setItem('checkedItems', JSON.stringify(storedCheckedItems));
        }
      } catch (error) {
        console.error('Error fetching bingo data:', error);
      }
    }, [sheetDBAPI]);
  
    // Load checked items from localStorage on component mount
    useEffect(() => {
      fetchBingoData();
    }, [fetchBingoData]);
  
    const toggleCheck = useCallback((index) => {
      setCheckedItems(prev => {
        const updated = [...prev];
        updated[index] = !updated[index];
    
        // Update the local storage
        localStorage.setItem('checkedItems', JSON.stringify(updated));
    
        // Trigger confetti for checking an item
        if (!prev[index]) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
    
        // Prepare data for SheetDB update
        const itemToUpdate = bingoData[index];
        const updatePayload = {
          Check: updated[index] ? '1' : '0', // Convert boolean back to SheetDB format
        };
    
        // Assuming 'Goal' can uniquely identify each row, update SheetDB
        // This example uses 'Goal' but adjust according to your data's unique identifier
        axios.patch(`${sheetDBAPI}/Goal/${encodeURIComponent(itemToUpdate.Goal)}`, updatePayload)
          .then(response => console.log('Sheet updated successfully', response))
          .catch(error => console.error('Error updating sheet:', error));
    
        return updated;
      });
    }, [bingoData, sheetDBAPI]);
    
    return (
      
      <div className="bingo-container">

            {/* Dummy elements */}
    <div id="header" style={{ display: 'none' }}></div>
    <div id="back-to-the-top" style={{ display: 'none' }}></div>
    
        <h1 className="bingo-title">2024 Bingo!</h1>
        <div className="bingo-card">
          {bingoData.map((item, index) => (
            <div
              key={index}
              className={`bingo-card__item ${checkedItems[index] ? 'checked' : ''}`}
              onClick={() => toggleCheck(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="bingo-card__goal">{item.Goal}</div>
              {hoveredIndex === index && (
                <div className="bingo-card__description">{item.Description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Bingo2024;
  