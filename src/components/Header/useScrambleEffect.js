import { useEffect } from "react";

function useScrambleEffect(ref) {
  useEffect(() => {
    const enhance = () => {
      if (window.innerWidth > 768) {
        ref.current.querySelectorAll("h1,h2,h3,p").forEach((header) => {
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
