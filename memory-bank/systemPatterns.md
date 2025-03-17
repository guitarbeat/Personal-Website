# System Patterns: Personal Website Tools

## Architecture Overview

The tools section is built using a component-based React architecture with SCSS modules for styling. Each tool is self-contained but shares common styling patterns and utilities through a shared styles system. The styling system uses modern SASS features with proper component scoping and reusable mixins.

## Key Components

- ConflictMediation: Main container component managing tool state and flow
- ProgressTracker: Reusable component for tracking multi-step processes
- EmotionSelector: Complex component with multiple visualization methods
  - EmotionWheel: Hierarchical emotion selection interface
  - EmotionAxes: MIT research-based emotion mapping
  - EmotionCircumplex: Valence-arousal based emotion plotting
- NeedsAssessment: Component for evaluating personal needs
- ReflectionPrompts: Guided reflection interface
- FullscreenTool: Wrapper component for tool expansion

## Design Patterns

- Glass Effect: Consistent use of backdrop-filter and gradients for modern UI
- Component Composition: Building complex UIs from smaller, reusable parts
- State Management: Local state with localStorage persistence
- Responsive Design: Mobile-first approach with fluid layouts
- Accessibility Patterns: ARIA labels, semantic HTML, keyboard navigation
- Style Patterns: Reusable mixins for consistent styling

## SASS Architecture

### Current Structure

- Main SASS Architecture:
  - `src/sass/`: Core SASS files (variables, mixins, functions)
  - `src/sass/main.scss`: Main entry point importing all styles
  - `src/sass/_variables.scss`: Global variables
  - `src/sass/_mixins.scss`: Reusable mixins
  - `src/sass/_functions.scss`: SASS functions
  - `src/sass/theme/`: Theme-related styles
  - `src/sass/theme/_keyframes.scss`: Animation keyframes
  - `src/sass/theme/_theme-switch.scss`: Theme switch component styles

- Tools SASS Architecture:
  - `src/components/Tools/styles/`: Shared tool styles
  - Individual tool style folders (e.g., `ConflictMediation/styles/`)
  - Component-specific style files

### Integration Issues

1. **Parallel Structures**: Tools section has its own parallel styling structure
2. **Limited Variable Sharing**: Not consistently using global variables
3. **Duplicate Patterns**: Redefining mixins that exist in main architecture
4. **Inconsistent Theming**: Different approaches to light/dark mode

### Recent Improvements

1. **Sass Deprecation Fixes**:
   - Wrapped declarations after nested rules in `& {}` blocks
   - Moved keyframes to dedicated files
   - Ensured proper nesting in media queries
   - Removed `&` selectors from keyframes

2. **Improved Organization**:
   - Centralized keyframes in dedicated files
   - Properly structured nested rules
   - Consistent use of `& {}` wrapper for declarations

3. **Better Maintainability**:
   - Clearer code structure with explicit nesting
   - Future-proof code that follows upcoming Sass behavior
   - Eliminated deprecation warnings

## SASS Patterns

### Nesting Pattern

```scss
// Proper nesting with & {} wrapper
.selector {
  .nested {
    color: blue;
  }
  
  & {
    color: red; // Wrapped in & {} to opt into new behavior
  }
}
```

### Keyframe Pattern

```scss
// Keyframes in dedicated file without & selectors
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

// Usage in component
.element {
  animation: fadeIn 0.5s ease forwards;
}
```

### Media Query Pattern

```scss
// Media queries with proper nesting
@media (max-width: 768px) {
  .selector {
    & {
      padding: 1rem;
    }
  }
}
```

### Variable Usage Pattern

```scss
// CSS Custom Properties for theme values
:root {
  --font-size-sm: 1.4rem;
  --spacing-xl: 2.5rem;
}

// Usage in component
.element {
  font-size: var(--font-size-sm);
  margin: var(--spacing-xl);
}
```

## Data Flow

The tools section follows a unidirectional data flow pattern:

1. User interacts with a tool component
2. Component updates local state
3. State changes trigger UI updates
4. State is persisted to localStorage when needed
5. On page load, state is restored from localStorage

## Technical Decisions

- **SASS Architecture**: Using modern @use syntax with proper namespacing
- **Styling System**: Leveraging global mixins and variables for consistency
- **Component Scoping**: Keeping component styles properly scoped
- **State Management**: Using localStorage for persistence
- **Mobile Design**: Implementing stacked layout for smaller screens
- **Theme Integration**: Aligning Tools section with main site's theming system
- **Sass Nesting**: Using `& {}` wrapper for declarations after nested rules
- **Keyframe Organization**: Centralizing keyframes in dedicated files

## Future Improvements

- Complete integration with main SASS architecture
- Standardize CSS variable usage across all tools
- Implement consistent theme handling for light/dark modes
- Refactor remaining component styles to use shared patterns
- Create a comprehensive audit of all Sass variables
- Consider creating a linting rule to enforce the new Sass nesting behavior
