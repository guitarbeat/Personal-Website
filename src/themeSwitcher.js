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
    const body = document.body;
    if (currentHour >= 6 && currentHour < 18) {
      body.classList.add("light-theme");
    } else {
      body.classList.remove("light-theme");
    }
  }
  
});
