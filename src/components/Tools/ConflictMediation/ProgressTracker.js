import React from "react";
import "./styles/progress-tracker.scss";

const ProgressTracker = ({
  steps,
  currentStep,
  onStepClick,
  isLocked = false,
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex === currentStep) {
      return "active";
    }
    if (stepIndex < currentStep) {
      return "completed";
    }
    return "";
  };

  const calculateProgress = () => {
    return (currentStep / (steps.length - 1)) * 100;
  };

  return (
    <div className="progress-tracker">
      <div className="steps-container">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={`step-button ${getStepStatus(index)} ${isLocked ? "locked" : ""}`}
            onClick={() => onStepClick(index)}
            disabled={isLocked || index > currentStep + 1}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <div className="step-name">{step.name}</div>
              <div className="step-description">{step.description}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${calculateProgress()}%`,
            background:
              "linear-gradient(135deg, var(--color-sage) 0%, var(--color-sage-light) 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressTracker;
