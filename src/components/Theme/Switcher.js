import React, { useState, useEffect, useCallback } from "react"
import CrossBlur from "./CrossBlur"

// Theme Configuration
const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  STORAGE_KEY: 'theme',
  CLASS_NAME: 'light-theme',
  DEFAULT_DAYLIGHT_HOURS: {
    START: 7,
    END: 17
  }
}

// Utility Functions
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME.STORAGE_KEY) || (new Date().getHours() >= THEME.DEFAULT_DAYLIGHT_HOURS.START && new Date().getHours() < THEME.DEFAULT_DAYLIGHT_HOURS.END ? THEME.LIGHT : THEME.DARK);
  return savedTheme === THEME.LIGHT;
}

const updateThemeColor = (isLight) => {
  const themeColorMeta = document.querySelector('meta#theme-color')
  if (themeColorMeta) {
    themeColorMeta.content = isLight ? '#ffffff' : '#1a1a1a'
  }
}

const ThemeSwitcher = () => {
  // State Management
  const [isLightTheme, setIsLightTheme] = useState(getInitialTheme)
  const [isCrossBlurVisible, setIsCrossBlurVisible] = useState(false)

  // Event Handlers
  const toggleTheme = useCallback(() => {
    setIsLightTheme(prev => {
      const newTheme = !prev
      localStorage.setItem(THEME.STORAGE_KEY, newTheme ? THEME.LIGHT : THEME.DARK)
      return newTheme
    })
  }, [])

  const toggleCrossBlur = useCallback((e) => {
    const isInteractive = e.target.closest('button, a, input, .theme-switch, .navbar')
    if (!isInteractive) {
      setIsCrossBlurVisible(prev => !prev)
    }
  }, [])

  // DOM Manipulation
  const updateClassList = useCallback((element, className, shouldAdd) => {
    if (element?.classList) {
      element.classList[shouldAdd ? 'add' : 'remove'](className)
    }
  }, [])

  // Event Listeners
  useEffect(() => {
    const elements = {
      themeSwitch: document.querySelector(".theme-switch"),
      mainContent: document.querySelector("main")
    }
    
    elements.themeSwitch?.addEventListener("click", toggleTheme)
    elements.mainContent?.addEventListener("dblclick", toggleCrossBlur)

    return () => {
      elements.themeSwitch?.removeEventListener("click", toggleTheme)
      elements.mainContent?.removeEventListener("dblclick", toggleCrossBlur)
    }
  }, [toggleTheme, toggleCrossBlur])

  // Synchronize theme state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === THEME.STORAGE_KEY) {
        setIsLightTheme(e.newValue === THEME.LIGHT);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Theme Application
  useEffect(() => {
    const elements = {
      body: document.body,
      themeSwitch: document.querySelector(".theme-switch")
    }
    
    updateClassList(elements.body, THEME.CLASS_NAME, isLightTheme)
    updateClassList(elements.themeSwitch, THEME.CLASS_NAME, isLightTheme)
    updateThemeColor(isLightTheme)
  }, [isLightTheme, updateClassList])

  // Enhance accessibility for the theme switch
  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch");
    if (themeSwitch) {
      themeSwitch.setAttribute('tabindex', '0');
      themeSwitch.setAttribute('aria-label', 'Toggle light/dark theme');

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      };

      themeSwitch.addEventListener('keydown', handleKeyDown);

      return () => {
        themeSwitch.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [toggleTheme]);

  // Cross Blur Effect
  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch")
    updateClassList(themeSwitch, "cross-blur-active", isCrossBlurVisible)
  }, [isCrossBlurVisible, updateClassList])

  return <CrossBlur isVisible={isCrossBlurVisible} />
}

export default ThemeSwitcher
