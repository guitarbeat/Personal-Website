import React, { useState, useCallback, useEffect } from 'react';
import FullscreenWrapper from '../FullscreenWrapper';
import { useLocalStorage } from './utils/storage';
import { NEEDS_LEVELS } from './constants';
import { formatDate } from './utils/dateUtils';
import EmojiSlider from '../emoji/emoji';
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
  const growthEmojis = ['🌱', '🌿', '🌳', '🌲', '🎋'];
  
  const handleSliderChange = (emoji, progress) => {
    onChange(progress);
  };

  return (
    <div className="growth-progress">
      <h3>Growth</h3>
      <EmojiSlider 
        emojis={growthEmojis}
        onChange={handleSliderChange}
        initialValue={value}
      />
      <textarea
        className="notes-input"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add notes..."
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

  const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  const MINIMUM_VALUE_TO_UNLOCK = 50;

  // Show notification helper with animation
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  }, []);

  // Handle save with proper dependencies
  const handleSave = useCallback(() => {
    const timestamp = new Date();
    
    try {
      localStorage.setItem('levels', JSON.stringify(levels));
      setLastUpdate(timestamp);
      showNotification('Progress saved successfully', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showNotification('Failed to save progress', 'error');
    }
  }, [levels, showNotification, setLevels]);

  // Auto-save effect
  useEffect(() => {
    const autoSaveInterval = setInterval(handleSave, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveInterval);
  }, [handleSave]);

  // Handle level value change with smooth animation
  const handleLevelChange = useCallback((index, newValue) => {
    setLevels(prev => prev.map((level, i) => 
      i === index ? { ...level, value: Math.max(0, Math.min(100, newValue)) } : level
    ));
  }, []);

  // Enhanced pyramid section with animations
  const renderPyramidSection = useCallback((level, index) => {
    const isAvailable = index === 0 || (levels[index - 1]?.value >= MINIMUM_VALUE_TO_UNLOCK);
    
    return (
      <div 
        className={`pyramid-section ${isAvailable ? 'available' : 'locked'}`}
        style={{
          '--delay': `${index * 0.1}s`,
          animation: 'scaleIn 0.5s ease-out forwards',
          animationDelay: `${index * 0.1}s`
        }}
      >
        <h3>{level.level}</h3>
        <EmojiSlider
          emojis={getEmojisForLevel(level.level)}
          onChange={(_, progress) => handleLevelChange(index, progress)}
          initialValue={level.value}
          disabled={!isAvailable}
        />
      </div>
    );
  }, [levels, handleLevelChange]);

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
          onNotesChange={(notes) => {
            setGrowthNotes(notes);
          }}
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