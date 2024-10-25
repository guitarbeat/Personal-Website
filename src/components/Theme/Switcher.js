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

  useEffect(() => {
    updateTheme();

    const themeSwitch = document.querySelector(".theme-switch");
    if (themeSwitch) {
      themeSwitch.addEventListener("click", toggleTheme);
      themeSwitch.addEventListener("dblclick", toggleCrossBlur);

      // Return a cleanup function
      return () => {
        themeSwitch.removeEventListener("click", toggleTheme);
        themeSwitch.removeEventListener("dblclick", toggleCrossBlur);
      };
    }
  }, []);

  useEffect(() => {
    const { classList } = document.body;
    if (isLightTheme) {
      classList.add("light-theme");
    } else {
      classList.remove("light-theme");
    }
  }, [isLightTheme]);

  useEffect(() => {
    const themeSwitch = document.querySelector(".theme-switch");
    if (themeSwitch) {
      if (isCrossBlurVisible) {
        themeSwitch.classList.add("cross-blur-active");
      } else {
        themeSwitch.classList.remove("cross-blur-active");
      }
    }
  }, [isCrossBlurVisible]);

  return (
    <CrossBlur isVisible={isCrossBlurVisible} />
  );
};

export default ThemeSwitcher;
