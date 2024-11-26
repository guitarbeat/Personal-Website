// Third-party imports
import React, { useState, lazy, Suspense } from 'react';

// Context imports
import { useAuth } from '../../context/AuthContext';

// Styles
import './ToolsSection.scss';

// Lazy load tool components
const Bingo = lazy(() => import('./bingo/bingo.js'));
const Needs = lazy(() => import('./needs/needs.js'));
const Snake = lazy(() => import('./snake/index.js'));

const ToolsSection = () => {
  const { isUnlocked } = useAuth();
  const [selectedTool, setSelectedTool] = useState('bingo');

  if (!isUnlocked) return null;

  const tools = [
    {
      id: 'bingo',
      title: 'Bingo',
      icon: 'fas fa-dice',
      component: Bingo
    },
    {
      id: 'needs',
      title: 'Needs',
      icon: 'fas fa-chart-radar',
      component: Needs
    },
    {
      id: 'snake',
      title: 'Snake',
      icon: 'fas fa-gamepad',
      component: Snake
    }
  ];

  const selectedToolData = tools.find(tool => tool.id === selectedTool);
  const selectorPosition = (() => {
    const positions = {
      bingo: '0',
      needs: '33.333333',
      snake: '66.666667'
    };
    return `${positions[selectedTool]}%`;
  })();

  return (
    <section id="tools" className="tools">
      <div className="container__content">
        <h1>Interactive Tools</h1>
        
        <div className="tools__tabs">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={selectedTool === tool.id ? 'active' : ''}
              onClick={() => setSelectedTool(tool.id)}
            >
              <i className={tool.icon}></i>
              {tool.title}
            </button>
          ))}
          <span 
            className="selector" 
            style={{ left: selectorPosition }}
          />
        </div>

        <div className="tools__content">
          <Suspense fallback={
            <div className="tools__loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading...</span>
            </div>
          }>
            {selectedToolData && React.createElement(selectedToolData.component)}
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
