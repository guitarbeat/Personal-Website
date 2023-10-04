import React, { useEffect, useRef } from "react";
import "./DuckEffect.css"; // Assuming you'll place the CSS in a separate file

function DuckEffect() {
  // We will use useRef for direct DOM manipulations (if needed)
  const wrapperRef = useRef(null);
  const markerRefs = useRef([]);
  const indicatorRef = useRef(null);
  const createDucklingBtnRef = useRef(null);

  // JavaScript logic will go here (converted to use React state and hooks)

  return (
    <div className="wrapper" ref={wrapperRef}>
      <div className="marker red"></div>
      <div className="marker blue"></div>
      <div className="marker yellow"></div>
      <div className="marker pink"></div>
      <div className="marker green"></div>
      <div className="marker purple"></div>
      <div className="duck down">
        <div className="neck-base">
          <div className="neck">
            <div className="head"></div>
          </div>
        </div>
        <div className="tail"></div>
        <div className="body"></div>
        <div className="legs">
          <div className="leg"></div>
          <div className="leg"></div>
        </div>
      </div>
      <button className="create-duckling" ref={createDucklingBtnRef}></button>
      <div className="indicator" ref={indicatorRef}></div>
      <div className="sign">
        by masahito / <a href="http://www.ma5a.com/">ma5a.com</a>
      </div>
    </div>
  );
}

export default DuckEffect;
