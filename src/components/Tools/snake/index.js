// External dependencies
import React, { useEffect, useRef, memo, useState } from 'react';

// Local imports
import FullscreenWrapper from '../FullscreenWrapper';

// Styles
import './snake.css';

// Basic game configuration
const GAME_CONFIG = {
  type: undefined,
  width: 400,
  height: 400,
  backgroundColor: '#000000',
  parent: undefined,
  scene: undefined,
  scale: {
    mode: undefined,
    autoCenter: undefined,
    width: 400,
    height: 400,
    expandParent: false
  }
};

/**
 * Snake Game Component
 */
const SnakeGame = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const initGame = async () => {
      try {
        console.log('Starting game initialization...');
        
        // Step 1: Load Phaser
        console.log('Loading Phaser...');
        const Phaser = await import('phaser').catch(error => {
          console.error('Failed to load Phaser:', error);
          throw new Error('Failed to load Phaser library');
        });
        
        // Step 2: Load Scene
        console.log('Loading SnakeScene...');
        const { SnakeScene } = await import('./snake').catch(error => {
          console.error('Failed to load SnakeScene:', error);
          throw new Error('Failed to load game scene');
        });
        
        // Step 3: Configure game
        console.log('Configuring game...');
        GAME_CONFIG.type = Phaser.CANVAS; // Use Canvas renderer for better compatibility
        GAME_CONFIG.scale.mode = Phaser.Scale.FIT;
        GAME_CONFIG.scale.autoCenter = Phaser.Scale.CENTER_BOTH;
        GAME_CONFIG.scene = SnakeScene;
        
        // Step 4: Set up container
        if (!containerRef.current) {
          throw new Error('Game container not found');
        }
        
        const { width, height } = containerRef.current.getBoundingClientRect();
        const size = Math.min(width, height);
        GAME_CONFIG.width = size;
        GAME_CONFIG.height = size;
        GAME_CONFIG.parent = containerRef.current;
        
        // Step 5: Create game instance
        console.log('Creating game instance...');
        if (!gameRef.current) {
          const game = new Phaser.Game(GAME_CONFIG);
          gameRef.current = game;
          
          // Add basic error handler
          window.addEventListener('error', (event) => {
            console.error('Game error:', event);
            setLoadError('An error occurred while running the game');
          });
        }
        
        console.log('Game initialization complete');
        setIsLoading(false);
      } catch (error) {
        console.error('Game initialization failed:', error);
        setLoadError(error.message || 'Failed to initialize game');
        setIsLoading(false);
      }
    };

    initGame();

    return () => {
      if (gameRef.current) {
        console.log('Cleaning up game instance...');
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  if (loadError) {
    return (
      <FullscreenWrapper>
        <div className="snake-container">
          <div className="snake-error">
            <p>{loadError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="snake-retry-button"
            >
              Retry
            </button>
          </div>
        </div>
      </FullscreenWrapper>
    );
  }

  return (
    <FullscreenWrapper>
      <div ref={containerRef} className="snake-container">
        {isLoading && (
          <div className="snake-loading">
            <p>Loading game...</p>
          </div>
        )}
      </div>
    </FullscreenWrapper>
  );
});

// Add display name for React DevTools
SnakeGame.displayName = 'SnakeGame';

export default SnakeGame;
