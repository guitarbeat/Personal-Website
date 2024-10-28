import React from 'react';
import PropTypes from 'prop-types';

const BingoItem = ({
  item,
  index,
  isChecked,
  isEditing,
  isHovered,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  onEdit,
  onBlur
}) => (
  <div
    className={`bingo-card__item ${isChecked ? 'checked' : ''} ${isEditing ? 'edit-mode' : ''}`}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    role="checkbox"
    aria-checked={isChecked}
    aria-label={`Bingo item: ${item.Goal}`}
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    }}
  >
    {isEditing ? (
      <input
        className="editable-input"
        type="text"
        value={item.Goal}
        onChange={(e) => onEdit('Goal', e.target.value)}
        onBlur={onBlur}
        aria-label="Edit goal"
      />
    ) : (
      <div className="bingo-card__goal">{item.Goal}</div>
    )}
    {isHovered && (
      isEditing ? (
        <textarea
          className="editable-textarea"
          value={item.Description}
          onChange={(e) => onEdit('Description', e.target.value)}
          onBlur={onBlur}
          aria-label="Edit description"
        />
      ) : (
        <div className="bingo-card__description">{item.Description}</div>
      )
    )}
  </div>
);

BingoItem.propTypes = {
  item: PropTypes.shape({
    Goal: PropTypes.string,
    Description: PropTypes.string,
    Check: PropTypes.bool,
    ID: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
  isChecked: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};

export default BingoItem; 