import React, { useState, useEffect } from "react";
import moment from "moment";
import { withGoogleSheets } from "react-db-google-sheets";
import TimelineBar from "./TimelineBar";
import EventCard from "./EventCard";
import "../fun/friends.css";

function Friends({ db }) {
  const [barHeight, setBarHeight] = useState(0);
  const [barStart, setBarStart] = useState(0);
  const [activeCard, setActiveCard] = useState();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (db && db["events"]) {
      let eventsData = db["events"].map((row) => ({
        title: row.title,
        place: row.place,
        date: row.date,
        from: row.from,
        to: row.to,
        description: row.description,
        image: row.image,
        slug: `${row.title
          .replace(/\s+/g, "-")
          .toLowerCase()}-${row.from.replace(/:/g, "")}`,
      }));

      // Sort events by start time
      eventsData.sort(
        (a, b) => moment(a.from, "HH:mm") - moment(b.from, "HH:mm")
      );

      setEvents(eventsData);
    }
  }, [db]);

  const currentTime = moment();
  const currentDay = currentTime.format("dddd");
  const currentTimeFormatted = currentTime.format("h:mm a");
  const greeting = `Today is ${currentDay}, ${currentTimeFormatted}, and here's what you have planned:`;

  const nextEvent = events.find((event) =>
    moment(event.from, "HH:mm").isAfter(currentTime)
  );

  let firstDate = moment();

  events.forEach((event) => {
    if (event) {
      // Check if event is not null
      let toMoment = event.to ? moment(event.to, "HH:mm") : moment();
      let fromMoment = moment(event.from, "HH:mm");
      let duration = toMoment.diff(fromMoment, "minutes");
      event["from"] = fromMoment.format("HH:mm");
      event["to"] = event.to ? toMoment.format("HH:mm") : "Now";
      event["_from"] = fromMoment;
      event["_to"] = toMoment;
      event["time"] =
        duration === 0 ? event.from : event.from + " - " + event.to;
      event["duration"] = duration === 0 ? 1 : duration;

      if (fromMoment.diff(firstDate) < 0) {
        firstDate = fromMoment;
      }
    }
  });

  let timeSpan = moment().diff(firstDate, "minutes");
  events.forEach((event) => {
    event["bar_start"] =
      (100 * event._from.diff(firstDate, "minutes")) / timeSpan;
    event["bar_height"] = (100 * event.duration) / timeSpan;
  });

  let eventBars = events.map((event) => [event?.bar_height, event?.bar_start]); // Optional chaining

  function changeBarHeight(element) {
    const barStart = element.getAttribute("data-barstart");
    const barHeight = element.getAttribute("data-barheight");

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
        <h2>{greeting}</h2>
        <div className="events">
          <TimelineBar
            first_year={firstDate.format("YYYY")}
            event_bars={eventBars}
            bar_height={barHeight}
            bar_start={barStart}
          />
          <div className="events__items">
            {events.map((event) => {
              if (event)
                // Check if event is not null
                return (
                  <EventCard
                    event={event}
                    activeCard={activeCard}
                    changeBarHeight={changeBarHeight}
                    handleCardClick={handleCardClick}
                  />
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withGoogleSheets("events")(Friends);
