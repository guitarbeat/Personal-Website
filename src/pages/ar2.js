import React, { useState } from "react";
import "../pages/styles.css";

const AR = () => {
  const [src, setSrc] = useState("blood-v1.glb");
  const [poster, setPoster] = useState("poster.webp");

  const switchSrc = (name) => {
    setSrc(name + ".glb");
    setPoster(name + ".webp");
  };

  return (
    <div className="card-container">
      <div id="card">
        <model-viewer
          src={src}
          poster={poster}
          shadow-intensity="1"
          ar
          camera-controls
          touch-action="pan-y"
          alt="A 3D model of blood cells"
        >
          <button slot="ar-button" id="ar-button">
            View in your space
          </button>
          <div id="ar-prompt">
            <img src="ar_hand_prompt.png" alt="ar_hand_prompt" />
          </div>{" "}
          <button id="ar-failure">AR is not tracking!</button>
          <div className="slider">
            <div className="slides">
              <button
                className="slide selected"
                onClick={() => switchSrc("blood-v1")}
                style={{ backgroundImage: `url(${poster})` }}
              ></button>
              <button
                className="slide"
                onClick={() => switchSrc("Mixer")}
                style={{ backgroundImage: `url(poster2.webp)` }}
              ></button>
              <button
                className="slide"
                onClick={() => switchSrc("GeoPlanter")}
                style={{ backgroundImage: `url(poster3.webp)` }}
              ></button>
            </div>
          </div>
        </model-viewer>
      </div>
    </div>
  );
};

export default AR;
