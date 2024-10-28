import React, { useState, useEffect } from 'react';
import MagicComponent from '../../Moiree';
import './needs.scss';

const Needs = () => {
  const [needs, setNeeds] = useState([
    {
      category: 'Physical',
      items: [
        { id: 1, name: 'Sleep', status: 'good' },
        { id: 2, name: 'Exercise', status: 'warning' },
        { id: 3, name: 'Nutrition', status: 'attention' },
      ]
    },
    {
      category: 'Mental',
      items: [
        { id: 4, name: 'Learning', status: 'good' },
        { id: 5, name: 'Creativity', status: 'good' },
        { id: 6, name: 'Focus', status: 'warning' },
      ]
    },
    {
      category: 'Social',
      items: [
        { id: 7, name: 'Connection', status: 'good' },
        { id: 8, name: 'Communication', status: 'attention' },
        { id: 9, name: 'Support', status: 'good' },
      ]
    }
  ]);

  const handleStatusChange = (categoryIndex, itemId) => {
    setNeeds(prevNeeds => {
      const newNeeds = [...prevNeeds];
      const category = newNeeds[categoryIndex];
      const itemIndex = category.items.findIndex(item => item.id === itemId);
      
      const statusCycle = ['good', 'warning', 'attention'];
      const currentStatus = category.items[itemIndex].status;
      const nextStatusIndex = (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length;
      
      category.items[itemIndex] = {
        ...category.items[itemIndex],
        status: statusCycle[nextStatusIndex]
      };
      
      return newNeeds;
    });
  };

  return (
    <>
      <div id="header" style={{ height: '1px', visibility: 'hidden' }}></div>
      <div id="back-to-the-top" style={{ height: '1px', visibility: 'hidden' }}></div>
      
      <div className="container">
        <div className="container__content">
          <div className="needs-container">
            <MagicComponent />
            <h1 className="needs-title">Needs Tracker</h1>
            
            <div className="needs-grid">
              {needs.map((category, categoryIndex) => (
                <div key={category.category} className="needs-category">
                  <h2 className="needs-category__title">{category.category}</h2>
                  <div className="needs-category__items">
                    {category.items.map(item => (
                      <div 
                        key={item.id}
                        className={`needs-item needs-item--${item.status}`}
                        onClick={() => handleStatusChange(categoryIndex, item.id)}
                      >
                        <span className="needs-item__name">{item.name}</span>
                        <div className="needs-item__status-indicator" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="needs-legend">
              <div className="needs-legend__item">
                <div className="needs-legend__indicator needs-legend__indicator--good" />
                <span>Good</span>
              </div>
              <div className="needs-legend__item">
                <div className="needs-legend__indicator needs-legend__indicator--warning" />
                <span>Warning</span>
              </div>
              <div className="needs-legend__item">
                <div className="needs-legend__indicator needs-legend__indicator--attention" />
                <span>Needs Attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Needs; 