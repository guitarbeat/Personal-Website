import React from "react";
import "@google/model-viewer/dist/model-viewer";
import "../pages/styles.css";

// const AR = () => (
//   <div id="card">
//     <model-viewer
//       src="https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?1542147958948"
//       ios-src="https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.usdz?v=1569545377878"
//       poster="https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b%2Fposter-astronaut.png?v=1599079951717"
//       alt="A 3D model of an astronaut"
//       shadow-intensity="1"
//       camera-controls
//       auto-rotate
//       ar
//     ></model-viewer>
//   </div>
// );
// export default AR;

// import React from "react";
// import "https://unpkg.com/focus-visible@5.0.2/dist/focus-visible.js";
// import "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
// import "https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js";
// import "../pages/styles.css";

const AR = () => (
  <div id="card">
    <model-viewer
      src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.glb"
      ios-src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.usdz"
      poster="https://foil-vasc.s3.us-east-2.amazonaws.com/poster.webp"
      alt="A 3D model of vasculature"
      ar
      ar-modes="webxr scene-viewer quick-look"
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
