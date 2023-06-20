import { useEffect } from "react";

const ThemeSwitcher = () => {
  useEffect(() => {
    const updateTheme = () => {
      const currentHour = new Date().getHours();
      const body = document.body;
      if (currentHour >= 6 && currentHour < 18) {
        body.classList.add("light-theme");
      } else {
        body.classList.remove("light-theme");
      }
    };

    const themeSwitch = document.querySelector(".theme-switch");
    if (themeSwitch) {
      themeSwitch.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
      });
    }

    updateTheme();
    window.addEventListener("resize", updateTheme);

    return () => {
      if (themeSwitch) {
        themeSwitch.removeEventListener("click", () => {
          document.body.classList.toggle("light-theme");
        });
      }
      window.removeEventListener("resize", updateTheme);
    };
  }, []);

  return null;
};

export default ThemeSwitcher;
