import React, { useState, useCallback, useEffect } from 'react';
import FullscreenWrapper from '../FullscreenWrapper';
import { useLocalStorage } from './utils/storage';
import { NEEDS_LEVELS } from './constants';
import { formatDate } from './utils/dateUtils';
import EmojiSlider from '../emoji/emoji';
import MilestoneTracker from './MilestoneTracker';
import './needs.scss';

const getEmojisForLevel = (level) => {
  switch (level) {
    case 'Self Actualization':
      return ['😔', '🤔', '😊', '🌟', '✨'];
    case 'Growth':
      return ['🌱', '🌿', '🌳', '🌲', '🎋'];
    case 'Esteem':
      return ['😞', '😐', '😊', '😄', '🤩'];
    case 'Connection':
      return ['💔', '❤️', '💖', '💝', '💫'];
    case 'Security':
      return ['🛡️', '🔒', '🏰', '⚔️', '🔱'];
    case 'Survival':
      return ['😫', '😣', '😌', '😊', '😎'];
    default:
      return ['😔', '😐', '🙂', '😊', '😄'];
  }
};

const GrowthProgress = ({ value, onChange, notes, onNotesChange }) => {
  const handleSliderChange = (emoji, progress) => {
    onChange(progress);
  };

  return (
    <div className="growth-progress">
      <h3>Growth Progress</h3>
      <EmojiSlider 
        emojis={getEmojisForLevel('Growth')}
        onChange={handleSliderChange}
        initialValue={value}
      />
      <MilestoneTracker 
        currentLevel={value} 
        onMilestoneAchieved={() => console.log('Growth milestone achieved!')}
      />
      <textarea
        className="notes-input"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Reflect on your growth journey..."
        aria-label="Growth progress notes"
      />
    </div>
  );
};

const NeedsAssessment = () => {
  const [levels, setLevels] = useLocalStorage('needs-levels', NEEDS_LEVELS);
  const [growthNotes, setGrowthNotes] = useLocalStorage('growth-notes', '');
  const [growthValue, setGrowthValue] = useLocalStorage('growth-value', 0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const AUTO_SAVE_INTERVAL = 30000;
  const MINIMUM_VALUE_TO_UNLOCK = 50;

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  }, []);

  const handleSave = useCallback(() => {
    const timestamp = new Date();
    try {
      setLastUpdate(timestamp);
      showNotification('Progress saved successfully', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showNotification('Failed to save progress', 'error');
    }
  }, [showNotification]);

  useEffect(() => {
    const autoSaveInterval = setInterval(handleSave, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveInterval);
  }, [handleSave]);

  const handleLevelChange = useCallback((index, newValue) => {
    setLevels(prev => prev.map((level, i) => 
      i === index ? { ...level, value: Math.max(0, Math.min(100, newValue)) } : level
    ));
  }, [setLevels]);

  const renderPyramidSection = useCallback((level, index) => {
    const isAvailable = index === 0 || (levels[index - 1]?.value >= MINIMUM_VALUE_TO_UNLOCK);
    
    return (
      <div 
        key={level.level}
        className={`pyramid-section ${isAvailable ? 'available' : 'locked'}`}
        style={{
          '--delay': `${index * 0.1}s`,
          '--level-index': index
        }}
      >
        <h3>{level.level}</h3>
        <EmojiSlider
          emojis={getEmojisForLevel(level.level)}
          onChange={(_, progress) => handleLevelChange(index, progress)}
          initialValue={level.value}
          disabled={!isAvailable}
        />
        <MilestoneTracker 
          currentLevel={level.value} 
          onMilestoneAchieved={() => 
            showNotification(`${level.level} milestone achieved! 🎉`, 'success')
          }
        />
      </div>
    );
  }, [levels, handleLevelChange, showNotification]);

  return (
    <FullscreenWrapper>
      <div className="needs-tool">
        <header className="header">
          <h2>Personal Growth Tracker</h2>
          {lastUpdate && (
            <span className="last-update">
              Last updated: {formatDate(lastUpdate)}
            </span>
          )}
        </header>

        <div className="pyramid-container">
          {levels.map((level, index) => renderPyramidSection(level, index))}
        </div>

        <GrowthProgress
          value={growthValue}
          onChange={setGrowthValue}
          notes={growthNotes}
          onNotesChange={setGrowthNotes}
        />

        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    </FullscreenWrapper>
  );
};

export default NeedsAssessment;