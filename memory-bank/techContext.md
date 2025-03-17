# Technical Context: Personal Website

## Technology Stack
- **Frontend**: React, TypeScript, SASS, Styled Components
- **Build Tools**: Webpack, Babel
- **Deployment**: Netlify
- **Version Control**: Git, GitHub
- **Design**: Figma

## SASS Architecture
The project uses a modular SASS architecture with a focus on maintainability, reusability, and performance. The architecture is organized into several key files:

### Core Files
- `_tokens.scss`: Design tokens and functions
- `_variables.scss`: Legacy variables (being phased out)
- `_mixins.scss`: Reusable style patterns
- `_functions.scss`: Utility functions
- `_breakpoints.scss`: Responsive design utilities
- `_base.scss`: Global styles and resets
- `_css-variables.scss`: CSS custom properties

### Import Structure
```scss
// Component SCSS file
@use "../../../../sass/variables" as vars;
@use "../../../../sass/mixins" as mix;
@use "../../../../sass/functions" as fn;
@use "../../../../sass/breakpoints" as bp;
@use "../../../../sass/tokens" as tokens;

// Component-specific styles
.component {
  padding: tokens.spacing('md');
  color: var(--color-text, tokens.gray('gray-800'));
}
```

## Current SASS Practices

### Module System
The project uses the modern SASS module system with `@use` instead of the deprecated `@import`. This provides better encapsulation and prevents global namespace pollution.

```scss
// Good
@use "sass:map";
@use "../tokens" as tokens;

// Avoid
@import "tokens";
```

### Namespacing
All imports are properly namespaced to avoid conflicts and improve code readability.

```scss
// Good
@use "../../../../sass/mixins" as mix;
.element {
  @include mix.respond('tablet') { ... }
}

// Avoid
@use "../../../../sass/mixins";
.element {
  @include respond('tablet') { ... }
}
```

### Function Usage
Functions are used to access design tokens, ensuring consistency and maintainability.

```scss
// Good
color: tokens.theme-color('sage');

// Avoid
color: #7a9e7e;
```

### CSS Variables
CSS variables are used for theme switching and dynamic values, with SASS tokens as fallbacks.

```scss
// Good
color: var(--color-text, tokens.gray('gray-800'));

// Avoid
color: var(--color-text);
```

## Phase 2 Technical Requirements

### Enhanced Spacing System
The enhanced spacing system will require:
- Updates to the `_tokens.scss` file to include the new spacing scale
- New functions for accessing component-specific spacing
- Mixins for applying spacing patterns
- Documentation for the new spacing system

### Typography System
The typography system will require:
- Updates to the `_tokens.scss` file to include the type scale and roles
- New mixins for applying typography styles
- Functions for accessing typography tokens
- Responsive typography utilities
- Documentation for the typography system

### Shadow System
The shadow system will require:
- Updates to the `_tokens.scss` file to include elevation levels and shadows
- New mixins for applying shadows based on elevation
- Functions for accessing shadow tokens
- Documentation for the shadow system

### Responsive Design System
The responsive design system will require:
- Updates to the `_breakpoints.scss` file to include container queries
- New mixins for common responsive patterns
- Documentation for the responsive design system

### Animation System
The animation system will require:
- Updates to the `_tokens.scss` file to include animation patterns
- New mixins for applying animations
- Utilities for handling reduced motion preferences
- Documentation for the animation system

## Development Environment

### Required Tools
- Node.js (v14+)
- npm (v6+)
- Visual Studio Code (recommended)

### VS Code Extensions
- SASS
- ESLint
- Prettier
- stylelint

### Setup Instructions
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Run `npm run build` to build for production

## Build & Deployment
The project is built using Webpack and deployed to Netlify. The build process includes:
1. Compiling TypeScript to JavaScript
2. Compiling SASS to CSS
3. Optimizing assets
4. Generating a production build

## Technical Constraints
- **Browser Support**: The project supports modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance**: The project aims for a Lighthouse score of 90+ in all categories
- **Accessibility**: The project aims for WCAG 2.1 AA compliance
- **Responsive Design**: The project must work on all screen sizes from 320px to 1920px

## Dependencies
- **react**: ^17.0.2 - UI library
- **react-dom**: ^17.0.2 - DOM rendering for React
- **react-router-dom**: ^6.2.1 - Routing
- **styled-components**: ^5.3.3 - CSS-in-JS styling
- **sass**: ^1.49.7 - SASS preprocessor
- **typescript**: ^4.5.5 - Type checking
- **@types/react**: ^17.0.39 - React type definitions
- **@types/react-dom**: ^17.0.11 - React DOM type definitions
- **@types/styled-components**: ^5.1.22 - Styled Components type definitions

## File References
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `webpack.config.js`: Webpack configuration
- `src/sass/_tokens.scss`: Design tokens
- `src/sass/_mixins.scss`: Reusable mixins
- `src/sass/_breakpoints.scss`: Breakpoint definitions
- `src/sass/_css-variables.scss`: CSS variables
