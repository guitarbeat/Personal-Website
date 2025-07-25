import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FullscreenTool } from '../ToolsSection/FullscreenWrapper';
import EmotionSelector from './EmotionSelector';
import ReflectionPrompts from './ReflectionPrompts';
import ProgressTracker from './ProgressTracker';
import NeedsAssessment from './NeedsAssessment';
import { emotionWheel, circumplex } from './emotionData';
import { getQuadrantFromValues, getCircumplexCoords } from './utils';
import './styles/index.scss';
import CircumplexChart from './CircumplexChart';

// Emotion Axes Data
const emotionAxes = {
  valence: {
    id: "valence",
    name: "Valence",
    description: "How positive or negative the emotion feels",
    min: "Negative",
    max: "Positive",
    color: "255, 215, 0", // Gold
    values: [
      { value: -1, label: "Very Negative" },
      { value: -0.5, label: "Somewhat Negative" },
      { value: 0, label: "Neutral" },
      { value: 0.5, label: "Somewhat Positive" },
      { value: 1, label: "Very Positive" }
    ]
  },
  arousal: {
    id: "arousal",
    name: "Arousal",
    description: "How energizing or calming the emotion feels",
    min: "Calm",
    max: "Excited",
    color: "77, 121, 255", // Blue
    values: [
      { value: -1, label: "Very Calm" },
      { value: -0.5, label: "Somewhat Calm" },
      { value: 0, label: "Neutral" },
      { value: 0.5, label: "Somewhat Energized" },
      { value: 1, label: "Very Energized" }
    ]
  }
};


// Valence-Arousal Circumplex Data

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

      {Object.values(emotionAxes).map((axis) => (
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
                className={`axis-point ${emotionAxesValues?.[axis.id] === value.value ? 'selected' : ''}`}
                onClick={() => !disabled && onEmotionAxisChange(axis.id, value.value)}
                disabled={disabled}
                aria-label={`${value.label} (${value.value})`}
                aria-pressed={emotionAxesValues?.[axis.id] === value.value}
                title={value.label}
              >
                <span className="axis-tooltip">{value.label}</span>
              </button>
            ))}
          </div>
          <div className="axis-labels">
            <span className="negative-label">{axis.min}</span>
            <span className="positive-label">{axis.max}</span>
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
        <div className="sub-emotions">
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

