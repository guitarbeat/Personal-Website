import { useEffect } from "react";

/**
 * Applies an interactive scramble effect to text headers within a referenced DOM node
 * @example
 * useScrambleEffect(headerRef)
 * // header elements within headerRef now have scramble effect on hover
 * @param {Object} ref - A React ref object targeting a DOM node.
 * @returns {void} This function does not return a value.
 * @description
 *   - The effect targets only "h1", "h2", and "h3" elements for scrambling.
 *   - The scramble effect is applied only when the viewport is wider than 768 pixels.
 *   - Each character of the targeted headers is wrapped in a "span" with a "letter" class.
 *   - On mouseover, each character is randomly translated and rotated within a range.
 */
function useScrambleEffect(ref) {
  useEffect(() => {
    /**
    * Applies a scramble effect to all h1, h2, and h3 elements within the ref current element
    * @example
    * useScrambleEffect(ref)
    * // Headers within ref.current now have a scramble effect on mouseover.
    * @param {Object} ref - Reference to a DOM element that the function will operate on.
    * @returns {void} No return value; this function applies side effects to the DOM.
    * @description
    *   - Splits header text content into individual spans to allow independent animation.
    *   - Binds mouseover and mouseout event listeners to each letter for the scramble effect.
    *   - Applies a random translation and rotation to each letter on mouseover.
    *   - Resets the letter styles on mouseout.
    */
    const enhance = () => {
      if (window.innerWidth > 768) {
        ref.current.querySelectorAll("h1,h2,h3").forEach((header) => {
          const letters = header.innerText.split("");
          header.innerText = "";
          letters.forEach((letter, i) => {
            const span = document.createElement("span");
            span.className = "letter";
            if (letter === " ") {
              span.innerHTML = "&nbsp;";
            } else {
              span.textContent = letter;
            }
            header.appendChild(span);
          });
        });

        ref.current.querySelectorAll(".letter").forEach((letter) => {
          const random = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min;
          letter.addEventListener("mouseover", (e) => {
            e.target.style.setProperty("--x", `${random(-10, 10)}px`);
            e.target.style.setProperty("--y", `${random(-10, 10)}px`);
            e.target.style.setProperty("--r", `${random(-10, 10)}deg`);
          });

          letter.addEventListener("mouseout", (e) => {
            e.target.style.setProperty("--x", "0px");
            e.target.style.setProperty("--y", "0px");
            e.target.style.setProperty("--r", "0deg");
          });
        });
      }
    };
    enhance();
  }, [ref]);
}

export default useScrambleEffect;
