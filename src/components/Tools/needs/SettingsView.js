import React from 'react';
import PropTypes from 'prop-types';

export const SettingsView = ({ onReset, onBack, state, updateState }) => {
  const exportData = () => {
    const data = JSON.stringify({
      levelValues: state.levelValues,
      history: state.history,
      userName: state.userName
    });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `needs-pyramid-${state.userName}-${new Date().toISOString()}.json`;
    a.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        updateState(data);
      } catch (error) {
        console.error('Failed to import data:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="needs-settings">
      <h2 className="needs-settings__title">Settings</h2>
      
      <div className="needs-settings__content">
        <button 
          className="needs-button needs-button--danger"
          onClick={onReset}
        >
          Reset All Data
        </button>

        <button 
          className="needs-button"
          onClick={exportData}
        >
          Export Data
        </button>

        <input
          type="file"
          id="import-data"
          accept=".json"
          onChange={importData}
          style={{ display: 'none' }}
        />
        <button 
          className="needs-button"
          onClick={() => {
            const importInput = document.getElementById('import-data');
            if (importInput) {
              importInput.click();
            } else {
              console.warn('Import input element not found');
            }
          }}
        >
          Import Data
        </button>
        
        <button 
          className="needs-button"
          onClick={onBack}
        >
          Back to Pyramid
        </button>
      </div>
    </div>
  );
};

SettingsView.propTypes = {
  onReset: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired
};

export default SettingsView; 