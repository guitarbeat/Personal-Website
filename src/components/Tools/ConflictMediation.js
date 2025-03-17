import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../../sass/components/conflictMediation.scss';

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

// MIT Emotion Axes Data
const emotionAxes = [
  {
    id: "anxiety_confidence",
    name: "Anxiety – Confidence",
    values: [
      { value: -1.0, label: "Anxiety" },
      { value: -0.5, label: "Worry" },
      { value: -0.25, label: "Discomfort" },
      { value: 0.25, label: "Comfort" },
      { value: 0.5, label: "Hopeful" },
      { value: 1.0, label: "Confident" }
    ],
    color: "#4D79FF"
  },
  {
    id: "boredom_fascination",
    name: "Boredom – Fascination",
    values: [
      { value: -1.0, label: "Ennui" },
      { value: -0.5, label: "Boredom" },
      { value: -0.25, label: "Indifference" },
      { value: 0.25, label: "Interest" },
      { value: 0.5, label: "Curiosity" },
      { value: 1.0, label: "Intrigue" }
    ],
    color: "#FFD700"
  },
  {
    id: "frustration_euphoria",
    name: "Frustration – Euphoria",
    values: [
      { value: -1.0, label: "Frustration" },
      { value: -0.5, label: "Puzzlement" },
      { value: -0.25, label: "Confusion" },
      { value: 0.25, label: "Insight" },
      { value: 0.5, label: "Enlightenment" },
      { value: 1.0, label: "Epiphany" }
    ],
    color: "#FF4D4D"
  },
  {
    id: "dispirited_encouraged",
    name: "Dispirited – Encouraged",
    values: [
      { value: -1.0, label: "Dispirited" },
      { value: -0.5, label: "Disappointed" },
      { value: -0.25, label: "Dissatisfied" },
      { value: 0.25, label: "Satisfied" },
      { value: 0.5, label: "Thrilled" },
      { value: 1.0, label: "Enthusiastic" }
    ],
    color: "#4DFF4D"
  },
  {
    id: "terror_enchantment",
    name: "Terror – Enchantment",
    values: [
      { value: -1.0, label: "Terror" },
      { value: -0.5, label: "Dread" },
      { value: -0.25, label: "Apprehension" },
      { value: 0.25, label: "Calm" },
      { value: 0.5, label: "Anticipatory" },
      { value: 1.0, label: "Excited" }
    ],
    color: "#9B4DFF"
  },
  {
    id: "humiliation_pride",
    name: "Humiliation – Pride",
    values: [
      { value: -1.0, label: "Humiliated" },
      { value: -0.5, label: "Embarrassed" },
      { value: -0.25, label: "Self-conscious" },
      { value: 0.25, label: "Pleased" },
      { value: 0.5, label: "Satisfied" },
      { value: 1.0, label: "Proud" }
    ],
    color: "#FF4DFF"
  }
];

// Valence-Arousal Circumplex Data
const circumplex = {
  quadrants: [
    {
      id: "high_valence_high_arousal",
      position: "top-right",
      name: "High Valence, High Arousal",
      description: "Positive feelings with high energy",
      emotions: ["Excited", "Astonished", "Delighted", "Happy", "Pleased"],
      color: "255, 215, 0" // Gold
    },
    {
      id: "low_valence_high_arousal",
      position: "top-left",
      name: "Low Valence, High Arousal",
      description: "Negative feelings with high energy",
      emotions: ["Alarmed", "Afraid", "Angry", "Annoyed", "Frustrated"],
      color: "255, 77, 77" // Red
    },
    {
      id: "low_valence_low_arousal",
      position: "bottom-left",
      name: "Low Valence, Low Arousal",
      description: "Negative feelings with low energy",
      emotions: ["Miserable", "Depressed", "Bored", "Tired", "Sad"],
      color: "77, 121, 255" // Blue
    },
    {
      id: "high_valence_low_arousal",
      position: "bottom-right",
      name: "High Valence, Low Arousal",
      description: "Positive feelings with low energy",
      emotions: ["Content", "Serene", "Calm", "Relaxed", "Peaceful"],
      color: "77, 255, 77" // Green
    }
  ]
};

