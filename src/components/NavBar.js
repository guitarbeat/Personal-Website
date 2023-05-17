import React from "react";

function BackToTheTop() {
  return (
    <li className="back-to-the-top hidden" id="back-to-the-top">
      <a href="#header" />
    </li>
  );
}

function NavBar({ items }) {
  let links = Object.keys(items)
    .reverse()
    .map((key, i) => (
      <li key={i} className="navbar__item">
        <a
          href={items[key]}
          onClick={(event) => {
            event.preventDefault();
            const { href } = event.target;
            if (href.startsWith("#")) {
              window.location.href = `${window.location.origin}${href}`;
            } else {
              window.location.href = href;
            }
          }}
        >
          {key}
        </a>
      </li>
    ));

  return (
    <ul className="navbar">
      {links}

      <div class="theme-switch">
        <div class="switch"></div>
      </div>

      <BackToTheTop />
    </ul>
  );
}

export default NavBar;
