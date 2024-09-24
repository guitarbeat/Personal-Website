import React, { useState, useEffect } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

/**
* Renders a project card link element with various details
* @example
* ProjectCard({
*   title: "Project Title",
*   content: "Project Description",
*   slug: "project_slug",
*   link: "https://example.com",
*   keyword: "React",
*   date: "2023-03-10",
*   image: "path/to/image.png",
*   tagColor: "#ff5733"
* })
* Returns the JSX element for the project card.
* @param {Object} projectData - Object containing project details.
* @param {string} projectData.title - Title of the project.
* @param {string} projectData.content - Short description or content of the project.
* @param {string} projectData.slug - Unique identifier for the project.
* @param {string} projectData.link - URL or link to the project.
* @param {string} projectData.keyword - Keyword or tag related to the project.
* @param {string} projectData.date - Date associated with the project.
* @param {string} projectData.image - Path to the project's image.
* @param {string} projectData.tagColor - Hex color code for the tag label.
* @returns {JSX.Element} JSX component representing a card with project's information.
* @description
*   - The `handleClick` function prevents the default action if the card has not been clicked.
*   - The `isClicked` state indicates if the card has been clicked or not.
*   - The `projects__card__link` is conditionally rendered based on the presence of `link`.
*   - The `project-image` is only included when the `image` prop is provided.
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
* Manages the rendering of project cards with dynamic filtering based on tags
* @example
* <Projects db={{ projects: [...projectData] }} />
* <div className="container" id="projects">...</div>
* @param {Object} props - The props object containing the projects data.
* @returns {ReactElement} The rendered component with projects and filterable tags.
* @description
*   - Dynamically generates tag colors for unique keywords in the projects data.
*   - Initializes activeFilters to include all keywords by default.
*   - Provides a toggleFilter function to activate/deactivate individual filters.
*   - Filters and sorts project cards based on active filters and dates.
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
  * Toggles the state of a given filter within activeFilters
  * @example
  * toggleFilter('react')
  * // Assuming 'react' was inactive, now 'react' will be active
  * @param {string} filter - The name of the filter to toggle.
  * @returns {undefined} Does not return a value.
  * @description
  *   - Resets to all filters if trying to deactivate the last active one.
  *   - Does not allow deactivating all filters; at least one must remain active.
  *   - Maintains order of active filters while toggling.
  *   - Assumes `activeFilters` and `setActiveFilters` are available in scope.
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
