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

The project uses a modular SASS architecture with a design token system at its core. This section documents the structure and relationships between SASS files.

### Core Files

- `_tokens.scss`: Single source of truth for all design tokens (colors, spacing, typography, etc.)
- `_variables.scss`: Legacy variables (being phased out in favor of tokens)
- `_breakpoints.scss`: Responsive utility library with breakpoint mixins
- `_css-variables.scss`: Generates CSS custom properties from tokens
- `_mixins.scss`: Reusable mixins for common patterns
- `_utilities.scss`: Utility classes for common styles
- `main.scss`: Main entry point that imports all other SASS files

### Removing _variables.scss

`_variables.scss` is being phased out in favor of using tokens directly. The current strategy is:

1. **Forwarding Module**: Transform `_variables.scss` into a forwarding module that:
   - Imports tokens directly
   - Provides clear warnings about removal
   - Maintains backward compatibility
   - Includes migration guidance in comments

2. **Gradual Migration**: Update files one by one to:
   - Import tokens directly (`@use "../sass/tokens" as tokens;`)
   - Replace variable references with token functions:
     - `vars.$shadow-light` → `tokens.shadow('sm')`
     - `vars.$shadow-medium` → `tokens.shadow('md')`
     - `vars.$shadow-heavy` → `tokens.shadow('lg')`
     - `vars.$scale-hover-small` → `tokens.scale('sm')`
     - `vars.$scale-hover-medium` → `tokens.scale('md')`
     - `vars.$scale-hover-large` → `tokens.scale('lg')`

3. **Testing Strategy**:
   - Verify compilation after each file update
   - Check visual appearance to ensure consistency
   - Test theme switching functionality
   - Update tools one by one to minimize risk

4. **Final Removal**:
   - Once all files are updated, remove `_variables.scss`
   - Ensure all JS imports get values from tokens directly

### Design Token System

Design tokens are the foundational elements of our design system, representing the smallest design decisions, such as colors, spacing, and typography.

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
