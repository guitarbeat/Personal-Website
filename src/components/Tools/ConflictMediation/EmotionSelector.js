import React, { useState, useEffect } from 'react';

// Emotion Wheel Data - Enhanced with icons and descriptions
const emotionWheel = {
  "Angry": {
    color: "#FF4D4D",
    icon: "🔥",
    description: "Feeling upset or annoyed because of something unfair or wrong",
    subEmotions: ["Frustrated", "Annoyed", "Offended", "Irritated", "Betrayed"]
  },
  "Sad": {
    color: "#4D79FF",
    icon: "😢",
    description: "Feeling unhappy or sorrowful about something",
    subEmotions: ["Hurt", "Disappointed", "Lonely", "Guilty", "Depressed"]
  },
  "Scared": {
    color: "#9B4DFF",
    icon: "😨",
    description: "Feeling afraid or worried about something",
    subEmotions: ["Anxious", "Stressed", "Overwhelmed", "Worried", "Shocked"]
  },
  "Happy": {
    color: "#FFD700",
    icon: "😊",
    description: "Feeling joy, pleasure, or contentment",
    subEmotions: ["Excited", "Grateful", "Optimistic", "Content", "Proud"]
  },
  "Disgusted": {
    color: "#4DFF4D",
    icon: "🤢",
    description: "Feeling strong disapproval or aversion",
    subEmotions: ["Disapproving", "Disappointed", "Awful", "Repelled"]
  },
  "Surprised": {
    color: "#FF4DFF",
    icon: "😲",
    description: "Feeling astonished or taken aback by something unexpected",
    subEmotions: ["Confused", "Amazed", "Stunned", "Startled"]
  }
};

// Circumplex data
const circumplex = {
  quadrants: [
    {
      id: "high_valence_high_arousal",
      name: "Excited",
      position: "top-right",
      color: "255, 215, 0", // Gold
      emotions: ["Excited", "Elated", "Happy", "Delighted"]
    },
    {
      id: "low_valence_high_arousal",
      name: "Distressed",
      position: "top-left",
      color: "255, 77, 77", // Red
      emotions: ["Angry", "Afraid", "Frustrated", "Anxious"]
    },
    {
      id: "low_valence_low_arousal",
      name: "Depressed",
      position: "bottom-left",
      color: "77, 121, 255", // Blue
      emotions: ["Sad", "Bored", "Tired", "Depressed"]
    },
    {
      id: "high_valence_low_arousal",
      name: "Relaxed",
      position: "bottom-right",
      color: "77, 255, 77", // Green
      emotions: ["Calm", "Relaxed", "Serene", "Content"]
    }
  ]
};

