import React, { useState, useRef} from "react";
import useScrambleEffect from "./useScrambleEffect";
import incorrectGif from './nu-uh-uh.webp';
import "./text.css";



/**
* Renders a social media icon with a click event
* @example
* SocialMedia({ keyword: 'Instagram', icon: 'fab fa-instagram', link: 'https://instagram.com', tooltip: 'Follow us on Instagram' })
* Renders Instagram icon as a button that links to the specified Instagram profile with a tooltip
* @param {object} props - The props object containing keyword, icon, link, and tooltip.
* @param {string} props.keyword - Name of the social media platform (e.g., 'Instagram').
* @param {string} props.icon - Class name for font awesome icon (e.g., 'fab fa-instagram').
* @param {string} props.link - URL for the social media profile (e.g., 'https://instagram.com').
* @param {string} props.tooltip - Tooltip text to describe the icon action (e.g., 'Follow us on Instagram').
* @returns {JSX.Element} JSX code for rendering the social media icon component.
* @description
*   - This component should be used inside a parent component, ideally a header or a footer.
*   - The icon uses Font Awesome classes and requires Font Awesome to be included in the project.
*   - Clicking the icon will open the social media profile in a new tab.
*   - A 'tooltip' class provides additional information when hovering over the icon.
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
* Renders a header component with dynamic features like image toggle and password prompt
* @example
* <Header />
* Renders the Header component with profile images, social media links, and a secret password prompt.
* @param {type} {Argument} - Argument description in one line.
* This function does not take any parameters.
* @returns {JSX.Element} Header component with dynamic features such as profile image toggle and secret password prompt.
* @description
*   - The password for the hidden link is set to "bingo".
*   - Double-clicking the profile image will prompt for the secret password.
*   - Incorrect password submission triggers a GIF display for 3 seconds.
*   - Uses useState for state management and useRef for DOM references.
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
  * Handles the password submission event
  * @example
  * handleSubmit({ preventDefault: () => {} })
  * undefined
  * @param {Object} e - The event object passed by the form submission.
  * @returns {void} Does not return any value.
  * @description
  *   - Assumes 'password' is a state variable in the scope of this function.
  *   - 'setShowIncorrectGif', 'setPassword', and 'setShowPasswordPrompt' are state setter functions.
  *   - Navigation occurs if the password matches 'bingo'.
  *   - Incorrect password triggers a temporary GIF display.
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
