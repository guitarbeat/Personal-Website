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

// Slides// Slides
$(document).ready(function () {
  // Store the third navbar item in a variable
  const thirdNavbarItem = document.querySelector(
    ".navbar__item:nth-of-type(3)"
  );
  // Add a class to the third navbar item for reference
  thirdNavbarItem.classList.add("third-item");

  var navbar = $(".navbar");
  var startX;
  var currentX;
  var isDragging = false;

  navbar.on("mousedown touchstart", function (e) {
    startX = e.pageX || e.originalEvent.touches[0].pageX;
    isDragging = true;
    navbar.addClass("dragging");
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
      // var thirdItemDistance =
      //   $(".third-item").offset().left + $(".third-item").outerWidth();
      // // Move the navbar to the right by the distance of the third item
      // navbar.css("right", `-${thirdItemDistance}px`);
      var thirdItemDistance =
        $(window).width() - $(".third-item").offset().left;
      // Move the navbar to the right by the distance of the third item
      navbar.css("right", `-${thirdItemDistance}vw`);
    }, 5000);
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

// test
const modelViewer = document.querySelector("model-viewer");

window.switchSrc = (element, name) => {
  const base = name;
  modelViewer.src = base + ".glb";
  modelViewer.poster = base + ".webp";
  const slides = document.querySelectorAll(".slide");
  slides.forEach((element) => {
    element.classList.remove("selected");
  });
  element.classList.add("selected");
};

document.querySelector(".slider").addEventListener("beforexrselect", (ev) => {
  // Keep slider interactions from affecting the XR scene.
  ev.preventDefault();
});
