import React, { useState, useEffect } from "react";
import CrossBlur from "./CrossBlur";

/**
* Manages theme and cross blur visibility based on user interactions and time of day
* @example
* // If it's 10:00 AM, light theme is activated
* updateTheme()
* // now isLightTheme is true
* @param {useState} setIsLightTheme - State setter for the light theme.
* @param {useState} setIsCrossBlurVisible - State setter for the cross blur visibility.
* @returns {JSX.Element} Renders a CrossBlur component with its visibility controlled by the state.
* @description
*   - 'updateTheme' checks the current hour and sets the 'isLightTheme' based on whether it's day.
*   - 'toggleTheme' inverts current theme state.
*   - 'toggleCrossBlur' toggles the visibility of a cross blur effect.
*   - useEffect hooks are used to add and clean up event listeners and to apply class changes.
*/
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
    const body = document.body;
    if (isLightTheme) {
      body.classList.add("light-theme");
    } else {
      body.classList.remove("light-theme");
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
    <>
      <CrossBlur isVisible={isCrossBlurVisible} />
    </>
  );
};

export default ThemeSwitcher;