import React, { useState, useEffect, useCallback } from "react";
import CrossBlur from "./CrossBlur";

const ThemeSwitcher = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isCrossBlurVisible, setIsCrossBlurVisible] = useState(false);

  const updateTheme = useCallback(() => {
    const currentHour = new Date().getHours();
    setIsLightTheme(currentHour >= 7 && currentHour < 17);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsLightTheme(prev => !prev);
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
    updateTheme();
    const themeSwitch = document.querySelector(".theme-switch");
    const mainContent = document.querySelector("main");
    
    themeSwitch?.addEventListener("click", toggleTheme);
    mainContent?.addEventListener("dblclick", toggleCrossBlur);

    return () => {
      themeSwitch?.removeEventListener("click", toggleTheme);
      mainContent?.removeEventListener("dblclick", toggleCrossBlur);
    };
  }, [updateTheme, toggleTheme, toggleCrossBlur]);

  useEffect(() => {
    const body = document.body;
    const themeSwitch = document.querySelector(".theme-switch");
    
    updateClassList(body, "light-theme", isLightTheme);
    updateClassList(themeSwitch, "light-theme", isLightTheme);
  }, [isLightTheme, updateClassList]);

  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch");
    updateClassList(themeSwitch, "cross-blur-active", isCrossBlurVisible);
  }, [isCrossBlurVisible, updateClassList]);

  return <CrossBlur isVisible={isCrossBlurVisible} />;
};

export default ThemeSwitcher;
