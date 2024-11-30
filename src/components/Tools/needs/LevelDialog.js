import React from 'react';
import PropTypes from 'prop-types';

export const LevelDialog = ({ 
  isOpen, 
  onClose, 
  level, 
  color, 
  value, 
  onChange, 
  description 
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="needs-dialog-overlay" onClick={onClose}>
      <div 
        className="needs-dialog" 
        onClick={e => e.stopPropagation()}
        style={{ '--dialog-color': color }}
      >
        <h2 className="needs-dialog__title">{level}</h2>
        <p className="needs-dialog__description">{description}</p>
        
        <div className="needs-dialog__slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="needs-dialog__slider"
          />
          <span className="needs-dialog__value">{value}%</span>
        </div>

        <button className="needs-dialog__close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

LevelDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired
}; 