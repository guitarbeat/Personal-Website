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
* Renders a navigation bar with menu items and a theme switch.
* @example
* NavBar({ items: { Home: '#home', About: '#about', Contact: 'https://example.com/contact' } })
* <ul className="navbar">...</ul>
* @param {Object} { items } - An object mapping names to URLs.
* @returns {JSX.Element} A JSX element representing the navigation bar.
* @description
*   - This component handles internal (# links) navigation by modifying `window.location.href` directly.
*   - Clicking the theme switch doesn't have any functionality implemented; it's a placeholder for theming logic.
*   - The `BackToTheTop` component is always rendered as the last item, not included in the `items` prop.
*   - The keys of the `items` object are used as the display text for the links.
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
