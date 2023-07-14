import React, { useRef, useEffect, useState } from "react";
import moment from "moment";

function EventCard({ event, activeCard, changeBarHeight, handleCardClick }) {
  const isActive = activeCard === event.slug;
  const cardRef = useRef(null); // Initialize the ref
  const [countdown, setCountdown] = useState("");

  // Function to update the countdown
  const updateCountdown = () => {
    const currentTime = moment();
    const timeToEvent = event._from.diff(currentTime);
    if (timeToEvent > 0) {
      setCountdown(
        `Event starts in ${moment.duration(timeToEvent).humanize()}`
      );
    } else {
      setCountdown(`Event has started!`);
    }
  };

  useEffect(() => {
    // Update the countdown immediately and then every minute
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000);
    return () => clearInterval(intervalId);
  }, [event]);

  // Use a callback function to pass the ref current value to the parent function
  const changeHeight = () => {
    if (cardRef.current) {
      changeBarHeight(cardRef.current);
    }
  };

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
      data-barheight={String(event.bar_height)} // Convert to string
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
      <p>{countdown}</p> {/* Display the countdown */}
    </div>
  );
}

export default EventCard;
