import PropTypes from "prop-types";
// Third-party imports
import React, { useEffect, useRef, useState } from "react";

import cvFile from "../../../assets/documents/cv.pdf";
// Asset imports
import profile1 from "../../../assets/images/profile1-nbg.png";
import profile2 from "../../../assets/images/profile2-nbg.png";
import profile3 from "../../../assets/images/profile3-nbg.png";
import profile4 from "../../../assets/images/profile4.png";

// Local imports
import { cn, isAboveBreakpoint, randomInt } from "../../../utils/commonUtils";
import "./text.scss";

// * Breakpoint constant - matches SCSS breakpoint system
const DESKTOP_BREAKPOINT = 768;

function useScrambleEffect(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    // * Early return if ref is not available
    if (!ref?.current) {
      return undefined;
    }

    // * Store event handlers for cleanup
    const eventHandlers = new Map();

    const enhance = () => {
      if (isAboveBreakpoint(DESKTOP_BREAKPOINT) && ref.current) {
        const headers = Array.from(
          ref.current.querySelectorAll("h1,h2,h3"),
        ) as HTMLElement[];
        for (const header of headers) {
          const letters = (header.textContent || "").split("");
          header.textContent = "";
          for (const letter of letters) {
            const span = document.createElement("span");
            span.className = "letter";
            if (letter === " ") {
              span.innerHTML = "&nbsp;";
            } else {
              span.textContent = letter;
            }
            header.appendChild(span);
          }
        }

        const letterElements = Array.from(
          ref.current.querySelectorAll(".letter"),
        ) as HTMLElement[];
        for (const letter of letterElements) {
          // * Create event handlers
          const handleMouseOver = (e: Event) => {
            const target = e.target as HTMLElement;
            target.style.setProperty("--x", `${randomInt(-10, 10)}px`);
            target.style.setProperty("--y", `${randomInt(-10, 10)}px`);
            target.style.setProperty("--r", `${randomInt(-10, 10)}deg`);
          };

          const handleMouseOut = (e: Event) => {
            const target = e.target as HTMLElement;
            target.style.setProperty("--x", "0px");
            target.style.setProperty("--y", "0px");
            target.style.setProperty("--r", "0deg");
          };

          // * Store handlers for cleanup
          eventHandlers.set(letter, {
            mouseover: handleMouseOver,
            mouseout: handleMouseOut,
          });

          // * Add event listeners
          letter.addEventListener("mouseover", handleMouseOver);
          letter.addEventListener("mouseout", handleMouseOut);
        }
      }
    };

    enhance();

    // * Cleanup function to remove all event listeners
    return () => {
      eventHandlers.forEach((handlers, letter) => {
        letter.removeEventListener("mouseover", handlers.mouseover);
        letter.removeEventListener("mouseout", handlers.mouseout);
      });
      eventHandlers.clear();
    };
  }, [ref]);
}

interface SocialMediaProps {
  keyword: string;
  icon?: string;
  link: string;
  tooltip: string;
  customIcon?: string;
}

