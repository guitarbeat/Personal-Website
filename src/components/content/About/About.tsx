// About section content component for the personal website.

import { useCallback, useEffect, useState } from "react";
// import { processAboutData } from "../../../utils/googleSheetsUtils";
import shell from "../../../assets/images/shell.png";
// import { withGoogleSheets } from "react-db-google-sheets";
import { useNotion } from "../../../contexts/NotionContext.tsx";
import { cn } from "../../../utils/commonUtils.ts";

const SPOTIFY_PROFILE_URL =
  "https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&redirect=true";
const SPOTIFY_IMAGE_URL =
  "https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_offline=true&background_color=121212&interchange=true&bar_color=53b14f&bar_color_cover=true";

function ColorChangeOnHover({ text = "" }) {
  const words = text.split(/\s+/).filter(Boolean);
  const wordOccurrences = new Map();

  return (
    <>
      {words.map((word) => {
        const occurrence = (wordOccurrences.get(word) ?? 0) + 1;
        wordOccurrences.set(word, occurrence);

        return (
          <span key={`${word}-${occurrence}`} className="hover-color-change">
            {word}{" "}
          </span>
        );
      })}
    </>
  );
}

function About() {
  const [expandedSection, setExpandedSection] = useState(null);
  const { db } = useNotion();

  const aboutTexts = db.about || [];

  const handleSectionClick = (category) => {
    setExpandedSection(expandedSection === category ? null : category);
  };

  // * Suppress Spotify scheme errors globally
  useEffect(() => {
    const handleError = (event) => {
      // * Suppress errors related to Spotify URI scheme handlers
      if (
        event.message?.includes("spotify:") ||
        event.message?.includes("scheme does not have a registered handler")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleUnhandledRejection = (event) => {
      // * Suppress unhandled promise rejections related to Spotify
      if (
        event.reason?.message?.includes("spotify:") ||
        event.reason?.message?.includes(
          "scheme does not have a registered handler",
        )
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  // * Handle Spotify widget click with error handling for missing handler
  const handleSpotifyClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    // * The Spotify GitHub profile widget redirects to a spotify: URI scheme
    // * which can fail if Spotify isn't installed or the handler isn't registered.
    // * We'll open the profile URL and catch any navigation errors.
    const openSpotifyProfile = () => {
      try {
        // * Use window.open with a timeout to detect if navigation fails
        const newWindow = window.open(
          SPOTIFY_PROFILE_URL,
          "_blank",
          "noopener,noreferrer",
        );

        // * If window.open returns null (blocked) or fails, fallback to web player
        if (!newWindow || newWindow.closed) {
          throw new Error("Window blocked or failed to open");
        }

        // * Set a timeout to detect if the window was closed due to scheme error
        setTimeout(() => {
          try {
            if (newWindow.closed) {
              // * Window was closed, likely due to scheme error
              // * Fallback to web player
              window.open(
                "https://open.spotify.com/user/31skxfoaghlkljkdiluds3g3decy",
                "_blank",
                "noopener,noreferrer",
              );
            }
          } catch (fallbackError) {
            // * Silently handle fallback errors
          }
        }, 500);
      } catch (error) {
        // * Fallback to Spotify web player if direct link fails
        try {
          window.open(
            "https://open.spotify.com/user/31skxfoaghlkljkdiluds3g3decy",
            "_blank",
            "noopener,noreferrer",
          );
        } catch (fallbackError) {
          // * Silently handle errors - user's popup blocker may be active
        }
      }
    };

    openSpotifyProfile();
  }, []);

  const renderAboutTexts = (texts) =>
    texts.map(({ category, description }) => (
      <button
        key={category}
        type="button"
        className={cn(
          "about-me__text",
          expandedSection === category && "expanded",
        )}
        onClick={() => handleSectionClick(category)}
      >
        <div className="text-background">
          <h2>{category}</h2>
          <p>
            <ColorChangeOnHover text={description} />
          </p>
          <div className="expand-indicator" aria-hidden="true">
            {expandedSection === category ? "−" : "+"}
          </div>
        </div>
      </button>
    ));

  return (
    <div id="about" className="container">
      <div className="container__content">
        <div className="about-me">
          <h1>About Me</h1>
          <div className="about-me__content">
            <div className="about-me__text-container">
              {renderAboutTexts(aboutTexts)}
            </div>
            <div className="about-me__spotify">
              <a
                href={SPOTIFY_PROFILE_URL}
                onClick={handleSpotifyClick}
                aria-label="View Spotify profile"
              >
                <img src={SPOTIFY_IMAGE_URL} alt="Spotify GitHub profile" />
              </a>
            </div>
          </div>
          <div className="about-me__img">
            <img src={shell} alt="shell background" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
