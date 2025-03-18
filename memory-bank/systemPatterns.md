# System Patterns: Personal Website

## Architecture Overview

The website follows a component-based architecture using modern SASS/CSS patterns and vanilla JavaScript. The system is built around a robust design system that emphasizes consistency, reusability, and maintainability.

## Key Components

### Design System

- **Theme System**: Manages color schemes, transitions, and visual consistency
  - Dark/light theme support
  - CSS Custom Properties for dynamic theming
  - Smooth transition management
  - Glass-morphism effects

- **Layout System**: Handles responsive layouts and spacing
  - Flexbox and Grid layouts
  - Responsive breakpoints
  - Container queries
  - Spacing scale

- **Typography System**: Manages text styles and hierarchy
  - Font scale
  - Responsive typography
  - Vertical rhythm
  - Text animations

### Component Architecture

- **Header Component**: Site navigation and theme switching
- **Work Timeline**: Interactive experience display
- **Project Cards**: Portfolio showcase
- **Tools Section**: Interactive feature demonstrations
- **Shared Styles**: Common styling patterns and utilities

## Design Patterns

### SASS Architecture

- **7-1 Pattern Modified**: Organized SASS files by function
  - Base styles
  - Components
  - Layout
  - Mixins
  - Variables
  - Functions
  - Tokens

### Mixins and Functions

- **Responsive Mixins**: Handle breakpoints and media queries
- **Glass Effect**: Manages backdrop-filter and fallbacks
- **Theme Transitions**: Controls smooth theme changes
- **Layout Utilities**: Common layout patterns
- **Animation Mixins**: Standardized animation patterns

### CSS Patterns

- **Custom Properties**: Dynamic theming and responsive values
- **Logical Properties**: Direction-agnostic layouts
- **Container Queries**: Component-level responsiveness
- **Grid Systems**: Flexible layout management
- **Animation System**: Consistent motion design

## Data Flow

1. **Theme Management**:
   - Theme selection → CSS Custom Properties → Component styles
   - System preferences → Theme detection → Style application

2. **Responsive Flow**:
   - Viewport size → Breakpoint detection → Layout adjustment
   - Container size → Component queries → Local styling

3. **Animation Flow**:
   - User interaction → State change → Animation trigger
   - Theme change → Transition system → Style update

## Technical Decisions

### CSS Architecture

- **Decision**: Use CSS Custom Properties for theming
- **Rationale**: Enables dynamic theme switching without JavaScript
- **Impact**: Improved performance and maintainability

### Responsive Design

- **Decision**: Mobile-first approach with breakpoint mixins
- **Rationale**: Ensures consistent responsive behavior
- **Impact**: Better maintainability and scalability

### Animation System

- **Decision**: CSS-based animations with minimal JavaScript
- **Rationale**: Better performance and browser support
- **Impact**: Smooth transitions with fallbacks

### Glass Morphism

- **Decision**: Implement with backdrop-filter and fallbacks
- **Rationale**: Modern aesthetic with broad compatibility
- **Impact**: Consistent visual effects across browsers

## File References

- `src/sass/_tokens.scss`: Main token definitions
- `src/sass/_mixins.scss`: Reusable style patterns
- `src/sass/_functions.scss`: Utility functions
- `src/sass/_breakpoints.scss`: Responsive design utilities
- `src/sass/_base.scss`: Global styles and resets
- `src/sass/_css-variables.scss`: CSS custom properties
