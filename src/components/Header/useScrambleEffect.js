import { useEffect } from "react";

/**
* Applies a scramble effect to header text when hovered
* @example
* useScrambleEffect(headerRef)
* // Headers within the referenced element will have the scramble effect applied
* @param {Object} ref - A React ref object targeting the element containing header elements.
* @returns {void} This function has no return value as it is a hook that applies side effects.
* @description
*   - `ref.current` must be a valid DOM node and not null.
*   - This effect is only applied to 'h1', 'h2', and 'h3' elements.
*   - Styles for the effect must be defined in CSS using the '--x', '--y', and '--r' variables.
*   - The effect only activates on devices with a viewport width greater than 768 pixels.
*/
function useScrambleEffect(ref) {
  useEffect(() => {
    /**
    * Animates the text content of headers (h1, h2, h3) within a referenced container
    * @example
    * scrambleTextEffect(ref)
    * - 'ref' is a reference object to the DOM element containing headers
    * @param {Object} ref - React ref object pointing to the container of header elements.
    * @returns {void} Does not return a value.
    * @description
    *   - The function will only execute its logic if the viewport is wider than 768px.
    *   - Split each header's innerText into individual spans with the classname 'letter'.
    *   - For spaces, inserts a non-breaking space HTML entity to preserve spacing in the animation.
    *   - Applies rise, sway, and twirl effects to letters on mouseover with randomized values.
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
