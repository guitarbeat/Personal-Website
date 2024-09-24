import React, { useState, useRef} from "react";
import useScrambleEffect from "./useScrambleEffect";
import incorrectGif from './nu-uh-uh.webp';
import "./text.css";



/**
* Renders a social media button with a tooltip.
* @example
* SocialMedia({ keyword: 'GitHub', icon: 'fa fa-github', link: 'https://github.com', tooltip: 'Visit our GitHub' })
* <div className="social__icon tooltip">
*   <button onClick={handleClick}>
*     <i className="fa fa-github" title="GitHub" aria-label="Go to GitHub" />
*   </button>
*   <span className="tooltiptext">Visit our GitHub</span>
* </div>
* @param {Object} props - Object containing key value pairs for keyword, icon, link, and tooltip.
* @param {string} props.keyword - The name of the social media platform.
* @param {string} props.icon - The CSS class for the font icon eg. 'fa fa-twitter'.
* @param {string} props.link - The URL to the social media platform.
* @param {string} props.tooltip - The text to display in the tooltip.
* @returns {JSX.Element} A React component that displays the social media button with the tooltip.
* @description
*   - The function component makes use of React hooks and JSX.
*   - Clicking the button will open the social media link in a new tab.
*   - The icon has an aria-label for better accessibility.
*   - The tooltip text appears when the user hovers over the button.
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
* Renders the header section of a webpage with user profile and social media links
* @example
* Header()
* <div className="container" id="header">...</div>
* @description
*   - It utilizes a scramble effect on the headerRef content.
*   - It toggles an avatar image upon clicking.
*   - It prompts for a password on double click which can redirect to a secret page.
*   - It handles incorrect password entry by displaying a GIF.
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
  * Handles the password submission event and navigates to secret page if correct
  * @example
  * handlePasswordSubmit({ preventDefault: () => {} })
  * // Assuming password was "bingo", it would navigate to secret URL
  * @param {Object} e - The event object associated with the password submission.
  * @returns {void} Does not return a value.
  * @description
  *   - The function assumes 'password', 'setShowIncorrectGif', 'setPassword', and 'setShowPasswordPrompt' are available in scope.
  *   - The URL "https://aaronwoods.info/bingo" is hardcoded and should be updated if the destination changes.
  *   - The incorrect password feedback is given in the form of a GIF, shown for 3 seconds.
  *   - The function is part of the 'Header' component as defined in 'Header.js'.
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
