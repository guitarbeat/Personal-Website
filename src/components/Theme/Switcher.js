import React, { useState, useEffect } from "react";
import CrossBlur from "./CrossBlur";

/**
* Manages and updates the theme and cross blur visibility
* @example
* useEffect(() => {
*   updateTheme();
*   // Output will vary based on the time of day and user interactions
* });
* @param {function} useState - React hook for setting state.
* @param {function} useEffect - React hook for side effects.
* @returns {JSX.Element} Renders a CrossBlur component with visibility based on state.
* @description
*   - Uses the system time to determine if light theme should be applied.
*   - Attaches event listeners to a theme switch button for interactivity.
*   - Implements cleanup by removing event listeners in a useEffect return function.
*   - Applies CSS classes to elements based on state to control visuals.
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