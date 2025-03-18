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

The project uses a modular SASS architecture with a design token system as the foundation.

### Core Files

- `_tokens.scss`: Single source of truth for all design tokens (colors, spacing, typography, etc.)
- `_breakpoints.scss`: Forwarding module for breakpoint variables from tokens
- `_variables.scss`: Legacy variables (being phased out in favor of tokens)
- `_shadows.scss`: Functions and mixins for shadow application
- `_css-variables.scss`: Generates CSS custom properties from tokens
- `_typography.scss`: Typography styles and mixins
- `_mixins.scss`: General utility mixins
- `_base.scss`: Base styles and resets
- `main.scss`: Main entry point that imports all modules

### Design Token System

The design token system is based on a hierarchical approach:

1. **Design Tokens (`_tokens.scss`)**:
   - Raw values organized in maps
   - Core design properties (colors, spacing, typography, etc.)
   - Single source of truth for all variable values

2. **Component Tokens**:
   - Higher-level abstractions built on design tokens
   - Component-specific variables (e.g., card-padding, button-height)
   - Derived from design tokens to ensure consistency

3. **CSS Custom Properties**:
   - Generated from tokens for use in the browser
   - Enables theme switching without CSS recompilation
   - Provides fallbacks for browser compatibility

### SASS Variable Naming Conventions

- **Design Tokens**: Clear, semantic names in kebab-case
  - `$color-primary`, `$spacing-lg`, `$font-size-md`
  
- **Maps**: Descriptive names with nested structure
  - `$theme-colors`, `$breakpoints`, `$spacing`

- **Component Variables**: Component prefix with property
  - `$card-padding`, `$button-height`, `$nav-height`

### Variable Access Patterns

The project provides several methods to access design tokens:

1. **Direct Variable Access**:
   - For simple variables: `$bp-large`, `$z-index-modal`
   - Being phased out in favor of functional access

2. **Functional Access**:
   - For variables in maps: `spacing('lg')`, `theme-color('primary')`
   - Preferred method for new code
   - Provides error handling and defaults

3. **CSS Custom Properties**:
   - For client-side theme switching: `var(--color-primary)`
   - Generated from tokens at build time

### Process for Adding New Variables

1. Add the variable to `_tokens.scss` in the appropriate section
2. If needed, create an access function in `_tokens.scss`
3. Add the variable to `_css-variables.scss` if it needs a CSS custom property
4. Document the variable with clear comments

### Best Practices

1. **Single Source of Truth**: Define variables only in `_tokens.scss`
2. **Functional Access**: Use functions to access variables in maps
3. **Proper Namespacing**: Use namespaced imports (e.g., `@use "tokens" as tokens;`)
4. **Forward Don't Duplicate**: Use `@use` and `@forward` instead of redefining variables
5. **Group Related Variables**: Use maps to group related variables
6. **Document Purpose**: Add clear comments explaining variable purpose
7. **Consistent Naming**: Follow established naming conventions

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
