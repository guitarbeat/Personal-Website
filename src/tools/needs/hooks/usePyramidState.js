import { useCallback } from 'react';
import { useLocalStorage } from '../utils/storage';
import { LEVELS } from '../config';
import { INITIAL_STATE } from '../constants';

export const usePyramidState = () => {
  // This hook uses localStorage to persist data
  const [state, setState] = useLocalStorage('needsPyramidState', {
    ...INITIAL_STATE,
    levelValues: LEVELS.map(() => 0)
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  }, [setState]);

  const saveSnapshot = useCallback(() => {
    if (!state.userName.trim()) {
      return;
    }

    const newSnapshot = {
      date: new Date().toISOString(),
      values: [...state.levelValues],
      userName: state.userName
    };

    // Add the new snapshot to history
    const updatedHistory = [...(state.history || []), newSnapshot];
    
    // Keep only the last 50 snapshots to prevent localStorage from getting too big
    const trimmedHistory = updatedHistory.slice(-50);

    updateState({ 
      history: trimmedHistory,
      currentView: 'history' // Automatically show history after saving
    });

    // Return true if save was successful
    return true;
  }, [state.levelValues, state.userName, state.history, updateState]);

  const resetData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setState({
        ...INITIAL_STATE,
        levelValues: LEVELS.map(() => 0)
      });
      return true;
    }
    return false;
  }, [setState]);

  const handleLevelChange = useCallback((index, value) => {
    if (index < 0 || index >= LEVELS.length) {
      return;
    }

    updateState({
      levelValues: state.levelValues.map((v, i) => {
        if (i === index) {
          return Math.max(0, Math.min(100, value)); // Clamp between 0 and 100
        }
        return v;
      })
    });
  }, [state.levelValues, updateState]);

  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify({
        levelValues: state.levelValues,
        history: state.history,
        userName: state.userName
      });
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `needs-pyramid-${state.userName}-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      return false;
    }
    return true;
  }, [state]);

  const importData = useCallback((jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.levelValues || !Array.isArray(data.levelValues)) {
        throw new Error('Invalid data format');
      }
      updateState({
        levelValues: data.levelValues,
        history: data.history || [],
        userName: data.userName || ''
      });
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }, [updateState]);

  return {
    state,
    updateState,
    saveSnapshot,
    resetData,
    handleLevelChange,
    exportData,
    importData
  };
}; 