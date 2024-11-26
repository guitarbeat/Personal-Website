// Third-party imports
import React, { useEffect, useRef, useState } from 'react';

// Context imports
import { useAuth } from '../../context/AuthContext';

// Asset imports
import incorrectGif from './nu-uh-uh.webp';

// Styles
import './matrix.scss';

const Matrix = ({ isVisible, onSuccess }) => {
  const canvasRef = useRef(null);
  const [password, setPassword] = useState('');
  const { checkPassword, showIncorrectFeedback, showSuccessFeedback, dismissFeedback } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = checkPassword(password);
    if (success) {
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 2000); // Match the animation duration
    }
    setPassword('');
  };

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyPress = () => {
      if (showIncorrectFeedback) {
        dismissFeedback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible, showIncorrectFeedback, dismissFeedback]);

  useEffect(() => {
    if (!isVisible) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

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
    
    const drops = Array(Math.floor(columns)).fill(1);
    
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.fillStyle = '#0F0';
      context.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        if (drops[i] * fontSize < fontSize) {
          context.fillStyle = '#FFF';
        } else {
          context.fillStyle = '#0F0';
        }
        
        context.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };

    let animationFrameId;
    const animate = () => {
      draw();
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-canvas" />
      {showIncorrectFeedback && (
        <div className="feedback-container" onClick={dismissFeedback}>
          <img src={incorrectGif} alt="Incorrect password" className="incorrect-gif" />
          <div className="feedback-hint">Press any key to continue</div>
        </div>
      )}
      {showSuccessFeedback && (
        <div className="success-message">
          Access Granted
        </div>
      )}
      {!showSuccessFeedback && !showIncorrectFeedback && (
        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
          />
        </form>
      )}
    </div>
  );
};

export default Matrix;
