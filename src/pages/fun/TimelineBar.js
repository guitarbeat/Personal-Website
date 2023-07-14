import React from "react";

function TimelineBar({ first_year, event_bars, bar_height, bar_start }) {
  let sub_bars = event_bars.map((bar, index) => (
    <div
      key={index}
      className="events__timeline__subbar"
      style={{ height: (bar[0] || 0) + "%", top: (bar[1] || 0) + "%" }}
    />
  ));

  return (
    <div className="events__timeline">
      <p className="events__timeline__start">{first_year}</p>
      {sub_bars}
      <div
        className="events__timeline__bar"
        style={{ height: (bar_height || 0) + "%", top: (bar_start || 0) + "%" }}
      />
      <p className="events__timeline__now">Now</p>
    </div>
  );
}

export default TimelineBar;
