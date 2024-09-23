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
* Renders a navigation bar with links
* @example
* NavBar({ items: { Home: '#home', About: '#about', Contact: 'http://example.com/contact' } })
* <ul className="navbar">...</ul>
* @param {Object} items - An object representing navigation items where keys are the text and values are the URLs.
* @returns {JSX.Element} Rendered navigation bar as a React component.
* @description
*   - It reverses the order of navigation items.
*   - Handles click events to support both internal anchors and external links.
*   - Prepends the origin of the window location to internal anchors.
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
