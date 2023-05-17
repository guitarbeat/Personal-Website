document.addEventListener("DOMContentLoaded", function () {
  const thirdNavbarItem = document.querySelector(
    ".navbar__item:nth-of-type(2)"
  );
  thirdNavbarItem.classList.add("third-item");

  const navbar = document.querySelector(".navbar");
  let startX;
  let isDragging = false;
  const thirdItemWidth =
    2.1 * thirdNavbarItem.getBoundingClientRect().width + 10;
  navbar.style.right = `-${thirdItemWidth}px`;

  navbar.addEventListener("mousedown", (e) => startDrag(e.pageX));
  navbar.addEventListener("touchstart", (e) => startDrag(e.touches[0].pageX));

  function startDrag(pageX) {
    startX = pageX;
    isDragging = true;
    navbar.classList.add("dragging");
  }

  document.addEventListener("mousemove", (e) => drag(e.pageX));
  document.addEventListener("touchmove", (e) => drag(e.touches[0].pageX));

  function drag(pageX) {
    if (isDragging) {
      const dragDistance = startX - pageX;
      navbar.style.right = `${dragDistance}px`;
    }
  }

  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchend", endDrag);

  function endDrag() {
    isDragging = false;
    navbar.classList.remove("dragging");
    setTimeout(() => {
      navbar.style.right = `-${thirdItemWidth}px`;
    }, 5000);
  }
});
