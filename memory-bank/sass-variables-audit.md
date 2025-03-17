# SASS Variables Audit

## Overview

This document provides a comprehensive audit of all SASS variables used throughout the Personal Website project. The audit aims to identify:

1. **Variable Categories**: How variables are organized and grouped
2. **Duplications**: Where the same values are defined multiple times
3. **Inconsistencies**: Where similar concepts use different naming conventions or values
4. **Standardization Opportunities**: Where variables could be consolidated or better organized

## Core Variable Files

### 1. `src/sass/_variables.scss`

**Purpose**: Defines global variables for transitions, scaling, shadows, z-index, spacing, and typography.

**Key Variable Groups**:

- Transitions (`$transition-timing`, `$transition-duration`)
- Scaling factors (`$scale-hover-small`, `$scale-hover-medium`, `$scale-hover-large`)
- Shadows (`$shadow-light`, `$shadow-medium`, `$shadow-heavy`)
- Z-index system (using a map)
- CSS Custom Properties in `:root` for:
  - Spacing system (`--spacing-xs` through `--spacing-xl`)
  - Font sizes (`--font-size-xs` through `--font-size-xl`)
  - Font weights (`--font-weight-normal` through `--font-weight-bold`)
  - Border radius (`--border-radius-sm` through `--border-radius-lg`)
  - Layout (`--max-content-width`)
  - Tool-specific variables (buttons, inputs)

### 2. `src/sass/_base.scss`

**Purpose**: Defines base theme colors, breakpoints, and CSS custom properties for the entire application.

**Key Variable Groups**:

- Theme color maps (`$theme-colors` with sage, coral, sand)
- Breakpoints (duplicated from `_breakpoints.scss`)
- Theme switch component variables
- CSS Custom Properties in `:root` for:
  - Background colors (`--lightground-color`, `--darkground-color`, etc.)
  - Overlay and shadow colors
  - Theme colors (generated from `$theme-colors` map)
  - Grey scale colors
  - Semantic colors (success, warning, error)
  - UI elements
  - Shadow system
  - Animation
  - Header theme colors

### 3. `src/sass/_breakpoints.scss`

**Purpose**: Defines breakpoints for responsive design.

**Key Variable Groups**:

- Standard breakpoints map (`$breakpoints` with mobile, phone, tablet, etc.)
- Legacy breakpoints (`$bp-largest`, `$bp-large`, etc.)
- Exports for JavaScript usage

### 4. `src/sass/theme/_theme-switch.scss`

**Purpose**: Defines variables for the theme switch component.

**Key Variable Groups**:

- Device screen configurations (`$screens` map)
- Theme switch configuration (`$theme-switch` map)
- Theme colors (`$theme-colors` map)

### 5. `src/sass/theme/_vignette.scss`

**Purpose**: Defines variables for the vignette effect.

**Key Variable Groups**:

- Configuration map (`$config` with blur, sides, gradient)

## Component-Specific Variables

### 1. `src/components/Tools/shared/styles/index.scss`

**Purpose**: Defines shared styles and mixins for all tools.

**Key Variable Groups**:

- No specific variables, but uses variables from core files
- Defines mixins that use variables from core files

### 2. `src/components/Tools/Snake/styles/snake.scss`

**Purpose**: Defines styles for the Snake game.

**Key Variable Groups**:

- No specific variables, but uses variables from core files

### 3. `src/components/Tools/Bingo/styles/bingo.scss`

**Purpose**: Defines styles for the Bingo game.

**Key Variable Groups**:

- No specific variables, but uses variables from core files
- Defines keyframes for animations

### 4. `src/components/Tools/ConflictMediation/styles/conflict-mediation.scss`

**Purpose**: Defines styles for the Conflict Mediation tool.

**Key Variable Groups**:

- Defines button mixins that use variables from core files

### 5. `src/components/Tools/ToolsSection/styles/tools-section.scss`

