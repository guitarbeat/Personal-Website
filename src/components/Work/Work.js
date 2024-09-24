// Import required libraries and components
import React, { useState } from "react";
import moment from "moment";
import { withGoogleSheets } from "react-db-google-sheets";

// Function for TimelineBar component
function TimelineBar({ first_year, job_bars, bar_height, bar_start }) {
  let sub_bars = job_bars.map((bar, index) => (
    <div
      key={index}
      className="work__timeline__subbar"
      style={{ height: bar[0] + "%", bottom: bar[1] + "%" }}
    />
  ));

  return (
    <div className="work__timeline">
      <p className="work__timeline__now">Now</p>
      <p className="work__timeline__start">{first_year}</p>
      {sub_bars}
      <div
        className="work__timeline__bar"
        style={{ height: bar_height + "%", bottom: bar_start + "%" }}
      />
    </div>
  );
}

// Function for Work component
function Work({ db }) {
  const [barHeight, setbarHeight] = useState(0);
  const [barStart, setBarStart] = useState(0);
  const [activeCard, setActiveCard] = useState(null);

  // Convert the data from Google Sheets into the jobs format
  let jobs = db["work"].map((row) => ({
    title: row.title,
    company: row.company,
    place: row.place,
    from: row.from,
    to: row.to,
    description: row.description,
    slug: row.slug
  }));

  let first_date = moment();

  // Format and enhance jobs data
  jobs.forEach((job) => {
    let _to_moment = job.to ? moment(job.to, "MM-YYYY") : moment();
    let _from_moment = moment(job.from, "MM-YYYY");
    let _duration = _to_moment.diff(_from_moment, "months");
    job["from"] = _from_moment.format("MMM YYYY");
    job["to"] = job.to ? _to_moment.format("MMM YYYY") : "Now";
    job["_from"] = _from_moment;
    job["_to"] = _to_moment;
    job["date"] = _duration === 0 ? job.from : job.from + " - " + job.to;
    job["duration"] = _duration === 0 ? 1 : _duration;

    if (first_date.diff(_from_moment) > 0) {
      first_date = _from_moment;
    }
  });

  // Calculate time span and bar metrics for jobs
  let time_span = moment().diff(first_date, "months");
  jobs.forEach((job) => {
    job["bar_start"] = (100 * job._from.diff(first_date, "months")) / time_span;
    job["bar_height"] = (100 * job.duration) / time_span;
  });

  let job_bars = jobs.map((job) => [job.bar_height, job.bar_start]);

  // Handle bar height changes
  function changebarHeight(event) {
    setBarStart(
      event.target.getAttribute("data-barstart") ||
        event.target.parentElement.getAttribute("data-barstart")
    );

    setbarHeight(
      event.target.getAttribute("data-barheight") ||
        event.target.parentElement.getAttribute("data-barheight")
    );
  }

  // Handle card click events
  const handleCardClick = (slug) => {
    setActiveCard(activeCard === slug ? null : slug);
  };

  // Render the Work component
  return (
    <div className="container" id="work">
      <div className="container__content">
        <h1>My career so far</h1>
        <div className="work">
          <TimelineBar
            first_year={first_date.format("YYYY")}
            job_bars={job_bars}
            bar_height={barHeight}
            bar_start={barStart}
          />
          <div className="work__items">
            {jobs.map((job) => {
              const isActive = activeCard === job.slug;

              return (
                <div
                  className={`work__item ${isActive ? "active" : ""}`}
                  key={job.slug}
                  data-key={job.slug}
                  onMouseEnter={changebarHeight}
                  onTouchStart={changebarHeight}
                  onClick={() => handleCardClick(job.slug)}
                  data-barstart={job.bar_start}
                  data-barheight={job.bar_height}
                >
                  <p
                    className={`work__item__place ${
                      isActive ? "show-text" : ""
                    }`}
                  >
                    <i className="fa fa-map-marker-alt" aria-hidden="true" />{" "}
                    {job.place}
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Work component with Google Sheets data
export default withGoogleSheets("work")(Work);
