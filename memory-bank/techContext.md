# Technical Context: Personal Website Tools

## Technology Stack
- Frontend:
  - React 18.2.0
  - SASS 1.69.5
  - TypeScript 5.0.4
  - Next.js 13.4.19
  - Framer Motion 10.16.4
- State Management:
  - React Context API
  - localStorage for persistence
- Testing:
  - Jest 29.5.0
  - React Testing Library 14.0.0
- Build Tools:
  - Craco 7.1.0
  - Webpack 5.88.2
- Infrastructure:
  - Vercel (deployment)
  - GitHub Actions (CI/CD)

## Development Environment
- Node.js: v18.17.0
- npm: 9.6.7
- VSCode Extensions:
  - SASS
  - ESLint
  - Prettier
  - TypeScript
  - Jest Runner

## Dependencies
- @craco/craco: ^7.1.0 - Build configuration override
- sass: ^1.69.5 - SASS preprocessing
- framer-motion: ^10.16.4 - Animation library
- @types/react: ^18.2.0 - React type definitions
- @testing-library/react: ^14.0.0 - Testing utilities
- eslint: ^8.45.0 - Code linting
- prettier: ^2.8.8 - Code formatting

## Technical Constraints
- SASS Architecture:
  - Must use @use syntax for imports
  - @use statements must come before any CSS rules
  - Global variables and mixins must be used where available
  - Component styles must be properly scoped
  - Media queries must use mix.respond mixin
  - Transitions must specify exact properties
  - Must support reduced motion preferences

- Performance:
  - Code splitting for tools
  - Optimized transitions
  - Efficient state management
  - Minimal re-renders
  - Proper will-change usage

- Accessibility:
  - WCAG 2.1 AA compliance
  - Keyboard navigation
  - Screen reader support
  - Reduced motion support
  - Color contrast requirements

- Mobile:
  - Touch-friendly controls
  - Responsive layouts
  - Performance optimization
  - Gesture support

## Build & Deployment
### Development
```bash
npm install
npm start
```

### Production Build
```bash
npm run build
npm run start:prod
```

### Testing
```bash
npm test
npm run test:coverage
```

## SASS Architecture
### Global Structure
```scss
@use 'variables';
@use 'mixins';
@use 'functions';
@use 'breakpoints';

// Component styles
@use './components';
```

### Component Structure
```scss
@use '../../shared/styles/index.scss' as *;

// Component-specific variables
:root {
  --component-specific-var: value;
}

// Component styles
.component {
  @include mix.respond("tablet") {
    // Responsive styles
  }
}
```

### Breakpoint System
```scss
// Using mix.respond mixin
@include mix.respond("tablet") {
  // Tablet styles
}

@include mix.respond("mobile") {
  // Mobile styles
}
```

### Theme System
```scss
:root {
  // Light theme variables
  --primary-color: #value;
}

[data-theme="dark"] {
  // Dark theme variables
  --primary-color: #value;
}
```

### Animation System
```scss
// Transition properties
transition: 
  transform var(--transition-duration) var(--transition-timing),
  opacity var(--transition-duration) var(--transition-timing);

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

## Code Organization
### Component Structure
```
ComponentName/
├── index.ts
├── ComponentName.tsx
├── ComponentName.test.tsx
├── types.ts
└── styles/
    ├── index.scss
    └── component-name.scss
```

### Style Patterns
- BEM methodology for class names
- CSS variables for theme values
- SASS mixins for reusable patterns
- Scoped styles to components
- Media queries through mixins
- Specific property transitions
- Reduced motion support

## Technical Decisions
### SASS Integration
- Modern @use syntax for better encapsulation
- Global variables and mixins for consistency
- Component-scoped styles to prevent conflicts
- Breakpoint mixins for responsive design
- Specific property transitions for performance
- Reduced motion support for accessibility

### State Management
- React Context for global state
- localStorage for persistence
- Optimized re-renders
- Proper state initialization

### Performance
- Code splitting by tool
- Optimized transitions
- Efficient state updates
- Proper will-change usage
- Reduced motion support

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast
- Motion preferences

### Mobile Support
- Touch controls
- Responsive layouts
- Performance optimization
- Gesture support
