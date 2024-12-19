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
  const savedTheme = localStorage.getItem(THEME.STORAGE_KEY)
  if (savedTheme) {
    return savedTheme === THEME.LIGHT
  }
  const currentHour = new Date().getHours()
  return currentHour >= THEME.DEFAULT_DAYLIGHT_HOURS.START && 
         currentHour < THEME.DEFAULT_DAYLIGHT_HOURS.END
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

  // Cross Blur Effect
  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch")
    updateClassList(themeSwitch, "cross-blur-active", isCrossBlurVisible)
  }, [isCrossBlurVisible, updateClassList])

  return <CrossBlur isVisible={isCrossBlurVisible} />
}

export default ThemeSwitcher
