import React, { useEffect, useRef } from 'react';
import './matrix.scss';

const Matrix = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    
    // Array to store current y position of each column
    const drops = Array(Math.floor(columns)).fill(1);
    
    // Setting the color
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const draw = () => {
      // Add semi-transparent black rectangle on top of previous frame
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.fillStyle = '#0F0';
      context.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        // Generate random character
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        // Calculate x position
        const x = i * fontSize;
        // Calculate y position
        const y = drops[i] * fontSize;
        
        // Add white color for first character in column
        if (drops[i] * fontSize < fontSize) {
          context.fillStyle = '#FFF';
        } else {
          context.fillStyle = '#0F0';
        }
        
        // Draw the character
        context.fillText(text, x, y);
        
        // Move drop to top if it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Increment y coordinate
        drops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, 33); // ~30fps

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="matrix-canvas"
    />
  );
};

export default Matrix;
