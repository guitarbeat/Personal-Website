import React, { useState, useEffect } from "react";
import CrossBlur from "./CrossBlur";

/**
* Manages the theme and crossblur visibility state of the application
* @example
* // Assuming this is a React component named ThemeSwitcher
* <ThemeSwitcher />
* Renders <CrossBlur isVisible={true} /> or <CrossBlur isVisible={false} />
* @returns {React.Element} The rendered component with CrossBlur based on the visibility state.
* @description
*   - This component uses React's useState and useEffect hooks to manage state.
*   - The theme is determined by the hour of the day upon initial mount.
*   - Theme and CrossBlur state toggles are bound to click and double click events.
*   - Event listeners for toggles are cleaned up on component unmount.
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