// Import required libraries and components
import React, { useState } from "react";
import moment from "moment";
import { withGoogleSheets } from "react-db-google-sheets";
import "../fun/friends.css";

// Function for TimelineBar component
function TimelineBar({ first_year, event_bars, bar_height, bar_start }) {
  let sub_bars = event_bars.map((bar) => (
    <div
      className="event__timeline__subbar"
      style={{ height: bar.height + "%", bottom: bar.start + "%" }}
    />
  ));

  return (
    <div className="event__timeline">
      <p className="event__timeline__now">Now</p>
      <p className="event__timeline__start">{first_year}</p>
      {sub_bars}
      <div
        className="event__timeline__bar"
        style={{ height: bar_height + "%", bottom: bar_start + "%" }}
      />
    </div>
  );
}

// Function for Events component
function Friends({ db }) {
  const [barHeight, setbarHeight] = useState(0);
  const [barStart, setBarStart] = useState(0);
  const [activeCard, setActiveCard] = useState(null);

  // Convert the data from Google Sheets into the events format
  let events = db["events"]
    ? db["events"].map((row) => ({
        title: row.title,
        place: row.place,
        date: row.date,
        from: row.from,
        to: row.to,
        description: row.description,
        image: row.image, // New image field
        slug: "persp-swe",
      }))
    : [];

  let first_date = moment();

  // Format and enhance events data
  events.forEach((event) => {
    let _to_moment = event.to ? moment(event.to, "HH:mm") : moment();
    let _from_moment = moment(event.from, "HH:mm");
    let _duration = _to_moment.diff(_from_moment, "minutes");
    event["from"] = _from_moment.format("HH:mm");
    event["to"] = event.to ? _to_moment.format("HH:mm") : "Now";
    event["_from"] = _from_moment;
    event["_to"] = _to_moment;
    event["time"] =
      _duration === 0 ? event.from : event.from + " - " + event.to;
    event["duration"] = _duration === 0 ? 1 : _duration;

    if (first_date.diff(_from_moment) > 0) {
      first_date = _from_moment;
    }
  });

  // Calculate time span and bar metrics for events
  let time_span = moment().diff(first_date, "minutes");
  events.forEach((event) => {
    event["bar_start"] =
      (100 * event._from.diff(first_date, "minutes")) / time_span;
    event["bar_height"] = (100 * event.duration) / time_span;
  });

  let event_bars = events.map((event) => ({
    height: event.bar_height,
    start: event.bar_start,
  }));

  // Handle bar height changes
  function changeBarHeight(event) {
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

  // Render the Events component
  return (
    <div className="container" id="events">
      <div className="container__content">
        <a
          className="google-sheet-link"
          href="https://docs.google.com/spreadsheets/d/1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA/edit#gid=1802221480"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Google Sheet
        </a>
        <h1>Mario Comes to Portland!</h1>
        <div className="events">
          <TimelineBar
            first_year={first_date.format("YYYY")}
            event_bars={event_bars}
            bar_height={barHeight}
            bar_start={barStart}
          />
          <div className="events__items">
            {events.map((event) => {
              const isActive = activeCard === event.slug;

              return (
                <div
                  className={`events__item ${isActive ? "active" : ""}`}
                  key={event.slug}
                  data-key={event.slug}
                  onMouseEnter={changeBarHeight}
                  onTouchStart={changeBarHeight}
                  onClick={() => handleCardClick(event.slug)}
                  data-barstart={event.bar_start}
                  data-barheight={event.bar_height}
                >
                  {/* Add the image here */}
                  <img
                    src={event.image ? event.image : "aaronwoods.info/frog.png"}
                    alt={event.title}
                    style={{ width: "100%" }}
                  />
                  <p className="events__item__place">
                    <i className="fa fa-map-marker-alt" aria-hidden="true" />{" "}
                    {event.place}
                  </p>
                  <h2>{event.title}</h2>
                  <p className="events__item__time">
                    {event.date}, {event.time}
                  </p>
                  <p>{event.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Friends component with Google Sheets data
export default withGoogleSheets("events")(Friends);
