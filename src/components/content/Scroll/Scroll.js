import React from "react";
import "./scroll.scss";

const Scroll = () => {
  // Generate multiple sections to demonstrate infinite scroll
  const generateScrollSections = () => {
    const sections = [];
    const features = [
      { icon: "🎨", title: "Visual Effects", description: "Beautiful blur and motion effects" },
      { icon: "⚡", title: "Smooth Animation", description: "Seamless infinite scroll experience" },
      { icon: "🎯", title: "Interactive", description: "Responsive to user input and movement" },
      { icon: "🌟", title: "Modern Design", description: "Glass-morphism and contemporary styling" },
      { icon: "📱", title: "Responsive", description: "Works perfectly on all devices" },
      { icon: "🎪", title: "Immersive", description: "Engaging user experience" },
      { icon: "🚀", title: "Performance", description: "Optimized for smooth scrolling" },
      { icon: "✨", title: "Elegant", description: "Polished and refined interactions" }
    ];

    for (let i = 0; i < 3; i++) {
      sections.push(
        <div key={`scroll-section-${i}`} className="scroll-section">
          <div className="scroll-header">
            <h1>Scroll Experience</h1>
            <p className="scroll-subtitle">Infinite scroll with blur effects</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={`${i}-${index}`} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <div className="feature-info">
                  <h3>{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="scroll-features">
            <div className="feature">
              <h3>🚀 Infinite Loop</h3>
              <p>Seamless continuous scrolling experience</p>
            </div>
            <div className="feature">
              <h3>💎 Motion Blur</h3>
              <p>Dynamic blur effects based on scroll speed</p>
            </div>
            <div className="feature">
              <h3>🔄 Smooth Transitions</h3>
              <p>Fluid animations and state changes</p>
            </div>
          </div>
          
          <div className="scroll-cta">
            <h2>Experience the Scroll Effect</h2>
            <p>Scroll through this infinite content with beautiful blur effects and smooth transitions.</p>
            <button className="cta-button">Keep Scrolling</button>
          </div>
        </div>
      );
    }
    
    return sections;
  };

  return (
    <div className="scroll-container">
      {generateScrollSections()}
    </div>
  );
};

export default Scroll;