import React, { useState, useRef } from "react";
import useScrambleEffect from "./useScrambleEffect";

function SocialMedia({ keyword, icon, link, tooltip }) {
  return (
    <div className="social__icon tooltip">
      <a href={link} target="_blank" rel="noreferrer">
        <i className={icon} title={keyword} aria-label={"Go to " + keyword} />
      </a>
      <span className="tooltiptext">{tooltip}</span>
    </div>
  );
}

function Header() {
  let social_media = [
    {
      keywork: "Email",
      icon: "fas fa-envelope-square",
      link: "mailto:alwoods@utexas.edu",
      tooltip: "Email: alwoods@utexas.edu",
    },
    {
      keywork: "LinkedIn",
      icon: "fab fa-linkedin",
      link: "https://www.linkedin.com/in/woods-aaron/",
      tooltip: "LinkedIn: woods-aaron",
    },
    {
      keywork: "Github",
      icon: "fab fa-github",
      link: "https://github.com/guitarbeat",
      tooltip: "Github: guitarbeat",
    },
    // {
    //   keywork: "ORCID",
    //   icon: "fab fa-orcid",
    //   link: "https://orcid.org/0000-0001-6786-9243",
    // },
    {
      keywork: "Instagram",
      icon: "fab fa-instagram",
      link: "https://www.instagram.com/guitarbeat/",
      tooltip: "Instagram @ guitarbeat",
    },
    {
      keywork: "Twitter",
      icon: "fab fa-twitter",
      link: "https://twitter.com/WoodsResearch",
      tooltip: "Twitter @ WoodsResearch",
    },
    // {
    //   keywork: "ResearchGate",
    //   icon: "fab fa-researchgate",
    //   link: "https://www.researchgate.net/profile/Aaron-Woods-7",
    // },
    {
      keywork: "CV",
      icon: "fas fa-file-alt",
      link: "/cv.pdf",
      tooltip: "Download my CV",
    },
  ];

  const headerRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  useScrambleEffect(headerRef);

  return (
    <div className="container" id="header" ref={headerRef}>
      <div className="container__content">
        <div className="header">
          <div className="header__image-container">
            <a onClick={handleClick}>
              <img
                className={`hover-effect ${isClicked ? "active" : ""}`}
                src={process.env.PUBLIC_URL + "/profile2.png"}
                alt="image1"
              />
              <img
                className={isClicked ? "" : "active"}
                src={process.env.PUBLIC_URL + "/profile1-nbg.png"}
                alt="image2"
              />
            </a>
          </div>
          <div className="header__text">
            <h1>Aaron </h1>
            <h1>Lorenzo </h1> <h1>Woods</h1>
            <br />
            <h2>Engineer</h2>
            <h2> | </h2>
            <h2>Artist</h2>
            <h2> | </h2>
            <h2>Scientist</h2>
            <br />
            <h3>Biomedical</h3>
            <h3> Engineering</h3>
            <h3> Doctoral</h3> <h3>Student</h3>
            <br />
            <div className="social">
              {social_media.map((s) => (
                <SocialMedia key={s.keywork} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
