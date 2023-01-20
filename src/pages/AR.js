import React from "react";
import "@google/model-viewer/dist/model-viewer";
import style from "../pages/style.css";

const AR = () => (
  <html lang="en">
    <head>
      <title>&lt;model-viewer&gt; example</title>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link rel="stylesheet" href="demo-styles.css" />

      <script
        src="https://unpkg.com/focus-visible@5.0.2/dist/focus-visible.js"
        defer
      ></script>
    </head>
    <body>
      <div id="card">
        <model-viewer
          src="https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?1542147958948"
          ios-src="https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.usdz?v=1569545377878"
          poster="https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b%2Fposter-astronaut.png?v=1599079951717"
          alt="A 3D model of an astronaut"
          shadow-intensity="1"
          camera-controls
          auto-rotate
          ar
        ></model-viewer>
        <section class="attribution">
          <span>
            <h1>Astronaut</h1>
            <span>
              By
              <a
                href="https://poly.google.com/view/dLHpzNdygsg"
                target="_blank"
                rel="noreferrer"
              >
                Poly
              </a>
            </span>
          </span>
          <a
            class="cc"
            href="https://creativecommons.org/licenses/by/2.0/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" />
            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" />
          </a>
        </section>
      </div>

      <footer>
        <span>
          This page is a basic demo of the
          <a
            href="https://github.com/GoogleWebComponents/model-viewer"
            target="_blank"
            rel="noreferrer"
          >
            &lt;model-viewer&gt;
          </a>
          web component.
        </span>
        <span>It makes displaying 3D and AR content on the web easy ✌️</span>
        <a href="https://glitch.com/edit/#!/remix/model-viewer">
          <img
            src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726"
            alt="remix button"
            aria-label="remix"
            height="33"
          />
        </a>
      </footer>

      <script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      ></script>
    </body>
  </html>
);

export default AR;
