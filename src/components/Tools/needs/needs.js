import React, { useState, useCallback } from 'react';
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

const NeedsAssessment = () => {
  const [userName, setUserName] = useLocalStorage('needs-username', '');
  const [levels, setLevels] = useState(NEEDS_LEVELS.map(level => ({
    ...level,
    value: level.baseValue,
    notes: ''
  })));
  const [history, setHistory] = useLocalStorage('needs-history', []);
  const [activeTab, setActiveTab] = useState('assessment');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Show notification helper
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  }, []);

  // Handle level value change
  const handleLevelChange = useCallback((index, newValue) => {
    setLevels(prev => prev.map((level, i) => 
      i === index ? { ...level, value: Math.max(0, Math.min(100, newValue)) } : level
    ));
  }, []);

  // Handle notes change
  const handleNotesChange = useCallback((index, notes) => {
    setLevels(prev => prev.map((level, i) => 
      i === index ? { ...level, notes } : level
    ));
  }, []);

  // Save progress
  const handleSave = useCallback(() => {
    if (!userName.trim()) {
      showNotification('Please enter your name', 'error');
      return;
    }

    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userName,
      levels: [...levels]
    };

    setHistory(prev => [newEntry, ...prev]);
    showNotification('Progress saved successfully!', 'success');
  }, [userName, levels, setHistory, showNotification]);

  // Export data
  const handleExport = useCallback(() => {
    const data = {
      userName,
      history,
      currentAssessment: levels
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `needs-assessment-${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
  }, [userName, history, levels, showNotification]);

  // Delete history entry
  const handleDeleteEntry = useCallback((entryId) => {
    setHistory(prev => prev.filter(entry => entry.id !== entryId));
    showNotification('Entry deleted', 'info');
  }, [setHistory, showNotification]);

  return (
    <FullscreenWrapper>
      <div className="needs-tool">
        <div className="header">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="name-input"
            />
            <div className="button-group">
              <button onClick={handleSave} className="primary">Save</button>
              <button onClick={handleExport}>Export</button>
              <button 
                onClick={() => setActiveTab(activeTab === 'assessment' ? 'history' : 'assessment')}
                className={activeTab === 'history' ? 'active' : ''}
              >
                {activeTab === 'assessment' ? 'View History' : 'Current Assessment'}
              </button>
            </div>
          </div>
        </div>

        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        {activeTab === 'history' ? (
          <div className="history-view">
            {history.length === 0 ? (
              <div className="empty-state">
                <p>No assessment history yet. Save your first assessment to see it here!</p>
              </div>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="history-entry">
                  <div className="history-header">
                    <span className="user">{entry.userName}</span>
                    <span className="date">{formatDate(entry.timestamp)}</span>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteEntry(entry.id)}
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                  <div className="levels-grid">
                    {entry.levels.map((level, index) => (
                      <div key={index} className="level-item">
                        <div className="level-header">
                          <span>{level.emoji}</span>
                          <span>{level.level}</span>
                        </div>
                        <EmojiSlider
                          value={level.value}
                          onChange={() => {}}
                          emojis={getEmojisForLevel(level.level)}
                          showValue={true}
                        />
                        {level.notes && (
                          <p className="notes">{level.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="assessment-view">
            <div className="levels-grid">
              {levels.map((level, index) => (
                <div key={index} className="level-item">
                  <div className="level-header">
                    <span>{level.emoji}</span>
                    <span>{level.level}</span>
                  </div>
                  <EmojiSlider
                    value={level.value}
                    onChange={(newValue) => handleLevelChange(index, newValue)}
                    emojis={getEmojisForLevel(level.level)}
                    showValue={true}
                  />
                  <textarea
                    placeholder="Add notes..."
                    value={level.notes}
                    onChange={(e) => handleNotesChange(index, e.target.value)}
                    className="notes-input"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FullscreenWrapper>
  );
};

export default NeedsAssessment;