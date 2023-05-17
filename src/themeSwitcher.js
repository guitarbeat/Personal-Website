document.addEventListener("DOMContentLoaded", function () {
  const themeSwitch = document.querySelector(".theme-switch");
  if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
    });
  }

  updateTheme();
  window.onresize = updateTheme;

  function updateTheme() {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 18) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }
});