**Purpose**: Defines styles for the Tools section.

**Key Variable Groups**:

- No specific variables, but uses variables from core files

### 6. `src/components/content/Header/text.scss`

**Purpose**: Defines styles for the Header text.

**Key Variable Groups**:

- Custom properties for bubble theme (`--bubble-theme`)
- Component-specific variables (`--bubble-border`, `--bubble-background`, `--bubble-text`, `--hint-divider-color`)

## Variable Categories

### 1. Theme Colors

**Primary Location**: `src/sass/_base.scss`

**Variables**:

- `$theme-colors` map with sage, coral, sand
- CSS Custom Properties for each color (base, light, dark, RGB variants)
- Additional theme colors (`--color-coral-alt`, `--color-sage-alt`, etc.)
- Accent colors (`--color-indigo`, variants)
- Grey scale (`--color-grey-light-1` through `--color-grey-light-4`, `--color-grey-dark-1` through `--color-grey-dark-4`)
- Semantic colors (`--color-success`, `--color-warning`, `--color-error`)

**Duplications**:

- Theme colors are defined in both `_base.scss` and `_theme-switch.scss`
- Different naming conventions for similar colors (e.g., `-alt` vs `-light`)

### 2. Spacing

**Primary Location**: `src/sass/_variables.scss`

**Variables**:

- `--spacing-xs`: 0.5rem
- `--spacing-sm`: 1rem
- `--spacing-md`: 2rem
- `--spacing-lg`: 2.5rem
- `--spacing-xl`: 3rem

**Inconsistencies**:

- Some components use hardcoded values instead of spacing variables
- Inconsistent usage of spacing variables across components

### 3. Typography

**Primary Location**: `src/sass/_variables.scss`

**Variables**:

- `--font-size-xs`: 0.75rem
- `--font-size-sm`: 0.875rem
- `--font-size-md`: 1.1rem
- `--font-size-lg`: 1.25rem
- `--font-size-xl`: 2.5rem
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

**Inconsistencies**:

- Some components use hardcoded font sizes and weights
- No clear system for heading sizes (h1-h6)

### 4. Breakpoints

**Primary Location**: `src/sass/_breakpoints.scss`

**Variables**:

- Standard breakpoints map with mobile (30em), phone (31.25em), etc.
- Legacy breakpoints (`$bp-largest`, `$bp-large`, etc.)

**Duplications**:

- Breakpoints are defined in both `_breakpoints.scss` and `_base.scss`
- Multiple naming conventions for similar breakpoints (e.g., "tablet" vs "medium")

### 5. Transitions

**Primary Location**: `src/sass/_variables.scss`

**Variables**:

- `$transition-timing`: cubic-bezier(0.4, 0, 0.2, 1)
- `$transition-duration`: 0.3s
- `$transition-duration-long`: 0.5s
- CSS Custom Properties for theme transitions

**Duplications**:

- Transition variables are defined in both `_variables.scss` and `_base.scss`
- Different naming conventions for similar transitions

### 6. Shadows

**Primary Location**: `src/sass/_variables.scss`

**Variables**:

- `$shadow-light`: 0 2px 4px rgb(0 0 0 / 10%)
- `$shadow-medium`: 0 4px 8px rgb(0 0 0 / 15%)
- `$shadow-heavy`: 0 8px 16px rgb(0 0 0 / 20%)
- CSS Custom Properties for shadow system in `_base.scss`

**Duplications**:

- Shadow variables are defined in both `_variables.scss` and `_base.scss`
- Different naming conventions for similar shadows

### 7. Z-index

**Primary Location**: `src/sass/_variables.scss`

**Variables**:

- `$z-index` map with base, vignette, frame, navbar, theme-switch
- CSS Custom Properties for z-index system

**Inconsistencies**:

- Some components might use hardcoded z-index values

### 8. Component-Specific Variables

**Primary Location**: Various component files

**Variables**:

