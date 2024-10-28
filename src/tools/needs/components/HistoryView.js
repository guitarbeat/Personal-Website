import React from 'react';
import PropTypes from 'prop-types';

export const HistoryView = ({ history, userName, onBack, levels, colors }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="needs-history">
      <h2 className="needs-history__title">History for {userName || 'Anonymous'}</h2>
      
      <div className="needs-history__list">
        {history.map((snapshot, index) => (
          <div key={snapshot.date} className="needs-history__item">
            <div className="needs-history__date">
              {formatDate(snapshot.date)}
            </div>
            <div className="needs-history__values">
              {snapshot.values.map((value, levelIndex) => (
                <div 
                  key={levelIndex}
                  className="needs-history__value"
                  style={{ 
                    '--value-color': colors[levelIndex],
                    '--value-width': `${value}%`
                  }}
                >
                  <span className="needs-history__label">
                    {levels[levelIndex]}: {value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
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
  ).isRequired,
  userName: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  levels: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default HistoryView; 