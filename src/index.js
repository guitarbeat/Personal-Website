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
    ".navbar__item:nth-of-type(4)"
  );

  // Add a class to the third navbar item for reference
  thirdNavbarItem.classList.add("third-item");

  // Store the navbar in a variable
  var navbar = $(".navbar");

  // Variables to track the starting and current positions during drag
  var startX;
  var currentX;
  var thirdItemWidth = document
    .querySelector(".third-item")
    .getBoundingClientRect().width;
  navbar.css("right", `-${thirdItemWidth}px`);

  // Variable to track if the navbar is being dragged
  var isDragging = false;

  // Add event listeners for mousedown and touchstart on the navbar
  navbar.on("mousedown touchstart", function (e) {
    // Store the starting position of the drag
    startX = e.pageX || e.originalEvent.touches[0].pageX;
    isDragging = true;
    // Add a class to the navbar for styling purposes
    navbar.addClass("dragging");
  });

  // Add event listeners for mousemove and touchmove on the document
  $(document).on("mousemove touchmove", function (e) {
    // If the navbar is being dragged, calculate the drag distance
    if (isDragging) {
      currentX = e.pageX || e.originalEvent.touches[0].pageX;
      var dragDistance = startX - currentX;
      // Apply the drag distance to the right property of the navbar
      navbar.css("right", dragDistance + "px");
    }
  });

  // Add event listeners for mouseup and touchend on the document
  $(document).on("mouseup touchend", function () {
    isDragging = false;
    // Remove the dragging class from the navbar
    navbar.removeClass("dragging");

    // After 5 seconds, move the navbar to the right by the width of the third item
    setTimeout(function () {
      navbar.css("right", `-${thirdItemWidth}px`);
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
