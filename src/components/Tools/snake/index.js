import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import FullscreenWrapper from '../FullscreenWrapper';
import { initSnakeGame } from './snake';
import './snake.css';

// Initialize game namespace before component definition
if (typeof window.g === 'undefined') {
  window.g = {
    m: Math,
    states: {},
    state: 'play',
    config: {
      title: 'Snakely',
      debug: false,
      state: 'play'
    },
    addState(state) {
      this.states[state.name] = state;
    },
    setState(name) {
      if (this.state && this.states[this.state]) {
        this.states[this.state].exit();
      }
      this.state = name;
      if (this.states[this.state]) {
        this.states[this.state].init();
      }
    }
  };
}

const SnakeGame = ({ onScoreChange }) => {
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);

  const handleResize = useCallback(() => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.cleanup();
    }
    if (gameContainerRef.current) {
      gameInstanceRef.current = initSnakeGame(gameContainerRef.current);
    }
  }, []);

  useEffect(() => {
    if (gameContainerRef.current) {
      gameInstanceRef.current = initSnakeGame(gameContainerRef.current);

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (gameInstanceRef.current) {
          gameInstanceRef.current.cleanup();
        }
      };
    }
  }, [handleResize]);

  return (
    <FullscreenWrapper>
      <div className="snake-game" ref={gameContainerRef} />
    </FullscreenWrapper>
  );
};

SnakeGame.propTypes = {
  onScoreChange: PropTypes.func
};

SnakeGame.defaultProps = {
  onScoreChange: () => {}
};

export default SnakeGame;
