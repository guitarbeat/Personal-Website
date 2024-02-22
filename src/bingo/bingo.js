import React, { useState, useEffect } from 'react';
import { withGoogleSheets } from 'react-db-google-sheets';
import confetti from 'canvas-confetti';
import './bingo.scss';

const Bingo2024 = ({ db }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  // Initialize hoveredIndex state
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Retrieve checked items from local storage or initialize if not present
    const storedCheckedItems = JSON.parse(localStorage.getItem('checkedItems'));
    if (db.bingo) {
      const initialCheckedItems = storedCheckedItems 
        ? storedCheckedItems 
        : new Array(db.bingo.length).fill(false);
      setCheckedItems(initialCheckedItems);
    }
  }, [db.bingo]);

  const toggleCheck = index => {
    const updatedCheckedItems = checkedItems.map((item, i) => i === index ? !item : item);
    setCheckedItems(updatedCheckedItems);
    // Store updated state in local storage
    localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));

    if (!checkedItems[index]) {
      // Trigger confetti when an item is checked
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleMouseEnter = index => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  if (!db.bingo) {
    return <div>Loading Bingo activities...</div>;
  }

  return (
    <div className="bingo-container">
      <h1 className="bingo-title">2024 Bingo!</h1>
      <div className="bingo-card">
        {db.bingo.map((activity, index) => (
          <div
            key={index}
            className={`bingo-card__item ${checkedItems[index] ? 'checked' : ''}`}
            onClick={() => toggleCheck(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bingo-card__goal">{activity.Goal}</div>
            {(hoveredIndex === index || checkedItems[index]) && (
              <div className="bingo-card__description">{activity.Description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withGoogleSheets('bingo')(Bingo2024);