const EmotionSelector = ({ 
  selectedEmotions = [], 
  onEmotionChange,
  valenceArousalValue,
  onCircumplexChange,
  disabled = false
}) => {
  const [activeEmotion, setActiveEmotion] = useState(null);
  const [activeQuadrant, setActiveQuadrant] = useState(null);
  const [pointPosition, setPointPosition] = useState(null);

  // Calculate point position from valenceArousalValue
  useEffect(() => {
    if (valenceArousalValue) {
      const [x, y] = valenceArousalValue;
      setPointPosition({
        left: `${((x + 1) / 2) * 100}%`,
        top: `${((1 - y) / 2) * 100}%`
      });
    } else {
      setPointPosition(null);
    }
  }, [valenceArousalValue, getQuadrantFromValues]);

  // Get quadrant from valence-arousal values
  const getQuadrantFromValues = (x, y) => {
    if (x >= 0 && y >= 0) {
      return "high_valence_high_arousal";
    }
    if (x < 0 && y >= 0) {
      return "low_valence_high_arousal";
    }
    if (x < 0 && y < 0) {
      return "low_valence_low_arousal";
    }
    return "high_valence_low_arousal";
  };

  // Handle click on the circumplex chart
  const handleCircumplexClick = (e) => {
    if (disabled) {
      return;
    }

    // Get relative position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // Scale to -1 to 1
    const y = 1 - ((e.clientY - rect.top) / rect.height) * 2; // Scale to -1 to 1, invert Y

    // Update values
    onCircumplexChange([x, y]);
    
    // Determine which quadrant was clicked and set it as active
    const quadrantId = getQuadrantFromValues(x, y);
    setActiveQuadrant(quadrantId);
  };

  // Handle clicking on a specific emotion in a quadrant
  const handleEmotionSelect = (emotion) => {
    if (disabled) {
      return;
    }
    onEmotionChange(emotion);
  };

  // Update active quadrant when valenceArousalValue changes
  useEffect(() => {
    if (valenceArousalValue) {
      const quadrantId = getQuadrantFromValues(
        valenceArousalValue[0], 
        valenceArousalValue[1]
      );
      setActiveQuadrant(quadrantId);
    }
  }, [valenceArousalValue]);

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
      onEmotionChange(selectedEmotions.filter(e => e !== subEmotion));
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
              className={`emotion-segment ${activeEmotion === emotion ? 'active' : ''}`}
              style={{ '--emotion-color': data.color }}
              onClick={() => handlePrimaryEmotionClick(emotion)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
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
              <span className="emotion-icon">{emotionWheel[activeEmotion].icon}</span>
              {activeEmotion} - {emotionWheel[activeEmotion].description}
            </h4>
            <div className="sub-emotion-list">
              {emotionWheel[activeEmotion].subEmotions.map(subEmotion => (
                <button
                  key={subEmotion}
                  type="button"
                  className={`sub-emotion-btn ${selectedEmotions.includes(subEmotion) ? 'selected' : ''}`}
                  style={{ 
                    '--emotion-color': emotionWheel[activeEmotion].color,
                    '--emotion-bg': `${emotionWheel[activeEmotion].color}33`
                  }}
                  onClick={() => handleSubEmotionClick(subEmotion)}
                  disabled={disabled}
                >
                  {subEmotion}
                </button>
              ))}
            </div>
          </button>
        )}
      </div>
      
      <div className="emotion-circumplex-container">
        <h3>Valence-Arousal Circumplex Chart</h3>
        <p className="emotion-hint">
          Click on the chart to indicate how you feel based on pleasure (valence) and energy (arousal) levels
        </p>
        
        <div className="circumplex-wrapper">
          <button
            type="button"
            className="circumplex-chart"
            onClick={handleCircumplexClick}
            aria-label="Emotion circumplex chart"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCircumplexClick(e);
              }
            }}
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
            {circumplex.quadrants.map(quadrant => (
              <div 
                key={quadrant.id}
                className={`quadrant-label ${quadrant.position} ${activeQuadrant === quadrant.id ? 'active' : ''}`}
                style={{ '--quadrant-color': quadrant.color }}
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
                  background: `rgba(${circumplex.quadrants.find(q => q.id === activeQuadrant)?.color || '255, 255, 255'}, 0.9)`
                }}
              />
            )}
          </div>
          
          {/* Emotions in active quadrant */}
          {activeQuadrant && (
            <div className="quadrant-emotions">
              <h4>{circumplex.quadrants.find(q => q.id === activeQuadrant)?.name} Emotions</h4>
              <div className="emotion-buttons">
                {circumplex.quadrants
                  .find(q => q.id === activeQuadrant)
                  ?.emotions.map(emotion => (
                    <button
                      key={emotion}
                      type="button"
                      className={`emotion-btn ${selectedEmotions.includes(emotion) ? 'selected' : ''}`}
                      style={{ 
                        '--quadrant-color': circumplex.quadrants.find(q => q.id === activeQuadrant)?.color
                      }}
                      onClick={() => handleEmotionSelect(emotion)}
                      disabled={disabled}
                    >
                      {emotion}
                    </button>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
      
      {selectedEmotions.length > 0 && (
        <div className="selected-emotions">
          <h3>Selected Emotions</h3>
          <div className="emotion-tags">
            {selectedEmotions.map(emotion => (
              <div
                key={emotion}
                className="emotion-tag"
                onClick={() => !disabled && handleSubEmotionClick(emotion)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    !disabled && handleSubEmotionClick(emotion);
                  }
                }}
              >
                {emotion}
                {!disabled && (
                  <span className="remove-emotion">×</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionSelector; 