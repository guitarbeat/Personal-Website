import React, { useState, useEffect } from "react";
import moment from "moment";
import { withGoogleSheets } from 'react-db-google-sheets';

function TimelineBar({ first_year, job_bars, bar_height, bar_start }) {
  let sub_bars = job_bars.map((bar) => {
    return (
      <div
        className="work__timeline__subbar"
        style={{ height: bar[0] + "%", bottom: bar[1] + "%" }}
      />
    );
  });

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

function Work({ db }) {
 // Convert the data from Google Sheets into the jobs format
  let jobs = db['work'].map((row) => {
    return {
      title: row.title,
      company: row.company,
      place: row.place,
      from: row.from,
      to: row.to,
      description: row.description,
      slug: row.slug,
    };
  });

  const [barHeight, setbarHeight] = useState(0);
  const [barStart, setBarStart] = useState(0);

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

  let first_date = moment();
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
  let time_span = moment().diff(first_date, "months");
  jobs.forEach((job) => {
    job["bar_start"] = (100 * job._from.diff(first_date, "months")) / time_span;
    job["bar_height"] = (100 * job.duration) / time_span;
  });

  let job_bars = jobs.map((job) => [job.bar_height, job.bar_start]);

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
              return (
                <div
                  className="work__item"
                  key={job.slug}
                  data-key={job.slug}
                  onMouseEnter={changebarHeight.bind(this)}
                  onTouchStart={changebarHeight.bind(this)}
                  onClick={changebarHeight.bind(this)}
                  data-barstart={job.bar_start}
                  data-barheight={job.bar_height}
                >
                  <p className="work__item__place">
                    <i className="fa fa-map-marker-alt" aria-hidden="true" />{" "}
                    {job.place}
                  </p>
                  <h2>{job.title}</h2>
                  <h3>{job.company}</h3>
                  <p className="work__item__date">{job.date}</p>
                  <p>{job.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withGoogleSheets('work')(Work);
