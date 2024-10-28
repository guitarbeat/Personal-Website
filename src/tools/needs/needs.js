import React, { useMemo, useEffect } from 'react';
import MagicComponent from '../../Moiree';
import { Pyramid } from './components/Pyramid';
import { LevelDialog } from './components/LevelDialog';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { LEVELS } from './config';
import { usePyramidState } from './hooks/usePyramidState';
import './needs.scss';

const Needs = () => {
  const {
    state,
    updateState,
    saveSnapshot,
    resetData,
    handleLevelChange
  } = usePyramidState();

  useEffect(() => {
    const createElementIfNotExists = (id) => {
      if (!document.getElementById(id)) {
        const element = document.createElement('div');
        element.id = id;
        document.body.insertBefore(element, document.body.firstChild);
      }
    };

    createElementIfNotExists('header');
    createElementIfNotExists('back-to-the-top');

    return () => {
      ['header', 'back-to-the-top'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.remove();
        }
      });
    };
  }, []);

  const pyramidData = useMemo(() => 
    LEVELS.map((level, index) => ({
      ...level,
      width: state.levelValues[index],
    }))
  , [state.levelValues]);

  const descriptions = useMemo(() => 
    LEVELS.reduce((acc, level) => ({
      ...acc,
      [level.level]: level.description
    }), {}),
    []
  );

  const renderView = () => {
    switch (state.currentView) {
      case 'history':
        return (
          <HistoryView 
            history={state.history}
            userName={state.userName}
            onBack={() => updateState({ currentView: 'main' })}
            levels={LEVELS}
            colors={LEVELS.map(level => level.color)}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            onReset={resetData}
            onBack={() => updateState({ currentView: 'main' })}
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
                onSectionClick={handleLevelChange}
                hoveredLevel={state.hoveredLevel}
                setHoveredLevel={(level) => updateState({ hoveredLevel: level })}
                descriptions={descriptions}
                minimumValueToUnlock={15}
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
    <div className="container">
      <div className="container__content">
        <div className="needs-container">
          <MagicComponent />
          <h1 className="needs-title">Needs Pyramid</h1>
          
          <div className="needs-card">
            {renderView()}
          </div>

          <LevelDialog
            isOpen={state.selectedLevel !== null}
            onClose={() => updateState({ selectedLevel: null })}
            level={state.selectedLevel !== null ? LEVELS[state.selectedLevel].level : ''}
            color={state.selectedLevel !== null ? LEVELS[state.selectedLevel].color : ''}
            value={state.selectedLevel !== null ? state.levelValues[state.selectedLevel] : 0}
            onChange={(value) => handleLevelChange(state.selectedLevel, value)}
            description={state.selectedLevel !== null ? LEVELS[state.selectedLevel].description : ''}
          />
        </div>
      </div>
    </div>
  );
};

export default Needs; 