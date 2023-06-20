import React from "react";
import { withGoogleSheets } from "react-db-google-sheets";

const tag_color = {
  Code: "#386FA4",
  Paper: "#DE7254",
  Misc: "#67a286",
};

function ProjectCard({ title, content, slug, link, keyword, date, image }) {
  let _link = link ? (
    <div className="projects__card__label projects__card__link">Link</div>
  ) : null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="projects__card"
      key={slug}
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
      <p style={{ fontStyle: "italic", color: "LightSteelBlue" }}>{date}</p>
      <p>{content}</p>
      {/* Only render the img element if the image prop is defined */}

      {image && <img src={image} className="project-image" alt="Project" />}
    </a>
  );
}

function Projects(props) {
  // Check if the data is loaded

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
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .map((props) => <ProjectCard key={props.slug} {...props} />);

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
export default withGoogleSheets("projects")(Projects);
