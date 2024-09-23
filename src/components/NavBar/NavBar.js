import React from "react";

function BackToTheTop() {
  return (
    <li className="back-to-the-top hidden" id="back-to-the-top">
      <a href="#header" aria-label="Back to the top">
        <span className="visually-hidden">Back to the top</span>
      </a>
    </li>
  );
}

/**
* Renders a navigation bar with given menu items
* @example
* NavBar({ items: {'Home': '#home', 'About': '#about', 'Contact': 'http://example.com/contact'} })
* <ul className="navbar">...</ul>
* @param {Object} items - An object with keys as link names and values as hrefs.
* @returns {JSX.Element} Returns a JSX Element representing the navigation bar.
* @description
*   - Keys of the `items` object are used as link text.
*   - Values are the corresponding href for the link.
*   - Clicking on the generated links will navigate based on the href value.
*   - If href starts with "#", page will navigate to an internal anchor.
*/
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
      <div className="theme-switch">
        <div className="switch"></div>
      </div>
      <BackToTheTop />
    </ul>
  );
}

export default NavBar;
