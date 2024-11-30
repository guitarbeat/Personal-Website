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
  minimumValueToUnlock = 70 
}) => {
  if (!Array.isArray(items)) {
    console.error('Pyramid items must be an array:', items);
    return null;
  }

  const calculateWidth = (index, totalLevels) => {
    // Base width for the bottom level (Survival)
    const baseWidth = 100;
    // Each level gets progressively narrower
    const shrinkFactor = baseWidth / (totalLevels * 1.5);
    // Calculate width based on position in pyramid (bottom up)
    const reversedIndex = totalLevels - index - 1;
    return Math.max(20, baseWidth - (reversedIndex * shrinkFactor));
  };

  const isLevelAvailable = (index, items) => {
    if (index === 0) return true;
    const previousValue = items[index - 1]?.width || 0;
    return previousValue >= minimumValueToUnlock;
  };

  return (
    <div className="needs-pyramid">
      {items.map((item, index) => {
        if (!item || typeof item !== 'object') {
          console.error(`Invalid item at index ${index}:`, item);
          return null;
        }

        const isAvailable = isLevelAvailable(index, items);
        const isHovered = hoveredIndex === index;
        const width = calculateWidth(index, items.length);

        return (
          <PyramidSection
            key={item.level || index}
            item={item}
            index={index}
            isHovered={isHovered}
            isAvailable={isAvailable}
            width={width}
            onMouseEnter={() => onHover?.(index)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => isAvailable && onSelect?.(item)}
            minimumValueToUnlock={minimumValueToUnlock}
          />
        );
      })}
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
};

export default Pyramid;