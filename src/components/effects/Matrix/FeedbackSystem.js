import React from 'react';
import incorrectGif from "../../../assets/images/nu-uh-uh.webp";

const FeedbackSystem = ({
  showIncorrectFeedback,
  showSuccessFeedback,
  failedAttempts
}) => {
  // Calculate exponential growth: 1, 2, 4, 8, 16, etc.
  const getGifCount = (attempts) => {
    if (attempts <= 0) return 0;
    return Math.pow(2, attempts - 1);
  };

  const gifCount = getGifCount(failedAttempts);

  return (
    <>
      {showIncorrectFeedback && (
        <div className="feedback-container-wrapper">
          {Array.from({ length: gifCount }, (_, index) => {
            const uniqueId = `feedback-${failedAttempts}-${index}-${Math.random().toString(36).substr(2, 9)}`;
            return (
              <div
                key={uniqueId}
                className="feedback-container glitch-effect"
                aria-label="Incorrect password feedback"
                style={{
                  position: 'absolute',
                  top: `${20 + (index * 80)}px`,
                  left: `${20 + (index * 60)}px`,
                  zIndex: 1000 + index,
                  transform: `rotate(${index * 3}deg) scale(${Math.max(0.3, 1 - (index * 0.05))})`,
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