// path/filename: src/components/About.js

import React, { useRef } from "react";
import useScrambleEffect from "../Header/useScrambleEffect";
import { withGoogleSheets } from "react-db-google-sheets";

// Removed Carousel import
// Removed CSS import for Carousel

// Custom hook to check if device is mobile (No longer needed, can be removed)
// const useIsMobile = () => {
//   return window.innerWidth <= 768;
// };

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
              <img
                src="https://spotify-github-profile.vercel.app/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_offline=true&background_color=121212&bar_color=53b14f&bar_color_cover=false"
                alt="Spotify GitHub profile"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withGoogleSheets("about")(About);
