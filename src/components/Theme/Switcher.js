import React, { useState, useEffect } from "react";
import CrossBlur from "./CrossBlur";

/**
* Manages theme and cross blur effect based on user interaction and time of day
* @example
* updateTheme()
* // isLightTheme state is set based on the current hour
* @example
* toggleTheme()
* // isLightTheme state is toggled
* @example
* toggleCrossBlur()
* // isCrossBlurVisible state is toggled
* @param {boolean} isLightTheme - Determines if the light theme is active
* @param {boolean} isCrossBlurVisible - Determines if the cross blur effect is visible
* @returns {JSX.Element} Rendered theme switcher component with cross blur effect
* @description
*   - The function is expected to be a component in `src/components/Theme/Switcher.js`.
*   - `updateTheme` sets light or dark theme based on the current hour.
*   - `toggleTheme` and `toggleCrossBlur` are toggled through click and dblclick events.
*   - The actual theme changes are effected via `useEffect` hooks whenever `isLightTheme`
*     or `isCrossBlurVisible` state changes.
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