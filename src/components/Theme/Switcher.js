import React, { useState, useEffect } from "react";

import CrossBlur from "./CrossBlur";

const ThemeSwitcher = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isCrossBlurVisible, setIsCrossBlurVisible] = useState(false);

  // Update the theme based on the current time of day
  const updateTheme = () => {
    const currentHour = new Date().getHours();
    setIsLightTheme(currentHour >= 7 && currentHour < 17);
  };

  // Toggle the theme
  const toggleTheme = () => {
    setIsLightTheme((prevTheme) => !prevTheme);
  };

  // Toggle CrossBlur visibility
  const toggleCrossBlur = () => {
    setIsCrossBlurVisible((prevState) => !prevState);
  };

  // Safe DOM manipulation functions
  const safeAddClass = (element, className) => {
    if (element?.classList && !element.classList.contains(className)) {
      element.classList.add(className);
    }
  };

  const safeRemoveClass = (element, className) => {
    if (element?.classList && element.classList.contains(className)) {
      element.classList.remove(className);
    }
  };

  useEffect(() => {
    updateTheme();

    const themeSwitch = document.querySelector(".theme-switch");
    if (themeSwitch) {
      themeSwitch.addEventListener("click", toggleTheme);
      themeSwitch.addEventListener("dblclick", toggleCrossBlur);

      return () => {
        themeSwitch.removeEventListener("click", toggleTheme);
        themeSwitch.removeEventListener("dblclick", toggleCrossBlur);
      };
    }
  }, []);

  useEffect(() => {
    const body = document.body;
    if (body) {
      if (isLightTheme) {
        safeAddClass(body, "light-theme");
      } else {
        safeRemoveClass(body, "light-theme");
      }
    }
  }, [isLightTheme]);

  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch");
    if (themeSwitch) {
      if (isCrossBlurVisible) {
        safeAddClass(themeSwitch, "cross-blur-active");
      } else {
        safeRemoveClass(themeSwitch, "cross-blur-active");
      }
    }
  }, [isCrossBlurVisible]);

  return (
    <CrossBlur isVisible={isCrossBlurVisible} />
  );
};

export default ThemeSwitcher;
