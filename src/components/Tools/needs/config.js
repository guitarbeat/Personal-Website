export const LEVELS = [
  {
    level: 'Survival',
    description: "Basic physiological needs essential for survival: food, water, sleep, shelter, breathing, and physical well-being. These form the foundation of all human needs.",
    color: 'var(--color-secondary)',
    baseWidth: 100
  },
  {
    level: 'Security',
    description: "Safety needs including personal security, financial security, health security, and emotional stability. This level ensures protection from harm and provides stability in life.",
    color: 'var(--color-secondary-light)',
    baseWidth: 85
  },
  {
    level: 'Connection',
    description: "Social needs and belongingness: meaningful relationships, love, friendship, family bonds, and community involvement. This level addresses our need for social connection and acceptance.",
    color: 'var(--color-terceary)',
    baseWidth: 70
  },
  {
    level: 'Esteem',
    description: "Self-esteem, confidence, achievement, respect from others, and recognition. This level builds personal worth and social recognition through accomplishments.",
    color: 'var(--color-primary)',
    baseWidth: 55
  },
  {
    level: 'Growth',
    description: "Personal growth through learning, skill development, and new experiences. This level focuses on continuous improvement and expanding capabilities.",
    color: 'var(--color-primary-light)',
    baseWidth: 40
  },
  {
    level: 'Self Actualization',
    description: "Reaching one's full potential, self-fulfillment, and pursuing inner talent. This highest level represents the full realization of personal capabilities and living with purpose.",
    color: 'var(--color-primary-dark)',
    baseWidth: 30
  }
];

// Add examples for each level
export const LEVEL_EXAMPLES = {
  Survival: [
    "Regular nutritious meals",
    "Adequate sleep (7-9 hours)",
    "Safe housing",
    "Clean water access",
    "Physical health maintenance"
  ],
  Security: [
    "Stable income",
    "Health insurance",
    "Emergency savings",
    "Safe neighborhood",
    "Job security"
  ],
  Connection: [
    "Close friendships",
    "Family relationships",
    "Community involvement",
    "Intimate relationships",
    "Social support network"
  ],
  Esteem: [
    "Professional achievements",
    "Personal goals met",
    "Recognition at work",
    "Self-confidence building",
    "Skills mastery"
  ],
  Growth: [
    "Learning new skills",
    "Taking on challenges",
    "Personal development",
    "Creative pursuits",
    "Knowledge expansion"
  ],
  "Self Actualization": [
    "Living authentically",
    "Pursuing passion projects",
    "Contributing to society",
    "Achieving full potential",
    "Finding life purpose"
  ]
};

// Add level dependencies
export const LEVEL_DEPENDENCIES = {
  Survival: "Foundation level - no prerequisites",
  Security: "Requires basic survival needs to be met (15%+)",
  Connection: "Requires feeling secure and safe (30%+)",
  Esteem: "Requires social connections and belonging (45%+)",
  Growth: "Requires self-esteem and confidence (60%+)",
  "Self Actualization": "Requires personal growth and development (75%+)"
}; 