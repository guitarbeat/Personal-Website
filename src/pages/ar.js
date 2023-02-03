import React from "react";
import "../pages/styles.css";

const AR = () => {
  const cards = [
    {
      src: "blood-v1.glb",
      iosSrc: "blood-d1.usdz",
      poster: "poster.webp",
      title: "Mouse Vasculature",
      author: "Bret W5",
    },
    {
      src: "blood-v2.glb",
      iosSrc: "blood-d2.usdz",
      poster: "poster2.webp",
      // title: "New Model",
      author: "Eddy W3",
    },
    {
      src: "blood-v3.glb",
      // iosSrc: "blood-d2.usdz",
      // poster: "poster2.webp",
      title: "Experiment",
      // author: "Eddy W3",
    },
    // Add more cards here
  ];

  return (
    <div className="card-container">
      {cards.map((card, index) => (
        <div key={index} id="card">
          <model-viewer
            src={card.src}
            ios-src={card.iosSrc}
            ar
            ar-modes="scene-viewer webxr quick-look"
            camera-controls
            poster={card.poster}
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
              <h1>{card.title}</h1>
              <h2>Mouse: {card.author}</h2>
            </span>
          </section>
        </div>
      ))}
    </div>
  );
};

export default AR;
