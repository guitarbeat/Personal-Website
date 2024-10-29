import React from 'react';
import { Link } from 'react-router-dom';
import './tools.scss';

const Tools = () => {
  return (
    <div className="tools-container">
      <h1>Secret Tools</h1>
      <div className="tools-grid">
        <Link to="/bingo" className="tool-card">
          <h2>Bingo</h2>
          <p>Custom bingo game generator</p>
        </Link>
        <Link to="/needs" className="tool-card">
          <h2>Needs</h2>
          <p>Needs assessment tool</p>
        </Link>
      </div>
    </div>
  );
};

export default Tools; 