import React, { useState, useEffect } from "react";
import moment from "moment";
import { withGoogleSheets } from "react-db-google-sheets";
import "../fun/friends.css";

function TimelineBar({ first_year, event_bars, bar_height, bar_start }) {
  let sub_bars = event_bars.map((bar) => (
    <div
      className="events__timeline__subbar"
      style={{ height: bar[0] + "%", top: bar[1] + "%" }}
    />
  ));

  return (
    <div className="events__timeline">
      <p className="events__timeline__start">{first_year}</p>
      {sub_bars}
      <div
        className="events__timeline__bar"
        style={{ height: bar_height + "%", top: bar_start + "%" }}
      />
      <p className="events__timeline__now">Now</p>
    </div>
  );
}

function Friends({ db }) {
  const [barHeight, setBarHeight] = useState(0);
  const [barStart, setBarStart] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (db && db["events"]) {
      const eventsData = db["events"].map((row) => ({
        title: row.title,
        place: row.place,
        date: row.date,
        from: row.from,
        to: row.to,
        description: row.description,
        image: row.image,
        slug: "persp-swe",
      }));
      setEvents(eventsData);
    }
  }, [db]);

  let firstDate = moment();

  events.forEach((event) => {
    let toMoment = event.to ? moment(event.to, "HH:mm") : moment();
    let fromMoment = moment(event.from, "HH:mm");
    let duration = toMoment.diff(fromMoment, "minutes");
    event["from"] = fromMoment.format("HH:mm");
    event["to"] = event.to ? toMoment.format("HH:mm") : "Now";
    event["_from"] = fromMoment;
    event["_to"] = toMoment;
    event["time"] = duration === 0 ? event.from : event.from + " - " + event.to;
    event["duration"] = duration === 0 ? 1 : duration;

    if (fromMoment.diff(firstDate) < 0) {
      firstDate = fromMoment;
    }
  });

  let timeSpan = moment().diff(firstDate, "minutes");
  events.forEach((event) => {
    event["bar_start"] =
      (100 * event._from.diff(firstDate, "minutes")) / timeSpan;
    event["bar_height"] = (100 * event.duration) / timeSpan;
  });

  let eventBars = events.map((event) => [event.bar_height, event.bar_start]);

  function changeBarHeight(event) {
    const barStart =
      event.target.getAttribute("data-barstart") ||
      event.target.parentElement?.getAttribute("data-barstart");
    const barHeight =
      event.target.getAttribute("data-barheight") ||
      event.target.parentElement?.getAttribute("data-barheight");

    if (barStart !== null && barHeight !== null) {
      setBarStart(barStart);
      setBarHeight(barHeight);
    }
  }

  const handleCardClick = (slug) => {
    setActiveCard(activeCard === slug ? null : slug);
  };

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
        <div className="work">
          <TimelineBar
            first_year={firstDate.format("YYYY")}
            event_bars={eventBars}
            bar_height={barHeight}
            bar_start={barStart}
          />
          <div className="work__items">
            {events.map((event) => {
              const isActive = activeCard === event.slug;

              return (
                <div
                  className={`work__item ${isActive ? "active" : ""}`}
                  key={event.slug}
                  data-key={event.slug}
                  onMouseEnter={changeBarHeight}
                  onTouchStart={changeBarHeight}
                  onClick={() => handleCardClick(event.slug)}
                  data-barstart={event.bar_start}
                  data-barheight={event.bar_height}
                >
                  <img
                    src={
                      event.image
                        ? event.image
                        : process.env.PUBLIC_URL + "/frog.png"
                    }
                    alt={event.title}
                    style={{ width: "100%" }}
                  />
                  <p className="work__item__place">
                    <i className="fa fa-map-marker-alt" aria-hidden="true" />{" "}
                    {event.place}
                  </p>
                  <h2>{event.title}</h2>
                  <p className="work__item__date">
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

export default withGoogleSheets("events")(Friends);
