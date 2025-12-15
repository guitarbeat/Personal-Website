import { useEffect } from "react";

import { isAboveBreakpoint, randomInt } from "../../../utils/commonUtils.ts";

// * Breakpoint constant - matches SCSS breakpoint system
const DESKTOP_BREAKPOINT = 768;

function useScrambleEffect(ref) {
  useEffect(() => {
    // * Early return if ref is not available
    if (!ref?.current) {
      return undefined;
    }

    // * Store event handlers for cleanup
    const eventHandlers = new Map();

    const enhance = () => {
      if (isAboveBreakpoint(DESKTOP_BREAKPOINT) && ref.current) {
        for (const header of ref.current.querySelectorAll("h1,h2,h3")) {
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

        for (const letter of ref.current.querySelectorAll(".letter")) {
          // * Create event handlers
          const handleMouseOver = (e) => {
            e.target.style.setProperty("--x", `${randomInt(-10, 10)}px`);
            e.target.style.setProperty("--y", `${randomInt(-10, 10)}px`);
            e.target.style.setProperty("--r", `${randomInt(-10, 10)}deg`);
          };

          const handleMouseOut = (e) => {
            e.target.style.setProperty("--x", "0px");
            e.target.style.setProperty("--y", "0px");
            e.target.style.setProperty("--r", "0deg");
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
      for (const [letter, handlers] of eventHandlers.entries()) {
        letter.removeEventListener("mouseover", handlers.mouseover);
        letter.removeEventListener("mouseout", handlers.mouseout);
      }
      eventHandlers.clear();
    };
  }, [ref]);
}

export default useScrambleEffect;
