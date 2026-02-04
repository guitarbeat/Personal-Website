import React, { useEffect } from "react";
import { isAboveBreakpoint, randomInt } from "../../../utils/commonUtils";

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
          const letters = header.innerText.split("");
          header.innerText = "";
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

export default useScrambleEffect;
