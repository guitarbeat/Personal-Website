import React from 'react';
import { useAuth } from '../effects/Matrix/AuthContext';
import { useMobileDetection } from '../../hooks/useMobileDetection';

/**
 * Test component to demonstrate mobile tools functionality
 * This component shows the current authentication and device state
 */
const MobileToolsTest = () => {
  const { isUnlocked, isMobileUnlocked, toolsAccessible, isMobile } = useAuth();
  const { isMobile: isMobileDevice, screenWidth, screenHeight } = useMobileDetection();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '200px'
    }}>
      <div><strong>Mobile Tools Test</strong></div>
      <div>Screen: {screenWidth}x{screenHeight}</div>
      <div>Is Mobile Device: {isMobileDevice ? 'Yes' : 'No'}</div>
      <div>Is Mobile (Auth): {isMobile ? 'Yes' : 'No'}</div>
      <div>Desktop Unlocked: {isUnlocked ? 'Yes' : 'No'}</div>
      <div>Mobile Unlocked: {isMobileUnlocked ? 'Yes' : 'No'}</div>
      <div>Tools Accessible: {toolsAccessible ? 'Yes' : 'No'}</div>
    </div>
  );
};

export default MobileToolsTest;