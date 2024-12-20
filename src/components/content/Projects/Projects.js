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
					style={{ backgroundColor: tagColor }}
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
		// Updated colors with better contrast ratios
		const colors = {
			primary: '#2563eb',    // Blue
			secondary: '#16a34a',  // Green
			tertiary: '#dc2626',   // Red
			quaternary: '#7c3aed', // Purple
			quinary: '#ea580c',    // Orange
			senary: '#0891b2',     // Cyan
			septenary: '#be185d'   // Pink
		};
		
		const colorValues = Object.values(colors);
		const generatedTagColors = uniqueKeywords.reduce((acc, keyword, index) => {
			acc[keyword] = colorValues[index % colorValues.length];
			return acc;
		}, {});

		setTagColors(generatedTagColors);
		setActiveFilters(uniqueKeywords);
	}, [props.db.projects]);

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
							key={filter}
							onClick={() => toggleFilter(filter)}
							className={`tag ${activeFilters.includes(filter) ? "active" : ""}`}
							style={{
								borderColor: activeFilters.includes(filter)
									? tagColors[filter]
									: "rgba(255, 255, 255, 0.2)", // Light border for non-active
								color: activeFilters.includes(filter)
									? "white"
									: "rgba(255, 255, 255, 0.7)", // Dimmed color for non-active
								backgroundColor: activeFilters.includes(filter)
									? tagColors[filter]
									: "rgba(255, 255, 255, 0.2)", // Semi-transparent for non-active
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
