import React, { useState, useEffect } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

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
		const uniqueKeywords = [
			...new Set(props.db.projects.map((project) => project.keyword)),
		];

		// Base colors with HSL values - more muted version
		const baseColors = {
			primary: { h: 220, s: 45, l: 65 },    // Muted Blue
			secondary: { h: 142, s: 35, l: 55 },  // Muted Green
			tertiary: { h: 0, s: 45, l: 65 },     // Muted Red
			quaternary: { h: 262, s: 35, l: 65 }, // Muted Purple
			quinary: { h: 24, s: 45, l: 60 },     // Muted Orange
			senary: { h: 190, s: 40, l: 60 },     // Muted Cyan
			septenary: { h: 328, s: 35, l: 65 },  // Muted Pink
		};

		const colorValues = Object.values(baseColors);

		// Generate base HSL colors
		const adjustedColors = colorValues.map((color) => {
			return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
		});

		const generatedTagColors = uniqueKeywords.reduce((acc, keyword, index) => {
			acc[keyword] = adjustedColors[index % adjustedColors.length];
			return acc;
		}, {});

		setTagColors(generatedTagColors);
		setActiveFilters(uniqueKeywords);
	}, [props.db.projects]);

	// Add theme change listener
	useEffect(() => {
		const handleThemeChange = () => {
			// Re-trigger the color generation effect
			setTagColors({}); // This will cause the first useEffect to run again
		};

		// Listen for theme changes
		document.body.addEventListener("theme-changed", handleThemeChange);

		return () => {
			document.body.removeEventListener("theme-changed", handleThemeChange);
		};
	}, []);

	const toggleFilter = (filter) => {
		if (activeFilters.includes(filter)) {
			if (activeFilters.length === 1) {
				setActiveFilters([...Object.keys(tagColors)]);
			} else {
				setActiveFilters(activeFilters.filter((f) => f !== filter));
			}
		} else {
			setActiveFilters([...activeFilters, filter]);
		}
	};

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
								transition: "all 0.2s ease"
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
