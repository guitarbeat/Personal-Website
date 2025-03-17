# SASS Audit for Phase 2

## Overview
This document contains an audit of the current usage of spacing, typography, and shadows in the codebase. The purpose is to identify patterns, inconsistencies, and opportunities for standardization as part of Phase 2 of the SASS Variable Standardization project.

## Methodology
1. Examine core SASS files to understand current token definitions
2. Analyze component styles to identify usage patterns
3. Document inconsistencies and hardcoded values
4. Identify common patterns that can be standardized

## Current Token Definitions

### Spacing
```scss
// From _tokens.scss
$spacing: (
  'xxs': 0.25rem,  // 4px
  'xs': 0.5rem,    // 8px
  'sm': 1rem,      // 16px
  'md': 1.5rem,    // 24px
  'lg': 2rem,      // 32px
  'xl': 2.5rem,    // 40px
  'xxl': 3rem,     // 48px
  'xxxl': 4rem     // 64px
);
```

### Typography
```scss
// From _tokens.scss
$font-sizes: (
  'xxs': 0.625rem,  // 10px
  'xs': 0.75rem,    // 12px
  'sm': 0.875rem,   // 14px
  'md': 1rem,       // 16px
  'lg': 1.25rem,    // 20px
  'xl': 1.5rem,     // 24px
  'xxl': 2rem,      // 32px
  'xxxl': 2.5rem,   // 40px
  'display': 3rem   // 48px
);

$font-weights: (
  'light': 300,
  'regular': 400,
  'medium': 500,
  'semibold': 600,
  'bold': 700
);

$line-heights: (
  'tight': 1.2,
  'normal': 1.5,
  'loose': 1.8
);

$font-families: (
  'primary': ('Poppins', sans-serif),
  'secondary': ('Roboto', sans-serif),
  'monospace': ('Roboto Mono', monospace)
);
```

### Shadows
```scss
// From _tokens.scss
$shadows: (
  'none': none,
  'xs': 0 1px 2px rgba(0, 0, 0, 0.05),
  'sm': 0 2px 4px rgba(0, 0, 0, 0.1),
  'md': 0 4px 8px rgba(0, 0, 0, 0.15),
  'lg': 0 8px 16px rgba(0, 0, 0, 0.2),
  'xl': 0 12px 24px rgba(0, 0, 0, 0.25),
  'inner': inset 0 2px 4px rgba(0, 0, 0, 0.05)
);
```

## Audit Findings

### Spacing Audit

#### Common Patterns
- Consistent use of tokens for spacing in newer or recently updated components (Snake)
- Common values for padding: 0.5rem, 1rem, 1.5rem, 2rem
- Common values for margins: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem
- Common values for gaps: 0.5rem, 0.75rem, 1rem, 2rem
- Use of clamp() for responsive spacing in some components

#### Inconsistencies
- Mix of token usage and hardcoded values, even within the same component
- Inconsistent naming for similar spacing needs (e.g., some components use 'md' for medium spacing, others use hardcoded 1.5rem)
- No clear pattern for component-specific spacing
- Lack of responsive spacing tokens that adjust based on viewport size
- No standardized approach for spacing in different contexts (e.g., form fields vs. cards)

#### Hardcoded Values
- Many hardcoded values in the ConflictMediation component (e.g., padding: 2rem, margin-bottom: 1.5rem)
- Utility classes in Bingo component with hardcoded values (.mt-4, .mt-8, .gap-2, .gap-4)
- Inconsistent use of rem vs. px units

#### Opportunities for Standardization
- Create a more structured spacing scale with clear relationships between sizes
- Define component-specific spacing tokens for common UI patterns
- Implement responsive spacing that adjusts based on viewport size
- Create spacing utility classes for common spacing needs
- Standardize the approach to spacing in different contexts

### Typography Audit

#### Common Patterns
- Use of tokens for font-size and font-weight in newer components
- Common font sizes: 0.875rem, 1rem, 1.2rem, 1.5rem, 2rem
- Common font weights: 500, 600, 700
- Use of clamp() for responsive typography
- Line heights typically between 1.5 and 1.7

#### Inconsistencies
- Mix of token usage and hardcoded values for typography
- No clear typographic hierarchy or roles (e.g., heading-1, body-text)
- Inconsistent use of font weights (e.g., 'bold' vs. 700)
- No standardized approach to responsive typography
- Lack of consistent vertical rhythm

#### Hardcoded Values
- Many hardcoded font sizes in the ConflictMediation component
- Hardcoded line heights and letter spacing
- Inconsistent use of clamp() for responsive typography

#### Opportunities for Standardization
- Create a comprehensive type scale with clear hierarchical relationships
- Define typography roles with associated styles
- Implement responsive typography that scales based on viewport size
- Create a vertical rhythm system for consistent spacing between text elements
- Standardize line-height and letter-spacing values

### Shadow Audit

#### Common Patterns
- Use of box-shadow for elevation and focus states
- Common shadow patterns: subtle shadows for cards, stronger shadows for modals
- Use of rgba() for shadow colors with varying opacity
- Text shadows for emphasis on light text

#### Inconsistencies
- Mix of token usage, CSS variables, and hardcoded values for shadows
- No clear relationship between shadow values and elevation levels
- Inconsistent shadow values for similar UI elements
- No standardized approach to shadows for different UI states

#### Hardcoded Values
- Hardcoded box-shadow values in ConflictMediation component
- Inconsistent use of rgba() values for shadows
- Mix of CSS variables and hardcoded values in Bingo component

#### Opportunities for Standardization
- Create a consistent elevation system with corresponding shadows
- Define shadow tokens for different UI states
- Implement a system for both dark and light themes
- Create utility classes for applying shadows

## Recommendations

### Spacing System Enhancements
1. **Structured Spacing Scale**: Implement a more structured spacing scale with clear relationships between sizes, possibly using a non-linear scale (4px, 8px, 16px, 32px, 64px).
2. **Component-Specific Spacing**: Define spacing tokens for specific UI patterns such as cards, forms, and buttons.
3. **Responsive Spacing**: Create a system for spacing that adjusts based on viewport size.
4. **Spacing Utilities**: Implement utility classes for common spacing needs (margin, padding, gap).
5. **Contextual Spacing**: Define spacing tokens for different contexts (e.g., dense vs. comfortable layouts).

### Typography System Enhancements
1. **Type Scale**: Implement a comprehensive type scale based on a modular ratio (1.25 or major third).
2. **Typography Roles**: Define clear typography roles (heading-1, heading-2, body, caption, etc.) with associated styles.
3. **Responsive Typography**: Create a system for typography that scales based on viewport size.
4. **Vertical Rhythm**: Implement a vertical rhythm system for consistent spacing between text elements.
5. **Typography Utilities**: Create utility classes for common typography needs.

### Shadow System Enhancements
1. **Elevation System**: Create a consistent elevation system with 5 levels (0-4) and corresponding shadows.
2. **UI State Shadows**: Define shadow tokens for different UI states (default, hover, active, focus).
3. **Theme-Specific Shadows**: Implement shadows that work well in both dark and light themes.
4. **Shadow Utilities**: Create utility classes for applying shadows based on elevation.
5. **Shadow Mixins**: Develop mixins for complex shadow effects.

## Next Steps
1. Complete the audit by examining additional components
2. Finalize recommendations for each system
3. Create detailed specifications for implementation
4. Begin implementation of enhanced systems 