function SocialMedia({
  keyword,
  icon,
  link,
  tooltip,
  customIcon,
}: SocialMediaProps) {
  return (
    <div className="social__icon tooltip">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={tooltip}
        aria-describedby={`tooltip-${keyword}`}
      >
        {customIcon ? (
          <img
            src={customIcon}
            alt={keyword}
            className="custom-icon"
            title={keyword}
          />
        ) : (
          <span role="img" className={icon} title={keyword} />
        )}
      </a>
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
  icon: PropTypes.string,
  link: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  customIcon: PropTypes.string,
};

const ChatBubblePart = ({ part }: { part: string }) => (
  <div className={`bub-part-${part}`} />
);

const ChatBubbleArrow = () => {
  // * SVG arrow provides crisp rendering, perfect borders, and rounded corners
  // * Single element replaces 4 divs, improving performance and maintainability
  return (
    <svg
      className="speech-arrow"
      width="26"
      height="14"
      viewBox="0 0 26 14"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 0 14 Q 0 14 2.5 11.5 L 11 3 Q 13 1 13 1 Q 13 1 15 3 L 23.5 11.5 Q 26 14 26 14"
        fill="var(--bubble-background)"
        stroke="var(--bubble-border)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ChatBubble = ({ isVisible }: { isVisible: boolean }) => {
  const [hintLevel, setHintLevel] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from affecting other elements
    setHintLevel((prev) => (prev < 2 ? prev + 1 : prev));
  };

  return (
    <button
      type="button"
      className={cn(
        "chat-bubble",
        isVisible && "visible",
        hintLevel > 0 && `level-${hintLevel}`,
      )}
      onClick={handleClick}
    >
      {["a", "b", "c"].map((part) => (
        <ChatBubblePart key={part} part={part} />
      ))}
      <div className="speech-txt">
        <div
          className={cn("hint-section", "initial", hintLevel >= 0 && "visible")}
        >
          <span className="hint-text">A glitch in the matrix awaits...</span>
          <div className="hint-divider" />
        </div>
        <div
          className={cn("hint-section", "first", hintLevel >= 1 && "visible")}
        >
          <span className="hint-text">Where binary worlds collide,</span>
          <div className="hint-divider" />
        </div>
        <div
          className={cn("hint-section", "second", hintLevel >= 2 && "visible")}
        >
          <span className="hint-text">Five rapid shifts unlock the code.</span>
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
    </button>
  );
};

ChatBubble.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

interface HeaderTextProps {
  type: "name" | "roles" | "title";
  items: string[];
  separator?: string;
}

const HeaderText = ({ type, items, separator }: HeaderTextProps) => {
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

const HEADER_SECTIONS: {
  type: "name" | "roles" | "title";
  items: string[];
  separator?: string;
}[] = [
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
    keyword: "GitHub",
    icon: "fab fa-github",
    link: "https://github.com/guitarbeat",
    tooltip: "GitHub: guitarbeat",
  },
  {
    keyword: "Instagram",
    icon: "fab fa-instagram",
    link: "https://www.instagram.com/guitarbeat/",
    tooltip: "Instagram: @guitarbeat",
  },
  {
    keyword: "Twitter",
    icon: "fab fa-x-twitter",
    link: "https://twitter.com/WoodsResearch",
    tooltip: "Twitter: @WoodsResearch",
  },
  // {
  //   keyword: "BlueSky",
  //   icon: "",
  //   customIcon: blueskyIcon,
  //   link: "https://bsky.app/profile/guitarbeat.bsky.social",
  //   tooltip: "BlueSky: @guitarbeat",
  // },
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

const PROFILE_IMAGES = [
  { src: profile1, alt: "Profile one" },
  { src: profile2, alt: "Profile two" },
  { src: profile3, alt: "Profile three" },
  { src: profile4, alt: "Profile four", isFallback: true },
];

const FALLBACK_PROFILE_SRC =
  PROFILE_IMAGES.find((image) => image.isFallback)?.src ??
  PROFILE_IMAGES[0].src;

function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [profileIndex, setProfileIndex] = useState<number>(() =>
    Math.floor(Math.random() * PROFILE_IMAGES.length),
  );
  const [isBubbleVisible, setIsBubbleVisible] = useState<boolean>(false);
  const hoverCountRef = useRef<number>(0);
  const clickTimesRef = useRef<number[]>([]);
  const lastHoverTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  useScrambleEffect(headerRef);

  const handleClick = () => {
    const now = Date.now();
    clickTimesRef.current.push(now);

    // Keep only clicks within last 3 seconds
    clickTimesRef.current = clickTimesRef.current.filter(
      (time) => now - time < 3000,
    );

    // If 3+ clicks in quick succession, show hint
    if (clickTimesRef.current.length >= 3 && !isBubbleVisible) {
      setIsBubbleVisible(true);
      clickTimesRef.current = [];
    }

    setProfileIndex((prev) => (prev + 1) % PROFILE_IMAGES.length);
  };

  const handleMouseEnter = () => {
    const now = Date.now();

    // Track rapid hover entries (unusual behavior)
    if (lastHoverTimeRef.current && now - lastHoverTimeRef.current < 1000) {
      hoverCountRef.current += 1;
    } else {
      hoverCountRef.current = 1;
    }

    lastHoverTimeRef.current = now;

    // Only show if user hovers multiple times quickly (5+ times)
    if (hoverCountRef.current >= 5 && !isBubbleVisible) {
      setIsBubbleVisible(true);
      hoverCountRef.current = 0;
    }
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Don't hide immediately - let it fade naturally if user moves away
    timerRef.current = setTimeout(() => {
      setIsBubbleVisible(false);
      hoverCountRef.current = 0;
    }, 2000);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = FALLBACK_PROFILE_SRC;
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
          <div className="header__image-container">
            <button
              type="button"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              aria-label="Change profile image"
            >
              {PROFILE_IMAGES.map(({ src, alt }, index) => (
                <img
                  key={src}
                  className={cn("avatar", profileIndex === index && "active")}
                  src={src}
                  alt={alt}
                  onError={handleImageError}
                />
              ))}
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
