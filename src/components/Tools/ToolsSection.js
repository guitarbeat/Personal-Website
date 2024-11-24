// Third-party imports
import React, { useState, lazy, Suspense } from 'react';

// Context imports
import { useAuth } from '../../context/AuthContext';

// Styles
import './ToolsSection.scss';

// Lazy load tool components
const Bingo = lazy(() => import('./bingo/bingo.js'));
const Needs = lazy(() => import('./needs/needs.js'));

const ToolSelector = ({ tools, selectedTool, onSelect }) => {
  return (
    <div className="tool-selector">
      <div className="tool-selector__header">
        <h3>Select a Tool</h3>
        <div className="tool-selector__tools">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-selector__button ${selectedTool === tool.id ? 'selected' : ''}`}
              onClick={() => onSelect(tool.id)}
            >
              <i className={tool.icon}></i>
              <span>{tool.title}</span>
              {tool.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="tool-selector__tag"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </button>
          ))}
        </div>
      </div>
      {selectedTool && (
        <div className="tool-selector__info">
          {tools.find(t => t.id === selectedTool)?.description}
        </div>
      )}
    </div>
  );
};

const ToolsSection = () => {
  const { isUnlocked } = useAuth();
  const [selectedTool, setSelectedTool] = useState(null);

  if (!isUnlocked) return null;

  const tools = [
    {
      id: 'bingo',
      title: 'Bingo Generator',
      description: 'Create custom bingo cards for any occasion. Perfect for events, classrooms, or fun gatherings!',
      component: Bingo,
      icon: 'fas fa-dice',
      tags: [
        { name: 'Interactive', color: '#386FA4' },
        { name: 'Generator', color: '#67a286' }
      ],
      features: [
        { icon: 'fas fa-palette', text: 'Customizable themes' },
        { icon: 'fas fa-print', text: 'Print-ready cards' },
        { icon: 'fas fa-random', text: 'Random generation' },
        { icon: 'fas fa-save', text: 'Save templates' }
      ]
    },
    {
      id: 'needs',
      title: 'Needs Assessment',
      description: 'Track and analyze personal needs and goals with this comprehensive assessment tool.',
      component: Needs,
      icon: 'fas fa-chart-radar',
      tags: [
        { name: 'Analytics', color: '#DE7254' },
        { name: 'Personal', color: '#A267AC' }
      ],
      features: [
        { icon: 'fas fa-chart-line', text: 'Progress tracking' },
        { icon: 'fas fa-tasks', text: 'Goal setting' },
        { icon: 'fas fa-chart-pie', text: 'Data visualization' },
        { icon: 'fas fa-calendar-check', text: 'Regular check-ins' }
      ]
    }
  ];

  const handleToolSelect = (toolId) => {
    setSelectedTool(selectedTool === toolId ? null : toolId);
  };

  const selectedToolData = tools.find(tool => tool.id === selectedTool);

  return (
    <section id="tools" className="tools">
      <div className="container__content">
        <h2 className="section__title">
          <i className="fas fa-lock-open"></i> Secret Tools
        </h2>
        <div className="tools__layout">
          <ToolSelector 
            tools={tools}
            selectedTool={selectedTool}
            onSelect={handleToolSelect}
          />
          {selectedToolData && (
            <div className="tools__content">
              <Suspense fallback={
                <div className="tools__loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Loading {selectedToolData.title}...</span>
                </div>
              }>
                <selectedToolData.component />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
