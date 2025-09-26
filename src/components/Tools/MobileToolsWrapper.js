import React, { memo } from 'react';
import { useAuth } from '../effects/Matrix/AuthContext';
import { useMobileDetection } from '../../hooks/useMobileDetection';
import './MobileToolsWrapper.scss';

/**
 * Mobile-specific wrapper for tools section
 * Shows tools only if user has authenticated on mobile device
 * Otherwise shows a message prompting for Matrix authentication
 */
const MobileToolsWrapper = memo(({ children }) => {
  const { toolsAccessible, isMobile } = useAuth();
  const { isMobile: isMobileDevice } = useMobileDetection();

  // If not on mobile device, render children normally
  if (!isMobileDevice) {
    return children;
  }

  // If on mobile and tools are accessible, render children
  if (toolsAccessible) {
    return children;
  }

  // If on mobile but tools are not accessible, show message
  return (
    <section id="tools" className="section mobile-tools-hidden">
      <div className="section-title-container">
        <h2 className="section-title">Interactive Tools</h2>
        <div className="section-subtitle">
          Tools are hidden on mobile devices
        </div>
      </div>

      <div className="mobile-tools-message">
        <div className="mobile-tools-icon">
          <i className="fas fa-mobile-alt"></i>
        </div>

        <div className="mobile-tools-content">
          <h3 className="mobile-tools-title">
            Mobile Access Restricted
          </h3>

          <p className="mobile-tools-description">
            Interactive tools are hidden on mobile devices for optimal performance.
            To access tools, please authenticate through the Matrix interface.
          </p>

          <div className="mobile-tools-hint">
            <i className="fas fa-key"></i>
            <span>Enter the correct password in the Matrix to unlock tools</span>
          </div>

          <div className="mobile-tools-note">
            <i className="fas fa-info-circle"></i>
            <span>Desktop users can access tools without authentication</span>
          </div>
        </div>
      </div>
    </section>
  );
});

MobileToolsWrapper.displayName = 'MobileToolsWrapper';

export default MobileToolsWrapper;