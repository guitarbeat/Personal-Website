import React from 'react';
import PropTypes from 'prop-types';

const getEmoji = (value) => {
  const emojis = ['😩', '😟', '😐', '🙂', '😊', '😄', '🤩'];
  const index = Math.floor((value / 100) * (emojis.length - 1));
  return emojis[Math.min(emojis.length - 1, Math.max(0, index))];
};

const PyramidSection = ({ 
  item, 
  index, 
  isHovered, 
  isAvailable, 
  width, 
  onMouseEnter, 
  onMouseLeave, 
  onClick, 
  minimumValueToUnlock 
}) => (
  <div
    className={`needs-pyramid__section ${isHovered ? 'hovered' : ''} ${isAvailable ? 'available' : 'locked'}`}
    style={{
      '--section-width': `${width}%`,
      '--section-color': item.color,
      '--section-index': index,
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={() => isAvailable && onClick()}
    role="button"
    aria-label={`${item.level} level: ${item.width}%`}
    tabIndex={0}
  >
    <div className="needs-pyramid__content">
      <div className="needs-pyramid__label">
        <span className="needs-pyramid__level">{item.level}</span>
        <span className="needs-pyramid__emoji">{getEmoji(item.width)}</span>
        <span className="needs-pyramid__value">{item.width}%</span>
      </div>
      {!isAvailable && (
        <div className="needs-pyramid__lock">
          <i className="fas fa-lock" />
          <span>{minimumValueToUnlock}% required below</span>
        </div>
      )}
    </div>
  </div>
);

export const Pyramid = ({ 
  data, 
  onSectionClick, 
  hoveredLevel, 
  setHoveredLevel, 
  descriptions, 
  minimumValueToUnlock = 15 
}) => {
  const calculateWidth = (index, baseWidth) => {
    const totalLevels = data.length;
    const topWidth = 25; 
    const bottomWidth = 100;
    const flippedIndex = totalLevels - 1 - index;
    const progress = flippedIndex / (totalLevels - 1);
    const exponentialFactor = 0.25; 
    const normalizedProgress = Math.pow(progress, exponentialFactor);
    const baseVisualWidth = bottomWidth - ((bottomWidth - topWidth) * (1 - normalizedProgress));
    
    const scaledWidth = Math.max((baseWidth / 100) * baseVisualWidth, 20); 
    return scaledWidth;
  };

  const isLevelAvailable = (index) => {
    if (index === 0) return true;
    return data[index - 1].width >= minimumValueToUnlock;
  };

  return (
    <div className="needs-pyramid">
      <div className="needs-pyramid__visual">
        {data.map((item, index) => (
          <PyramidSection
            key={item.level}
            item={item}
            index={index}
            isHovered={hoveredLevel === index}
            isAvailable={isLevelAvailable(index)}
            width={calculateWidth(index, item.width)}
            onMouseEnter={() => setHoveredLevel(index)}
            onMouseLeave={() => setHoveredLevel(null)}
            onClick={() => onSectionClick(index)}
            minimumValueToUnlock={minimumValueToUnlock}
          />
        ))}
      </div>
    </div>
  );
};

PyramidSection.propTypes = {
  item: PropTypes.shape({
    level: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isAvailable: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  minimumValueToUnlock: PropTypes.number.isRequired,
};

Pyramid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSectionClick: PropTypes.func.isRequired,
  hoveredLevel: PropTypes.number,
  setHoveredLevel: PropTypes.func.isRequired,
  descriptions: PropTypes.object,
  minimumValueToUnlock: PropTypes.number,
};