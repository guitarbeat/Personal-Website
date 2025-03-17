import React from 'react';

const ProgressTracker = ({ 
  steps, 
  currentStep, 
  onStepClick,
  disabled = false
}) => {
  // Calculate progress percentage
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="progress-tracker">
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="progress-steps">
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={`progress-step ${currentStep === index ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
            onClick={() => !disabled && onStepClick(index)}
            disabled={disabled}
            aria-current={currentStep === index ? 'step' : undefined}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker; 