- Tool-specific variables in `_variables.scss`
- Bubble theme variables in `Header/text.scss`
- Theme switch variables in `_theme-switch.scss`

**Inconsistencies**:

- Inconsistent approach to defining component-specific variables
- Some components define variables locally, others use global variables

## Standardization Opportunities

### 1. Consolidate Theme Color System

**Current State**:

- Theme colors are defined in multiple files
- Different naming conventions for similar colors
- Inconsistent usage of RGB variants

**Recommendation**:

- Consolidate all theme colors in a single file
- Use a consistent naming convention (e.g., `--color-{name}-{variant}`)
- Generate RGB variants for all colors
- Create a clear hierarchy of primary, secondary, and accent colors

### 2. Standardize Spacing System

**Current State**:

- Spacing variables are defined but not consistently used
- Some components use hardcoded values

**Recommendation**:

- Enforce usage of spacing variables across all components
- Consider a more comprehensive spacing scale (e.g., 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem, 4rem)
- Document the spacing system and when to use each value

### 3. Create a Comprehensive Typography System

**Current State**:

- Basic font size and weight variables are defined
- No clear system for heading sizes
- Inconsistent usage across components

**Recommendation**:

- Define a clear typography scale with specific roles (body, caption, heading-1 through heading-6)
- Include line heights and letter spacing
- Create typography mixins for common text styles
- Enforce usage across all components

### 4. Unify Breakpoint System

**Current State**:

- Multiple breakpoint systems (standard and legacy)
- Duplicated definitions
- Inconsistent naming

**Recommendation**:

- Consolidate to a single breakpoint system
- Use a consistent naming convention
- Deprecate legacy breakpoints
- Document the breakpoint system and when to use each breakpoint

### 5. Standardize Transitions and Animations

**Current State**:

- Transition variables are defined in multiple files
- Inconsistent usage across components
- No clear system for animation durations

**Recommendation**:

- Consolidate all transition and animation variables in a single file
- Define a clear system for durations (e.g., fast, medium, slow)
- Create animation mixins for common patterns
- Enforce usage across all components

### 6. Create a Comprehensive Shadow System

**Current State**:

- Shadow variables are defined in multiple files
- Inconsistent usage across components

**Recommendation**:

- Consolidate all shadow variables in a single file
- Define a clear system for shadow elevations
- Create shadow mixins for common patterns
- Enforce usage across all components

### 7. Implement a Design Token System

**Current State**:

- Variables are scattered across multiple files
- Inconsistent naming and usage

**Recommendation**:

- Implement a design token system that separates semantic tokens from base tokens
- Use a consistent naming convention for all tokens
- Document the token system and when to use each token
- Consider using a tool like Style Dictionary to manage tokens

## Implementation Plan

### Phase 1: Audit and Documentation

1. **Complete this audit** to identify all variables and their usage
2. **Document the current state** of the variable system
3. **Identify critical issues** that need immediate attention

### Phase 2: Consolidation

1. **Consolidate theme colors** into a single file
2. **Unify breakpoint system** to eliminate duplications
3. **Standardize transitions and animations** across the project

### Phase 3: Standardization

1. **Create a comprehensive spacing system** and enforce usage
2. **Develop a typography system** with clear roles and usage guidelines
3. **Implement a shadow system** with consistent elevations

### Phase 4: Implementation

1. **Update all components** to use the standardized variables
2. **Create documentation** for the new variable system
3. **Implement linting rules** to enforce usage of variables

## Conclusion

The current SASS variable system has several inconsistencies and duplications that could be addressed to improve maintainability and consistency. By implementing the recommendations in this audit, the project can achieve a more cohesive design system that is easier to maintain and extend.

Key priorities should be:

1. Consolidating theme colors into a single source of truth
2. Standardizing the spacing and typography systems
3. Unifying the breakpoint system
4. Implementing a design token approach for all variables

This will result in a more maintainable codebase, more consistent UI, and easier onboarding for new developers.
