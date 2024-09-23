import React, { useState, useEffect } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

/**
* Renders a project card with conditional interactivity
* @example
* ProjectCard({
*   title: "Project Name",
*   content: "Detailed description here.",
*   slug: "project-name",
*   link: "https://www.example.com",
*   keyword: "JS",
*   date: "2023-01-01",
*   image: "/images/project.jpg",
*   tagColor: "#ff5733"
* })
* <a href="https://www.example.com" target="_blank" rel="noreferrer" className="projects__card" key="project-name" onClick={handleClick}>...</a>
* @param {Object} props - Object containing properties for the project card.
* @param {string} props.title - Title of the project.
* @param {string} props.content - Brief description of the project.
* @param {string} props.slug - Unique identifier for the project.
* @param {string} props.link - External link to the project.
* @param {string} props.keyword - Keyword or tag associated with the project.
* @param {string} props.date - Publication or last updated date of the project.
* @param {string} [props.image] - URL to the image representing the project.
* @param {string} props.tagColor - CSS color value for the keyword label background.
* @returns {JSX.Element} A JSX element of the project card with conditional formatting and functionality.
* @description
*   - The card initially prevents navigation to the project link.
*   - On the first click, the card enables navigation and updates its style.
*   - The tagColor property styles the background color of the keyword label.
*   - An image is conditionally rendered if the image prop is provided.
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
* Renders a list of projects with filterable tags
* @example
* <Projects db={{ projects: sampleProjectsData }} />
* // A component instance with a list of project cards, each with its own tag and tag colors that can be filtered
* @param {Object} props - Contains the 'db' object with a 'projects' array.
* @returns {JSX.Element} The rendered component with filterable project cards.
* @description
*   - 'activeFilters' state initializes with all tags and can be toggled to filter the displayed projects.
*   - 'tagColors' state holds a color mapping for project tags which is dynamically generated from unique 'keyword' fields.
*   - Utilizes useEffect to generate initial states based on the 'projects' data from 'props.db'.
*   - The filter buttons visually reflect their active/inactive state and adjust the list of displayed project cards accordingly.
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
  * Toggles a filter within the activeFilters array
  * @example
  * toggleFilter('design')
  * ['development', 'marketing'] // when 'design' was initially in activeFilters
  * @example
  * toggleFilter('marketing')
  * ['design', 'development', 'marketing'] // when 'marketing' was not initially in activeFilters
  * @param {string} filter - The filter to be toggled.
  * @returns {void} Does not return a value, modifies the activeFilters state.
  * @description
  *   - The function checks if a filter is already active. If it is, it gets removed, unless it is the last one.
  *   - If it's the last active filter, it resets to all filters active instead of deactivating it.
  *   - If the filter is not active, it adds the filter to the list of active filters.
  *   - Assumption: 'activeFilters' and 'setActiveFilters' are state and setState from a useState hook respectively.
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
