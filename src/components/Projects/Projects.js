// Import required libraries and components
import React, { useState } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

// Declare color tags
const tag_color = {
  Code: "#386FA4",
  Paper: "#DE7254",
  Misc: "#67a286",
};

// Function for ProjectCard component
function ProjectCard({ title, content, slug, link, keyword, date, image }) {
  const [isClicked, setIsClicked] = useState(false);

  // Handle click events
  const handleClick = (e) => {
    if (!isClicked) {
      e.preventDefault();
      setIsClicked(true);
    }
  };

  // Conditionally render link
  let _link = link ? (
    <div className="projects__card__label projects__card__link">Link</div>
  ) : null;

  // Return the card component
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="projects__card"
      key={slug}
      onClick={handleClick}
    >
      <div className="projects__card__keywords">
        {_link}
        <div
          className="projects__card__label"
          style={{ backgroundColor: tag_color[keyword] }}
        >
          {keyword}
        </div>
      </div>
      <h3>{title}</h3>
      <p
        className={`date ${isClicked ? "show-text" : ""}`}
        style={{ fontStyle: "italic", color: "LightSteelBlue" }}
      >
        {date}
      </p>
      <p className={isClicked ? "show-text" : ""}>{content}</p>

      {/* Only render the img element if the image prop is defined */}
      {image && <img src={image} className="project-image" alt="Project" />}
    </a>
  );
}

// Function for Projects component
function Projects(props) {
  // Map the projects data
  let projects = props.db.projects.map((row) => ({
    title: row.title,
    slug: row.slug,
    date: row.date,
    keyword: row.keyword,
    link: row.link,
    content: row.content,
    image: row.image,
  }));

  // Sort and map the project cards
  let project_cards = projects
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .map((props) => <ProjectCard key={props.slug} {...props} />);

  // Return the projects component
  return (
    <div className="container" id="projects">
      <div className="container__content">
        <h1>Some of my Projects</h1>
        <div className="projects">
          <div className="projects__cards_container">{project_cards}</div>
        </div>
      </div>
    </div>
  );
}

// Export the Projects component with Google Sheets data
export default withGoogleSheets("projects")(Projects);
