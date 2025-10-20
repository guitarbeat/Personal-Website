import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import deniedAudio from "../../../assets/audio/didn't-say-the-magic-word.mp3";
import deniedImage from "../../../assets/images/nu-uh-uh.webp";
import deniedCaptions from "../../../assets/audio/didnt-say-the-magic-word.vtt";

const NuUhUhEasterEgg = ({ onClose }) => {
  const audioRef = useRef(null);
  const overlayRef = useRef(
    typeof document !== "undefined" ? document.createElement("div") : null,
  );

  useEffect(() => {
    const overlayNode = overlayRef.current;

    if (!overlayNode || typeof document === "undefined") {
      return undefined;
    }

    overlayNode.className = "nuuhuh-overlay";
    document.body.appendChild(overlayNode);

    return () => {
      if (overlayNode.parentNode) {
        overlayNode.parentNode.removeChild(overlayNode);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      return undefined;
    }

    const handleEnded = () => {
      onClose?.();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    const attemptPlayback = async () => {
      try {
        await audioElement.play();
      } catch (error) {
        console.warn("Audio playback failed", error);
      }
    };

    attemptPlayback();

    audioElement.addEventListener("ended", handleEnded);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.removeEventListener("ended", handleEnded);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!overlayRef.current || typeof document === "undefined") {
    return null;
  }

  const handleBackdropKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClose?.();
    }
  };

  return createPortal(
    <>
      <div
        className="nuuhuh-overlay__backdrop"
        role="button"
        tabIndex={0}
        aria-label="Dismiss access denied Easter egg"
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
      />
      <dialog
        open
        className="nuuhuh-overlay__content glitch-effect"
        aria-label="Access denied Easter egg"
      >
        <img
          src={deniedImage}
          alt="Dennis Nedry from Jurassic Park saying 'uh-uh-uh, you didn't say the magic word'"
          className="nuuhuh-overlay__image"
        />
        <p className="nuuhuh-overlay__message">Access Denied</p>
        <p className="nuuhuh-overlay__hint">Nu-uh-uh! You didn't say the magic word.</p>
        <button type="button" className="nuuhuh-overlay__close-btn" onClick={onClose}>
          Dismiss
        </button>
        <audio ref={audioRef} src={deniedAudio} preload="auto">
          <track
            kind="captions"
            src={deniedCaptions}
            srcLang="en"
            label="English captions"
            default
          />
        </audio>
      </dialog>
    </>,
    overlayRef.current,
  );
};

export default NuUhUhEasterEgg;
