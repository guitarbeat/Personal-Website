import React, { useState, useEffect } from 'react';
import { emotionWheel, circumplex } from './emotionData';
import { getQuadrantFromValues, getCircumplexCoords } from './utils';

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

  // Get quadrant from valence-arousal values

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
  }, [valenceArousalValue]);

  // Handle click on the circumplex chart
  const handleCircumplexClick = (e) => {
    if (disabled) {
      return;
    }

    const { x, y, quadrantId } = getCircumplexCoords(e);
    onCircumplexChange([x, y]);
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
          </div>
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
          </button>

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
              <button
                key={emotion}
                type="button"
                className="emotion-tag"
                onClick={() => !disabled && handleSubEmotionClick(emotion)}
                disabled={disabled}
              >
                {emotion}
                {!disabled && (
                  <span className="remove-emotion">×</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionSelector; 