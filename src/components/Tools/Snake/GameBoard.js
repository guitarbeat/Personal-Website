import React, { useEffect, useRef, memo } from "react";

const GameBoard = memo(({ 
  onCanvasReady, 
  width, 
  height, 
  className 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Notify parent component that canvas is ready
      onCanvasReady(canvas, ctx);
    }
  }, [width, height, onCanvasReady]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ 
        width: `${width}px`, 
        height: `${height}px` 
      }}
    />
  );
});

GameBoard.displayName = 'GameBoard';

export default GameBoard; 