import React, { useRef, useEffect, useState, useCallback } from "react";
import moment from "moment";

const EventCard = ({ event, activeCard, changeBarHeight, handleCardClick }) => {
  const isActive = activeCard === event.slug;
  const cardRef = useRef(null);
  const [countdown, setCountdown] = useState("");

  const updateCountdown = useCallback(() => {
    const currentTime = moment();
    const timeToEvent = event._from.diff(currentTime);
    if (timeToEvent > 0) {
      setCountdown(
        `Event starts in ${moment.duration(timeToEvent).humanize()}`
      );
    } else {
      setCountdown("Event has started!");
    }
  }, [event]);

  useEffect(() => {
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000);
    return () => clearInterval(intervalId);
  }, [event, updateCountdown]);

  const changeHeight = useCallback(() => {
    if (cardRef.current) {
      changeBarHeight(cardRef.current);
    }
  }, [changeBarHeight]);

  return (
    <div
      ref={cardRef}
      className={`events__item ${isActive ? "active" : ""}`}
      key={event.slug}
      data-key={event.slug}
      onMouseEnter={changeHeight}
      onTouchStart={changeHeight}
      onClick={() => handleCardClick(event.slug)}
      data-barstart={event.bar_start}
      data-barheight={String(event.bar_height)}
    >
      <img
        src={event.image ? event.image : process.env.PUBLIC_URL + "/frog.png"}
        alt={event.title}
        style={{ width: "100%" }}
      />
      <p className="events__item__place">
        <i className="fa fa-map-marker-alt" aria-hidden="true" /> {event.place}
      </p>
      <h2>{event.title}</h2>
      <p className="events__item__date">
        {event.date}, {event.time}
      </p>
      <p>{event.description}</p>
      <p>{countdown}</p>
    </div>
  );
};

export default EventCard;
