import React, { useRef } from "react";

function EventCard({ event, activeCard, changeBarHeight, handleCardClick }) {
  const isActive = activeCard === event.slug;
  const cardRef = useRef(null); // Initialize the ref

  // Use a callback function to pass the ref current value to the parent function
  const changeHeight = () => {
    if (cardRef.current) {
      changeBarHeight(cardRef.current);
    }
  };

  return (
    <div
      ref={cardRef} // Attach the ref to your component
      className={`events__item ${isActive ? "active" : ""}`}
      key={event.slug}
      data-key={event.slug}
      onMouseEnter={changeHeight}
      onTouchStart={changeHeight}
      onClick={() => handleCardClick(event.slug)}
      data-barstart={event.bar_start}
      data-barheight={event.bar_height}
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
    </div>
  );
}

export default EventCard;
