import React, { useState, useEffect } from 'react';
import './FullscreenWrapper.scss';

const FullscreenWrapper = ({ children, className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Trigger a resize event for any game containers
      window.dispatchEvent(new Event('resize'));
    };

    if (isFullscreen) {
      window.addEventListener('resize', handleResize);
      // Trigger initial resize
      handleResize();
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  return (
    <div className={`fullscreen-wrapper ${isFullscreen ? 'fullscreen' : ''} ${className}`}>
      <button 
        className="fullscreen-toggle" 
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        )}
      </button>
      <div className="fullscreen-content">
        {children}
      </div>
    </div>
  );
};

export default FullscreenWrapper;
