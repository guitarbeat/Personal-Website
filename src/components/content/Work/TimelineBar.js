import React from 'react';
import PropTypes from 'prop-types';

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

  export default React.memo(TimelineBar);