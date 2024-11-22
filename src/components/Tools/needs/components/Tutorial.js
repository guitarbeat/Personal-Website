import React, { useState } from 'react';

const Tutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: 'Welcome to Needs Pyramid',
      content: 'This tool helps you track and balance different aspects of your life.'
    },
    // ... more steps
  ];

  return (
    <div className="needs-tutorial">
      <div className="needs-tutorial__content">
        <h2>{steps[step].title}</h2>
        <p>{steps[step].content}</p>
        <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}>
          {step < steps.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>
    </div>
  );
};

export default Tutorial; 