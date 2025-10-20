import React, { useState, useEffect, useCallback } from "react";
import { withGoogleSheets } from "react-db-google-sheets";
import { generateItemColors } from "../../../utils/colorUtils";

function ProjectCard({
  title,
  content,
  slug,
  link,
  keyword,
  date,
  image,
  tagColor,
  className,
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    if (!isClicked) {
      e.preventDefault();
      setIsClicked(true);
    }
  };

  const _link = link ? (
    <div className="projects__card__label projects__card__link">Link</div>
  ) : null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className={`projects__card ${className}`}
      key={slug}
      onClick={handleClick}
    >
      <div className="projects__card__keywords">
        {_link}
        <div
          className="projects__card__label"
          style={{
            backgroundColor: tagColor,
            mixBlendMode: "multiply",
            filter: "contrast(1.1) brightness(1.1)",
          }}
        >
          {keyword}
        </div>
      </div>
      <h3>{title}</h3>
      <p
        className={`date ${isClicked ? "show-text" : ""}`}
        style={{ fontStyle: "italic", color: "var(--color-sage-light)" }}
      >
        {date}
      </p>
      <p className={isClicked ? "show-text" : ""}>{content}</p>
      {image && <img src={image} className="project-image" alt="Project" />}
    </a>
  );
}
function Projects(props) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [tagColors, setTagColors] = useState({});

  useEffect(() => {
    const projectsData = props.db.projects ?? [];
    const uniqueKeywords = [
      ...new Set(projectsData.map((project) => project.keyword)),
    ];

    const generatedTagColors = generateItemColors(projectsData, "keyword");
    setTagColors(generatedTagColors);
    setActiveFilters((prevFilters) => {
      if (prevFilters.length === 0) {
        return uniqueKeywords;
      }

      const filtered = prevFilters.filter((filter) =>
        uniqueKeywords.includes(filter),
      );

      if (filtered.length === 0) {
        return uniqueKeywords;
      }

      return filtered;
    });
  }, [props.db.projects]);

  // Add theme change listener
  useEffect(() => {
    const handleThemeChange = () => {
      const projectsData = props.db.projects ?? [];
      const uniqueKeywords = [
        ...new Set(projectsData.map((project) => project.keyword)),
      ];

      const regeneratedTagColors = generateItemColors(
        projectsData,
        "keyword",
      );
      setTagColors(regeneratedTagColors);
      setActiveFilters((prevFilters) => {
        if (prevFilters.length === 0) {
          return uniqueKeywords;
        }

        const filtered = prevFilters.filter((filter) =>
          uniqueKeywords.includes(filter),
        );

        if (filtered.length === 0) {
          return uniqueKeywords;
        }

        return filtered;
      });
    };

    // Listen for theme changes
    document.body.addEventListener("theme-changed", handleThemeChange);

    return () => {
      document.body.removeEventListener("theme-changed", handleThemeChange);
    };
  }, [props.db.projects]);

  const toggleFilter = useCallback(
    (filter) => {
      setActiveFilters((prevFilters) => {
        if (prevFilters.includes(filter)) {
          if (prevFilters.length === 1) {
            return [...Object.keys(tagColors)];
          }
          return prevFilters.filter((f) => f !== filter);
        }

        return [...prevFilters, filter];
      });
    },
    [tagColors],
  );

  const projects = props.db.projects.map((row) => ({
    title: row.title,
    slug: row.slug,
    date: row.date,
    keyword: row.keyword,
    link: row.link,
    content: row.content,
    image: row.image,
  }));

  const project_cards = projects
    .map((projectProps) => {
      const isFiltered = !activeFilters.includes(projectProps.keyword);
      return (
        <ProjectCard
          key={projectProps.slug}
          {...projectProps}
          tagColor={tagColors[projectProps.keyword]}
          className={`projects__card ${isFiltered ? "filtered-out" : ""}`}
        />
      );
    })
    .sort((a, b) => (a.props.date > b.props.date ? -1 : 1));

  return (
    <div className="container" id="projects">
      <div className="container__content">
        <h1>Some of my Projects</h1>
        <div className="filter-buttons">
          {Object.keys(tagColors).map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`tag ${activeFilters.includes(filter) ? "active" : ""}`}
              style={{
                backgroundColor: activeFilters.includes(filter)
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(255, 255, 255, 0.12)",
                borderLeft: activeFilters.includes(filter)
                  ? `4px solid ${tagColors[filter]}`
                  : "4px solid rgba(255, 255, 255, 0.3)",
                color: activeFilters.includes(filter)
                  ? "var(--color-text)"
                  : "var(--color-text-secondary)",
                backdropFilter: "blur(12px)",
                boxShadow: activeFilters.includes(filter)
                  ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                  : "0 1px 4px rgba(0, 0, 0, 0.1)",
                padding: "6px 12px",
                fontWeight: activeFilters.includes(filter) ? "600" : "400",
                transition: "all 0.2s ease",
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
