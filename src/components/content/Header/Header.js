import PropTypes from "prop-types";
// Third-party imports
import React, { useState, useRef, useEffect } from "react";

import cvFile from "../../../assets/documents/cv.pdf";
// Asset imports
import profile1 from "../../../assets/images/profile1-nbg.png";
import profile2 from "../../../assets/images/profile2-nbg.png";
import profile3 from "../../../assets/images/profile3-nbg.png";
import profile4 from "../../../assets/images/profile4.png";
import profile5 from "../../../assets/images/profile5.png";

// Local imports
import useScrambleEffect from "./useScrambleEffect";
import "./text.scss";

function SocialMedia({ keyword, icon, link, tooltip }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.open(link, "_blank");
  };

  return (
    <div className="social__icon tooltip">
      <button
        type="button"
        onClick={handleClick}
        aria-describedby={`tooltip-${keyword}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick(e);
          }
        }}
      >
        <i className={icon} title={keyword} aria-label={`Go to ${keyword}`} />
      </button>
      <span
        id={`tooltip-${keyword}`}
        className="tooltiptext tooltip-bottom"
        role="tooltip"
        aria-hidden="true"
      >
        {tooltip}
      </span>
    </div>
  );
}

SocialMedia.propTypes = {
  keyword: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

const ChatBubblePart = ({ part }) => <div className={`bub-part-${part}`} />;

const ChatBubbleArrow = () => (
  <div className="speech-arrow">
    {["w", "x", "y", "z"].map((letter) => (
      <div key={letter} className={`arrow-${letter}`} />
    ))}
  </div>
);

const ChatBubble = ({ isVisible }) => {
  const [hintLevel, setHintLevel] = useState(0);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent click from affecting other elements
    setHintLevel((prev) => (prev < 2 ? prev + 1 : prev));
  };

  return (
    <div
      className={`chat-bubble ${isVisible ? "visible" : ""} ${hintLevel > 0 ? `level-${hintLevel}` : ""}`}
      onClick={handleClick}
      onKeyUp={(e) => e.key === "Enter" && handleClick()}
    >
      {["a", "b", "c"].map((part) => (
        <ChatBubblePart key={part} part={part} />
      ))}
      <div className="speech-txt">
        <div
          className={`hint-section initial ${hintLevel >= 0 ? "visible" : ""}`}
        >
          <span className="hint-text">Whispers of a hidden realm echo...</span>
          <div className="hint-divider" />
        </div>
        <div
          className={`hint-section first ${hintLevel >= 1 ? "visible" : ""}`}
        >
          <span className="hint-text">
            Where light meets dark in rhythmic dance,
          </span>
          <div className="hint-divider" />
        </div>
        <div
          className={`hint-section second ${hintLevel >= 2 ? "visible" : ""}`}
        >
          <span className="hint-text">
            Five times shall break the mystic trance.
          </span>
        </div>
        {hintLevel < 2 && (
          <div className="hint-prompt">
            {hintLevel === 0 ? "Tap for more..." : "One more line..."}
          </div>
        )}
      </div>
      {["c", "b", "a"].map((part) => (
        <ChatBubblePart key={`bottom-${part}`} part={part} />
      ))}
      <ChatBubbleArrow />
    </div>
  );
};

ChatBubble.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

const HeaderText = ({ type, items, separator }) => {
  const Tag = type === "name" ? "h1" : "h2";

  return (
    <>
      {items.map((item, i) => (
        <React.Fragment key={item}>
          <Tag>{item}</Tag>
          {separator && i < items.length - 1 && <h2>{separator}</h2>}
        </React.Fragment>
      ))}
      <br />
    </>
  );
};

HeaderText.propTypes = {
  type: PropTypes.oneOf(["name", "roles", "title"]).isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  separator: PropTypes.string,
};

const HEADER_SECTIONS = [
  { type: "name", items: ["Aaron", "Lorenzo", "Woods"] },
  {
    type: "roles",
    items: ["Engineer", "Artist", "Scientist"],
    separator: " | ",
  },
  {
    type: "title",
    items: ["Biomedical", "Engineering", "Doctoral", "Student"],
  },
];

const SOCIAL_MEDIA = [
  {
    keyword: "Email",
    icon: "fas fa-envelope-square",
    link: "mailto:alwoods@utexas.edu",
    tooltip: "Email: alwoods@utexas.edu",
  },
  {
    keyword: "LinkedIn",
    icon: "fab fa-linkedin",
    link: "https://www.linkedin.com/in/woods-aaron/",
    tooltip: "LinkedIn: woods-aaron",
  },
  {
    keyword: "Github",
    icon: "fab fa-github",
    link: "https://github.com/guitarbeat",
    tooltip: "Github: guitarbeat",
  },
  {
    keyword: "Instagram",
    icon: "fab fa-instagram",
    link: "https://www.instagram.com/guitarbeat/",
    tooltip: "Instagram @ guitarbeat",
  },
  {
    keyword: "Twitter",
    icon: "fab fa-x-twitter",
    link: "https://twitter.com/WoodsResearch",
    tooltip: "Twitter @ WoodsResearch",
  },
  {
    keyword: "CV",
    icon: "fas fa-file-alt",
    link: cvFile,
    tooltip: "Download my CV",
  },
  {
    keyword: "Google Scholar",
    icon: "fas fa-graduation-cap",
    link: "https://scholar.google.com/citations?user=85U8cEoAAAAJ&hl=en&authuser=1",
    tooltip: "View my Google Scholar profile",
  },
];

function Header() {
  const headerRef = useRef(null);
  const [profileIndex, setProfileIndex] = useState(() =>
    Math.floor(Math.random() * 5),
  );
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const timerRef = useRef(null);

  useScrambleEffect(headerRef);

  const handleClick = () => setProfileIndex((prev) => (prev + 1) % 5);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsBubbleVisible(true);
    }, 3000); // Reduced to 1.5 seconds for testing
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsBubbleVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="container" id="header" ref={headerRef}>
      <div className="container__content">
        <div className="header">
          <div
            className="header__image-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button type="button" onClick={handleClick}>
              <img
                className={`avatar ${profileIndex === 0 ? "active" : ""}`}
                src={profile1}
                alt="Profile one"
              />
              <img
                className={`avatar ${profileIndex === 1 ? "active" : ""}`}
                src={profile2}
                alt="Profile two"
              />
              <img
                className={`avatar ${profileIndex === 2 ? "active" : ""}`}
                src={profile3}
                alt="Profile three"
              />
              <img
                className={`avatar ${profileIndex === 3 ? "active" : ""}`}
                src={profile4}
                alt="Profile four"
              />
              <img
                className={`avatar ${profileIndex === 4 ? "active" : ""}`}
                src={profile5}
                alt="Profile five"
              />
            </button>
            <ChatBubble isVisible={isBubbleVisible} />
          </div>
          <div className="header__text">
            {HEADER_SECTIONS.map((section) => (
              <HeaderText key={section.type} {...section} />
            ))}
            <div className="social">
              {SOCIAL_MEDIA.map((s) => (
                <SocialMedia key={s.keyword} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
