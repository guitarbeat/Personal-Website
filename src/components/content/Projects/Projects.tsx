import { useCallback, useEffect, useMemo, useState } from "react";
// import { withGoogleSheets } from "react-db-google-sheets";
import { useNotion } from "../../../contexts/NotionContext.tsx";
import { generateItemColors } from "../../../utils/colorUtils.ts";
import { clamp, cn } from "../../../utils/commonUtils.ts";
// import { processProjectsData } from "../../../utils/googleSheetsUtils";
import PixelCanvas from "../../effects/PixelCanvas/PixelCanvas.jsx";

const DEFAULT_PROJECT_EFFECT = {
  colors: ["#f8fafc", "#cbd5f5", "#94a3b8"],
  gap: 9,
  speed: 24,
};

const parseHsl = (color) => {
  if (typeof color !== "string") {
    return null;
  }

  const match = color
    .replace(/\s+/g, "")
    .match(/^hsl\(([-\d.]+),([-\d.]+)%,([-\d.]+)%\)$/i);

  if (!match) {
    return null;
  }

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
};

const createPaletteFromHsl = (color) => {
  const parsed = parseHsl(color);

  if (!parsed) {
    return DEFAULT_PROJECT_EFFECT.colors;
  }

  const { h, s, l } = parsed;
  const accent = `hsl(${h}, ${clamp(s + 12, 0, 100)}%, ${clamp(l + 18, 0, 96)}%)`;
  const base = `hsl(${h}, ${clamp(s + 6, 0, 100)}%, ${clamp(l + 6, 0, 96)}%)`;
  const shadow = `hsl(${h}, ${clamp(s + 4, 0, 100)}%, ${clamp(l - 10, 4, 92)}%)`;

  return [accent, base, shadow];
};

const createProjectEffect = (tagColor, index) => {
  const palette = createPaletteFromHsl(tagColor);

  return {
    colors: palette,
    gap: 8 + (index % 3) * 2,
    speed: 18 + (index % 4) * 3,
  };
};

function ProjectCard({
  title,
  content,
  slug,
  link,
  keyword,
  date,
  image,
  tagColor,
  className = "",
  effect = DEFAULT_PROJECT_EFFECT,
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
      className={cn(`projects__card ${className}`.trim(), image && "has-image")}
      key={slug}
      onClick={handleClick}
    >
      <PixelCanvas
        className="projects__card__pixel-canvas"
        colors={effect.colors}
        gap={effect.gap}
        speed={effect.speed}
      />
      <div className="projects__card__content">
        <div className="projects__card__keywords">
          {_link}
          <div
            className="projects__card__label"
            style={{
              backgroundColor: tagColor || "rgba(255, 255, 255, 0.25)",
              mixBlendMode: "multiply",
              filter: "contrast(1.1) brightness(1.1)",
            }}
          >
            {keyword}
          </div>
        </div>
        <h3>{title}</h3>
        <p
          className={cn("date", isClicked && "show-text")}
          style={{ fontStyle: "italic", color: "var(--color-sage-light)" }}
        >
          {date}
        </p>
        <p className={cn(isClicked && "show-text")}>{content}</p>
        {image && <img src={image} className="project-image" alt="Project" />}
      </div>
    </a>
  );
}
function Projects() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [tagColors, setTagColors] = useState({});
  const { db } = useNotion();
  const projectsData = useMemo(
    () => (Array.isArray(db?.projects) ? db.projects : []),
    [db?.projects],
  );

  useEffect(() => {
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
  }, [projectsData]);

  // Add theme change listener
  useEffect(() => {
    const handleThemeChange = () => {
      const uniqueKeywords = [
        ...new Set(projectsData.map((project) => project.keyword)),
      ];

      const regeneratedTagColors = generateItemColors(projectsData, "keyword");
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
  }, [projectsData]);

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

  const projects = projectsData;

  const sortedProjects = [...projects].sort((a, b) =>
    a.date > b.date ? -1 : 1,
  );

  const project_cards = sortedProjects.map((projectProps, index) => {
    const isFiltered = !activeFilters.includes(projectProps.keyword);
    const tagColor = tagColors[projectProps.keyword];
    const effect = createProjectEffect(tagColor, index);

    return (
      <ProjectCard
        key={projectProps.slug}
        {...projectProps}
        tagColor={tagColor}
        className={cn(isFiltered && "filtered-out")}
        effect={effect}
      />
    );
  });

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
              className={cn("tag", activeFilters.includes(filter) && "active")}
              style={{
                "--tag-color": activeFilters.includes(filter)
                  ? tagColors[filter]
                  : undefined,
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

export default Projects;
