import React, { useEffect, useRef } from 'react';
import { initializeBodyScrollMotionBlur } from './bodyScroll';

const BlurSection = ({ children, className, style = {}, as: Component = 'div', ...props }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const cleanup = initializeBodyScrollMotionBlur(containerRef.current);
      return () => {
        cleanup?.();
      };
    }
  }, []);

  return (
    <Component 
      ref={containerRef} 
      className={className} 
      style={{
        position: 'relative', // Ensure proper stacking context
        ...style
      }} 
      {...props}
    >
      {children}
    </Component>
  );
};

export default BlurSection;
