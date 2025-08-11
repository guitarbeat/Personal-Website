import React, { useState, useEffect, useCallback } from "react";

/**
 * CircumplexChart component for selecting valence-arousal values and quadrant-based emotions.
 *
 * Props:
 * - value: [valence, arousal] array, both in [-1, 1]
 * - onChange: function([valence, arousal])
 * - onEmotionSelect: function(emotion) (optional)
 * - circumplex: { quadrants: [{ id, name, color, position, emotions }] }
 * - disabled: boolean
 */
const CircumplexChart = ({
  value,
  onChange,
  onEmotionSelect,
  circumplex,
  disabled = false,
  selectedEmotions = [],
}) => {
  const [activeQuadrant, setActiveQuadrant] = useState(null);
  const pointPosition = value
    ? {
        left: `${((value[0] + 1) / 2) * 100}%`,
        top: `${(1 - (value[1] + 1) / 2) * 100}%`,
      }
    : null;

  // Handle click on the circumplex chart
  const handleCircumplexClick = useCallback(
    (e) => {
      if (disabled) return;
      if (!circumplex || !circumplex.getCircumplexCoords) return;
      const { x, y, quadrantId } = circumplex.getCircumplexCoords(e);
      if (onChange) onChange([x, y]);
      setActiveQuadrant(quadrantId);
    },
    [disabled, circumplex, onChange],
  );

  // Handle clicking on a specific emotion in a quadrant
  const handleEmotionSelect = useCallback(
    (emotion) => {
      if (disabled || !onEmotionSelect) return;
      onEmotionSelect(emotion);
    },
    [disabled, onEmotionSelect],
  );

  // Update active quadrant when value changes
  useEffect(() => {
    if (value && circumplex && circumplex.getQuadrantFromValues) {
      const quadrantId = circumplex.getQuadrantFromValues(value[0], value[1]);
      setActiveQuadrant(quadrantId);
    }
  }, [value, circumplex]);

  return (
    <div className="emotion-circumplex-container">
      <h3>Valence-Arousal Circumplex Chart</h3>
      <p className="emotion-hint">
        Click on the chart to indicate how you feel based on pleasure (valence)
        and energy (arousal) levels
      </p>
      <div className="circumplex-wrapper">
        <button
          type="button"
          className="circumplex-chart"
          onClick={handleCircumplexClick}
          aria-label="Emotion circumplex chart"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleCircumplexClick(e);
            }
          }}
          disabled={disabled}
        >
          {/* Axes labels */}
          <div className="axis-label valence-axis">
            <span className="negative">Displeasure</span>
            <span className="axis-name">Valence</span>
            <span className="positive">Pleasure</span>
          </div>
          <div className="axis-label arousal-axis">
            <span className="positive">High Energy</span>
            <span className="axis-name">Arousal</span>
            <span className="negative">Low Energy</span>
          </div>
          {/* Quadrant labels */}
          {circumplex?.quadrants?.map((quadrant) => (
            <div
              key={quadrant.id}
              className={`quadrant-label ${quadrant.position} ${activeQuadrant === quadrant.id ? "active" : ""}`}
              style={{ "--quadrant-color": quadrant.color }}
            >
              {quadrant.name}
            </div>
          ))}
          {/* Axes lines */}
          <div className="horizontal-axis" />
          <div className="vertical-axis" />
          {/* Selected point */}
          {pointPosition && (
            <div
              className="selected-point"
              style={{
                left: pointPosition.left,
                top: pointPosition.top,
                background: `rgba(${
                  circumplex?.quadrants?.find((q) => q.id === activeQuadrant)
                    ?.color || "255, 255, 255"
                }, 0.9)`,
              }}
            />
          )}
        </button>
        {/* Emotions in active quadrant */}
        {activeQuadrant && circumplex?.quadrants && (
          <div className="quadrant-emotions">
            <h4>
              {circumplex.quadrants.find((q) => q.id === activeQuadrant)?.name}{" "}
              Emotions
            </h4>
            <div className="emotion-buttons">
              {circumplex.quadrants
                .find((q) => q.id === activeQuadrant)
                ?.emotions.map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    className={`emotion-btn ${selectedEmotions?.includes(emotion) ? "selected" : ""}`}
                    style={{
                      "--quadrant-color": circumplex.quadrants.find(
                        (q) => q.id === activeQuadrant,
                      )?.color,
                    }}
                    onClick={() => handleEmotionSelect(emotion)}
                    disabled={disabled}
                  >
                    {emotion}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircumplexChart;
