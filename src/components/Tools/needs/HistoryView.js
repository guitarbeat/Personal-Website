import React from 'react';
import PropTypes from 'prop-types';

export const HistoryView = ({ history = [], userName, onBack, levels, colors }) => {
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

  if (!history || history.length === 0) {
    return (
      <div className="needs-history needs-history--empty">
        <h2 className="needs-history__title">No History Available</h2>
        <p>Save your first snapshot to see it here!</p>
        <button className="needs-button" onClick={onBack}>
          Back to Pyramid
        </button>
      </div>
    );
  }

  return (
    <div className="needs-history">
      <h2 className="needs-history__title">History for {userName || 'Anonymous'}</h2>
      
      <div className="needs-history__list">
        {history.map((snapshot, index) => (
          <div key={`${snapshot.date}-${index}`} className="needs-history__item">
            <div className="needs-history__date">
              {formatDate(snapshot.date)}
            </div>
            <div className="needs-history__values">
              {snapshot.values.map((value, levelIndex) => (
                <div 
                  key={levelIndex}
                  className="needs-history__value"
                  style={{ 
                    '--value-color': colors[levelIndex] || '#ccc',
                    '--value-width': `${Math.min(100, Math.max(0, value))}%`
                  }}
                >
                  <span className="needs-history__label">
                    {levels[levelIndex]?.level || `Level ${levelIndex + 1}`}: {value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )).reverse()} {/* Show newest first */}
      </div>

      <button className="needs-button" onClick={onBack}>
        Back to Pyramid
      </button>
    </div>
  );
};

HistoryView.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.number).isRequired,
      userName: PropTypes.string
    })
  ),
  userName: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  levels: PropTypes.array.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default HistoryView; 