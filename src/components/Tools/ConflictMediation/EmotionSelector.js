import React, { useState, useEffect } from "react";
import CircumplexChart from "./CircumplexChart";
import { circumplex, emotionWheel } from "./emotionData";

const EmotionSelector = ({
  selectedEmotions = [],
  onEmotionChange,
  valenceArousalValue,
  onCircumplexChange,
  disabled = false,
}) => {
  const [activeEmotion, setActiveEmotion] = useState(null);

  // Handle clicking on a specific emotion in a quadrant
  const handleEmotionSelect = (emotion) => {
    if (disabled) {
      return;
    }
    onEmotionChange(emotion);
  };

  // Handle primary emotion selection
  const handlePrimaryEmotionClick = (emotion) => {
    if (disabled) {
      return;
    }

    setActiveEmotion(activeEmotion === emotion ? null : emotion);
  };

  // Handle sub-emotion selection
  const handleSubEmotionClick = (subEmotion) => {
    if (disabled) {
      return;
    }

    const isSelected = selectedEmotions.includes(subEmotion);

    if (isSelected) {
      onEmotionChange(selectedEmotions.filter((e) => e !== subEmotion));
    } else {
      onEmotionChange([...selectedEmotions, subEmotion]);
    }
  };

  return (
    <div className="emotion-selector-container">
      <div className="emotion-wheel-section">
        <h3>Emotion Wheel</h3>
        <p className="emotion-hint">
          Select primary emotions to see more specific feelings
        </p>

        <div className="emotion-wheel">
          {Object.entries(emotionWheel).map(([emotion, data]) => (
            <button
              key={emotion}
              type="button"
              className={`emotion-segment ${activeEmotion === emotion ? "active" : ""}`}
              style={{ "--emotion-color": data.color }}
              onClick={() => handlePrimaryEmotionClick(emotion)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePrimaryEmotionClick(emotion);
                }
              }}
            >
              <div className="emotion-content">
                <span className="emotion-icon">{data.icon}</span>
                <span className="emotion-name">{emotion}</span>
              </div>
            </button>
          ))}
        </div>

        {activeEmotion && (
          <div className="sub-emotions">
            <h4>
              <span className="emotion-icon">
                {emotionWheel[activeEmotion].icon}
              </span>
              {activeEmotion} - {emotionWheel[activeEmotion].description}
            </h4>
            <div className="sub-emotion-list">
              {emotionWheel[activeEmotion].subEmotions.map((subEmotion) => (
                <button
                  key={subEmotion}
                  type="button"
                  className={`sub-emotion-btn ${selectedEmotions.includes(subEmotion) ? "selected" : ""}`}
                  style={{
                    "--emotion-color": emotionWheel[activeEmotion].color,
                    "--emotion-bg": `${emotionWheel[activeEmotion].color}33`,
                  }}
                  onClick={() => handleSubEmotionClick(subEmotion)}
                  disabled={disabled}
                >
                  {subEmotion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <CircumplexChart
        value={valenceArousalValue}
        onChange={onCircumplexChange}
        onEmotionSelect={handleEmotionSelect}
        circumplex={circumplex}
        disabled={disabled}
        selectedEmotions={selectedEmotions}
      />

      {selectedEmotions.length > 0 && (
        <div className="selected-emotions">
          <h3>Selected Emotions</h3>
          <div className="emotion-tags">
            {selectedEmotions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                className="emotion-tag"
                onClick={() => !disabled && handleSubEmotionClick(emotion)}
                disabled={disabled}
              >
                {emotion}
                {!disabled && <span className="remove-emotion">×</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionSelector;
