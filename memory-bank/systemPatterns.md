# System Patterns: Personal Website

## Architecture Overview
The website uses a modular SASS architecture with a comprehensive design token system as the foundation. The architecture follows a layered approach, with tokens at the base, followed by functions, mixins, and component styles.

## Key Components

### Design Token System
The design token system serves as the single source of truth for all design decisions in the project. It is implemented in the `_tokens.scss` file and provides a comprehensive set of tokens for colors, spacing, typography, shadows, and more.

#### Current Structure
- **Color System**: Theme colors, grayscale, semantic colors
- **Spacing System**: Basic spacing scale
- **Typography System**: Font sizes, weights, line heights, families
- **Breakpoint System**: Standardized breakpoints for responsive design
- **Transitions & Animations**: Duration and timing functions
- **Shadows**: Basic shadow definitions
- **Border Radius**: Standard radius values
- **Z-Index**: Layering system
- **Layout**: Container widths and padding

#### Phase 2 Enhancements
- **Enhanced Spacing System**: More structured with clear relationships and context-specific tokens
- **Comprehensive Typography System**: Type scale with roles and responsive behavior
- **Elevation System**: Consistent shadows tied to UI elevation
- **Responsive Design System**: Enhanced breakpoints with container queries
- **Animation Library**: Standardized animations for common interactions

### SASS Architecture
The SASS architecture is organized into several key files:
- `_tokens.scss`: Design tokens and functions
- `_variables.scss`: Legacy variables (being phased out)
- `_mixins.scss`: Reusable style patterns
- `_functions.scss`: Utility functions
- `_breakpoints.scss`: Responsive design utilities
- `_base.scss`: Global styles and resets
- `_css-variables.scss`: CSS custom properties

### Component Styling
Components use a combination of:
- Styled Components for dynamic styling
- SCSS modules for component-specific styles
- Global tokens for consistency

## Design Patterns

### Token Usage Pattern
```scss
// Good: Using tokens
.element {
  padding: tokens.spacing('md');
  color: var(--color-text, tokens.gray('gray-800'));
  font-size: tokens.font-size('md');
}

// Avoid: Hardcoded values
.element {
  padding: 1.5rem;
  color: #343a40;
  font-size: 1rem;
}
```

### Responsive Design Pattern
```scss
.component {
  width: 100%;
  
  @include bp.respond('tablet') {
    width: 50%;
  }
  
  @include bp.respond('desktop') {
    width: 33.333%;
  }
}
```

### Theme Switching Pattern
```scss
.element {
  background-color: var(--color-background, tokens.gray('white'));
  color: var(--color-text, tokens.gray('gray-800'));
  
  .dark-theme & {
    // Dark theme styles are handled via CSS variables
  }
}
```

## Phase 2 Implementation Patterns

### Spacing System Pattern
```scss
// Base spacing scale
$spacing-scale: (
  '0': 0,
  '1': 0.25rem,  // 4px
  '2': 0.5rem,   // 8px
  '3': 0.75rem,  // 12px
  '4': 1rem,     // 16px
  '5': 1.5rem,   // 24px
  '6': 2rem,     // 32px
  '7': 2.5rem,   // 40px
  '8': 3rem,     // 48px
  '9': 4rem,     // 64px
  '10': 5rem,    // 80px
);

// Component-specific spacing
$component-spacing: (
  'card': (
    'padding': map.get($spacing-scale, '4'),
    'gap': map.get($spacing-scale, '3'),
    'margin': map.get($spacing-scale, '5'),
  ),
  'form': (
    'field-gap': map.get($spacing-scale, '4'),
    'label-gap': map.get($spacing-scale, '2'),
    'group-gap': map.get($spacing-scale, '6'),
  ),
);
```

### Typography System Pattern
```scss
// Type scale based on a 1.25 ratio
$type-scale: (
  '1': 0.8rem,    // 12.8px
  '2': 1rem,      // 16px (base)
  '3': 1.25rem,   // 20px
  '4': 1.563rem,  // 25px
  '5': 1.953rem,  // 31.25px
  '6': 2.441rem,  // 39.06px
  '7': 3.052rem,  // 48.83px
);

// Typography roles
$typography-roles: (
  'heading-1': (
    'font-size': map.get($type-scale, '7'),
    'font-weight': map.get($font-weights, 'bold'),
    'line-height': 1.2,
    'letter-spacing': -0.02em,
  ),
  'body': (
    'font-size': map.get($type-scale, '2'),
    'font-weight': map.get($font-weights, 'regular'),
    'line-height': 1.5,
    'letter-spacing': 0,
  ),
);
```

### Shadow System Pattern
```scss
// Elevation levels
$elevation-levels: (
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
);

// Shadows mapped to elevation
$elevation-shadows: (
  '0': none,
  '1': (0 2px 4px rgba(0, 0, 0, 0.1)),
  '2': (0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)),
  '3': (0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)),
  '4': (0 16px 24px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.05)),
);
```

## Technical Decisions

### Spacing System Approach
We will implement a non-linear spacing scale that follows a more natural progression, with smaller increments at the lower end and larger increments at the higher end. This provides more precision for fine adjustments while still allowing for larger spaces when needed.

### Typography Scale
We will use a modular scale with a ratio of 1.25 (major third) for the type scale. This provides a harmonious progression of sizes that works well across different screen sizes and maintains good readability.

### Shadow Implementation
We will implement shadows using a combination of SASS maps for definition and CSS variables for implementation. This allows for theme-specific shadow adjustments while maintaining the structure of the elevation system.

### Animation Complexity
We will implement a tiered approach to animations:
1. Essential animations (feedback, state changes)
2. Enhanced animations (transitions between states)
3. Decorative animations (background effects, parallax)

Users with reduced motion preferences will only see essential animations, while others will see all tiers based on their preferences.

## Data Flow
1. Design tokens define the base values
2. Functions and mixins transform these values for specific contexts
3. Component styles consume the tokens through functions and mixins
4. CSS variables allow for runtime theme switching

## File References
- `src/sass/_tokens.scss`: Main token definitions
- `src/sass/_mixins.scss`: Reusable style patterns
- `src/sass/_functions.scss`: Utility functions
- `src/sass/_breakpoints.scss`: Responsive design utilities
- `src/sass/_base.scss`: Global styles and resets
- `src/sass/_css-variables.scss`: CSS custom properties
