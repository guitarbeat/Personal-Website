import React from 'react';
import incorrectGif from "../../../assets/images/nu-uh-uh.webp";

const FeedbackSystem = ({ 
  showIncorrectFeedback, 
  showSuccessFeedback, 
  failedAttempts 
}) => {
  return (
    <>
      {showIncorrectFeedback && (
        <div className="feedback-container-wrapper">
          {Array.from({ length: Math.max(1, failedAttempts) }, (_, index) => {
            const uniqueId = `feedback-${failedAttempts}-${index}-${Math.random().toString(36).substr(2, 9)}`;
            return (
              <div
                key={uniqueId}
                className="feedback-container glitch-effect"
                aria-label="Incorrect password feedback"
                style={{
                  position: 'absolute',
                  top: `${20 + (index * 100)}px`,
                  left: `${20 + (index * 50)}px`,
                  zIndex: 1000 + index,
                  transform: `rotate(${index * 5}deg) scale(${1 - (index * 0.1)})`,
                  pointerEvents: 'none', // Prevent clicking to dismiss
                }}
              >
                <img
                  src={incorrectGif}
                  alt="Incorrect password"
                  className="incorrect-gif"
                />
                <div className="feedback-hint">Enter the correct password to stop this</div>
              </div>
            );
          })}
        </div>
      )}

      {showSuccessFeedback && (
        <div className="success-message">
          <span className="success-text">Access Granted</span>
        </div>
      )}
    </>
  );
};

export default FeedbackSystem;