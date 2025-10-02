import React, { useState, useRef, useEffect } from 'react';
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
  
  // State to track positions of each gif
  const [positions, setPositions] = useState({});
  const dragState = useRef({});

  // Reset positions when gifCount changes
  useEffect(() => {
    setPositions({});
  }, [gifCount]);

  const handleMouseDown = (index, e) => {
    e.preventDefault();
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    dragState.current[index] = {
      isDragging: true,
      startX: clientX - rect.left,
      startY: clientY - rect.top,
      currentX: rect.left,
      currentY: rect.top
    };
    
    const handleMouseMove = (moveEvent) => {
      if (dragState.current[index]?.isDragging) {
        const moveClientX = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const moveClientY = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientY : moveEvent.clientY;
        
        const newX = moveClientX - dragState.current[index].startX;
        const newY = moveClientY - dragState.current[index].startY;
        
        setPositions(prev => ({
          ...prev,
          [index]: { x: newX, y: newY }
        }));
      }
    };
    
    const handleMouseUp = () => {
      if (dragState.current[index]) {
        dragState.current[index].isDragging = false;
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  return (
    <>
      {showIncorrectFeedback && (
        <div className="feedback-container-wrapper">
          {Array.from({ length: gifCount }, (_, index) => {
            const uniqueId = `feedback-${failedAttempts}-${index}-${Math.random().toString(36).substr(2, 9)}`;
            const position = positions[index] || { x: 20 + (index * 60), y: 20 + (index * 80) };
            
            return (
              <div
                key={uniqueId}
                className="feedback-container glitch-effect"
                aria-label="Incorrect password feedback"
                onMouseDown={(e) => handleMouseDown(index, e)}
                onTouchStart={(e) => handleMouseDown(index, e)}
                style={{
                  position: 'fixed',
                  top: `${position.y}px`,
                  left: `${position.x}px`,
                  zIndex: 1000 + index,
                  transform: `rotate(${index * 3}deg) scale(${Math.max(0.3, 1 - (index * 0.05))})`,
                  cursor: 'grab',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              >
                <img
                  src={incorrectGif}
                  alt="Incorrect password"
                  className="incorrect-gif"
                  draggable="false"
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