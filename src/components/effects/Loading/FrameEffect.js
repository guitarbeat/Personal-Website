import PropTypes from "prop-types";
import React from "react";
import { styled } from "styled-components";

const FRAME_BORDER_WIDTH = "7px";
const FRAME_COLOR = "#999";
const FRAME_BORDER_RADIUS = "20px";

const Frame = styled.div`
  --frame-border: ${FRAME_BORDER_WIDTH} solid ${FRAME_COLOR};
  
  position: fixed;
  inset: 0;
  height: 100vh; /* Fallback for browsers that do not support dvh */
  height: 100dvh; /* Dynamic viewport height - accounts for mobile browser chrome */
  border: var(--frame-border);
  box-sizing: border-box;
  z-index: var(--z-index-frame);
  user-select: none;
  pointer-events: none;
  mix-blend-mode: difference;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: var(--frame-border);
    border-radius: ${FRAME_BORDER_RADIUS};
    margin: -${FRAME_BORDER_WIDTH};
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  pointer-events: auto;
`;

const FrameEffect = ({ children }) => (
  <div className="frame">
    <ContentWrapper>{children}</ContentWrapper>
    <Frame />
  </div>
);

FrameEffect.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FrameEffect;
