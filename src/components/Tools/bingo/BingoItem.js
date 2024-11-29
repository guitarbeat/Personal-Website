import React from 'react';
import PropTypes from 'prop-types';

const BingoItem = ({
  index,
  text,
  description = '',
  category = '',
  checked = false,
  isHovered = false,
  isEditing = false,
  onClick = () => {},
  onDoubleClick = () => {},
  onHover = () => {},
  onEditComplete = () => {},
  editRef
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      onEditComplete(index, e.target.value);
    }
  };

  return (
    <div
      className={`bingo-item ${checked ? 'checked' : ''} ${isHovered ? 'hovered' : ''} category-${category.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={() => onClick(index)}
      onDoubleClick={() => onDoubleClick(index)}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      role="button"
      tabIndex={0}
    >
      <div className="bingo-item-content">
        {isEditing ? (
          <input
            ref={editRef}
            type="text"
            defaultValue={text}
            onKeyDown={handleKeyDown}
            onBlur={(e) => onEditComplete(index, e.target.value)}
            className="bingo-item-input"
            autoFocus
          />
        ) : (
          <>
            <div className="bingo-item-text">{text}</div>
            {description && isHovered && (
              <div className="bingo-item-description">
                {description}
              </div>
            )}
            {category && (
              <div className="bingo-item-category">
                {category}
              </div>
            )}
          </>
        )}
      </div>
      <div className="bingo-item-check">
        {checked ? '✓' : ''}
      </div>
    </div>
  );
};

BingoItem.propTypes = {
  index: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string,
  category: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onEditComplete: PropTypes.func.isRequired,
  editRef: PropTypes.object
};

export default BingoItem;