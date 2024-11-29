import React from 'react';
import PropTypes from 'prop-types';

import { Pyramid } from './Pyramid';

export const MainView = ({ 
  pyramidData,
  descriptions,
  onSectionClick,
  hoveredLevel,
  setHoveredLevel,
  userName,
  onUserNameChange,
  saveSnapshot,
  onHistoryClick,
  onSettingsClick
}) => (
  <div className="needs-main">
    <div className="needs-controls">
      <input
        type="text"
        placeholder="Enter your name"
        value={userName || ''}
        onChange={onUserNameChange}
        className="needs-input"
      />
      <button onClick={saveSnapshot} className="needs-button">
        Save Snapshot
      </button>
      <button onClick={onHistoryClick} className="needs-button">
        View History
      </button>
      <button onClick={onSettingsClick} className="needs-button">
        Settings
      </button>
    </div>
    <Pyramid
      data={pyramidData}
      descriptions={descriptions}
      onSectionClick={onSectionClick}
      hoveredLevel={hoveredLevel}
      setHoveredLevel={setHoveredLevel}
    />
  </div>
);

MainView.propTypes = {
  pyramidData: PropTypes.array.isRequired,
  descriptions: PropTypes.object,
  onSectionClick: PropTypes.func.isRequired,
  hoveredLevel: PropTypes.number,
  setHoveredLevel: PropTypes.func.isRequired,
  userName: PropTypes.string,
  onUserNameChange: PropTypes.func.isRequired,
  saveSnapshot: PropTypes.func.isRequired,
  onHistoryClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired
};