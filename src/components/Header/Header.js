// Third-party imports
import React, { useState, useRef} from "react"

// Context imports
import { useAuth } from '../../context/AuthContext'

// Local imports
import incorrectAudio from '../../assets/didn\'t-say-the-magic-word.mp3'
import incorrectGif from './nu-uh-uh.webp'
import useScrambleEffect from './useScrambleEffect'
import Matrix from './Matrix'
import profile1 from '../../assets/images/profile1-nbg.png';
import profile2 from '../../assets/images/profile2-nbg.png';

// Styles
import './text.scss'

function SocialMedia({ keyword, icon, link, tooltip }) {
  const handleClick = (e) => {
    e.preventDefault()
    window.open(link, "_blank")
  }

  return (
    <div className="social__icon tooltip">
      <button onClick={handleClick}>
        <i className={icon} title={keyword} aria-label={"Go to " + keyword} />
      </button>
      <span className="tooltiptext">{tooltip}</span>
    </div>
  )
}

const ChatBubblePart = ({ part }) => (
  <div className={`bub-part-${part}`}></div>
)

const ChatBubbleArrow = () => (
  <div className="speech-arrow">
    {['w', 'x', 'y', 'z'].map(letter => (
      <div key={letter} className={`arrow-${letter}`}></div>
    ))}
  </div>
)

const ChatBubble = () => (
  <div className="chat-bubble">
    {['a', 'b', 'c'].map(part => (
      <ChatBubblePart key={part} part={part} />
    ))}
    <div className="speech-txt">
      <span className="hint-text">Curious visitor, a secret lies within...</span>
      <span className="password-hint">In five letters my essence flows,<br/>The name that starts this tale unfolds.<br/>Not Woods, but what comes before,<br/>In humble case, unlocks the door.</span>
    </div>
    {['c', 'b', 'a'].map(part => (
      <ChatBubblePart key={`bottom-${part}`} part={part} />
    ))}
    <ChatBubbleArrow />
  </div>
)

const usePasswordHandler = () => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [password, setPassword] = useState("")
  const [showIncorrectGif, setShowIncorrectGif] = useState(false)
  const audioRef = useRef(null)
  const { unlock } = useAuth()

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === "aaron") {
      unlock()
      setShowPasswordPrompt(false)
    } else {
      setShowIncorrectGif(true)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
        audioRef.current.onloadedmetadata = () => {
          const audioDuration = audioRef.current.duration * 1000
          setTimeout(() => setShowIncorrectGif(false), audioDuration)
        }
      }
    }
    setPassword("")
  }

  return {
    showPasswordPrompt,
    setShowPasswordPrompt,
    password,
    setPassword,
    showIncorrectGif,
    audioRef,
    handlePasswordSubmit
  }
}

const HeaderText = ({ type, items, separator }) => {
  const Tag = type === 'name' ? 'h1' : 'h2'
  
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
  )
}

const HEADER_SECTIONS = [
  { type: 'name', items: ['Aaron', 'Lorenzo', 'Woods'] },
  { type: 'roles', items: ['Engineer', 'Artist', 'Scientist'], separator: ' | ' },
  { type: 'title', items: ['Biomedical', 'Engineering', 'Doctoral', 'Student'] }
]

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
]

function Header() {
  const headerRef = useRef(null)
  const [isClicked, setIsClicked] = useState(false)
  const {
    showPasswordPrompt,
    setShowPasswordPrompt,
    password,
    setPassword,
    showIncorrectGif,
    audioRef,
    handlePasswordSubmit
  } = usePasswordHandler()

  useScrambleEffect(headerRef)

  const handleClick = () => setIsClicked(!isClicked)
  const handleDoubleClick = () => setShowPasswordPrompt(true)

  return (
    <div className="container" id="header" ref={headerRef}>
      <div className="container__content">
        <div className="header">
          <div className="header__image-container">
            <button onClick={handleClick} onDoubleClick={handleDoubleClick}>
              <img 
                className={`avatar ${isClicked ? "" : "active"}`}
                src={profile1}
                alt="image1"
              />
              <img
                className={`avatar ${isClicked ? "active" : ""}`}
                src={profile2}
                alt="image2"
              />
            </button>
            <ChatBubble />
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
      {showPasswordPrompt && (
        <>
          <Matrix />
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
        </>
      )}
      {showIncorrectGif && (
        <img src={incorrectGif} alt="Incorrect password" className="incorrect-gif" />
      )}
      <audio ref={audioRef} className="password-audio">
        <source src={incorrectAudio} type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default Header
