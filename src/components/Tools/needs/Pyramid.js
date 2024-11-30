import React from 'react';
import PropTypes from 'prop-types';

const getEmoji = (value) => {
  const emojis = ['😩', '😟', '😐', '🙂', '😊', '😄', '🤩'];
  const index = Math.floor((value / 100) * (emojis.length - 1));
  return emojis[Math.min(emojis.length - 1, Math.max(0, index))];
};

const PyramidSection = ({ 
  item = {}, 
  index, 
  isHovered, 
  isAvailable, 
  width, 
  onMouseEnter, 
  onMouseLeave, 
  onClick, 
  minimumValueToUnlock 
}) => {
  if (!item || typeof item !== 'object') {
    console.error('Invalid item provided to PyramidSection:', item);
    return null;
  }

  const { color = 'var(--color-error)', level = 'Error' } = item;

  return (
    <div
      className={`needs-pyramid__section ${isHovered ? 'hovered' : ''} ${isAvailable ? 'available' : 'locked'}`}
      style={{
        '--section-width': `${width}%`,
        '--section-color': color,
        '--section-index': index,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => isAvailable && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div className="needs-pyramid__content">
        <span className="needs-pyramid__level">{level}</span>
        {item.width !== undefined && (
          <span className="needs-pyramid__value">
            {getEmoji(item.width)}
            <span className="needs-pyramid__percentage">{Math.round(item.width)}%</span>
          </span>
        )}
      </div>
    </div>
  );
};

export const Pyramid = ({ 
  items = [], 
  hoveredIndex, 
  onHover, 
  onSelect, 
  minimumValueToUnlock = 70,
  currentLevel = 0,  
  onLevelChange      
}) => {
  const maxWidth = 80;
  const minWidth = 30;
  const widthStep = (maxWidth - minWidth) / (items.length - 1);

  const visibleItems = items.slice(items.length - 1 - currentLevel);

  return (
    <div className="needs-pyramid">
      {visibleItems.map((item, index) => {
        const actualIndex = items.length - visibleItems.length + index;
        const width = maxWidth - (actualIndex * widthStep);
        const isAvailable = index === 0 || 
          (visibleItems[index - 1]?.width >= minimumValueToUnlock);

        return (
          <PyramidSection
            key={item.level}
            item={item}
            index={actualIndex}
            isHovered={hoveredIndex === actualIndex}
            isAvailable={isAvailable}
            width={width}
            onMouseEnter={() => onHover?.(actualIndex)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onSelect?.(actualIndex)}
            minimumValueToUnlock={minimumValueToUnlock}
          />
        );
      })}
      <div className="needs-pyramid__controls">
        <button 
          onClick={() => onLevelChange?.(Math.max(0, currentLevel - 1))}
          disabled={currentLevel === 0}
          className="needs-pyramid__control-btn"
        >
          ⬇️ Show Less
        </button>
        <button 
          onClick={() => onLevelChange?.(Math.min(items.length - 1, currentLevel + 1))}
          disabled={currentLevel === items.length - 1}
          className="needs-pyramid__control-btn"
        >
          ⬆️ Show More
        </button>
      </div>
    </div>
  );
};

PyramidSection.propTypes = {
  item: PropTypes.shape({
    level: PropTypes.string,
    width: PropTypes.number,
    color: PropTypes.string,
  }),
  index: PropTypes.number.isRequired,
  isHovered: PropTypes.bool,
  isAvailable: PropTypes.bool,
  width: PropTypes.number,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  minimumValueToUnlock: PropTypes.number,
};

Pyramid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.string,
      width: PropTypes.number,
      color: PropTypes.string,
    })
  ),
  hoveredIndex: PropTypes.number,
  onHover: PropTypes.func,
  onSelect: PropTypes.func,
  minimumValueToUnlock: PropTypes.number,
  currentLevel: PropTypes.number,
  onLevelChange: PropTypes.func,
};

export default Pyramid;