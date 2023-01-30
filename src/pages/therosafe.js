import React from "react";
import "../pages/styles.css";

const AR = () => {
  const cards = [
    {
      src: "cart.glb",
      iosSrc: "cart.usdz",
      poster: "cart.webp",
      title: "Therosafe",
      // author: "Reduc",
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
              <h2>{card.author}</h2>
            </span>
          </section>
        </div>
      ))}
    </div>
  );
};

export default AR;
