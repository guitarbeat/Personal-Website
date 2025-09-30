// LoadingVariantSelector.js
import React from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #00ff88;
`;

const Label = styled.label`
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin-right: 10px;
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.8);
  color: #00ff88;
  border: 1px solid #00ff88;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  
  option {
    background: #000;
    color: #00ff88;
  }
`;

const LoadingVariantSelector = ({ variant, onVariantChange }) => {
  const variants = [
    { value: 1, label: 'Spiral Reveal' },
    { value: 2, label: 'Particle Burst' },
    { value: 3, label: 'Wave Ripple' },
    { value: 4, label: 'Typewriter' },
    { value: 5, label: 'Matrix Rain' },
    { value: 6, label: 'Glitch Effect' }
  ];

  return (
    <SelectorContainer>
      <Label htmlFor="loading-variant">Loading Style:</Label>
      <Select
        id="loading-variant"
        value={variant}
        onChange={(e) => onVariantChange(parseInt(e.target.value))}
      >
        {variants.map(v => (
          <option key={v.value} value={v.value}>
            {v.label}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};

export default LoadingVariantSelector;