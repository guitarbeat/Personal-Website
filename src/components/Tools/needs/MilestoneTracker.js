import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './MilestoneTracker.scss';

const MilestoneTracker = ({ currentLevel, onMilestoneAchieved }) => {
  // Memoize the milestone achievement callback
  const achievedMilestone = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Call the milestone achievement callback when level changes
  useEffect(() => {
    if (currentLevel >= 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentLevel, achievedMilestone, onMilestoneAchieved]);

  return (
    <div className="milestone-tracker">
      <div className="milestone-progress">
        <div 
          className="milestone-fill" 
          style={{ width: `${currentLevel}%` }} 
        />
      </div>
    </div>
  );
};

MilestoneTracker.propTypes = {
  currentLevel: PropTypes.number,
  onMilestoneAchieved: PropTypes.func,
};

export default MilestoneTracker;
