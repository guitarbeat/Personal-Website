import React, { useState, useRef} from "react";
import useScrambleEffect from "./useScrambleEffect";
import incorrectGif from './nu-uh-uh.webp';
import "./text.css";



/**
* Renders a social media icon with a link and a tooltip
* @example
* SocialMedia({ keyword: 'GitHub', icon: 'fa fa-github', link: 'https://github.com', tooltip: 'Visit GitHub' })
* Returns a React component displaying a GitHub icon with a tooltip that links to https://github.com when clicked
* @param {Object} props - The properties for the SocialMedia component.
* @param {string} props.keyword - The name of the social media platform (used for accessibility).
* @param {string} props.icon - The CSS class for the icon font (e.g., 'fa fa-github').
* @param {string} props.link - The URL to the social media platform.
* @param {string} props.tooltip - The text that will be displayed as the tooltip.
* @returns {JSX.Element} A React component that renders the social media icon with a tooltip.
* @description
*   - Assumes an external CSS class 'social__icon' and 'tooltiptext' for styling.
*   - Utilizes Font Awesome or similar icon library classes for the 'icon' prop.
*   - Opens the social media link in a new browser tab using 'window.open'.
*   - Prevents the default action of the anchor on click with 'e.preventDefault()'.
*/
function SocialMedia({ keyword, icon, link, tooltip }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.open(link, "_blank");
  };

  return (
    <div className="social__icon tooltip">
      <button onClick={handleClick}>
        <i className={icon} title={keyword} aria-label={"Go to " + keyword} />
      </button>
      <span className="tooltiptext">{tooltip}</span>
    </div>
  );
}

/**
* Renders the interactive Header component with social media links and a secret double-click feature
* @example
* // Renders Header with no arguments required as it manages its own state
* <Header />
* // The Header component is displayed in the application
* @returns {React.Component} A React component that renders the Header containing social media links and profile images with toggle functionality.
* @description
*   - The component uses internal state to manage toggle states and secret features.
*   - 'social_media' array contains objects with details for each social media link.
*   - Double-clicking the profile image triggers a password prompt for an easter egg feature.
*   - An incorrect password submission results in a GIF display for 3 seconds.
*/
function Header() {
  let social_media = [
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
      icon: "fab fa-twitter",
      link: "https://twitter.com/WoodsResearch",
      tooltip: "Twitter @ WoodsResearch",
    },
    {
      keyword: "CV",
      icon: "fas fa-file-alt",
      link: "/cv.pdf",
      tooltip: "Download my CV",
    },
    {
      keyword: "Google Scholar",
      icon: "fas fa-graduation-cap",
      link: "https://scholar.google.com/citations?user=85U8cEoAAAAJ&hl=en&authuser=1",
      tooltip: "View my Google Scholar profile"
    }
  ];

  const headerRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [showIncorrectGif, setShowIncorrectGif] = useState(false);

  useScrambleEffect(headerRef);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleDoubleClick = () => {
    setShowPasswordPrompt(true);
  };

  /**
  * Handles the submission of the password prompt in the header component
  * @example
  * handleSubmit({preventDefault: () => {}});
  * Redirects to bingo page or shows incorrect GIF
  * @param {Object} e - The event object from the password submission.
  * @returns {void} No return value.
  * @description
  *   - This function should be triggered on form submission.
  *   - It assumes global variables 'password', 'setShowIncorrectGif', 'setPassword', and 'setShowPasswordPrompt' are available.
  *   - The string "bingo" is used as a placeholder password.
  *   - Location redirection and GIF display are side effects.
  */
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "bingo") {  // Replace with your desired password
      window.location.href = "https://aaronwoods.info/bingo";
    } else {
      setShowIncorrectGif(true);
      setTimeout(() => {
        setShowIncorrectGif(false);
      }, 3000);  // Hide the GIF after 3 seconds
    }
    setPassword("");
    setShowPasswordPrompt(false);
  };

 
  return (
    <div className="container" id="header" ref={headerRef}>
      <div className="container__content">
        <div className="header">
          <div className="header__image-container">
          <button
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              >
              <img 
                className={`avatar ${isClicked ? "" : "active"}`}
                src={process.env.PUBLIC_URL + "/profile1-nbg.png"}
                alt="image1"
              />
              <img
                className={`avatar ${isClicked ? "active" : ""}`}
                src={process.env.PUBLIC_URL + "/profile2-nbg.png"}
                alt="image2"
              />
             
           </button>
              <div className="chat-bubble">Double click the toggle button<br />for an optical surprise!</div>
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
            <h3> Doctoral</h3> <h3> Student</h3>
            <br />
            <div className="social">
              {social_media.map((s) => (
                <SocialMedia key={s.keyword} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showPasswordPrompt && (
        <div className="password-prompt">
          <div className="password-prompt-inner">
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">LOGIN</button>
            </form>
          </div>
        </div>
      )}
 {showIncorrectGif && (
  <div className="incorrect-gif">
    <iframe 
      src={incorrectGif}
      width="480" 
      height="360" 
      className="giphy-embed" 
      allowFullScreen
      title="Incorrect password GIF"
    ></iframe>
  </div>
)}
    </div>
  );
  
}



export default Header;
