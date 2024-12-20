import React, { useState, useEffect, useCallback } from "react"
import CrossBlur from "./CrossBlur"

const ThemeSwitcher = () => {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'light'
    }
    const currentHour = new Date().getHours()
    return currentHour >= 7 && currentHour < 17
  })
  const [isCrossBlurVisible, setIsCrossBlurVisible] = useState(false)

  const toggleTheme = useCallback(() => {
    setIsLightTheme(prev => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'light' : 'dark')
      return newTheme
    })
  }, [])

  const toggleCrossBlur = useCallback((e) => {
    console.log('Double click detected');
    setIsCrossBlurVisible(prev => !prev);
  }, [])

  const updateClassList = useCallback((element, className, shouldAdd) => {
    if (element?.classList) {
      element.classList[shouldAdd ? 'add' : 'remove'](className)
    }
  }, [])

  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch")
    const mainContent = document.querySelector("body")
    
    themeSwitch?.addEventListener("click", toggleTheme)
    mainContent?.addEventListener("dblclick", toggleCrossBlur)

    console.log('Event listeners added', { mainContent, themeSwitch });

    return () => {
      themeSwitch?.removeEventListener("click", toggleTheme)
      mainContent?.removeEventListener("dblclick", toggleCrossBlur)
    }
  }, [toggleTheme, toggleCrossBlur])

  useEffect(() => {
    const {body} = document
    const themeSwitch = document.querySelector(".theme-switch")
    const themeColorMeta = document.querySelector('meta#theme-color')
    
    updateClassList(body, "light-theme", isLightTheme)
    updateClassList(themeSwitch, "light-theme", isLightTheme)

    // Update iOS status bar color
    if (themeColorMeta) {
      themeColorMeta.content = isLightTheme ? '#ffffff' : '#1a1a1a'
    }
  }, [isLightTheme, updateClassList])

  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch")
    updateClassList(themeSwitch, "cross-blur-active", isCrossBlurVisible)
  }, [isCrossBlurVisible, updateClassList])

  useEffect(() => {
    console.log('CrossBlur visibility:', isCrossBlurVisible);
  }, [isCrossBlurVisible])

  return <CrossBlur isVisible={isCrossBlurVisible} />
}

export default ThemeSwitcher
