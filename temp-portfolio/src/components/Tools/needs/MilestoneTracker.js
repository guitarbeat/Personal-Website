import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './MilestoneTracker.scss';

const MilestoneTracker = ({ currentLevel, onMilestoneAchieved }) => {
  const [hasAchievedMilestone, setHasAchievedMilestone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (currentLevel >= 100 && !hasAchievedMilestone) {
      setHasAchievedMilestone(true);
      setShowConfetti(true);
      onMilestoneAchieved?.();
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (currentLevel < 100 && hasAchievedMilestone) {
      setHasAchievedMilestone(false);
    }
  }, [currentLevel, hasAchievedMilestone, onMilestoneAchieved]);

  return (
    <div className="milestone-tracker">
      <div className="milestone-progress">
        <div 
          className="milestone-fill" 
          style={{ 
            width: `${Math.min(100, Math.max(0, currentLevel))}%`,
            transition: 'width 0.3s ease-out'
          }} 
        />
      </div>
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                '--delay': `${Math.random() * 3}s`,
                '--rotation': `${Math.random() * 360}deg`,
                '--position': `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

MilestoneTracker.propTypes = {
  currentLevel: PropTypes.number,
  onMilestoneAchieved: PropTypes.func,
};

MilestoneTracker.defaultProps = {
  currentLevel: 0,
  onMilestoneAchieved: () => {},
};

export default MilestoneTracker;
