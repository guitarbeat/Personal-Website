import React, { useCallback, useRef, memo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useVisibilityObserver, useScreenOrientation } from "../shared/hooks";

// Common animation configurations
const ANIMATION_CONFIG = {
  duration: {
    default: 0.3,
    enter: 0.5,
    exit: 0.3,
  },
  ease: [0.4, 0, 0.2, 1],
};

// Animation variants
const variants = {
  initial: { 
    opacity: 0, 
    scale: 0.98,
    y: 20 
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: ANIMATION_CONFIG.duration.enter, 
      ease: ANIMATION_CONFIG.ease,
      scale: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -20,
    transition: { 
      duration: ANIMATION_CONFIG.duration.exit, 
      ease: ANIMATION_CONFIG.ease 
    },
  },
};

// Common style variables
const STYLE_VARS = {
  fullscreen: {
    transitionDuration: '0.4s',
    transitionTiming: 'cubic-bezier(0.4, 0, 0.2, 1)',
    backdropBlur: '8px',
    borderRadius: '16px',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    toggleSize: 'clamp(32px, 5vw, 40px)',
    headerOffset: 'max(60px, 10vh)',
  },
};

// CSS Custom Properties
const GlobalStyle = createGlobalStyle`
  :root {
    ${Object.entries(STYLE_VARS.fullscreen).map(
      ([key, value]) => `--fullscreen-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
    ).join('\n\t\t')}
  }

  body.is-fullscreen {
    overflow: hidden !important;
    touch-action: none;

    #magicContainer,
    .vignette-top,
    .vignette-bottom,
    .vignette-left,
    .vignette-right {
      display: none !important;
    }
  }
`;

// Icons
const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
    />
  </svg>
);

const ExitFullscreenIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
    />
  </svg>
);

// Styled components
const FullscreenContent = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  backdrop-filter: blur(var(--about-blur-amount));
  background: var(--about-glass-bg);
  border: 1px solid var(--about-glass-border);
  border-radius: var(--about-border-radius);
  box-shadow: var(--about-glass-shadow);
  overflow: hidden;
  transition: all var(--about-transition-duration) var(--theme-transition-timing);
  will-change: transform, opacity;

  &:hover {
    border-color: var(--color-sage);
  }
`;

const ToolContent = styled(motion.div)`
  width: 100%;
  height: 100%;
  padding: ${props => props.$isGame ? '0' : '1rem'};
  overflow: auto;
  position: relative;

  // Hide scrollbar but keep functionality
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ToggleButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: var(--fullscreen-toggle-size);
  height: var(--fullscreen-toggle-size);
  border-radius: 50%;
  backdrop-filter: blur(var(--about-blur-amount));
  background: var(--about-glass-bg);
  border: 1px solid var(--about-glass-border);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 2;
  transition: all var(--about-transition-duration) var(--theme-transition-timing);
  will-change: transform;

  &:hover {
    transform: var(--about-hover-transform);
    border-color: var(--color-sage);
  }

  &:active {
    transform: var(--about-active-transform);
  }
`;

// Fullscreen wrapper component
export const FullscreenWrapper = memo(
  ({
    children,
    className = "",
    contentClassName = "",
    isGame = false,
    toolId = "",
  }) => {
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const contentRef = useRef(null);
    const isVisible = useVisibilityObserver(wrapperRef);
    const orientation = useScreenOrientation();

    const handleFullscreen = useCallback(() => {
      navigate(`/tools/${toolId}/fullscreen`);
    }, [navigate, toolId]);

    return (
      <AnimatePresence mode="wait">
        <>
          <GlobalStyle />
          <FullscreenContent
            ref={wrapperRef}
            className={className}
            $isVisible={isVisible}
            $orientation={orientation}
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit"
            layout
          >
            <ToolContent
              ref={contentRef}
              className={contentClassName}
              $isGame={isGame}
              layout
            >
              {children}
            </ToolContent>
            <ToggleButton
              onClick={handleFullscreen}
              aria-label="Enter fullscreen"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FullscreenIcon />
            </ToggleButton>
          </FullscreenContent>
        </>
      </AnimatePresence>
    );
  }
);

FullscreenWrapper.displayName = "FullscreenWrapper";

// Add styles for the fullscreen tool
export const FullscreenToolStyles = createGlobalStyle`
  .fullscreen-tool {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: var(--color-grey-dark-1);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fullscreen-tool-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(10px, 3vw, 20px);
    padding-top: calc(var(--fullscreen-header-offset) + clamp(10px, 3vw, 20px));
    backdrop-filter: blur(var(--about-blur-amount));
    background: var(--about-glass-bg);
    border: 1px solid var(--about-glass-border);
    border-radius: var(--about-border-radius);
    box-shadow: var(--about-glass-shadow);
    transition: all var(--about-transition-duration) var(--theme-transition-timing);
    will-change: transform;

    &:hover {
      border-color: var(--color-sage);
    }
  }

  .exit-fullscreen-btn {
    position: fixed;
    top: 1rem;
    right: 1rem;
    width: var(--fullscreen-toggle-size);
    height: var(--fullscreen-toggle-size);
    border-radius: 50%;
    backdrop-filter: blur(var(--about-blur-amount));
    background: var(--about-glass-bg);
    border: 1px solid var(--about-glass-border);
    color: var(--color-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    z-index: 2;
    transition: all var(--about-transition-duration) var(--theme-transition-timing);
    will-change: transform;

    &:hover {
      transform: var(--about-hover-transform);
      border-color: var(--color-sage);
    }

    &:active {
      transform: var(--about-active-transform);
    }
  }
`;

// Add a new component for fullscreen mode
export const FullscreenTool = memo(
  ({
    children,
    className = "",
    contentClassName = "",
    isGame = false,
    onExit,
    title = "",
  }) => {
    const navigate = useNavigate();

    const handleExit = useCallback(() => {
      navigate("/tools");
      onExit?.();
    }, [navigate, onExit]);

    // Handle escape key
    useEffect(() => {
      const handleEscKey = (e) => {
        if (e.key === "Escape") {
          handleExit();
        }
      };

      window.addEventListener("keydown", handleEscKey);
      document.body.classList.add('is-fullscreen');

      return () => {
        window.removeEventListener("keydown", handleEscKey);
        document.body.classList.remove('is-fullscreen');
      };
    }, [handleExit]);

    return (
      <motion.div 
        className="fullscreen-tool"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: ANIMATION_CONFIG.ease }}
      >
        <motion.div 
          className="fullscreen-tool-content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: ANIMATION_CONFIG.ease,
            delay: 0.1 
          }}
        >
          {children}
        </motion.div>
        <motion.button
          className="exit-fullscreen-btn"
          onClick={handleExit}
          aria-label="Exit fullscreen"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ExitFullscreenIcon />
        </motion.button>
      </motion.div>
    );
  },
);

FullscreenTool.displayName = "FullscreenTool";

export default FullscreenWrapper; 