import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FullscreenTool } from '../ToolsSection';
import EmotionSelector from './EmotionSelector';
import ReflectionPrompts from './ReflectionPrompts';
import ProgressTracker from './ProgressTracker';
import NeedsAssessment from './NeedsAssessment';
import './styles/index.scss';

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
const emotionAxes = {
  valence: {
    label: "Valence",
    description: "How positive or negative the emotion feels",
    min: "Negative",
    max: "Positive"
  },
  arousal: {
    label: "Arousal",
    description: "How energizing or calming the emotion feels",
    min: "Calm",
    max: "Excited"
  }
};

// eslint-disable-next-line no-unused-vars
const emotionMapping = {
  "Angry": { valence: -0.8, arousal: 0.8 },
  "Frustrated": { valence: -0.7, arousal: 0.5 },
  "Annoyed": { valence: -0.5, arousal: 0.3 },
  "Offended": { valence: -0.6, arousal: 0.4 },
  "Irritated": { valence: -0.4, arousal: 0.3 },
  "Betrayed": { valence: -0.9, arousal: 0.6 },
  
  "Sad": { valence: -0.7, arousal: -0.4 },
  "Hurt": { valence: -0.8, arousal: -0.2 },
  "Disappointed": { valence: -0.6, arousal: -0.3 },
  "Lonely": { valence: -0.7, arousal: -0.5 },
  "Guilty": { valence: -0.6, arousal: -0.1 },
  "Depressed": { valence: -0.9, arousal: -0.8 },
  
  "Scared": { valence: -0.7, arousal: 0.7 },
  "Anxious": { valence: -0.6, arousal: 0.6 },
  "Stressed": { valence: -0.7, arousal: 0.5 },
  "Overwhelmed": { valence: -0.8, arousal: 0.4 },
  "Worried": { valence: -0.5, arousal: 0.3 },
  "Shocked": { valence: -0.4, arousal: 0.9 },
  
  "Happy": { valence: 0.8, arousal: 0.5 },
  "Excited": { valence: 0.7, arousal: 0.8 },
  "Grateful": { valence: 0.9, arousal: 0.3 },
  "Optimistic": { valence: 0.8, arousal: 0.4 },
  "Content": { valence: 0.7, arousal: -0.2 },
  "Proud": { valence: 0.8, arousal: 0.6 },
  
  "Disgusted": { valence: -0.6, arousal: 0.2 },
  "Disapproving": { valence: -0.5, arousal: 0.1 },
  "Awful": { valence: -0.8, arousal: 0.3 },
  "Repelled": { valence: -0.7, arousal: 0.4 },
  
  "Surprised": { valence: 0.1, arousal: 0.8 },
  "Confused": { valence: -0.2, arousal: 0.3 },
  "Amazed": { valence: 0.6, arousal: 0.7 },
  "Stunned": { valence: 0.0, arousal: 0.9 },
  "Startled": { valence: -0.1, arousal: 0.8 }
};

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
  const handleKeyDown = (e, emotion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setActiveMainEmotion(emotion);
      e.preventDefault();
    }
  };

  const handleMainEmotionClick = (emotion) => {
    setActiveMainEmotion(emotion);
  };

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

  const handleAddCustom = () => {
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
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleInputChange = (e) => {
    setCustomEmotion(e.target.value);
  };

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

// Main component
const ConflictMediation = () => {
  const location = useLocation();
  const isFullscreen = location.pathname.includes('/fullscreen');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [needsData, setNeedsData] = useState(null);
  const printRef = useRef(null);

  // Define the steps for the conflict mediation process
  const steps = [
    { id: 1, name: 'Emotions', description: 'Identify your emotions' },
    { id: 2, name: 'Needs', description: 'Assess your needs' },
    { id: 3, name: 'Reflection', description: 'Reflect on the situation' },
    { id: 4, name: 'Review', description: 'Review your insights' }
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('conflictMediationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSelectedEmotions(parsedData.selectedEmotions || []);
        setFormData(parsedData.formData || {});
        setIsLocked(parsedData.isLocked || false);
        setNeedsData(parsedData.needsData || null);
        
        // Set the appropriate step based on saved data
        if (parsedData.isLocked) {
          setCurrentStep(4); // Review step
        } else if (parsedData.formData && Object.keys(parsedData.formData).length > 0) {
          setCurrentStep(3); // Reflection step
        } else if (parsedData.needsData) {
          setCurrentStep(3); // Reflection step
        } else if (parsedData.selectedEmotions && parsedData.selectedEmotions.length > 0) {
          setCurrentStep(2); // Needs step
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (selectedEmotions.length > 0 || Object.keys(formData).length > 0 || needsData) {
      const dataToSave = {
        selectedEmotions,
        formData,
        isLocked,
        needsData
      };
      localStorage.setItem('conflictMediationData', JSON.stringify(dataToSave));
    }
  }, [selectedEmotions, formData, isLocked, needsData]);

  // Handle emotion selection
  const handleEmotionSelect = (emotions) => {
    setSelectedEmotions(emotions);
  };

  // Handle needs assessment submission
  const handleNeedsSelected = (data) => {
    setNeedsData(data);
    setCurrentStep(3); // Move to the next step after needs assessment
  };

  // Handle form submission
  const handleSubmit = (data) => {
    setFormData(data);
    setIsLocked(true);
    setCurrentStep(4); // Move to review step
  };

  // Handle step navigation
  const handleStepClick = (stepId) => {
    if (!isLocked || stepId <= 4) {
      setCurrentStep(stepId);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new reflection? This will clear all current data.')) {
      setSelectedEmotions([]);
      setFormData({});
      setIsLocked(false);
      setNeedsData(null);
      setCurrentStep(1);
      localStorage.removeItem('conflictMediationData');
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EmotionSelector
            selectedEmotions={selectedEmotions}
            onEmotionSelect={handleEmotionSelect}
            onContinue={() => setCurrentStep(2)}
            emotionWheel={emotionWheel}
            isLocked={isLocked}
          />
        );
      case 2:
        return (
          <NeedsAssessment 
            onNeedsSelected={handleNeedsSelected}
          />
        );
      case 3:
        return (
          <ReflectionPrompts
            selectedEmotions={selectedEmotions}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isLocked={isLocked}
            needsData={needsData}
          />
        );
      case 4:
        return (
          <div className="view-mode">
            <div className="submission-container" ref={printRef}>
              <div className="submission-header">
                <h1>Conflict Reflection</h1>
                <div className="reflection-name">{formData.reflectionName || 'Untitled Reflection'}</div>
                <div className="reflection-date">{formData.date || new Date().toLocaleDateString()}</div>
              </div>
              
              <div className="data-section">
                <h2>Emotions Identified</h2>
                <div className="emotions-grid">
                  {selectedEmotions.map(emotion => (
                    <div key={emotion.name} className="emotion-tag" style={{ backgroundColor: emotion.color }}>
                      <span className="emotion-icon">{emotion.icon}</span>
                      <span className="emotion-name">{emotion.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {needsData && (
                <div className="data-section">
                  <h2>Needs Assessment</h2>
                  {needsData.selectedLevel && (
                    <div className="needs-summary">
                      <h3>Primary Need Category: {needsData.selectedLevel.name}</h3>
                      <p>{needsData.selectedLevel.description}</p>
                    </div>
                  )}
                  
                  {needsData.selectedNeeds && needsData.selectedNeeds.length > 0 && (
                    <div className="needs-list-summary">
                      <h3>Specific Needs Identified:</h3>
                      <div className="needs-tags">
                        {needsData.selectedNeeds.map(need => (
                          <div key={need} className="need-tag">
                            {need}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {needsData.needsText && (
                    <div className="custom-needs-summary">
                      <h3>Additional Needs:</h3>
                      <p>{needsData.needsText}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="data-section">
                <h2>Situation Details</h2>
                <div className="reflection-field">
                  <h3>What happened?</h3>
                  <p>{formData.situation || 'No details provided'}</p>
                </div>
              </div>
              
              <div className="data-section">
                <h2>Emotional Response</h2>
                <div className="reflection-field">
                  <h3>How did you feel?</h3>
                  <p>{formData.emotionalResponse || 'No details provided'}</p>
                </div>
                <div className="reflection-field">
                  <h3>What triggered these emotions?</h3>
                  <p>{formData.triggers || 'No details provided'}</p>
                </div>
              </div>
              
              <div className="data-section">
                <h2>Perspective Taking</h2>
                <div className="reflection-field">
                  <h3>How might others have perceived the situation?</h3>
                  <p>{formData.otherPerspective || 'No details provided'}</p>
                </div>
              </div>
              
              <div className="data-section">
                <h2>Resolution Ideas</h2>
                <div className="reflection-field">
                  <h3>What could help resolve this conflict?</h3>
                  <p>{formData.resolutionIdeas || 'No details provided'}</p>
                </div>
              </div>
              
              <div className="data-section">
                <h2>Learning & Growth</h2>
                <div className="reflection-field">
                  <h3>What have you learned from this situation?</h3>
                  <p>{formData.learnings || 'No details provided'}</p>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="reset-button" onClick={handleReset}>
                  Start New Reflection
                </button>
                <button className="print-button" onClick={handlePrint}>
                  Print Reflection
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FullscreenTool isFullscreen={isFullscreen} title="Conflict Mediation">
      <div className="conflict-mediation-container">
        <ProgressTracker 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
          isLocked={isLocked}
        />
        <div className="content-container">
          {renderStepContent()}
        </div>
      </div>
    </FullscreenTool>
  );
};

export default ConflictMediation; 