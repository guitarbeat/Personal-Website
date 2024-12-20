// path/filename: src/components/About.js

import React, { useState } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

import shell from "../../../assets/images/shell.png";

function ColorChangeOnHover({ text }) {
	const words = text.split(" ");
	return (
		<>
			{words.map((word, i) => (
				<span key={i} className="hover-color-change">
					{word}{" "}
				</span>
			))}
		</>
	);
}

function About({ db }) {
	const [expandedSection, setExpandedSection] = useState(null);

	const aboutTexts = db.about
		? db.about.map((row) => ({
				category: row.category,
				description: row.description,
			}))
		: [];

	const handleSectionClick = (category) => {
		setExpandedSection(expandedSection === category ? null : category);
	};

	const renderAboutTexts = (texts) =>
		texts.map(({ category, description }) => (
			<div
				key={category}
				className={`about-me__text ${expandedSection === category ? "expanded" : ""}`}
				onClick={() => handleSectionClick(category)}
				role="button"
				tabIndex={0}
				onKeyPress={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						handleSectionClick(category);
					}
				}}
			>
				<div className="text-background">
					<h2>{category}</h2>
					<p>
						<ColorChangeOnHover text={description} />
					</p>
					<div className="expand-indicator" aria-hidden="true">
						{expandedSection === category ? "−" : "+"}
					</div>
				</div>
			</div>
		));

	return (
		<div id="about" className="container">
			<div className="container__content">
				<div className="about-me">
					<h1>About Me</h1>
					<div className="about-me__content">
						<div className="about-me__text-container">
							{renderAboutTexts(aboutTexts)}
						</div>
						<div className="about-me__spotify">
							<a href="https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&redirect=true">
								<img
									src="https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_offline=true&background_color=121212&interchange=true&bar_color=53b14f&bar_color_cover=true"
									alt="Spotify GitHub profile"
								/>
							</a>
						</div>
					</div>
					<div className="about-me__img">
						<img src={shell} alt="shell background" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default withGoogleSheets("about")(About);
