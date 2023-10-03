import { useEffect } from "react";

const ThemeSwitcher = () => {
  // Update the theme based on the current time of day
  const updateTheme = () => {
    const currentHour = new Date().getHours();
    const body = document.body;
    if (currentHour >= 6 && currentHour < 18) {
      body.classList.add("light-theme");
    } else {
      body.classList.remove("light-theme");
    }
  };

  // Add an event listener to the theme switch button
  const themeSwitch = document.querySelector(".theme-switch");
  if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
    });
  }

  // Update the theme on mount and on resize
  useEffect(() => {
    updateTheme();
    window.addEventListener("resize", updateTheme);

    // Remove the event listener on unmount
    return () => {
      if (themeSwitch) {
        themeSwitch.removeEventListener("click", () => {
          document.body.classList.toggle("light-theme");
        });
      }
      window.removeEventListener("resize", updateTheme);
    };
  }, []);

  // Return null since this component is a side effect only
  return null;
};

export default ThemeSwitcher;
