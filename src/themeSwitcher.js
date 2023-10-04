import { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);

  // Update the theme based on the current time of day
  const updateTheme = () => {
    const currentHour = new Date().getHours();
    setIsLightTheme(currentHour >= 6 && currentHour < 18);
  };

  // Toggle the theme
  const toggleTheme = () => {
    setIsLightTheme((prevTheme) => !prevTheme);
  };

  useEffect(() => {
    updateTheme();

    const themeSwitch = document.querySelector(".theme-switch");
    if (themeSwitch) {
      themeSwitch.addEventListener("click", toggleTheme);

      // Return a cleanup function
      return () => themeSwitch.removeEventListener("click", toggleTheme);
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

  return null;
};

export default ThemeSwitcher;
