import React from "react";
import "../pages/styles.css";

const AR = () => {
  return (
    <div className="card-container">
      <div id="card">
        <model-viewer
          src="blood-v1.glb"
          ios-src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.usdz"
          ar
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          poster="poster.webp"
          shadow-intensity="1"
          auto-rotate
        >
          <div className="progress-bar hide" slot="progress-bar">
            <div className="update-bar"></div>
          </div>
          <button slot="ar-button" id="ar-button">
            View in your space
          </button>
          <div id="ar-prompt">
            <img src="ar_hand_prompt.png" alt="ar_hand_prompt" />
          </div>
        </model-viewer>
        <section className="attribution">
          <span>
            <h1>Mouse Vasculature</h1>
            <h2>By FOIL</h2>
          </span>
        </section>
      </div>
    </div>
  );
};

export default AR;
