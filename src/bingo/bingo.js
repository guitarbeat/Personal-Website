import React, { useState, useEffect, useCallback } from 'react';
import { withGoogleSheets } from 'react-db-google-sheets';
import confetti from 'canvas-confetti';
import './bingo.scss';

const Bingo2024 = ({ db }) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const loadCheckedItems = useCallback(() => {
    const storedCheckedItems = JSON.parse(localStorage.getItem('checkedItems')) || [];
    setCheckedItems(storedCheckedItems);
  }, []);

  useEffect(() => {
    if (db.bingo) {
      loadCheckedItems();

            // Map the "Check" column to a boolean array to initialize checkedItems
            const storedCheckedItems = db.bingo.map(activity => activity.Check === '1');
            setCheckedItems(storedCheckedItems);
      
            // Optionally, you can also synchronize this state with localStorage if needed
            localStorage.setItem('checkedItems', JSON.stringify(storedCheckedItems));
    }
  }, [db.bingo, loadCheckedItems]);



  const toggleCheck = useCallback((index) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = prevCheckedItems.map((item, i) => i === index ? !item : item);
      localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));

      if (!prevCheckedItems[index]) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      return updatedCheckedItems;
    });
  }, []);

  return (
    <div className="bingo-container">
      <h1 className="bingo-title">2024 Bingo!</h1>
      <div className="bingo-card">
        {db.bingo.map((activity, index) => (
          <div
            key={index}
            className={`bingo-card__item ${checkedItems[index] ? 'checked' : ''}`}
            onClick={() => toggleCheck(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="bingo-card__goal">{activity.Goal}</div>
            {hoveredIndex === index && ( // Show only on hover
              <div className="bingo-card__description">
                {activity.Description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withGoogleSheets('bingo')(Bingo2024);
