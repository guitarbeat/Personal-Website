import React, { useState } from "react";

function NavBar({ items }) {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [navPosition, setNavPosition] = useState(0);

  let links = Object.keys(items)
    .reverse()
    .map((key, i) => (
      <li key={i} className={`navbar__item ${dragging ? "dragging" : ""}`}>
        <a href={items[key]}>{key}</a>
      </li>
    ));

  const handleMouseDown = (event) => {
    setDragging(true);
    setDragStart(event.clientX);
  };

  const handleMouseMove = (event) => {
    if (!dragging) return;
    let newNavPosition = navPosition + (event.clientX - dragStart);
    setDragStart(event.clientX);
    setNavPosition(newNavPosition);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const navStyle = {
    right: navPosition,
  };

  return (
    <ul
      className="navbar"
      style={navStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {links}
      <div className="theme-switch">
        <div className="switch"></div>
      </div>
    </ul>
  );
}

export default NavBar;
