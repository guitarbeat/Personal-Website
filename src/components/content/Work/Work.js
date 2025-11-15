import moment from "moment";
import PropTypes from "prop-types";
// Import required libraries and components
import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { withGoogleSheets } from "react-db-google-sheets";
import PixelCanvas from "../../effects/PixelCanvas/PixelCanvas.jsx";
import TimelineBar from "./TimelineBar.js";

const CARD_EFFECTS = [
  {
    colors: ["#f8fafc", "#f1f5f9", "#cbd5e1"],
    gap: 8,
    speed: 24,
  },
  {
    colors: ["#e0f2fe", "#7dd3fc", "#0ea5e9"],
    gap: 12,
    speed: 18,
  },
  {
    colors: ["#fef08a", "#fde047", "#eab308"],
    gap: 10,
    speed: 16,
  },
  {
    colors: ["#fecdd3", "#fda4af", "#e11d48"],
    gap: 11,
    speed: 28,
    noFocus: true,
  },
];

// Function for Work component
function Work({ db }) {
  // State management
  const [activeCards, setActiveCards] = useState(() => new Set());
  const [hoveredCard, setHoveredCard] = useState(null); // Add missing state

  const handleCardClick = useCallback((slug) => {
    setActiveCards((prev) => {
      const newSet = new Set(prev); // Create a new Set to avoid mutating state directly
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  }, []);

  const handleCardHover = useCallback((slug) => {
    setHoveredCard(slug);
  }, []);

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
  for (const job of jobs) {
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
  }

  const time_span = moment().diff(first_date, "months");
  const safe_time_span = time_span === 0 ? 1 : time_span;
  for (const job of jobs) {
    job.bar_start =
      (100 * job._from.diff(first_date, "months")) / safe_time_span;
    job.bar_height = (100 * job.duration) / safe_time_span;
  }

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
            <TimelineBar
              first_year={first_date.format("YYYY")}
              job_bars={job_bars}
              activeCards={activeCards}
              hoveredJob={jobs.find((job) => job.slug === hoveredCard)}
              jobs={jobs}
            />
            <div className="work__items">
              {jobs.map((job, index) => {
                const isActive = activeCards.has(job.slug);
                const effect = CARD_EFFECTS[index % CARD_EFFECTS.length];
                return (
                  <button
                    key={job.slug}
                    type="button"
                    className={`work__item ${isActive ? "active" : ""}`}
                    onClick={() => handleCardClick(job.slug)}
                    onMouseEnter={() => handleCardHover(job.slug)}
                    onMouseLeave={() => handleCardHover(null)}
                    aria-expanded={isActive}
                  >
                    <PixelCanvas
                      className="work__item__pixel-canvas"
                      colors={effect.colors}
                      gap={effect.gap}
                      speed={effect.speed}
                      noFocus={effect.noFocus}
                    />
                    <div className="work__item__content">
                      <p
                        className={`work__item__place ${
                          isActive ? "show-text" : ""
                        }`}
                      >
                        <i className="fa fa-map-marker-alt" /> {job.place}
                      </p>
                      <h2>{job.title}</h2>
                      <h3 className="company-name">{job.company}</h3>
                      <p
                        className={`work__item__date ${
                          isActive ? "show-text" : ""
                        }`}
                      >
                        {job.date}
                      </p>
                      <p className={isActive ? "show-text" : ""}>
                        {job.description}
                      </p>
                    </div>
                  </button>
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
