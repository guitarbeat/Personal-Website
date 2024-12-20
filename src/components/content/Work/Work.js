import moment from "moment";
import PropTypes from "prop-types";
// Import required libraries and components
import React, { Fragment, useState, useRef, useEffect } from "react";
import { withGoogleSheets } from "react-db-google-sheets";

// Function for TimelineBar component
function TimelineBar({ first_year, job_bars, activeCards, hoveredJob, jobs }) {
	const formatDuration = (months) => {
		const years = Math.floor(months / 12);
		const remainingMonths = months % 12;

		// Convert numbers to words
		const numberToWord = (num) => {
			const words = [
				"One",
				"Two",
				"Three",
				"Four",
				"Five",
				"Six",
				"Seven",
				"Eight",
				"Nine",
				"Ten",
				"Eleven",
				"Twelve",
			];
			return num <= 12 ? words[num - 1] : num.toString();
		};

		// Helper for formatting duration parts
		const formatPart = (num, singular, plural) => {
			if (num === 0) {
     return "";
   }
			const word = numberToWord(num);
			return `${word} ${num === 1 ? singular : plural}`;
		};

		// Format months only
		if (years === 0) {
			return formatPart(remainingMonths, "Month", "Months");
		}

		// Format years only
		if (remainingMonths === 0) {
			return formatPart(years, "Year", "Years");
		}

		// Format years and months
		const yearText = formatPart(years, "Year", "Years");
		const monthText = formatPart(
			remainingMonths,
			"Month",
			"Months",
		).toLowerCase();
		return `${yearText}, ${monthText}`;
	};

	const sub_bars = job_bars.map(([height, start], index) => (
		<div
			key={index}
			className="work__timeline__subbar"
			style={{ height: `${height}%`, bottom: `${start}%` }}
		/>
	));

	return (
		<div className="work__timeline">
			<p className="work__timeline__now">Now</p>
			{hoveredJob && (
				<div
					className="work__timeline__duration"
					style={{
						bottom: `${hoveredJob.bar_start + hoveredJob.bar_height / 2}%`,
						visibility: hoveredJob ? "visible" : "hidden",
					}}
				>
					{formatDuration(hoveredJob.duration)}
				</div>
			)}
			<p className="work__timeline__start">{first_year}</p>

			{sub_bars}
			{Array.from(activeCards).map((slug) => {
				const activeJob = jobs.find((job) => job.slug === slug);
				return (
					activeJob && (
						<div
							key={slug}
							className="work__timeline__bar"
							style={{
								height: `${activeJob.bar_height}%`,
								bottom: `${activeJob.bar_start}%`,
							}}
						/>
					)
				);
			})}
		</div>
	);
}

TimelineBar.propTypes = {
	first_year: PropTypes.string.isRequired,
	job_bars: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
	activeCards: PropTypes.instanceOf(Set).isRequired,
	hoveredJob: PropTypes.shape({
		bar_start: PropTypes.number,
		bar_height: PropTypes.number,
		duration: PropTypes.number,
	}),
	jobs: PropTypes.arrayOf(
		PropTypes.shape({
			slug: PropTypes.string.isRequired,
			bar_start: PropTypes.number.isRequired,
			bar_height: PropTypes.number.isRequired,
		}),
	).isRequired,
};

// Memoize TimelineBar component
const MemoizedTimelineBar = React.memo(TimelineBar);

// Function for Work component
function Work({ db }) {
	// State management
	const [activeCards, setActiveCards] = useState(new Set());
	const [hoveredCard, setHoveredCard] = useState(null); // Add missing state

	const handleCardClick = (slug) => {
		setActiveCards((prev) => {
			const newSet = new Set(prev); // Create a new Set to avoid mutating state directly
			if (newSet.has(slug)) {
				newSet.delete(slug);
			} else {
				newSet.add(slug);
			}
			return newSet;
		});
	};

	const handleCardHover = (slug) => {
		setHoveredCard(slug);
	};

	// Data processing
	const jobs = db.work.map((row) => ({
		title: row.title,
		company: row.company,
		place: row.place,
		from: row.from,
		to: row.to,
		description: row.description,
		slug: row.slug,
	}));

	let first_date = moment();

	// Format and enhance jobs data
	jobs.forEach((job) => {
		const _to_moment = job.to ? moment(job.to, "MM-YYYY") : moment(); // Define _to_moment
		const _from_moment = moment(job.from, "MM-YYYY");
		const _duration = _to_moment.diff(_from_moment, "months");

		job.from = _from_moment.format("MMM YYYY");
		job.to = job.to ? _to_moment.format("MMM YYYY") : "Now";
		job._from = _from_moment;
		job._to = _to_moment;
		job.date = _duration === 0 ? job.from : `${job.from} - ${job.to}`;
		job.duration = _duration === 0 ? 1 : _duration;

		if (first_date.diff(_from_moment) > 0) {
			first_date = _from_moment;
		}
	});

	const time_span = moment().diff(first_date, "months");
	jobs.forEach((job) => {
		job.bar_start = (100 * job._from.diff(first_date, "months")) / time_span;
		job.bar_height = (100 * job.duration) / time_span;
	});

	const job_bars = jobs.map((job) => [job.bar_height, job.bar_start]);

	// Add intersection observer for lazy loading
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<Fragment>
			<div className="container" id="work" ref={sectionRef}>
				<div className="container__content">
					<h1>My career so far</h1>
					<div className={`work ${isVisible ? "visible" : ""}`}>
						<MemoizedTimelineBar
							first_year={first_date.format("YYYY")}
							job_bars={job_bars}
							activeCards={activeCards}
							hoveredJob={jobs.find((job) => job.slug === hoveredCard)}
							jobs={jobs}
						/>
						<div className="work__items">
							{jobs.map((job) => {
								const isActive = activeCards.has(job.slug);
								return (
									<div
										key={job.slug}
										className={`work__item ${isActive ? "active" : ""}`}
										onClick={() => handleCardClick(job.slug)}
										onMouseEnter={() => handleCardHover(job.slug)}
										onMouseLeave={() => handleCardHover(null)}
										tabIndex={0}
										role="button"
										aria-expanded={isActive}
										onKeyPress={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												handleCardClick(job.slug);
											}
										}}
									>
										<p
											className={`work__item__place ${isActive ? "show-text" : ""}`}
										>
											<i className="fa fa-map-marker-alt" /> {job.place}
										</p>
										<h2>{job.title}</h2>
										<h3 className="company-name">{job.company}</h3>
										<p
											className={`work__item__date ${isActive ? "show-text" : ""}`}
										>
											{job.date}
										</p>
										<p className={isActive ? "show-text" : ""}>
											{job.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

Work.propTypes = {
	db: PropTypes.shape({
		work: PropTypes.arrayOf(
			PropTypes.shape({
				title: PropTypes.string.isRequired,
				company: PropTypes.string.isRequired,
				place: PropTypes.string.isRequired,
				from: PropTypes.string.isRequired,
				to: PropTypes.string,
				description: PropTypes.string.isRequired,
				slug: PropTypes.string.isRequired,
			}),
		).isRequired,
	}).isRequired,
};

export default withGoogleSheets("work")(Work);
