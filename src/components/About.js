import React from "react";

function About() {
  return (
    <div id="about" className="container">
      <div className="container__content">
        <div className="about-me">
          <div className="about-me__img">
            <img src="guitar.png" alt="Guitar" />
          </div>
          <h1>About Me</h1>
          {/* Wrap the text and Spotify element in the new div element */}
          <div className="about-me__text-container">
            {/* Add the Spotify element */}
            <div className="about-me__spotify">
              <img
                src="https://spotify-github-profile.vercel.app/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_                show_offline=true&background_color=121212&bar_color=53b14f&bar_color_cover=false"
                alt="Spotify GitHub profile"
              />
            </div>
            <div className="about-me__text">
              <p>
                I am a second-year doctoral student working in a functional
                optics lab that develops and deploys imaging technologies for
                the study of neurovascular physiology and disease. Through the
                use of computational approaches, I am investigating ways to
                improve the qualitative and quantitative analysis of data
                received from various imaging modalities. I received my B.S. in
                Engineering Innovation and Leadership from UT El Paso.
              </p>
              <p>
                I'm interested in science and engineering because it allows me
                to spend time learning new things while also allowing me to
                express myself creatively as an artist. In my free time, I enjoy
                playing music and exploring the outdoors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
