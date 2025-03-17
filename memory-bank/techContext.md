# Technical Context: Personal Website

## Technology Stack
- **Frontend**: React, JavaScript, SASS/SCSS
- **Build Tools**: Webpack, Babel, PostCSS
- **State Management**: React Context, useState/useReducer hooks
- **Storage**: LocalStorage for persistence
- **Animation**: CSS animations, keyframes
- **Styling**: SASS with 7-1 architecture pattern (adapted)
- **Deployment**: Netlify

## Development Environment
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **Editor**: VSCode with ESLint, Prettier, and SASS extensions
- **Browser DevTools**: Chrome/Firefox for debugging
- **Git**: For version control

## Dependencies
- **react**: ^18.2.0 - Core React library
- **react-dom**: ^18.2.0 - React DOM rendering
- **react-router-dom**: ^6.4.0 - Routing
- **sass**: ^1.62.0 - SASS preprocessing
- **sass-loader**: ^13.2.2 - Webpack loader for SASS
- **css-loader**: ^6.7.3 - Webpack loader for CSS
- **style-loader**: ^3.3.2 - Webpack loader for styles
- **webpack**: ^5.80.0 - Module bundler
- **babel**: ^7.21.4 - JavaScript compiler

## Technical Constraints
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized for mobile devices
- **No Backend**: Client-side only with localStorage for persistence

## Build & Deployment
The project uses Webpack for bundling and Netlify for deployment. The build process includes:
1. SASS compilation with PostCSS processing
2. JavaScript transpilation with Babel
3. Asset optimization
4. Bundle generation
5. Deployment to Netlify

## SASS Architecture

### Overview
The project uses a modified 7-1 SASS architecture pattern, which organizes styles into logical categories:

1. **Abstracts**: Variables, functions, mixins
2. **Base**: Reset, typography, base styles
3. **Components**: Buttons, forms, cards
4. **Layout**: Header, footer, grid
5. **Pages**: Page-specific styles
6. **Themes**: Theme-related styles
7. **Vendors**: Third-party styles

### Key Files and Directories

#### Core SASS Files
- `src/sass/main.scss`: Main entry point that imports all other SASS files
- `src/sass/_breakpoints.scss`: Breakpoint definitions and mixins
- `src/sass/_mixins.scss`: Reusable mixins
- `src/sass/_variables.scss`: Global variables
- `src/sass/_functions.scss`: SASS functions
- `src/sass/_base.scss`: Base styles and global CSS variables
- `src/sass/theme/_theme-switch.scss`: Theme switching functionality

#### Component-Specific Styles
- `src/components/*/styles.scss`: Component-specific styles
- `src/components/Tools/shared/styles/index.scss`: Shared styles for tools
- `src/components/Tools/styles/index.scss`: Main styles for tools section

### SASS Features and Patterns

#### Modern SASS Syntax
The project uses modern SASS features:
- `@use` instead of `@import` for better namespacing
- Module system with proper namespacing
- SASS maps for organized data structures
- Advanced mixins with content blocks

#### Responsive Design
- Breakpoint mixins for consistent media queries
- Mobile-first approach
- Fluid typography and spacing

#### Theme System
- CSS custom properties for theme values
- Theme switching without page reload
- Dark/light/cosmic theme options

#### Animation System
- Keyframes in dedicated files
- Animation mixins for consistent timing
- Reduced motion support

### Recent Improvements

#### Fixed SASS Deprecation Warnings
- Wrapped declarations after nested rules in `& {}` blocks
- Removed `&` selectors from keyframes
- Ensured proper nesting in media queries
- Added proper namespacing to SASS imports

#### Improved Integration
- Added mobile breakpoint (480px) to breakpoints map
- Standardized breakpoint usage
- Integrated Tools styles with main SASS architecture
- Replaced hardcoded values with global variables

#### Enhanced Maintainability
- Improved component scoping
- Added comments for complex sections
- Organized styles more logically
- Moved keyframes to dedicated files

## JavaScript Architecture

### Component Structure
- Functional components with hooks
- Props interface definitions
- Container/presentation pattern
- Higher-order components for shared functionality

### State Management
- React Context for global state
- useState/useReducer for component state
- Custom hooks for reusable logic
- LocalStorage for persistence

### Performance Optimizations
- React.memo for preventing unnecessary re-renders
- useCallback for memoizing functions
- useMemo for memoizing values
- Code splitting for lazy loading

## Accessibility Considerations
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus management
- Color contrast
- Reduced motion support

## File References
- `src/sass/main.scss`: Main SASS entry point
- `src/sass/_breakpoints.scss`: Breakpoint definitions
- `src/sass/_mixins.scss`: Reusable mixins
- `src/sass/_base.scss`: Base styles
- `src/sass/theme/_theme-switch.scss`: Theme switching
- `src/components/Tools/shared/styles/index.scss`: Shared tool styles
- `src/components/Tools/styles/index.scss`: Tools section styles
- `src/components/content/Header/text.scss`: Header typography