// Emotion Axes Component
const EmotionAxes = React.memo(({ 
  emotionAxesValues, 
  onEmotionAxisChange, 
  disabled = false 
}) => {
  return (
    <div className="emotion-axes-container">
      <h3>Emotional States (MIT Research)</h3>
      <p className="emotion-hint">
        Select where you fall on each emotional spectrum. These axes represent the dynamic interplay between opposite emotional states.
      </p>
      
      {emotionAxes.map((axis) => (
        <div key={axis.id} className="emotion-axis">
          <div className="axis-label">
            <span>{axis.name}</span>
          </div>
          <div 
            className="axis-track"
            style={{ '--axis-color': axis.color }}
          >
            {axis.values.map((value) => (
              <button
                key={`${axis.id}_${value.value}`}
                type="button"
                className={`axis-point ${emotionAxesValues[axis.id] === value.value ? 'selected' : ''}`}
                onClick={() => !disabled && onEmotionAxisChange(axis.id, value.value)}
                disabled={disabled}
                aria-label={`${value.label} (${value.value})`}
                aria-pressed={emotionAxesValues[axis.id] === value.value}
                title={value.label}
              >
                <span className="axis-tooltip">{value.label}</span>
              </button>
            ))}
          </div>
          <div className="axis-labels">
            <span className="negative-label">{axis.values[0].label}</span>
            <span className="positive-label">{axis.values[axis.values.length - 1].label}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

// Add display name for debugging
EmotionAxes.displayName = 'EmotionAxes';

// Improved Emotion Wheel Component
const EmotionWheel = React.memo(({ onSelectEmotion, selectedEmotions }) => {
  const [activeMainEmotion, setActiveMainEmotion] = useState(null);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, emotion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setActiveMainEmotion(emotion);
      e.preventDefault();
    }
  }, []);

  const handleMainEmotionClick = useCallback((emotion) => {
    setActiveMainEmotion(emotion);
  }, []);

  return (
    <div className="emotion-wheel-container">
      <div className="emotion-categories">
        {Object.entries(emotionWheel).map(([emotion, { color, icon, description }]) => (
          <button
            key={emotion}
            type="button"
            className={`emotion-category ${activeMainEmotion === emotion ? 'active' : ''}`}
            style={{ '--emotion-color': color }}
            onClick={() => handleMainEmotionClick(emotion)}
            onKeyDown={(e) => handleKeyDown(e, emotion)}
            aria-pressed={activeMainEmotion === emotion}
            aria-label={`${emotion} emotions: ${description}`}
          >
            <span className="emotion-icon">{icon}</span>
            <span className="emotion-name">{emotion}</span>
          </button>
        ))}
      </div>
      
      {activeMainEmotion && (
        <div className="sub-emotions" role="group" aria-label={`${activeMainEmotion} sub-emotions`}>
          <div className="sub-emotions-header">
            <h3>{activeMainEmotion} emotions</h3>
            <p>{emotionWheel[activeMainEmotion].description}</p>
          </div>
          <div className="sub-emotions-grid">
            {emotionWheel[activeMainEmotion].subEmotions.map(subEmotion => (
              <button
                key={subEmotion}
                type="button"
                className={`sub-emotion ${selectedEmotions.includes(subEmotion) ? 'selected' : ''}`}
                onClick={() => onSelectEmotion(subEmotion)}
                aria-pressed={selectedEmotions.includes(subEmotion)}
                style={{ '--emotion-color': emotionWheel[activeMainEmotion].color }}
              >
                {subEmotion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// Add display name for debugging
EmotionWheel.displayName = 'EmotionWheel';

// Emotion Circumplex Component
const EmotionCircumplex = React.memo(({
  valenceArousalValue,
  onCircumplexChange,
  onEmotionSelect,
  selectedEmotions,
  disabled = false
}) => {
  const [activeQuadrant, setActiveQuadrant] = useState(null);

  // Calculate position from valenceArousalValue [x, y] where x is valence (-1 to 1) and y is arousal (-1 to 1)
  const pointPosition = valenceArousalValue ? {
    left: `${((valenceArousalValue[0] + 1) / 2) * 100}%`,
    top: `${(1 - ((valenceArousalValue[1] + 1) / 2)) * 100}%`
  } : null;

  // Get quadrant based on valence-arousal values
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
    onEmotionSelect(emotion);
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

  return (
    <div className="emotion-circumplex-container">
      <h3>Valence-Arousal Circumplex Chart</h3>
      <p className="emotion-hint">
        Click on the chart to indicate how you feel based on pleasure (valence) and energy (arousal) levels
      </p>
      
      <div className="circumplex-wrapper">
        <div 
          className="circumplex-chart" 
          onClick={handleCircumplexClick}
          role="grid"
          aria-label="Emotion circumplex chart"
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
          <div className="horizontal-axis"></div>
          <div className="vertical-axis"></div>
          
          {/* Selected point */}
          {pointPosition && (
            <div 
              className="selected-point"
              style={{
                left: pointPosition.left,
                top: pointPosition.top,
                background: `rgba(${circumplex.quadrants.find(q => q.id === activeQuadrant)?.color || '255, 255, 255'}, 0.9)`
              }}
            ></div>
          )}
        </div>
      </div>
      
      {/* Show emotions for the active quadrant */}
      {activeQuadrant && (
        <div className="quadrant-emotions">
          <h4>{circumplex.quadrants.find(q => q.id === activeQuadrant).name}</h4>
          <p>{circumplex.quadrants.find(q => q.id === activeQuadrant).description}</p>
          
          <div className="emotions-grid">
            {circumplex.quadrants
              .find(q => q.id === activeQuadrant)
              .emotions.map(emotion => (
                <button
                  key={emotion}
                  type="button"
                  className={`emotion-button quadrant-emotion ${selectedEmotions.includes(emotion) ? 'selected' : ''}`}
                  onClick={() => handleEmotionSelect(emotion)}
                  aria-pressed={selectedEmotions.includes(emotion)}
                  disabled={disabled}
                  style={{ '--quadrant-color': circumplex.quadrants.find(q => q.id === activeQuadrant).color }}
                >
                  {emotion}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
});

// Add display name for debugging
EmotionCircumplex.displayName = 'EmotionCircumplex';

// Custom hook for form state management with validation
const useFormState = (initialState, validationRules = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Use useCallback to memoize the handleChange function
  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Clear error when field is edited
    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.entries(validationRules).forEach(([field, rule]) => {
      if (rule.required && (!values[field] || (Array.isArray(values[field]) && values[field].length === 0))) {
        newErrors[field] = rule.message || 'This field is required';
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return { values, errors, touched, handleChange, validate, resetForm };
};

// Input Field Component with error handling
const InputField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  error,
  touched,
  required = false,
  disabled = false
}) => (
  <div className={`input-group ${error && touched ? 'has-error' : ''}`}>
    <label htmlFor={id}>
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error && touched ? 'true' : 'false'}
        aria-describedby={error && touched ? `${id}-error` : undefined}
        disabled={disabled}
      />
    ) : (
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error && touched ? 'true' : 'false'}
        aria-describedby={error && touched ? `${id}-error` : undefined}
        disabled={disabled}
      />
    )}
    {error && touched && (
      <div id={`${id}-error`} className="error-message">
        {error}
      </div>
    )}
  </div>
);

// Updated EmotionsSection Component
const EmotionsSection = React.memo(({ 
  emotions, 
  onToggleEmotion, 
  onAddCustomEmotion,
  emotionAxesValues,
  onEmotionAxisChange,
  valenceArousalValue,
  onValenceArousalChange,
  error,
  touched,
  disabled = false
}) => {
  const [customEmotion, setCustomEmotion] = useState("");
  const customInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("wheel"); // "wheel", "axes", or "circumplex"

  const handleAddCustom = useCallback(() => {
    if (customEmotion.trim()) {
      // Split by commas and add each emotion individually
      const emotionsToAdd = customEmotion
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
      
      emotionsToAdd.forEach(emotion => {
        if (!emotions.includes(emotion)) {
          onAddCustomEmotion(emotion);
        }
      });
      
      setCustomEmotion("");
      if (customInputRef.current) {
        customInputRef.current.focus();
      }
    }
  }, [customEmotion, emotions, onAddCustomEmotion]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  }, [handleAddCustom]);

  const handleInputChange = useCallback((e) => {
    setCustomEmotion(e.target.value);
  }, []);

  return (
    <div className={`emotions-section ${error && touched ? 'has-error' : ''}`}>
      <label>I Feel...</label>
      <p className="emotion-hint">Select emotions from the options below or add your own. Remember to use descriptive words.</p>
      
      <div className="emotion-tabs">
        <button 
          type="button" 
          className={`tab-button ${activeTab === "wheel" ? "active" : ""}`}
          onClick={() => setActiveTab("wheel")}
          disabled={disabled}
        >
          Emotion Wheel
        </button>
        <button 
          type="button" 
          className={`tab-button ${activeTab === "axes" ? "active" : ""}`}
          onClick={() => setActiveTab("axes")}
          disabled={disabled}
        >
          Emotion Axes (MIT Research)
        </button>
        <button 
          type="button" 
          className={`tab-button ${activeTab === "circumplex" ? "active" : ""}`}
          onClick={() => setActiveTab("circumplex")}
          disabled={disabled}
        >
          Emotion Circumplex
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === "wheel" ? (
          <>
            <p className="emotion-example">Example: Instead of "I feel like Bruce doesn't like me" (which is a belief), use "Hurt" or "Insecure"</p>
            
            <EmotionWheel
              onSelectEmotion={onToggleEmotion}
              selectedEmotions={emotions}
            />
          </>
        ) : activeTab === "axes" ? (
          <EmotionAxes 
            emotionAxesValues={emotionAxesValues}
            onEmotionAxisChange={onEmotionAxisChange}
            disabled={disabled}
          />
        ) : (
          <EmotionCircumplex
            valenceArousalValue={valenceArousalValue}
            onCircumplexChange={onValenceArousalChange}
            onEmotionSelect={onToggleEmotion}
            selectedEmotions={emotions}
            disabled={disabled}
          />
        )}
      </div>

      {emotions.length > 0 && (
        <div className="selected-emotions">
          <h3>Selected Emotions: <span className="emotion-count">{emotions.length}</span></h3>
          <div className="emotions-grid" role="list" aria-label="Selected emotions">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => onToggleEmotion(emotion)}
                className="emotion-button selected"
                aria-label={`Remove ${emotion}`}
                role="listitem"
                disabled={disabled}
              >
                {emotion} ×
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="custom-emotion">
        <input
          type="text"
          value={customEmotion}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add custom emotions (separate multiple with commas)"
          ref={customInputRef}
          aria-label="Add custom emotion"
          disabled={disabled}
        />
        <button 
          type="button"
          onClick={handleAddCustom}
          aria-label="Add custom emotion"
          className="custom-emotion-button"
          disabled={disabled}
        >
          Add
        </button>
      </div>
      
      {error && touched && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
});

// Add display name for debugging
EmotionsSection.displayName = 'EmotionsSection';

// Collapsible Section Component
const CollapsibleSection = ({ 
  title, 
  isOpen, 
  onToggle, 
  children,
  id,
  disabled = false
}) => (
  <div className="collapsible-section">
    <button
      type="button"
      onClick={onToggle}
      className="section-header"
      aria-expanded={isOpen}
      aria-controls={`section-${id}`}
      disabled={disabled}
    >
      <span>{title}</span>
      <span className="toggle-icon">{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && (
      <div className="section-content" id={`section-${id}`}>
        {children}
      </div>
    )}
  </div>
);

// Add this new component before the ConflictMediation component
const ViewMode = ({ values }) => {
  const formatEmotions = (emotions) => {
    if (!emotions || emotions.length === 0) {
      return null;
    }
    return emotions.map(emotion => (
      <span key={emotion} className="emotion-tag">
        {emotion}
      </span>
    ));
  };

  // Helper to render emotion axis display
  const renderEmotionAxis = (axisId) => {
    const value = values.emotionAxesValues[axisId];
    if (value === null) {
      return null;
    }
    
    const axis = emotionAxes.find(a => a.id === axisId);
    if (!axis) {
      return null;
    }
    
    const selectedValue = axis.values.find(v => v.value === value);
    if (!selectedValue) {
      return null;
    }
    
    return (
      <div className="emotion-axis-display" key={axisId}>
        <div className="axis-display-header">
          <span>{axis.name}</span>
        </div>
        <div 
          className="axis-display-track"
          style={{ '--axis-color': axis.color }}
        >
          {axis.values.map(val => (
            <div
              key={`${axisId}_${val.value}`}
              className={`axis-display-point ${val.value === value ? 'selected' : ''}`}
              title={val.label}
            >
              {val.value === value && <span className="axis-display-label">{val.label}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the circumplex point
  const renderCircumplex = () => {
    if (!values.valenceArousalValue) {
      return null;
    }
    
    // Determine which quadrant the point is in
    const [valence, arousal] = values.valenceArousalValue;
    let quadrantId;
    if (valence >= 0 && arousal >= 0) {
      quadrantId = "high_valence_high_arousal";
    } else if (valence < 0 && arousal >= 0) {
               quadrantId = "low_valence_high_arousal";
             } else if (valence < 0 && arousal < 0) {
               quadrantId = "low_valence_low_arousal";
             } else {
               quadrantId = "high_valence_low_arousal";
             }
    
    const quadrant = circumplex.quadrants.find(q => q.id === quadrantId);
    
    return (
      <div className="circumplex-display">
        <div className="circumplex-chart-display">
          <div className="chart-container">
            {/* Axes */}
            <div className="horizontal-axis"></div>
            <div className="vertical-axis"></div>
            
            {/* Labels */}
            <div className="axis-label valence-axis">
              <span className="negative">Displeasure</span>
              <span className="positive">Pleasure</span>
            </div>
            <div className="axis-label arousal-axis">
              <span className="positive">High Energy</span>
              <span className="negative">Low Energy</span>
            </div>
            
            {/* Selected point */}
            <div 
              className="display-point"
              style={{
                left: `${((valence + 1) / 2) * 100}%`,
                top: `${(1 - ((arousal + 1) / 2)) * 100}%`,
                background: `rgba(${quadrant.color}, 0.9)`
              }}
            ></div>
          </div>
        </div>
        
        <div className="circumplex-info">
          <h4>{quadrant.name}</h4>
          <p>{quadrant.description}</p>
        </div>
      </div>
    );
  };

  // Check if any emotion axis value is set
  const hasEmotionAxesValues = Object.values(values.emotionAxesValues).some(val => val !== null);

  return (
    <div className="view-mode">
      {values.name && (
        <div className="view-section">
          <h2>{values.name}'s Reflection</h2>
        </div>
      )}
      
      {values.thoughts && (
        <div className="view-section">
          <h3>Thoughts</h3>
          <p className="view-content">{values.thoughts}</p>
        </div>
      )}

      {values.emotions.length > 0 && (
        <div className="view-section">
          <h3>Emotions</h3>
          <div className="emotions-display">
            {formatEmotions(values.emotions)}
          </div>
        </div>
      )}

      {hasEmotionAxesValues && (
        <div className="view-section">
          <h3>Emotional States (MIT Research)</h3>
          <div className="emotion-axes-display">
            {Object.keys(values.emotionAxesValues).map(axisId => renderEmotionAxis(axisId))}
          </div>
        </div>
      )}

      {values.valenceArousalValue && (
        <div className="view-section">
          <h3>Valence-Arousal Emotional State</h3>
          {renderCircumplex()}
        </div>
      )}

      {(values.aggressiveWant || values.passiveWant || values.assertiveWant) && (
        <div className="view-section">
          <h3>Communication Styles</h3>
          {values.aggressiveWant && (
            <div className="style-block aggressive">
              <h4>Confrontational</h4>
              <p>{values.aggressiveWant}</p>
            </div>
          )}
          {values.passiveWant && (
            <div className="style-block passive">
              <h4>Holding Back</h4>
              <p>{values.passiveWant}</p>
            </div>
          )}
          {values.assertiveWant && (
            <div className="style-block assertive">
              <h4>Direct & Respectful</h4>
              <p>{values.assertiveWant}</p>
            </div>
          )}
        </div>
      )}

      {(values.whyThinkPart1 || values.whyFeelPart1 || values.whyWantPart1) && (
        <div className="view-section">
          <h3>Understanding My Perspective</h3>
          {values.whyThinkPart1 && (
            <div className="perspective-block">
              <p>
                <strong>I think </strong>
                {values.whyThinkPart1}
                <strong className="because"> this way because </strong>
                {values.whyThinkPart2}
              </p>
            </div>
          )}
          {values.whyFeelPart1 && (
            <div className="perspective-block">
              <p>
                <strong>I feel </strong>
                {values.whyFeelPart1}
                <strong className="because"> this way because </strong>
                {values.whyFeelPart2}
              </p>
            </div>
          )}
          {values.whyWantPart1 && (
            <div className="perspective-block">
              <p>
                <strong>I want </strong>
                {values.whyWantPart1}
                <strong className="because"> this way because </strong>
                {values.whyWantPart2}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ConflictMediation = () => {
  const initialState = {
    name: "",
    thoughts: "",
    emotions: [],
    emotionAxesValues: {
      anxiety_confidence: null,
      boredom_fascination: null,
      frustration_euphoria: null,
      dispirited_encouraged: null,
      terror_enchantment: null,
      humiliation_pride: null
    },
    valenceArousalValue: null,
    aggressiveWant: "",
    passiveWant: "",
    assertiveWant: "",
    whyThink: "",
    whyFeel: "",
    whyWant: "",
    isLocked: false
  };
  
  // Define validation rules
  const validationRules = {
    // All fields are now optional - removed required validations
  };

  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    validate, 
    resetForm 
  } = useFormState(initialState, validationRules);
  
  const [showIWant, setShowIWant] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  
  // Store handleChange in a ref to avoid dependency issues
  const handleChangeRef = useRef(handleChange);
  useEffect(() => {
    handleChangeRef.current = handleChange;
  }, [handleChange]);
  
  // Load saved form data from localStorage if available
  useEffect(() => {
    const savedForm = localStorage.getItem('conflictMediationForm');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        // Only restore if there's actual data
        if (parsedForm.thoughts || (parsedForm.emotions && parsedForm.emotions.length > 0)) {
          Object.entries(parsedForm).forEach(([key, value]) => {
            handleChangeRef.current(key, value);
          });
          
          // Restore section states
          if (parsedForm.aggressiveWant || parsedForm.passiveWant || parsedForm.assertiveWant) {
            setShowIWant(true);
          }
          
          if (parsedForm.whyThink || parsedForm.whyFeel || parsedForm.whyWant) {
            setShowWhy(true);
          }
        }
      } catch (e) {
        console.error("Error loading saved form data", e);
      }
    }
  }, []); // Run only once on component mount
  
  // Save form data to localStorage when it changes
  const previousValuesRef = useRef(values);
  
  useEffect(() => {
    // Only save if not locked and if values have actually changed
    if (!values.isLocked && JSON.stringify(values) !== JSON.stringify(previousValuesRef.current)) {
      localStorage.setItem('conflictMediationForm', JSON.stringify(values));
      previousValuesRef.current = values;
    }
  }, [values]);

  // Memoize the toggleEmotion function to prevent unnecessary re-renders
  const toggleEmotion = useCallback((emotion) => {
    if (values.isLocked) {
      return;
    }
    handleChange("emotions", 
      values.emotions.includes(emotion)
        ? values.emotions.filter((e) => e !== emotion)
        : [...values.emotions, emotion]
    );
  }, [values.emotions, handleChange, values.isLocked]);

  const handleLockToggle = () => {
    if (!values.isLocked && validate()) {
      handleChange("isLocked", true);
      localStorage.removeItem('conflictMediationForm');
    } else if (values.isLocked) {
      handleChange("isLocked", false);
    }
  };

  const handleReset = () => {
    resetForm();
    setShowIWant(false);
    setShowWhy(false);
    localStorage.removeItem('conflictMediationForm');
  };

  // Memoize the add custom emotion handler
  const handleAddCustomEmotion = useCallback((emotion) => {
    if (values.isLocked) {
      return;
    }
    handleChange("emotions", [...values.emotions, emotion]);
  }, [values.emotions, handleChange, values.isLocked]);

  // Memoize the emotion axis change handler
  const handleEmotionAxisChange = useCallback((axisId, value) => {
    if (values.isLocked) {
      return;
    }
    handleChange("emotionAxesValues", {
      ...values.emotionAxesValues,
      [axisId]: value
    });
  }, [values.emotionAxesValues, handleChange, values.isLocked]);

  // Memoize the valence-arousal change handler
  const handleValenceArousalChange = useCallback((value) => {
    if (values.isLocked) {
      return;
    }
    handleChange("valenceArousalValue", value);
  }, [handleChange, values.isLocked]);

  return (
    <div className="conflict-mediation-container">
      <div className={`form-container ${values.isLocked ? 'view-only' : ''}`}>
        <h1>Conflict Resolution Tool</h1>
        <p className="form-description">
          This tool helps you explore your thoughts and feelings about a conflict situation. Take your time with each section - there are no right or wrong answers.
        </p>
        
        {values.isLocked ? (
          <ViewMode values={values} />
        ) : (
          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <InputField
              id="name"
              label="Your Name"
              value={values.name}
              onChange={(value) => !values.isLocked && handleChange("name", value)}
              placeholder="Enter your name"
              error={errors.name}
              touched={touched.name}
              disabled={values.isLocked}
            />

            <div className="form-section">
              <h2>Step 1: Describe the Situation</h2>
              <InputField
                id="thoughts"
                label="What's on your mind?"
                value={values.thoughts}
                onChange={(value) => !values.isLocked && handleChange("thoughts", value)}
                placeholder="Describe what happened or what you're thinking about..."
                type="textarea"
                error={errors.thoughts}
                touched={touched.thoughts}
                disabled={values.isLocked}
              />
            </div>

            <div className="form-section">
              <h2>Step 2: Identify Your Emotions</h2>
              <EmotionsSection
                emotions={values.emotions}
                onToggleEmotion={toggleEmotion}
                onAddCustomEmotion={handleAddCustomEmotion}
                emotionAxesValues={values.emotionAxesValues}
                onEmotionAxisChange={handleEmotionAxisChange}
                valenceArousalValue={values.valenceArousalValue}
                onValenceArousalChange={handleValenceArousalChange}
                error={errors.emotions}
                touched={touched.emotions}
                disabled={values.isLocked}
              />
            </div>

            <CollapsibleSection
              id="wants"
              title="Step 3: Express What You Want"
              isOpen={showIWant}
              onToggle={() => !values.isLocked && setShowIWant(!showIWant)}
              disabled={values.isLocked}
            >
              <p className="section-intro">
                There are different ways to express what you want. Try writing your message in these three ways to see how each approach might affect the outcome:
              </p>
              <div className="grid-3">
                <InputField
                  id="aggressiveWant"
                  label="Confrontational Approach"
                  value={values.aggressiveWant}
                  onChange={(value) => handleChange("aggressiveWant", value)}
                  placeholder="Write as if you're frustrated and defensive..."
                  type="textarea"
                  error={errors.aggressiveWant}
                  touched={touched.aggressiveWant}
                />
                <InputField
                  id="passiveWant"
                  label="Hesitant Approach"
                  value={values.passiveWant}
                  onChange={(value) => handleChange("passiveWant", value)}
                  placeholder="Write as if you're trying to avoid conflict..."
                  type="textarea"
                  error={errors.passiveWant}
                  touched={touched.passiveWant}
                />
                <InputField
                  id="assertiveWant"
                  label="Balanced Approach"
                  value={values.assertiveWant}
                  onChange={(value) => handleChange("assertiveWant", value)}
                  placeholder="Write while being both honest and respectful..."
                  type="textarea"
                  error={errors.assertiveWant}
                  touched={touched.assertiveWant}
                />
              </div>
              <p className="style-note">
                Notice how the balanced approach helps express your needs clearly while keeping the conversation open.
              </p>
            </CollapsibleSection>

            <CollapsibleSection
              id="why"
              title="Step 4: Understand Your Perspective"
              isOpen={showWhy}
              onToggle={() => !values.isLocked && setShowWhy(!showWhy)}
              disabled={values.isLocked}
            >
              <p className="section-intro">
                Understanding why we think, feel, and want certain things helps us communicate better. Complete these statements:
              </p>
              <div className="why-section">
                <div className="because-field-group">
                  <div className="split-input">
                    <div className="thought-part">
                      <InputField
                        id="whyThinkPart1"
                        label="I think..."
                        value={values.whyThinkPart1}
                        onChange={(value) => handleChange("whyThinkPart1", value)}
                        placeholder="Write down your main thought or belief about the situation"
                        type="textarea"
                        error={errors.whyThinkPart1}
                        touched={touched.whyThinkPart1}
                      />
                    </div>
                    <div className="connector">this way because...</div>
                    <div className="reason-part">
                      <InputField
                        id="whyThinkPart2"
                        label="The reason is..."
                        value={values.whyThinkPart2}
                        onChange={(value) => handleChange("whyThinkPart2", value)}
                        placeholder="Explain what experiences or observations led you to this thought"
                        type="textarea"
                        error={errors.whyThinkPart2}
                        touched={touched.whyThinkPart2}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="because-field-group">
                  <div className="split-input">
                    <div className="thought-part">
                      <InputField
                        id="whyFeelPart1"
                        label="I feel..."
                        value={values.whyFeelPart1}
                        onChange={(value) => handleChange("whyFeelPart1", value)}
                        placeholder="Name the emotions you're experiencing in this situation"
                        type="textarea"
                        error={errors.whyFeelPart1}
                        touched={touched.whyFeelPart1}
                      />
                    </div>
                    <div className="connector">this way because...</div>
                    <div className="reason-part">
                      <InputField
                        id="whyFeelPart2"
                        label="The reason is..."
                        value={values.whyFeelPart2}
                        onChange={(value) => handleChange("whyFeelPart2", value)}
                        placeholder="Describe what triggered these emotions or what needs aren't being met"
                        type="textarea"
                        error={errors.whyFeelPart2}
                        touched={touched.whyFeelPart2}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="because-field-group">
                  <div className="split-input">
                    <div className="thought-part">
                      <InputField
                        id="whyWantPart1"
                        label="I want..."
                        value={values.whyWantPart1}
                        onChange={(value) => handleChange("whyWantPart1", value)}
                        placeholder="State what change or outcome you're hoping for"
                        type="textarea"
                        error={errors.whyWantPart1}
                        touched={touched.whyWantPart1}
                      />
                    </div>
                    <div className="connector">this way because...</div>
                    <div className="reason-part">
                      <InputField
                        id="whyWantPart2"
                        label="The reason is..."
                        value={values.whyWantPart2}
                        onChange={(value) => handleChange("whyWantPart2", value)}
                        placeholder="Explain why this outcome matters to you and what values it represents"
                        type="textarea"
                        error={errors.whyWantPart2}
                        touched={touched.whyWantPart2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </form>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            className={`submit-button ${values.isLocked ? 'locked' : ''}`}
            onClick={handleLockToggle}
          >
            {values.isLocked ? 'Edit Reflection' : 'Lock Reflection'}
          </button>
          {!values.isLocked && (values.thoughts || values.emotions.length > 0) && (
            <button type="button" className="reset-button" onClick={handleReset}>
              Clear Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConflictMediation; 