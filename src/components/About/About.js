import React, { useRef } from "react";
import useScrambleEffect from "../Header/useScrambleEffect";
import { withGoogleSheets } from "react-db-google-sheets";

function ColorChangeOnHover({ text }) {
  // Split the text into words
  const words = text.split(" ");

  // Wrap each word in a span
  const spans = words.map((word, i) => (
    <span key={i} className="hover-color-change">
      {word}{" "}
    </span>
  ));

  return <>{spans}</>;
}

function About({ db }) {
  const aboutRef = useRef(null);

  useScrambleEffect(aboutRef);

  let aboutTexts = db.about
    ? db.about.map((row) => ({
        category: row.category,
        description: row.description,
      }))
    : [];

  return (
    <div id="about" className="container">
      <div className="container__content">
        <div className="about-me" ref={aboutRef}>
          <div className="about-me__img">
            <img src="guitar.png" alt="Guitar" />
          </div>
          <h1>About Me</h1>
          {/* Wrap the text and Spotify element in the new flex container */}
          <div className="about-me__content-container">
            <div className="about-me__text-container">
              {aboutTexts.map(({ category, description }) => (
                <div key={category} className="about-me__text">
                  <h2>{category}</h2>
                  <p>
                    <ColorChangeOnHover text={description} />
                  </p>
                </div>
              ))}
            </div>
            {/* Add the Spotify element */}
            <div className="about-me__spotify">
              <img
                src="https://spotify-github-profile.vercel.app/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_                show_offline=true&background_color=121212&bar_color=53b14f&bar_color_cover=false"
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
