import PropTypes from "prop-types";
import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { withGoogleSheets } from "react-db-google-sheets";
import {
  normalizeSheetData,
  processWorkData,
} from "../../../utils/googleSheetsUtils";
import PixelCanvas from "../../effects/PixelCanvas/PixelCanvas.jsx";

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

  const sub_bars = job_bars.map(([height, start]) => (
    <div
      key={`${height}-${start}`}
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
  const [activeCards, setActiveCards] = useState(() => new Set());
  const [hoveredCard, setHoveredCard] = useState(null);

  const rawJobs = useMemo(() => normalizeSheetData(db, "work"), [db]);
  const { processedJobs, firstDate, jobBars } = useMemo(
    () => processWorkData(rawJobs),
    [rawJobs],
  );

  const handleCardClick = useCallback((slug) => {
    setActiveCards((prev) => {
      const newSet = new Set(prev);
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
              first_year={firstDate}
              job_bars={jobBars}
              activeCards={activeCards}
              hoveredJob={processedJobs.find(
                (job) => job.slug === hoveredCard,
              )}
              jobs={processedJobs}
            />
            <div className="work__items">
              {processedJobs.map((job, index) => {
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
