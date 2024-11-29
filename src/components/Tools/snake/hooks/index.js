import { useState, useCallback } from 'react';

/**
 * Custom hook for managing game state
 * @returns {Object} Game state and update function
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState({
    status: 'initializing',
    score: 0,
    highScore: typeof window !== 'undefined' ? 
      localStorage.getItem('snakeHighScore') || 0 : 0,
    error: null
  });

  const updateGameState = useCallback((update) => {
    setGameState(prevState => {
      const newState = { ...prevState, ...update };
      
      if (typeof window !== 'undefined' && newState.score > newState.highScore) {
        newState.highScore = newState.score;
        localStorage.setItem('snakeHighScore', newState.highScore);
      }
      
      return newState;
    });
  }, []);

  return { gameState, updateGameState };
};
