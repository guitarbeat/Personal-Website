import React, { useState, useEffect } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

/**
* Renders a card component for a project with linked content
* @example
* ProjectCard({
*   title: "Project Name",
*   content: "Project description here.",
*   slug: "project-name",
*   link: "https://www.example.com",
*   keyword: "JavaScript",
*   date: "January 1, 2023",
*   image: "/path/to/image.jpg",
*   tagColor: "#ff5733"
* })
* <a href="https://www.example.com" target="_blank" rel="noreferrer" ...>...</a>
* @param {Object} props - The props object containing the project details.
* @param {string} props.title - Title of the project.
* @param {string} props.content - Description or content of the project.
* @param {string} props.slug - Unique slug identifier for the project.
* @param {string} props.link - URL link for the project.
* @param {string} props.keyword - Keyword associated with the project.
* @param {string} props.date - Publish or event date for the project.
* @param {string} props.image - URL or relative path to the project's image.
* @param {string} props.tagColor - Color code for the keyword tag.
* @returns {JSX.Element} JSX component representing the project card.
* @description
*   - The card uses conditional rendering for the link label and image elements.
*   - It toggles the visibility of the project's content and date on click.
*   - The `rel="noreferrer"` attribute is used to prevent phishing attacks.
*   - The `key` prop should be unique for list rendering performance.
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
* Manages the display and filtering of project cards based on active filters
* @example
* Projects({ db: { projects: [{ title: "Project X", slug: "project-x", date: "2023-01-01", keyword: "Development", link: "https://example.com", content: "Project description", image: "image-path.jpg" }] } })
* <div className="container" id="projects">...</div>
* @param {Object} props - Object containing a `db` object with a `projects` array.
* @returns {JSX.Element} The component with the project cards and filter buttons.
* @description
*   - Filters are dynamically created based on the keywords of the projects.
*   - It has internal state management to handle active and inactive filters.
*   - Filters can be toggled off until one remains, further toggling resets to all filters on.
*   - The style of filter buttons changes based on the active state to visualize toggled filters.
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
  * Toggles a filter's active state or resets to all if the last active filter is toggled off
  * @example
  * toggleFilter('filter1') 
  * // Either adds 'filter1' to activeFilters or removes it if it's the last active one
  * @param {string} filter - The filter name to be toggled or checked.
  * @returns {void} Does not return anything, but updates the state of activeFilters.
  * @description
  *   - If all filters are deactivated, resets to activate all filters.
  *   - If the only active filter is toggled, it activates all filters.
  *   - If a filter is active, it deactivates it, and vice versa.
  *   - It relies on an external 'activeFilters' state and 'tagColors' dictionary.
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
