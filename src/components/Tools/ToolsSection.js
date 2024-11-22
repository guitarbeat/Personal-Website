// Third-party imports
import React, { useState } from 'react';

// Context imports
import { useAuth } from '../../context/AuthContext';

// Styles
import './ToolsSection.scss';

const ToolCard = ({ title, description, link, icon, tags = [], features = [] }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    if (!isClicked) {
      e.preventDefault();
      setIsClicked(true);
      setTimeout(() => window.location.href = link, 500);
    }
  };

  return (
    <div className={`tool-card ${isClicked ? 'clicked' : ''}`} onClick={handleClick}>
      <div className="tool-card__keywords">
        {tags.map((tag, index) => (
          <span key={index} className="tool-card__label" style={{ backgroundColor: tag.color }}>
            {tag.name}
          </span>
        ))}
      </div>
      <div className="tool-card__content">
        <i className={`tool-card__icon ${icon}`}></i>
        <h3>{title}</h3>
        <p className={isClicked ? 'show-text' : ''}>{description}</p>
        <ul className="tool-card__features">
          {features.map((feature, index) => (
            <li key={index}>
              <i className={feature.icon}></i>
              {feature.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ToolsSection = () => {
  const { isUnlocked } = useAuth();

  if (!isUnlocked) return null;

  const tools = [
    {
      title: 'Bingo Generator',
      description: 'Create custom bingo cards for any occasion. Perfect for events, classrooms, or fun gatherings!',
      link: '/bingo',
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
      title: 'Needs Assessment',
      description: 'Track and analyze personal needs and goals with this comprehensive assessment tool.',
      link: '/needs',
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

  return (
    <section id="tools" className="tools">
      <div className="container__content">
        <h2 className="section__title">
          <i className="fas fa-lock-open"></i> Secret Tools
        </h2>
        <div className="tools__cards_container">
          {tools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
