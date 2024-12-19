import React from 'react'
import { styled } from 'styled-components'

const Frame = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  border: 7px solid #999; /* Base frame that covers corners */
  box-sizing: border-box;
  z-index: var(--z-index-frame);
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
  mix-blend-mode: difference;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 7px solid #999;
    border-radius: 20px;
    margin: -7px;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  pointer-events: auto;
`

const FrameEffect = ({ children }) => {
  return (
    <div className="frame">
      <ContentWrapper>
        {children}
      </ContentWrapper>
      <Frame />
    </div>
  )
}

export default FrameEffect
