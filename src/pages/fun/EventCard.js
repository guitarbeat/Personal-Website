import React from "react";

function EventCard({ event, activeCard, changeBarHeight, handleCardClick }) {
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
        src={event.image ? event.image : process.env.PUBLIC_URL + "/frog.png"}
        alt={event.title}
        style={{ width: "100%" }}
      />
      <p className="work__item__place">
        <i className="fa fa-map-marker-alt" aria-hidden="true" /> {event.place}
      </p>
      <h2>{event.title}</h2>
      <p className="work__item__date">
        {event.date}, {event.time}
      </p>
      <p>{event.description}</p>
    </div>
  );
}

export default EventCard;
