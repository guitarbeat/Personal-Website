# Technical Context: Personal Website

## Technology Stack

- **Frontend**:
  - HTML5
  - SASS/CSS3
  - Vanilla JavaScript
  - Modern CSS Features (Custom Properties, Container Queries)

- **Build Tools**:
  - Node.js
  - NPM for package management
  - SASS compiler

- **Version Control**:
  - Git
  - GitHub for hosting

## Development Environment

- **Code Editor**: Cursor IDE
- **Browser DevTools**: Chrome/Firefox for debugging
- **Terminal**: zsh shell
- **OS**: macOS 24.4.0

## Dependencies

- **SASS**: Latest version for CSS preprocessing
- **PostCSS**: For CSS post-processing and optimization
- **Autoprefixer**: For cross-browser compatibility
- **Node-SASS**: For SASS compilation
- **NPM Scripts**: For build and development tasks

## Technical Constraints

- Must support modern browsers (Chrome, Firefox, Safari, Edge)
- Must work without JavaScript for core functionality
- Must maintain WCAG 2.1 AA accessibility standards
- Must optimize for mobile devices
- Must follow progressive enhancement principles

## Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile SASS
npm run sass:compile

# Check SASS for errors
npm run sass:check
```

### Production

```bash
# Build for production
npm run build

# Deploy to production
npm run deploy
```

## SASS Architecture

The SASS architecture follows a modular, token-based approach that provides a single source of truth for all design values.

### Core Files

- **_tokens.scss**: The single source of truth for all design tokens in the system. Contains all color, typography, spacing, shadow, and other design values organized in maps.
- **_mixins.scss**: Reusable functions and patterns for consistent styling across components.
- **_functions.scss**: Utility functions for manipulating values and performing calculations.
- **_breakpoints.scss**: Responsive design utilities and mixins for consistent media queries.
- **_css-variables.scss**: Generates CSS custom properties from the token system for runtime theme switching.
- **_base.scss**: Global base styles and default element styling.
- **_typography.scss**: Typography-specific styles and utilities.

### Design Token System

The design token system is implemented through SASS maps in `_tokens.scss`, which provides a comprehensive set of functions for accessing token values:

```scss
// Example of token usage
.element {
  color: tokens.theme-color('sage');
  padding: tokens.spacing('md');
  font-size: tokens.font-size('lg');
  box-shadow: tokens.shadow('md');
  transition: all tokens.transition-duration('normal') tokens.transition-timing('ease');
}
```

### Accessing Tokens

All design values should be accessed through token functions rather than direct variable references:

| Category | Function | Example |
|----------|----------|---------|
| Colors | `tokens.theme-color($name, $variant: 'base')` | `tokens.theme-color('sage', 'light')` |
| Spacing | `tokens.spacing($size)` | `tokens.spacing('md')` |
| Typography | `tokens.font-size($size)` | `tokens.font-size('lg')` |
| Shadows | `tokens.shadow($size)` | `tokens.shadow('md')` |
| Scales | `tokens.scale($size)` | `tokens.scale('sm')` |
| Breakpoints | `tokens.breakpoint($size)` | `tokens.breakpoint('medium')` |
| Transitions | `tokens.transition-duration($speed)` | `tokens.transition-duration('normal')` |

### Responsive Design

The system provides responsive mixins through `_breakpoints.scss`:

```scss
.element {
  // Base styles
  
  @include mix.respond('medium') {
    // Medium screen styles
  }
  
  @include mix.respond('large') {
    // Large screen styles
  }
}
```

### Component Structure

Each component has its own SCSS file that follows a consistent pattern:

```scss
// Import main SASS architecture
@use "../../../../sass/tokens" as tokens;
@use "../../../../sass/mixins" as mix;
@use "../../../../sass/functions" as fn;
@use "../../../../sass/breakpoints" as bp;

// Component styles
.component {
  // Styles using tokens
}
```

### Theme System

The theme system uses CSS custom properties generated from tokens for runtime switching between dark and light modes. These are defined in `_css-variables.scss` and applied in `_base.scss`.

```scss
:root {
  --color-text: var(--color-gray-100);
  --color-bg: var(--color-gray-900);
  --color-primary: var(--color-sage-base);
  // More variables...
}

@media (prefers-color-scheme: light) {
  :root {
    --color-text: var(--color-gray-900);
    --color-bg: var(--color-gray-100);
    --color-primary: var(--color-sage-dark);
    // More variables...
  }
}
```

### Best Practices

1. **Token-First**: Always use tokens for design values rather than hardcoded values.
2. **Component Encapsulation**: Keep component styles modular and encapsulated.
3. **Responsive Design**: Use the responsive mixins for consistent breakpoints.
4. **Theme Awareness**: Design with both light and dark themes in mind.
5. **Import Order**: Maintain consistent import order in SCSS files.

## Performance Considerations

- Optimize images and assets
- Minimize CSS and JavaScript
- Use appropriate caching strategies
- Implement lazy loading where appropriate
- Monitor bundle sizes
- Use CSS containment for performance
- Implement will-change hints judiciously

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Accessibility

- ARIA labels where necessary
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Reduced motion support
- Focus management
- Semantic HTML

## File References

- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `webpack.config.js`: Webpack configuration
- `src/sass/_tokens.scss`: Design tokens
- `src/sass/_mixins.scss`: Reusable mixins
- `src/sass/_breakpoints.scss`: Breakpoint definitions
- `src/sass/_css-variables.scss`: CSS variables

## SASS Module Usage

The project uses SASS modules to provide advanced functionality in styling. We've established the following guidelines for SASS module imports:

### Required Module Imports

All SCSS files should include the necessary SASS module imports at the top of the file, before any other imports or CSS rules:

```scss
@use "sass:map";     // For map functions (map.get, map.merge, etc.)
@use "sass:math";    // For mathematical operations
@use "sass:color";   // For color manipulation functions
@use "sass:list";    // For list operations (when needed)
@use "sass:string";  // For string manipulation (when needed)
```

### Common Issues and Solutions

1. **Missing Module Imports**: Files using functions like `map.get()` will fail to compile if they don't import the corresponding module.
   - Solution: Always include `@use "sass:map";` before using map functions

2. **Inconsistent Access Patterns**: Some files might use different methods to access the same functionality.
   - Solution: Standardize on the module approach (e.g., `map.get()` instead of deprecated `map-get()`)

3. **Module Conflicts**: When multiple files import the same module without namespaces, conflicts can occur.
   - Solution: Use consistent namespacing for module imports

### Migration Path

As part of our SASS architecture simplification:

1. All component files should be updated to include necessary module imports
2. Legacy function calls should be updated to use module syntax
3. Files using map-based token systems must include the `sass:map` module

### Example: Proper Module Usage

```scss
// Module imports
@use "sass:map";
@use "sass:math";
@use "sass:color";

// Project imports
@use "../../../../sass/tokens" as tokens;
@use "../../../../sass/mixins" as mix;

// Component styles
.component {
  // Using map module
  padding: map.get(tokens.$spacing, 'md');
  
  // Using math module
  width: math.div(100%, 3);
  
  // Using color module
  color: color.adjust(tokens.$primary-color, $lightness: 10%);
}
```

This approach ensures consistency and prevents compilation errors across the codebase.
