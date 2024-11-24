// External imports
import React from 'react';

// Internal imports
import { commonComponents } from '../config/toolConfigs';

const CommonDialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="common-dialog-overlay" onClick={onClose}>
      <div 
        className="common-dialog"
        style={commonComponents.dialog}
        onClick={e => e.stopPropagation()}
      >
        <div className="common-dialog-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="common-dialog-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CommonDialog;
