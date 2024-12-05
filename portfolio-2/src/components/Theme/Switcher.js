import React, { useState, useEffect, useCallback } from "react";
import CrossBlur from "./CrossBlur";

const ThemeSwitcher = () => {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'light';
    const currentHour = new Date().getHours();
    return currentHour >= 7 && currentHour < 17;
  });
  const [isCrossBlurVisible, setIsCrossBlurVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsTransitioning(true);
    setIsLightTheme(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'light' : 'dark');
      return newTheme;
    });
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const toggleCrossBlur = useCallback((e) => {
    if (!e.target.closest('button, a, input, .theme-switch, .navbar')) {
      setIsCrossBlurVisible(prev => !prev);
    }
  }, []);

  const updateClassList = useCallback((element, className, shouldAdd) => {
    if (element?.classList) {
      element.classList[shouldAdd ? 'add' : 'remove'](className);
    }
  }, []);

  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch");
    const mainContent = document.querySelector("main");
    
    themeSwitch?.addEventListener("click", toggleTheme);
    mainContent?.addEventListener("dblclick", toggleCrossBlur);

    return () => {
      themeSwitch?.removeEventListener("click", toggleTheme);
      mainContent?.removeEventListener("dblclick", toggleCrossBlur);
    };
  }, [toggleTheme, toggleCrossBlur]);

  useEffect(() => {
    const body = document.body;
    const themeSwitch = document.querySelector(".theme-switch");
    
    updateClassList(body, "light-theme", isLightTheme);
    updateClassList(themeSwitch, "light-theme", isLightTheme);
    updateClassList(themeSwitch, "transitioning", isTransitioning);
  }, [isLightTheme, isTransitioning, updateClassList]);

  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch");
    updateClassList(themeSwitch, "cross-blur-active", isCrossBlurVisible);
  }, [isCrossBlurVisible, updateClassList]);

  return <CrossBlur isVisible={isCrossBlurVisible} />;
};

export default ThemeSwitcher;
