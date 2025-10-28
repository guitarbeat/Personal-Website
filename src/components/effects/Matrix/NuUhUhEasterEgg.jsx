import React, { useEffect, useRef, useState } from "react";

import deniedAudio from "../../../assets/audio/didn't-say-the-magic-word.mp3";
import deniedImage from "../../../assets/images/nu-uh-uh.webp";
import deniedCaptions from "../../../assets/audio/didnt-say-the-magic-word.vtt";

const NuUhUhEasterEgg = ({ onClose, id }) => {
  const audioRef = useRef(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(9999);
  const containerRef = useRef(null);

  // * Generate random position for each instance
  useEffect(() => {
    const randomX = Math.random() * (window.innerWidth - 400) + 100;
    const randomY = Math.random() * (window.innerHeight - 300) + 100;
    setPosition({ x: randomX, y: randomY });
  }, []);

  // * Bring to front on click
  useEffect(() => {
    const currentZIndex = zIndex;
    const newZIndex = currentZIndex + 1;
    setZIndex(newZIndex);
  }, []);

  // * Drag handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.nuuhuh-overlay__content')) {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        // Bring to front
        setZIndex((prev) => prev + 1);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      return undefined;
    }

    const attemptPlayback = async () => {
      try {
        await audioElement.play();
      } catch (error) {
        console.warn("Audio playback failed", error);
      }
    };

    attemptPlayback();

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="nuuhuh-overlay"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <dialog
        open
        className="nuuhuh-overlay__content glitch-effect"
        aria-label="Access denied Easter egg"
      >
        <button 
          type="button" 
          className="nuuhuh-overlay__close-btn" 
          onClick={onClose}
          style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem' }}
        >
          ×
        </button>
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
        <audio 
          ref={audioRef} 
          src={deniedAudio} 
          preload="auto"
          autoPlay
        >
          <track
            kind="captions"
            src={deniedCaptions}
            srcLang="en"
            label="English captions"
            default
          />
        </audio>
      </dialog>
    </div>
  );
};

export default NuUhUhEasterEgg;
