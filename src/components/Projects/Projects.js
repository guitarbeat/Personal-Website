import React, { useState, useEffect } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

/**
 * Renders a clickable project card with title, content, and other metadata
 * @example
 * ProjectCard({ title: 'Demo Project', content: 'A short description', slug: 'demo-project', link: 'https://example.com', keyword: 'UX Design', date: '2021-04-01', image: 'path/to/image.png', tagColor: '#ff5733' })
 * <a href="https://example.com" target="_blank" ... > ... </a>
 * @param {Object} props - Object containing project card properties.
 * @param {string} props.title - Title of the project.
 * @param {string} props.content - Short description or content of the project.
 * @param {string} props.slug - Unique identifier used for the project card.
 * @param {string} [props.link] - External link for the project.
 * @param {string} props.keyword - Keyword or category of the project.
 * @param {string} props.date - Date of the project.
 * @param {string} [props.image] - URL of the project image.
 * @param {string} [props.tagColor] - Color code (e.g., HEX) for the tag label background.
 * @returns {JSX.Element} The project card component.
 * @description
 *   - Renders a link `a` tag if the `link` prop is provided.
 *   - Toggles content visibility on card click.
 *   - Utilizes `useState` to track the clicked state of the card.
 *   - Styles are dynamically applied based on the `isClicked` state and `tagColor` prop.
 */
function ProjectCard({ title, content, slug, link, keyword, date, image, tagColor }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    if (!isClicked) {
      e.preventDefault();
      setIsClicked(true);
    }
  };

  let _link = link ? <div className="projects__card__label projects__card__link">Link</div> : null;

  return (
    <a href={link} target="_blank" rel="noreferrer" className="projects__card" key={slug} onClick={handleClick}>
      <div className="projects__card__keywords">
        {_link}
        <div className="projects__card__label" style={{ backgroundColor: tagColor }}>
          {keyword}
        </div>
      </div>
      <h3>{title}</h3>
      <p className={`date ${isClicked ? "show-text" : ""}`} style={{ fontStyle: "italic", color: "LightSteelBlue" }}>
        {date}
      </p>
      <p className={isClicked ? "show-text" : ""}>{content}</p>
      {image && <img src={image} className="project-image" alt="Project" />}
    </a>
  );
}

/**
* Manages project display and filter functionality
* @example
* <Projects db={{ projects: sampleProjectsData }} />
* <div className="container" id="projects">...</div>
* @param {Object} props - Object containing a `db` property with the projects data.
* @returns {JSX.Element} Rendered component elements that include project cards and filter buttons.
* @description
*   - Dynamically generates tag colors for projects based on unique keywords when the component mounts.
*   - Initializes all filters to active, allows toggling filters to show/hide project cards.
*   - Ensures at least one filter remains active at all times.
*   - Sorts project cards by date in descending order and filters them based on active keywords.
*/
function Projects(props) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [tagColors, setTagColors] = useState({});

  useEffect(() => {
    // Dynamically generate tag colors based on unique keywords in the data
    const uniqueKeywords = [...new Set(props.db.projects.map((project) => project.keyword))];
    const colors = ["#386FA4", "#DE7254", "#67a286", "#A267AC", "#67A2AC", "#AC6767", "#AC8A67"]; // Example color list
    const generatedTagColors = uniqueKeywords.reduce((acc, keyword, index) => {
      acc[keyword] = colors[index % colors.length]; // Cycle through colors if more keywords than colors
      return acc;
    }, {});

    setTagColors(generatedTagColors);
    // Initialize activeFilters with all unique keywords so all buttons are active at the start
    setActiveFilters(uniqueKeywords);
  }, [props.db.projects]);

  /**
  * Toggles the given filter in the list of active filters
  * @example
  * toggleFilter('design')
  * // If 'design' is inactive, it's added to the active filters
  * @param {string} filter - The filter to be toggled.
  * @returns {void} Does not return a value.
  * @description
  *   - If the provided filter is the only active filter, all filters are activated.
  *   - This function indirectly affects the state by calling setActiveFilters.
  */
  const toggleFilter = (filter) => {
    // Toggle logic to deactivate/activate filters
    if (activeFilters.includes(filter)) {
      if (activeFilters.length === 1) {
        // If attempting to deactivate the last active filter, instead reset to all filters active
        setActiveFilters([...Object.keys(tagColors)]);
      } else {
        // Remove filter from activeFilters if it's currently active
        setActiveFilters(activeFilters.filter((f) => f !== filter));
      }
    } else {
      // Add filter to activeFilters if it's currently inactive
      setActiveFilters([...activeFilters, filter]);
    }
  };


  let projects = props.db.projects.map((row) => ({
    title: row.title,
    slug: row.slug,
    date: row.date,
    keyword: row.keyword,
    link: row.link,
    content: row.content,
    image: row.image,
  }));

  let project_cards = projects
    .filter(({ keyword }) => activeFilters.length === 0 || activeFilters.includes(keyword))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .map((projectProps) => (
      <ProjectCard key={projectProps.slug} {...projectProps} tagColor={tagColors[projectProps.keyword]} />
    ));

  return (
    <div className="container" id="projects">
      <div className="container__content">
        <h1>Some of my Projects</h1>
        <div className="filter-buttons">
          {Object.keys(tagColors).map((filter) => (
            <button
  key={filter}
  onClick={() => toggleFilter(filter)}
  className={`tag ${activeFilters.includes(filter) ? "active" : ""}`}
  style={{
    borderColor: activeFilters.includes(filter) ? tagColors[filter] : "rgba(255, 255, 255, 0.2)", // Light border for non-active
    color: activeFilters.includes(filter) ? "white" : "rgba(255, 255, 255, 0.7)", // Dimmed color for non-active
    backgroundColor: activeFilters.includes(filter) ? tagColors[filter] : "rgba(255, 255, 255, 0.2)", // Semi-transparent for non-active
    opacity: activeFilters.includes(filter) ? 1 : 0.7, // Adjust opacity for non-active
  }}
>
  {filter}
</button>

          ))}
        </div>
        <div className="projects">
          <div className="projects__cards_container">{project_cards}</div>
        </div>
      </div>
    </div>
  );
}

export default withGoogleSheets("projects")(Projects);
