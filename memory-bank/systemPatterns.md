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

- Tools SASS Architecture:
  - `src/components/Tools/styles/`: Shared tool styles
  - Individual tool style folders (e.g., `ConflictMediation/styles/`)
  - Component-specific style files

### Integration Issues

1. **Parallel Structures**: Tools section has its own parallel styling structure
2. **Limited Variable Sharing**: Not consistently using global variables
3. **Duplicate Patterns**: Redefining mixins that exist in main architecture
4. **Inconsistent Theming**: Different approaches to light/dark mode
5. **Isolated Imports**: Not properly importing from main SASS files

### Ideal Architecture

- **Single Source of Truth**: All variables and mixins from main SASS files
- **Consistent Import Patterns**: Using `@use` with namespaces
- **Proper Variable Usage**: Using global variables for colors, spacing, etc.
- **Shared Mixins**: Leveraging existing mixins instead of redefining
- **Theme Integration**: Using the site's theme system consistently
- **Component Scoping**: Keeping component styles properly scoped

### Implementation Pattern

```scss
// Proper import pattern
@use "src/sass/variables" as vars;
@use "src/sass/mixins" as mix;
@use "src/sass/functions" as fn;

// Component styles using global patterns
.component {
  @include mix.glass-morphism;
  color: vars.$color-text;
  padding: fn.spacing(2);
  
  // Theme-aware styling
  @include mix.theme-aware('background-color', vars.$light-bg, vars.$dark-bg);
}
```

## Data Flow

1. User Input Flow
   - User interactions trigger state updates
   - State changes trigger UI updates
   - Progress is automatically saved to localStorage

2. Component Communication
   - Parent-child prop passing for component coordination
   - Event handlers for user interactions
   - Callback functions for completing steps

## Technical Decisions

- SCSS Modules: For scoped styling and shared patterns
- LocalStorage: For persistent state management
- React Hooks: For component state and lifecycle management
- Shared Mixins: For consistent styling patterns
- Mobile-First Design: For responsive layouts
- Glass Effect Implementation: For modern UI aesthetics

## Style Organization

### Current Pattern

```scss
// Tools-specific mixin (redundant with main architecture)
@mixin glass-container {
  backdrop-filter: blur(var(--about-blur-amount));
  background: var(--about-glass-bg);
  border: 1px solid var(--about-glass-border);
  border-radius: var(--about-border-radius);
  box-shadow: var(--about-glass-shadow);
}

// Component styles
.component {
  @include glass-container;
  // Component-specific styles
}
```

### Ideal Pattern

```scss
// Import from main architecture
@use "src/sass/mixins" as mix;
@use "src/sass/variables" as vars;

// Component styles using global patterns
.component {
  @include mix.glass-morphism;
  color: vars.$color-text;
  
  // Theme-aware styling
  @include mix.theme-aware('background-color', vars.$light-bg, vars.$dark-bg);
}
```

## Integration Strategy

1. **Audit Current Usage**: Identify all custom variables and mixins
2. **Map to Global Equivalents**: Find corresponding global variables/mixins
3. **Refactor Imports**: Update import statements to use main SASS files
4. **Replace Custom Patterns**: Replace custom implementations with global ones
5. **Standardize Theme Handling**: Use consistent theme approach
6. **Test Cross-Browser**: Ensure compatibility across browsers
7. **Validate Accessibility**: Ensure proper contrast in all themes
