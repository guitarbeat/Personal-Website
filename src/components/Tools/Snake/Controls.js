import React, { memo } from "react";

const Controls = memo(({ onDirectionChange, isMobile }) => {
  if (!isMobile) {
    return null; // Only show controls on mobile
  }

  const handleButtonPress = (direction) => {
    onDirectionChange(direction);
  };

  return (
    <div className="controls">
      <div className="control-row">
        <button 
          onClick={() => handleButtonPress('up')}
          aria-label="Move Up"
        >
          ↑
        </button>
      </div>
      <div className="control-row">
        <button
          type="button"
          onClick={() => handleButtonPress('left')}
          aria-label="Move Left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => handleButtonPress('down')}
          aria-label="Move Down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => handleButtonPress('right')}
          aria-label="Move Right"
        >
          →
        </button>
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';

export default Controls; 