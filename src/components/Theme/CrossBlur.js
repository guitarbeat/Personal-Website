import React, { Suspense, lazy } from 'react';
import "./CrossBlur.css";

const CrossBlurComponent = lazy(() => import('./CrossBlurComponent'));

const CrossBlur = ({ isVisible }) => {
  return (
    <Suspense fallback={null}>
      <CrossBlurComponent isVisible={isVisible} />
    </Suspense>
  );
};

export default CrossBlur;