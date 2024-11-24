import React from 'react';
import PropTypes from 'prop-types';

import { LEVEL_EXAMPLES, LEVEL_DEPENDENCIES } from '../config';

const getEmoji = (value) => {
  const emojis = ['😩', '😟', '😐', '🙂', '😊', '😄', '🤩'];
  const index = Math.floor((value / 100) * (emojis.length - 1));
  return emojis[Math.min(emojis.length - 1, Math.max(0, index))];
};

export const Pyramid = ({ data, onSectionClick, hoveredLevel, setHoveredLevel, descriptions, minimumValueToUnlock = 15 }) => {
  const calculateWidth = (index, baseWidth) => {
    const totalLevels = data.length;
    const topWidth = 30; // Narrower top
    const bottomWidth = 100;
    const progress = index / (totalLevels - 1);
    const exponentialFactor = 2; // Controls how quickly the width reduces
    const normalizedProgress = Math.pow(progress, exponentialFactor);
    const visualWidth = bottomWidth - ((bottomWidth - topWidth) * (1 - normalizedProgress));
    
    // Scale the width based on the user's input value
    return Math.max((baseWidth / 100) * visualWidth, 20); // Minimum width of 20%
  };

  const isLevelAvailable = (index) => {
    if (index === 0) {
      return true;
    }
    return data[index - 1].width >= minimumValueToUnlock;
  };

  const getMaxAllowedValue = (index) => {
    if (index === 0) {
      return 100;
    }
    return data[index - 1].width;
  };

  const calculateProgress = () => {
    const totalLevels = data.length;
    const unlockedLevels = data.filter((_, index) => isLevelAvailable(index)).length;
    return Math.round((unlockedLevels / totalLevels) * 100);
  };

  return (
    <div className="needs-pyramid">
      {/* Left side: Pyramid visualization */}
      <div className="needs-pyramid__visual">
        <div className="needs-pyramid__sections-container">
          <div className="needs-pyramid__sections">
            {data.map((item, index) => {
              const available = isLevelAvailable(index);
              const adjustedWidth = calculateWidth(index, item.width);
              
              return (
                <div
                  key={item.level}
                  className={`needs-pyramid__section ${hoveredLevel === index ? 'hovered' : ''} ${available ? 'available' : 'locked'}`}
                  style={{
                    '--section-width': `${adjustedWidth}%`,
                    '--section-color': item.color,
                    '--section-index': index,
                    '--total-sections': data.length,
                  }}
                  onMouseEnter={() => setHoveredLevel(index)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  onClick={() => available && onSectionClick(index)}
                  role="button"
                  aria-label={`${item.level} level: ${item.width}%`}
                  tabIndex={0}
                >
                  <div className="needs-pyramid__section-3d">
                    <div className="needs-pyramid__face needs-pyramid__face--front">
                      <div className="needs-pyramid__content">
                        <span className="needs-pyramid__label">
                          {item.level} {getEmoji(item.width)}
                        </span>
                      </div>
                    </div>
                    <div className="needs-pyramid__face needs-pyramid__face--back" />
                    <div className="needs-pyramid__face needs-pyramid__face--left" />
                    <div className="needs-pyramid__face needs-pyramid__face--right" />
                  </div>
                  {!available && (
                    <div className="needs-pyramid__lock-message">
                      Unlock at {minimumValueToUnlock}% below
                    </div>
                  )}
                </div>
              );
            }).reverse()} {/* Reverse to build from bottom to top */}
          </div>
        </div>
      </div>

      {/* Right side: Interactive controls - keep original order */}
      <div className="needs-pyramid__interaction">
        {data.map((item, index) => {
          const available = isLevelAvailable(index);
          if (!available) {
            return null;
          }

          const maxAllowed = getMaxAllowedValue(index);
          
          return (
            <div 
              key={`control-${item.level}`}
              className={`needs-pyramid__control-group ${hoveredLevel === index ? 'active' : ''}`}
              onMouseEnter={() => setHoveredLevel(index)}
              onMouseLeave={() => setHoveredLevel(null)}
            >
              <div className="needs-pyramid__control-header">
                <span className="needs-pyramid__control-label" style={{ color: item.color }}>
                  {item.level}
                </span>
                <div className="needs-pyramid__control-value">
                  <span className="needs-pyramid__control-value-number">
                    {item.width}% (max: {maxAllowed}%)
                  </span>
                  <span 
                    className="needs-pyramid__control-value-emoji" 
                    role="img" 
                    aria-label="satisfaction level"
                  >
                    {getEmoji(item.width)}
                  </span>
                </div>
              </div>
              
              <div className="needs-pyramid__control-slider">
                <input
                  type="range"
                  min="0"
                  max={maxAllowed}
                  value={item.width}
                  onChange={(e) => onSectionClick(index, parseInt(e.target.value))}
                  className="needs-pyramid__slider"
                  style={{ 
                    '--slider-color': item.color,
                    '--value-percentage': `${item.width}%`
                  }}
                />
              </div>
              
              <div className="needs-pyramid__control-description">
                {descriptions[item.level]}
                <div className="needs-pyramid__examples">
                  <h4>Examples:</h4>
                  <ul>
                    {LEVEL_EXAMPLES[item.level].map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
                <div className="needs-pyramid__dependency">
                  <strong>Prerequisites:</strong> {LEVEL_DEPENDENCIES[item.level]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="needs-pyramid__progress">
        <div className="needs-pyramid__progress-bar" style={{ width: `${calculateProgress()}%` }} />
        <span className="needs-pyramid__progress-text">
          Progress: {calculateProgress()}%
        </span>
      </div>
    </div>
  );
};

Pyramid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  onSectionClick: PropTypes.func.isRequired,
  hoveredLevel: PropTypes.number,
  setHoveredLevel: PropTypes.func.isRequired,
  descriptions: PropTypes.objectOf(PropTypes.string).isRequired,
  minimumValueToUnlock: PropTypes.number
};

export default Pyramid; 