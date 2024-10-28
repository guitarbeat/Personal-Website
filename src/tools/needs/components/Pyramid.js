import React from 'react';
import PropTypes from 'prop-types';
import { LEVEL_EXAMPLES, LEVEL_DEPENDENCIES } from '../config';

export const Pyramid = ({ data, onSectionClick, hoveredLevel, setHoveredLevel, descriptions, minimumValueToUnlock = 15 }) => {
  const calculateWidth = (index, baseWidth) => {
    const totalLevels = data.length;
    const topWidth = 40;
    const bottomWidth = 100;
    const widthStep = (bottomWidth - topWidth) / (totalLevels - 1);
    const visualWidth = bottomWidth - (index * widthStep);
    const minWidth = 70 - (index * 5);
    return Math.max((baseWidth / 100) * visualWidth, minWidth);
  };

  const isLevelAvailable = (index) => {
    if (index === 0) return true;
    return data[index - 1].width >= minimumValueToUnlock;
  };

  const getMaxAllowedValue = (index) => {
    if (index === 0) return 100;
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
              if (!available) return null;

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
                  role="slider"
                  aria-valuemin="0"
                  aria-valuemax={getMaxAllowedValue(index)}
                  aria-valuenow={item.width}
                  aria-label={`${item.level} level: ${item.width}%`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      onSectionClick(index, Math.min(item.width + 5, getMaxAllowedValue(index)));
                    } else if (e.key === 'ArrowDown') {
                      onSectionClick(index, Math.max(item.width - 5, 0));
                    }
                  }}
                >
                  <div className="needs-pyramid__section-3d">
                    <div className="needs-pyramid__face needs-pyramid__face--front">
                      <div className="needs-pyramid__content">
                        <span 
                          className="needs-pyramid__label"
                          style={{ 
                            fontSize: `clamp(0.8rem, ${adjustedWidth / (item.level.length * 3)}rem, 1.8rem)`,
                            minWidth: '20rem'
                          }}
                        >
                          {item.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!available && (
                    <div className="needs-pyramid__lock-message">
                      Unlock at {minimumValueToUnlock}% below
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right side: Interactive controls - keep original order */}
      <div className="needs-pyramid__interaction">
        {data.map((item, index) => {
          const available = isLevelAvailable(index);
          if (!available) return null;

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
                <span className="needs-pyramid__control-value">
                  {item.width}% (max: {maxAllowed}%)
                </span>
              </div>
              
              <div className="needs-pyramid__control-slider">
                <input
                  type="range"
                  min="0"
                  max={maxAllowed}
                  value={item.width}
                  onChange={(e) => onSectionClick(index, parseInt(e.target.value))}
                  className="needs-pyramid__slider"
                  style={{ '--slider-color': item.color }}
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