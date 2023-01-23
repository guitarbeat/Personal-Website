//https://www.digitalocean.com/community/tutorials/how-to-handle-routing-in-react-apps-with-react-router
import React, { useState } from "react";
import "@google/model-viewer";
import "../pages/styles.css";

const models = [
  {
    name: "Astronaut",
    src: "https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?1542147958948",
    iosSrc:
      "https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.usdz?v=1569545377878",
    poster:
      "https://cdn.glitch.com/36cb8393-65c6-408d-a536-055ada20431b/poster-astronaut.png?v=1599079951717",
  },
  {
    name: "Blood",
    src: "https://foil-vasc.s3.us-east-2.amazonaws.com/blood.glb",
    iosSrc: "https://foil-vasc.s3.us-east-2.amazonaws.com/blood.usdz",
    poster: "https://foil-vasc.s3.us-east-2.amazonaws.com/poster.webp",
  },
];

const AR = () => {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  <script>
    const ModelViewerElement = customElements.get('model-viewer');
    ModelViewerElement.dracoDecoderLocation =
    'http://example.com/location/of/draco/decoder/files/';
  </script>;
  return (
    <div id="card">
      <model-viewer
        src={selectedModel.src}
        ios-src={selectedModel.iosSrc}
        poster={selectedModel.poster}
        alt={`A 3D model of ${selectedModel.name}`}
        shadow-intensity="1"
        camera-controls
        auto-rotate
        ar
      >
        <div className="slider">
          <div className="slides">
            {models.map((model, index) => (
              <button
                className={`slide ${
                  model.name === selectedModel.name ? "selected" : ""
                }`}
                key={index}
                onClick={() => setSelectedModel(model)}
                style={{ backgroundImage: `url(${model.poster})` }}
              ></button>
            ))}
          </div>
        </div>
        <button slot="ar-button" id="ar-button">
          View in your space
        </button>
        <div id="ar-prompt">
          <img src="../src/pages/ar_hand_prompt.png" alt="ar_hand_prompt" />
        </div>
      </model-viewer>
    </div>
  );
};

export default AR;
