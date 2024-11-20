import React from 'react';
import PropTypes from 'prop-types';

import { VIEWS } from '../constants';

import { Pyramid } from './Pyramid';

export const MainView = ({ 
  state, 
  updateState, 
  saveSnapshot, 
  handleLevelChange, 
  pyramidData, 
  descriptions 
}) => (
  <div className="needs-main">
    <div className="needs-controls">
      <input
        type="text"
        placeholder="Enter your name"
        value={state.userName}
        onChange={(e) => updateState({ userName: e.target.value })}
        className="needs-input"
      />
      <button 
        className="needs-button"
        onClick={saveSnapshot}
        disabled={!state.userName.trim()}
      >
        Save Snapshot
      </button>
    </div>

    <div className="needs-content">
      <Pyramid
        data={pyramidData}
        onSectionClick={handleLevelChange}
        hoveredLevel={state.hoveredLevel}
        setHoveredLevel={(level) => updateState({ hoveredLevel: level })}
        descriptions={descriptions}
      />
    </div>

    <div className="needs-instructions">
      <p>Hover over sections to see descriptions. Click and drag sliders to adjust values.</p>
    </div>

    <div className="needs-navigation">
      <button 
        className="needs-button"
        onClick={() => updateState({ currentView: VIEWS.HISTORY })}
      >
        View History
      </button>
      <button 
        className="needs-button"
        onClick={() => updateState({ currentView: VIEWS.SETTINGS })}
      >
        Settings
      </button>
    </div>
  </div>
);

MainView.propTypes = {
  state: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  saveSnapshot: PropTypes.func.isRequired,
  handleLevelChange: PropTypes.func.isRequired,
  pyramidData: PropTypes.array.isRequired,
  descriptions: PropTypes.object.isRequired
}; 