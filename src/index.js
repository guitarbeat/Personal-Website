import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import $ from "jquery";
import "@google/model-viewer";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

$(".theme-switch").on("click", () => {
  $("body").toggleClass("light-theme");
});

window.onload = function () {
  updateTheme();
};

window.onresize = function () {
  updateTheme();
};

function updateTheme() {
  const currentHour = new Date().getHours();

  if (currentHour >= 6 && currentHour < 18) {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }
}

