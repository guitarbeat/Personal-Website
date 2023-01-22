import React from "react";
import "@google/model-viewer/dist/model-viewer";
import "../pages/styles.css";

const AR = () => (
  <div id="card">
    <model-viewer
      src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.glb"
      ios-src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.usdz"
      poster="https://foil-vasc.s3.us-east-2.amazonaws.com/poster.webp"
      alt="A 3D model of vasculature"
      shadow-intensity="1"
      camera-controls
      auto-rotate
      ar
    ></model-viewer>

    <model-viewer
      src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.glb"
      ios-src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.usdz"
      poster="https://foil-vasc.s3.us-east-2.amazonaws.com/poster.webp"
      alt="A 3D model of vasculature"
      ar
      // ar-modes="webxr scene-viewer quick-look"
      camera-controls
      shadow-intensity="1"
    >
      <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
      </div>
      <button slot="ar-button" id="ar-button">
        View in your space
      </button>
      <div id="ar-prompt">
        <img src="ar_hand_prompt.png"></img>
      </div>
    </model-viewer>
  </div>
);

export default AR;
