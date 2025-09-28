import React from 'react';

const HintSystem = ({ hintLevel, onHintClick }) => {
  return (
    <button
      type="button"
      className={`matrix-hint-bubble ${hintLevel > 0 ? `level-${hintLevel}` : ""}`}
      onClick={onHintClick}
      onKeyDown={(e) => e.key === "Enter" && onHintClick(e)}
      aria-label="Matrix hints"
    >
      <div className="hint-bubble-parts">
        <div className="bub-part-a" />
        <div className="bub-part-b" />
        <div className="bub-part-c" />
      </div>
      <div className="hint-speech-txt">
        <div
          className={`hint-section initial ${hintLevel >= 0 ? "visible" : ""}`}
        >
          <span className="hint-text">
            Digital whispers echo through the void...
          </span>
          <div className="hint-divider" />
        </div>
        <div
          className={`hint-section first ${hintLevel >= 1 ? "visible" : ""}`}
        >
          <span className="hint-text">
            The key lies in the name that starts with 'A',
            <br />
            The first letter of my identity.
          </span>
          <div className="hint-divider" />
        </div>
        <div
          className={`hint-section second ${hintLevel >= 2 ? "visible" : ""}`}
        >
          <span className="hint-text">
            Think of the name that begins my story,
            <br />
            The word that unlocks this digital glory.
          </span>
        </div>
        {hintLevel < 2 && (
          <div className="hint-prompt">
            {hintLevel === 0
              ? "Click for more..."
              : "One more secret remains..."}
          </div>
        )}
      </div>
      <div className="hint-speech-arrow">
        <div className="arrow-w" />
        <div className="arrow-x" />
        <div className="arrow-y" />
        <div className="arrow-z" />
      </div>
    </button>
  );
};

export default HintSystem;