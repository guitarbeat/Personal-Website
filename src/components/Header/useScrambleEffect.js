import { useEffect } from "react";

/**
* Applies a scramble effect to text elements when hovered
* @example
* useScrambleEffect(headerRef)
* // No explicit return value, effects are visually noticeable
* @param {Object} ref - Ref object pointing to a DOM element.
* @returns {void} No return value as it's a hook with side effects.
* @description
*   - It applies the effect only to 'h1', 'h2', and 'h3' elements within the referenced DOM node.
*   - The effect is not applied if the viewport width is less than 768px.
*   - CSS Variables '--x', '--y', and '--r' are expected to be used in the stylesheet to see the scrambling effect.
*/
function useScrambleEffect(ref) {
  useEffect(() => {
    /**
    * Applies a scramble effect to all h1, h2, and h3 elements when hovered
    * @example
    * useScrambleEffect(ref)
    * // h1, h2, h3 inner texts are now individually wrapped within spans with class 'letter'
    * @param {Object} ref - A React ref object linked to a DOM element.
    * @returns {void} No return value, applies a side-effect to the DOM.
    * @description
    *   - This function modifies the passed DOM element's children conditionally based on innerWidth.
    *   - Direct DOM manipulation is performed within React components, which should be used cautiously.
    *   - The function relies on a global `window` object, and therefore is not server-side render safe.
    *   - Event listeners added in this function create an animation effect by manipulating CSS variables.
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
