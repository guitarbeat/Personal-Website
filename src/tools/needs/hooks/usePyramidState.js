import { useCallback, useState } from 'react';
import { useLocalStorage } from '../utils/storage';
import { LEVELS } from '../config';

export const usePyramidState = () => {
  const [state, setState] = useLocalStorage('needsPyramidState', {
    levelValues: LEVELS.map(() => 0),
    selectedLevel: null,
    history: [],
    userName: '',
    hoveredLevel: null,
    currentView: 'main',
  });

  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, [setState]);

  const MINIMUM_VALUE_TO_UNLOCK = 15;

  const isLevelAvailable = useCallback((index) => {
    if (index === 0) return true; // Survival is always available
    return state.levelValues[index - 1] >= MINIMUM_VALUE_TO_UNLOCK;
  }, [state.levelValues]);

  const getMaxAllowedValue = useCallback((index) => {
    // For the first level (Survival), there's no cap
    if (index === 0) return 100;
    // For other levels, can't exceed the value of the level below it
    return state.levelValues[index - 1];
  }, [state.levelValues]);

  const handleLevelChange = useCallback((index, value) => {
    const available = isLevelAvailable(index);
    if (!available) return;

    const maxAllowed = getMaxAllowedValue(index);
    const cappedValue = Math.min(value, maxAllowed);

    updateState({
      levelValues: state.levelValues.map((v, i) => {
        if (i === index) {
          return cappedValue;
        }
        // Make the dependency less strict - allow 15% above parent level
        if (i > index && v > cappedValue + 15) {
          return cappedValue + 15;
        }
        return v;
      })
    });
  }, [state.levelValues, updateState, isLevelAvailable, getMaxAllowedValue]);

  const saveSnapshot = useCallback(() => {
    const newSnapshot = {
      date: new Date().toISOString(),
      values: [...state.levelValues],
      userName: state.userName
    };
    updateState({ history: [...state.history, newSnapshot] });
  }, [state.levelValues, state.userName, state.history, updateState]);

  const resetData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setState({
        levelValues: LEVELS.map(() => 0),
        selectedLevel: null,
        history: [],
        userName: '',
        hoveredLevel: null,
        currentView: 'main',
      });
    }
  }, [setState]);

  const pushToHistory = (values) => {
    const newHistory = [...history.slice(0, currentIndex + 1), values];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      updateState({ levelValues: history[currentIndex - 1] });
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      updateState({ levelValues: history[currentIndex + 1] });
    }
  };

  return {
    state,
    updateState,
    saveSnapshot,
    resetData,
    handleLevelChange,
    isLevelAvailable,
    getMaxAllowedValue,
    pushToHistory,
    undo,
    redo
  };
}; 