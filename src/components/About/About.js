// path/filename: src/components/About.js

import React, { useRef } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

import useScrambleEffect from "../Header/useScrambleEffect";


function ColorChangeOnHover({ text }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="hover-color-change">
          {word}{" "}
        </span>
      ))}
    </>
  );
}

function About({ db }) {
  const aboutRef = useRef(null);

  // Removed isMobile variable as it's not needed anymore

  useScrambleEffect(aboutRef);

  const aboutTexts = db.about
    ? db.about.map((row) => ({
        category: row.category,
        description: row.description,
      }))
    : [];

  const renderAboutTexts = (texts) =>
    texts.map(({ category, description }) => (
      <div key={category} className="about-me__text">
        <div className="text-background">
          <h2>{category}</h2>
          <p>
            <ColorChangeOnHover text={description} />
          </p>
        </div>
      </div>
    ));

  return (
    <div id="about" className="container">
      <div className="container__content">
        <div className="about-me" ref={aboutRef}>
          <div className="about-me__img">
            <img src="guitar.png" alt="Guitar" />
          </div>
          <h1>About Me</h1>
          <div className="about-me__content-container">
            <div className="about-me__text-container">
              {renderAboutTexts(aboutTexts)}
            </div>
            <div className="about-me__spotify">
              <a href="https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&redirect=true">
                <img
                  src="https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_offline=true&background_color=121212&interchange=true&bar_color=53b14f&bar_color_cover=true"
                  alt="Spotify GitHub profile"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default withGoogleSheets("about")(About);
