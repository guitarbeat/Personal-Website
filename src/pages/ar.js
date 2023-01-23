import React from "react";
import "@google/model-viewer";
import styles from "../pages/styles.css";

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
const AR = () => (
  <div class="card-container">
    <div id="card">
      <model-viewer
        src="blood-v1.glb"
        // ios-src="https://foil-vasc.s3.us-east-2.amazonaws.com/blood.usdz"
        poster="poster.webp"
        alt="A 3D model of vasculature"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        shadow-intensity="1"
      >
        <div
          className={`${styles.progressBar} ${styles.hide}`}
          slot="progress-bar"
        >
          <div className={styles.bar}></div>
        </div>
        <button className={styles.button} slot="ar-button">
          View in your space
        </button>
        <div className={styles.ar - prompt}>
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

export default AR;
