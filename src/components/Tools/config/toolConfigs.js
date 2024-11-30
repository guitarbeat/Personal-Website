// Common configuration structure for all tools
export const needsConfig = {
  name: 'Needs Assessment',
  levels: [
    {
      level: 'Survival',
      description: "Basic physiological needs essential for survival: food, water, sleep, shelter, breathing, and physical well-being. These form the foundation of all human needs.",
      color: 'var(--color-coral)',
      baseWidth: 100
    },
    // ... other levels moved from needs/config.js
  ],
  examples: {
    Survival: [
      "Regular nutritious meals",
      "Adequate sleep (7-9 hours)",
      "Safe housing",
      "Clean water access",
      "Physical health maintenance"
    ],
    // ... other examples moved from needs/config.js
  }
};

export const bingoConfig = {
  // Configuration for bingo tool
  // ... similar structure
};

// Common UI components configuration
export const commonComponents = {
  dialog: {
    width: '500px',
    maxHeight: '80vh',
    padding: '20px',
  },
  transitions: {
    duration: 300,
    easing: 'ease-in-out',
  }
};
