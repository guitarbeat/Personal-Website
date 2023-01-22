import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import $ from "jquery";

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

// Slides
$(document).ready(function () {
  var navbar = $(".navbar");
  var startX;
  var currentX;
  var items = $(".navbar__item");
  var itemsToShow = items.length - 3;
  items.slice(0, itemsToShow).hide();
  var isDragging = false;

  navbar.on("mousedown touchstart", function (e) {
    startX = e.pageX || e.originalEvent.touches[0].pageX;
    isDragging = true;
    navbar.addClass("dragging");
    items.slice(0, itemsToShow).show();
  });

  $(document).on("mousemove touchmove", function (e) {
    if (isDragging) {
      currentX = e.pageX || e.originalEvent.touches[0].pageX;
      var dragDistance = startX - currentX;
      navbar.css("right", dragDistance + "px");
    }
  });
  $(document).on("mouseup touchend", function () {
    isDragging = false;
    navbar.removeClass("dragging");
    setTimeout(function () {
      navbar.css("right", "0px");
      items.slice(0, itemsToShow).hide();
    }, 3000);
  });
});

// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector(".progress-bar");
  const updatingBar = event.target.querySelector(".update-bar");
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add("hide");
  } else {
    progressBar.classList.remove("hide");
    if (event.detail.totalProgress === 0) {
      event.target.querySelector(".center-pre-prompt").classList.add("hide");
    }
  }
};
document.querySelector("model-viewer").addEventListener("progress", onProgress);
