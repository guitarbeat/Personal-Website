import React from 'react';
import styled from 'styled-components';

const Frame = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  border: 7px solid #999; /* Reduced thickness */
  box-sizing: border-box;
  z-index: 1000;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
  mix-blend-mode: difference; /* Changed blend mode */
`;

const FrameEffect = ({ children }) => {
  return (
    <div className="frame">
      {children}
      <Frame />
    </div>
  );
};

export default FrameEffect;
