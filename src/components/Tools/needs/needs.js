import React, { useState } from 'react';

import FullscreenWrapper from '../FullscreenWrapper';

import { LEVELS } from './config';
import './needs.scss';

const NeedsAssessment = () => {
  const [name, setName] = useState('');
  const [values, setValues] = useState(Array(LEVELS.length).fill(0));
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleValueChange = (index, newValue) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter your name first');
      return;
    }
    // Save logic here
    console.log('Saving:', { name, values });
  };

  return (
    <FullscreenWrapper>
      <div className="needs-container">
        <div className="needs-header">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="needs-input"
          />
          <button 
            onClick={handleSave}
            className="needs-button"
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>

        <div className="needs-pyramid">
          {LEVELS.map((level, index) => (
            <div
              key={level.level}
              className="needs-level"
              style={{
                backgroundColor: level.color,
                width: `${level.baseWidth}%`,
                opacity: selectedLevel === index ? 1 : 0.8
              }}
              onClick={() => setSelectedLevel(index)}
            >
              <div className="needs-level-content">
                <h3>{level.level}</h3>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={values[index]}
                  onChange={(e) => handleValueChange(index, parseInt(e.target.value))}
                  className="needs-level-slider"
                />
                <span>{values[index]}%</span>
              </div>
              {selectedLevel === index && (
                <div className="needs-level-description">
                  {level.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </FullscreenWrapper>
  );
};

export default NeedsAssessment;