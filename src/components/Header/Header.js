import React, { useState, useRef} from "react";
import useScrambleEffect from "./useScrambleEffect";
import incorrectGif from './nu-uh-uh.webp';
import "./text.css";



/**
* Renders a social media icon with a link and tooltip
* @example
* SocialMedia({ keyword: 'Facebook', icon: 'fa fa-facebook', link: 'https://www.facebook.com', tooltip: 'Follow us on Facebook' })
* <div class="social__icon tooltip">
*   <button onClick={ [Function handleClick] }>
*     <i class="fa fa-facebook" title="Facebook" aria-label="Go to Facebook"></i>
*   </button>
*   <span class="tooltiptext">Follow us on Facebook</span>
* </div>
* @param {Object} props - The component props containing the social media information.
* @param {string} props.keyword - A unique identifier for the social media platform.
* @param {string} props.icon - The class name(s) for the icon font representing the social platform.
* @param {string} props.link - The URL to the social media platform.
* @param {string} props.tooltip - The message to show when the icon is hovered.
* @returns {React.Component} A react component representing a social media icon.
* @description
*   - The handleClick function prevents the default link behavior and opens the link in a new tab.
*   - The component expects certain props to be passed to it, specifically keyword, icon, link, and tooltip.
*   - It is assumed that FontAwesome or a similar icon font library is used for the icon prop.
*   - The aria-label attribute is constructed to enhance accessibility by giving screen readers the context of the link.
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
* Renders a header with social media links and interactive elements
* @example
* Header()
* <div className="container" id="header">...</div>
* @param None No parameters are taken by this function.
* @returns {ReactElement} JSX for the header component.
* @description
*   - The function relies on internal state and React hooks to manage user interaction.
*   - Images change on click and a password prompt appears on double click.
*   - A correct password submission triggers a navigation to a new URL.
*   - In the event of an incorrect password, a GIF is displayed for 3 seconds.
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
  * Redirects to a new page if password is correct, otherwise shows an incorrect password indication
  * @example
  * handlePasswordSubmit({preventDefault: () => {}})
  * @param {Object} e - The event object from the password submission.
  * @returns {void} Does not return a value.
  * @description
  *   - 'password', 'setShowIncorrectGif', 'setPassword', and 'setShowPasswordPrompt' should be in scope.
  *   - The string "bingo" is the hardcoded correct password.
  *   - If the password is incorrect, a GIF is displayed for 3 seconds.
  *   - Clear the password input field and hide the password prompt regardless of password correctness.
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
