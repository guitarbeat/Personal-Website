import { useEffect } from "react";

/**
* Adds a scramble effect to all header elements found within the provided ref
* @example
* useScrambleEffect(headerRef)
* // no explicit return value since this is a hook effect
* @param {React.RefObject} ref - The React ref object containing the target DOM node.
* @returns {void} No return value since this is a useEffect hook function.
* @description
*   - Assumes headers exist and contain text.
*   - Applies to screen widths greater than 768px, suitable for desktop layouts.
*   - Splits header texts into spans with class "letter" to facilitate individual letter effects.
*   - Binds mouseover/out events to create a random scramble effect on each letter.
*/
function useScrambleEffect(ref) {
  useEffect(() => {
    /**
    * Adds a scramble effect to header elements within the ref'd container on hover
    * @example
    * useScrambleEffect(headerRef)
    * // h1, h2, h3 elements within headerRef will now have the scramble effect applied
    * @param {Object} ref - A reference object to the container with header elements.
    * @returns {void} Does not return a value.
    * @description
    *   - It should be called within a React component with a valid ref object.
    *   - The effect is applied only if the viewport width is greater than 768 pixels.
    *   - Header elements (h1, h2, h3) are split into spans with a 'letter' class.
    *   - Mouseover on each letter applies a random translation and rotation.
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