// Updated EmotionsSection Component
const EmotionsSection = React.memo(({
  emotions,
  onToggleEmotion,
  onAddCustomEmotion,
  emotionAxesValues,
  onEmotionAxisChange,
  valenceArousalValue,
  onCircumplexChange,
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

      for (const emotion of emotionsToAdd) {
        if (!emotions.includes(emotion)) {
          onAddCustomEmotion(emotion);
        }
      }

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
      <h2>I Feel...</h2>
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
          <CircumplexChart
            value={valenceArousalValue}
            onChange={onCircumplexChange}
            onEmotionSelect={onToggleEmotion}
            circumplex={circumplex}
            disabled={disabled}
            selectedEmotions={emotions}
          />
        )}
      </div>

      {emotions.length > 0 && (
        <div className="selected-emotions">
          <h3>Selected Emotions: <span className="emotion-count">{emotions.length}</span></h3>
          <ul className="emotions-grid" aria-label="Selected emotions">
            {emotions.map((emotion) => (
              <li key={emotion}>
                <button
                  type="button"
                  onClick={() => onToggleEmotion(emotion)}
                  className="emotion-button selected"
                  aria-label={`Remove ${emotion}`}
                  disabled={disabled}
                >
                  {emotion} ×
                </button>
              </li>
            ))}
          </ul>
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
  const [valenceArousal, setValenceArousal] = useState(null);
  const [emotionAxesValues, setEmotionAxesValues] = useState({
    valence: 0,
    arousal: 0
  });
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
        setValenceArousal(parsedData.valenceArousal || null);
        setEmotionAxesValues(parsedData.emotionAxesValues || { valence: 0, arousal: 0 });

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
    const dataToSave = {
      selectedEmotions,
      formData,
      isLocked,
      needsData,
      valenceArousal,
      emotionAxesValues
    };

    try {
      localStorage.setItem('conflictMediationData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [selectedEmotions, formData, isLocked, needsData, valenceArousal, emotionAxesValues]);

  // Handle step navigation
  const handleStepClick = (stepId) => {
    if (!isLocked && stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  // Handle emotion selection
  const handleEmotionChange = (emotions) => {
    setSelectedEmotions(emotions);
  };

  // Handle emotion axis change
  const handleEmotionAxisChange = (axisId, value) => {
    setEmotionAxesValues(prev => ({
      ...prev,
      [axisId]: value
    }));
  };

  // Handle valence-arousal changes
  const handleValenceArousalChange = (values) => {
    setValenceArousal(values);
  };

  // Handle needs assessment completion
  const handleNeedsComplete = (data) => {
    setNeedsData(data);
    setCurrentStep(3);
  };

  // Handle reflection form submission
  const handleReflectionComplete = (data) => {
    setFormData(data);
    setIsLocked(true);
    setCurrentStep(4);
  };

  // Handle starting over
  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will clear all your progress.')) {
      setSelectedEmotions([]);
      setFormData({});
      setIsLocked(false);
      setNeedsData(null);
      setValenceArousal(null);
      setEmotionAxesValues({ valence: 0, arousal: 0 });
      setCurrentStep(1);
      localStorage.removeItem('conflictMediationData');
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EmotionSelector
            selectedEmotions={selectedEmotions}
            onEmotionChange={handleEmotionChange}
            valenceArousalValue={valenceArousal}
            onCircumplexChange={handleValenceArousalChange}
            emotionAxesValues={emotionAxesValues}
            onEmotionAxisChange={handleEmotionAxisChange}
            disabled={isLocked}
          />
        );
      case 2:
        return (
          <NeedsAssessment
            selectedEmotions={selectedEmotions}
            onComplete={handleNeedsComplete}
            initialData={needsData}
            disabled={isLocked}
          />
        );
      case 3:
        return (
          <ReflectionPrompts
            selectedEmotions={selectedEmotions.map(emotion => {
              if (typeof emotion === 'string') {
                // Find the emotion in the emotionWheel if possible
                for (const [mainEmotion, data] of Object.entries(emotionWheel)) {
                  if (mainEmotion === emotion) {
                    return { name: emotion, color: data.color, icon: data.icon };
                  }
                  if (data.subEmotions.includes(emotion)) {
                    return { name: emotion, color: data.color, icon: data.icon };
                  }
                }
                // Default if not found
                return { name: emotion, color: "#777777", icon: "😐" };
              }
              return emotion;
            })}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleReflectionComplete}
            isLocked={isLocked}
            needsData={needsData}
          />
        );
      case 4:
        return (
          <div className="review-section" ref={printRef}>
            <h2>Your Conflict Resolution Journey</h2>
            <div className="review-content">
              <section>
                <h3>Emotional Awareness</h3>
                <div className="emotions-list">
                  {selectedEmotions.map(emotion => (
                    <span key={typeof emotion === 'string' ? emotion : emotion.name} className="emotion-tag">
                      {typeof emotion === 'string' ? emotion : emotion.name}
                    </span>
                  ))}
                </div>
              </section>

              {needsData && (
                <section>
                  <h3>Needs Assessment</h3>
                  <div className="needs-summary">
                    {Object.entries(needsData).map(([need, value]) => (
                      <div key={need} className="need-item">
                        <span className="need-name">{need}</span>
                        <div className="need-value" style={{ width: `${value}%` }}>
                          {value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {formData && Object.keys(formData).length > 0 && (
                <section>
                  <h3>Reflections</h3>
                  {Object.entries(formData).map(([question, answer]) => (
                    <div key={question} className="reflection-item">
                      <h4>{question}</h4>
                      <p>{answer}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <button
              type="button"
              className="start-over-button"
              onClick={handleStartOver}
            >
              Start Over
            </button>
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