import React, { useState, useCallback, useEffect } from 'react';
import FullscreenWrapper from '../FullscreenWrapper.js';
import EmojiSlider from '../emoji/emoji.js';
import './styles.css';

// Constants
const NEEDS_LEVELS = [
  {
    level: 'Self Actualization',
    emoji: '🌟',
    description: 'Reaching your full potential',
    emojis: ['😔', '🤔', '😊', '🌟', '✨'],
  },
  {
    level: 'Growth',
    emoji: '🌱',
    description: 'Learning and development',
    emojis: ['🌱', '🌿', '🌳', '🌲', '🎋'],
  },
  {
    level: 'Esteem',
    emoji: '⭐',
    description: 'Self-worth and confidence',
    emojis: ['😞', '😐', '😊', '😄', '🤩'],
  },
  {
    level: 'Connection',
    emoji: '💝',
    description: 'Relationships and belonging',
    emojis: ['💔', '❤️', '💖', '💝', '💫'],
  },
  {
    level: 'Security',
    emoji: '🛡️',
    description: 'Safety and stability',
    emojis: ['🛡️', '🔒', '🏰', '⚔️', '🔱'],
  },
  {
    level: 'Survival',
    emoji: '🌿',
    description: 'Basic needs and health',
    emojis: ['😫', '😣', '😌', '😊', '��'],
  },
];

// Utility functions
const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// Components
const MilestoneTracker = ({ value, onMilestoneAchieved }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (value >= 100 && !showConfetti) {
      setShowConfetti(true);
      onMilestoneAchieved?.();
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [value, showConfetti, onMilestoneAchieved]);

  return (
    <div className="milestone-tracker">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showConfetti && (
        <div className="confetti">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              style={{
                '--delay': `${Math.random() * 3}s`,
                '--position': `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NeedsAssessment = () => {
  const [levels, setLevels] = useLocalStorage(
    'needs-levels',
    NEEDS_LEVELS.map(level => ({ ...level, value: 0 }))
  );
  const [notes, setNotes] = useLocalStorage('needs-notes', '');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const handleLevelChange = useCallback((index, newValue) => {
    setLevels(prev => prev.map((level, i) =>
      i === index ? { ...level, value: Math.max(0, Math.min(100, newValue)) } : level
    ));
    setLastUpdate(new Date());
  }, [setLevels]);

  const isLevelUnlocked = useCallback((index) => {
    return index === 0 || (levels[index - 1]?.value >= 50);
  }, [levels]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FullscreenWrapper>
      <div className="needs-assessment">
        <header>
          <h2>Daily Needs Check-in</h2>
          {lastUpdate && <span>Last updated: {formatDate(lastUpdate)}</span>}
        </header>

        <div className="needs-grid">
          {levels.map((level, index) => (
            <div
              key={level.level}
              className={`need-card ${isLevelUnlocked(index) ? 'unlocked' : 'locked'}`}
            >
              <h3>
                {level.emoji} {level.level}
                <span className="value">({Math.round(level.value)}%)</span>
              </h3>
              <p>{level.description}</p>
              <EmojiSlider
                emojis={level.emojis}
                onChange={(_, value) => handleLevelChange(index, value)}
                initialValue={level.value}
                disabled={!isLevelUnlocked(index)}
              />
              <MilestoneTracker
                value={level.value}
                onMilestoneAchieved={() => showMessage(`${level.level} milestone achieved! 🎉`)}
              />
              {!isLevelUnlocked(index) && (
                <div className="lock-message">Complete previous level to unlock</div>
              )}
            </div>
          ))}
        </div>

        <div className="notes-section">
          <h3>Reflection Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today? What's contributing to your current state?"
          />
        </div>

        {message && <div className="message">{message}</div>}
      </div>
    </FullscreenWrapper>
  );
};

export default NeedsAssessment; 