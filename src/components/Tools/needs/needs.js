// External imports
import React from 'react';

// Internal imports
import { useToolState } from '../hooks/useToolState';
import FullscreenWrapper from '../FullscreenWrapper';

import { Pyramid } from './components/Pyramid';
import { LevelDialog } from './components/LevelDialog';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { LEVELS } from './config';
import './needs.scss';

const NeedsAssessment = () => {
  const { state, updateState } = useToolState({
    selectedLevel: null,
    progress: {},
    settings: {},
    currentView: 'main',
    history: [],
    userName: '',
    hoveredLevel: null,
    levelValues: Array(LEVELS.length).fill(0)
  });

  const handleLevelChange = (index, value) => {
    const newLevelValues = [...state.levelValues];
    newLevelValues[index] = value;
    updateState({ ...state, levelValues: newLevelValues });
  };

  const saveSnapshot = () => {
    const snapshot = {
      userName: state.userName,
      levelValues: state.levelValues
    };
    updateState({ ...state, history: [...state.history, snapshot] });
  };

  const resetData = () => {
    updateState({
      ...state,
      levelValues: Array(LEVELS.length).fill(0),
      history: [],
      userName: ''
    });
  };

  const pyramidData = LEVELS.map((level, index) => ({
    level: level.level,
    description: level.description,
    color: level.color,
    width: state.levelValues[index] || 0,
  }));

  const descriptions = LEVELS.reduce((acc, level) => ({
    ...acc,
    [level.level]: level.description
  }), {});

  const renderView = () => {
    switch (state.currentView) {
      case 'history':
        return (
          <HistoryView 
            history={state.history}
            onBack={() => updateState({ ...state, currentView: 'main' })}
            userName={state.userName}
            levels={LEVELS}
            colors={LEVELS.map(level => level.color)}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            onReset={resetData}
            onBack={() => updateState({ ...state, currentView: 'main' })}
            state={state}
            updateState={updateState}
          />
        );
      default:
        return (
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
                onSectionClick={(index) => updateState({ ...state, selectedLevel: index })}
                hoveredLevel={state.hoveredLevel}
                setHoveredLevel={(level) => updateState({ ...state, hoveredLevel: level })}
                descriptions={descriptions}
              />
            </div>

            <div className="needs-instructions">
              <p>Hover over sections to see descriptions. Click and drag sliders to adjust values.</p>
            </div>

            <div className="needs-navigation">
              <button 
                className="needs-button"
                onClick={() => updateState({ currentView: 'history' })}
              >
                View History
              </button>
              <button 
                className="needs-button"
                onClick={() => updateState({ currentView: 'settings' })}
              >
                Settings
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <FullscreenWrapper>
      <div className="needs-container">
        <LevelDialog
          isOpen={state.selectedLevel !== null}
          onClose={() => updateState({ ...state, selectedLevel: null })}
          level={state.selectedLevel !== null ? LEVELS[state.selectedLevel].level : ''}
          color={state.selectedLevel !== null ? LEVELS[state.selectedLevel].color : ''}
          value={state.selectedLevel !== null ? state.levelValues[state.selectedLevel] : 0}
          onChange={(value) => handleLevelChange(state.selectedLevel, value)}
          description={state.selectedLevel !== null ? LEVELS[state.selectedLevel].description : ''}
        />
        {renderView()}
      </div>
    </FullscreenWrapper>
  );
};

export default NeedsAssessment;