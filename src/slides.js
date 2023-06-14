// document.addEventListener("DOMContentLoaded", function () {
//   // Adjustable parameters
//   const targetNavItemIndex = 1;
//   const dragThreshold = 5;
//   const resetDelay = 5000;

//   // Get the target navbar item
//   const targetNavItem = document.querySelector(
//     `.navbar__item:nth-of-type(${targetNavItemIndex})`
//   );
//   targetNavItem.classList.add("third-item");

//   // Get the navbar element
//   const navbar = document.querySelector(".navbar");

//   // Initialize variables
//   let startX;
//   let isDragging = false;

//   const navbarWidth = navbar.getBoundingClientRect().width;
//   const targetNavItemWidth =
//     2.1 * targetNavItem.getBoundingClientRect().width + 10;
//   const maxRight = navbarWidth - targetNavItemWidth;

//   // Set initial position and transition
//   navbar.style.right = `-${targetNavItemWidth}px`;
//   navbar.style.transition = "right 0.5s";

//   // Function to reset navbar position
//   function resetNavbarPosition() {
//     navbar.style.right = `-${targetNavItemWidth}px`;
//   }

//   // Event listeners for starting the drag on mouse and touch events
//   navbar.addEventListener("mousedown", (e) => startDrag(e.pageX));
//   navbar.addEventListener("touchstart", (e) => startDrag(e.touches[0].pageX));

//   function startDrag(pageX) {
//     startX = pageX;
//     isDragging = true;
//     navbar.style.transition = "none"; // Remove transition during drag
//     navbar.classList.add("dragging");
//   }

//   // Event listeners for dragging the navbar on mouse and touch events
//   document.addEventListener("mousemove", (e) => drag(e.pageX));
//   document.addEventListener("touchmove", (e) => drag(e.touches[0].pageX));

//   function drag(pageX) {
//     if (isDragging) {
//       let dragDistance = startX - pageX;

//       // Limit the drag distance
//       if (dragDistance > maxRight) dragDistance = maxRight;
//       if (dragDistance < -targetNavItemWidth)
//         dragDistance = -targetNavItemWidth;

//       if (Math.abs(dragDistance) >= dragThreshold) {
//         navbar.style.right = `${dragDistance}px`;
//       }
//     }
//   }

//   // Event listeners for ending the drag on mouse and touch events
//   document.addEventListener("mouseup", endDrag);
//   document.addEventListener("touchend", endDrag);

//   function endDrag() {
//     isDragging = false;
//     navbar.classList.remove("dragging");
//     navbar.style.transition = "right 0.5s"; // Reapply transition

//     // Reset the position of the navbar after a delay
//     setTimeout(resetNavbarPosition, resetDelay);
//   }

//   // Reset position on resize
//   window.addEventListener("resize", resetNavbarPosition);
// });
