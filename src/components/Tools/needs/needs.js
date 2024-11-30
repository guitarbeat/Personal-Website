import React, { useState } from 'react';
import FullscreenWrapper from '../FullscreenWrapper';
import './needs.scss';

// Configuration
const LEVELS = [
  {
    level: 'Self Actualization',
    emoji: '😩',
    baseValue: 0
  },
  {
    level: 'Growth',
    emoji: '😊',
    baseValue: 80
  },
  {
    level: 'Esteem',
    emoji: '🙂',
    baseValue: 67
  },
  {
    level: 'Connection',
    emoji: '😟',
    baseValue: 0
  },
  {
    level: 'Security',
    emoji: '😩',
    baseValue: 0
  },
  {
    level: 'Survival',
    emoji: '😄',
    baseValue: 100
  }
];

// Utilities
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

const NeedsAssessment = () => {
  const [userName, setUserName] = useState('');
  const [levels, setLevels] = useState(LEVELS.map(level => ({
    ...level,
    value: level.baseValue
  })));
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSave = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    const newEntry = {
      timestamp: new Date().toISOString(),
      userName,
      levels: [...levels]
    };

    setHistory(prev => [newEntry, ...prev]);
    alert('Progress saved!');
  };

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
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowHistory(!showHistory)}>History</button>
          </div>
        </div>
        
        {showHistory ? (
          <div className="history-view">
            {history.map((entry, index) => (
              <div key={index} className="history-entry">
                <div className="history-header">
                  <span>{entry.userName}</span>
                  <span>{formatDate(entry.timestamp)}</span>
                </div>
                <div className="history-levels">
                  {entry.levels.map((level, idx) => (
                    <div key={idx} className="history-level">
                      <span>{level.level}</span>
                      <span>{level.emoji}{level.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="levels-list">
            {levels.map((level, index) => (
              <div key={index} className="level-item">
                <span>{level.level}{level.emoji}{level.value}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FullscreenWrapper>
  );
};

export default NeedsAssessment;