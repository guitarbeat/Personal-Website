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
    const mainContent = document.querySelector("main");
    
    if (themeSwitch) {
      themeSwitch.addEventListener("click", toggleTheme);
    }
    
    if (mainContent) {
      mainContent.addEventListener("dblclick", (e) => {
        // Don't trigger if clicking inside interactive elements
        if (!e.target.closest('button, a, input, .theme-switch, .navbar')) {
          toggleCrossBlur();
        }
      });
    }

    return () => {
      if (themeSwitch) {
        themeSwitch.removeEventListener("click", toggleTheme);
      }
      if (mainContent) {
        mainContent.removeEventListener("dblclick", toggleCrossBlur);
      }
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    const themeSwitch = document.querySelector(".theme-switch");
    if (body) {
      if (isLightTheme) {
        safeAddClass(body, "light-theme");
      } else {
        safeRemoveClass(body, "light-theme");
      }
    }
    if (themeSwitch) {
      if (isLightTheme) {
        safeAddClass(themeSwitch, "light-theme");
      } else {
        safeRemoveClass(themeSwitch, "light-theme");
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
