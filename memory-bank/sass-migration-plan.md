# SASS Variable Migration Plan

## Overview

This document outlines the plan to clean up and consolidate SASS variables across the project, based on the analysis performed using our custom SASS variable analysis tools.

## Current State

- Total SASS files: 24
- Total variables: 80
- Potentially unused variables: 34
- Files with duplicate variable definitions: 5
- Primary variable files: `_tokens.scss`, `_variables.scss`, `_base.scss`

## Migration Goals

1. Consolidate all design tokens into `_tokens.scss`
2. Remove unused and deprecated variables
3. Establish clear variable organization
4. Reduce duplicate definitions
5. Improve maintainability

## Phase 1: Variable Consolidation

### 1.1 Breakpoint Variables

Move all breakpoint-related variables to `_tokens.scss`:

```scss
// _tokens.scss
$breakpoints: (
  'smallest': $bp-smallest,
  'small': $bp-small,
  'medium': $bp-medium,
  'large': $bp-large,
  'largest': $bp-largest
);
```

Remove from:

- `_breakpoints.scss`
- `_base.scss`

### 1.2 Transition Variables

Consolidate in `_tokens.scss`:

```scss
// _tokens.scss
$transitions: (
  'duration': (
    'default': 300ms,
    'fast': 150ms,
    'slow': 500ms
  ),
  'timing': (
    'default': ease-in-out,
    'bounce': cubic-bezier(0.68, -0.55, 0.265, 1.55)
  )
);
```

Remove from:

- `_variables.scss`
- `_base.scss`

### 1.3 Z-index Variables

Consolidate in `_tokens.scss`:

```scss
// _tokens.scss
$z-index: (
  'modal': 1000,
  'overlay': 900,
  'dropdown': 800,
  'header': 700,
  'footer': 600
);
```

Remove from:

- `_variables.scss`

## Phase 2: Variable Cleanup

### 2.1 Remove Deprecated Variables

Delete the following variables:

```scss
// From _variables.scss
$shadow-light
$shadow-medium
$theme-transition-properties
$transition-duration-long

// From _animations.scss
$bounce-out
$smooth-out

// From _base.scss
$spacing-ratio
$track-padding
```

### 2.2 Review and Update Design System Variables

Verify usage and update these variables in `_tokens.scss`:

```scss
$component-shadows
$component-spacing
$semantic-spacing
$semantic-type-scale
$font-families
$font-weights
$heading-styles
```

### 2.3 Theme Variables Cleanup

Review and potentially remove:

- `$theme-switch`
- `$z-index-vignette`

## Phase 3: File Organization

### 3.1 File Structure

Organize SASS files into a clear hierarchy:

```
src/sass/
├── abstracts/
│   ├── _tokens.scss       # Single source of truth for design tokens
│   ├── _functions.scss    # SASS functions
│   ├── _mixins.scss      # Mixins and tools
│   └── _index.scss       # Forwards all abstracts
├── base/
│   ├── _typography.scss   # Typography rules
│   ├── _animations.scss   # Animation definitions
│   └── _index.scss       # Forwards base styles
├── themes/
│   ├── _light.scss       # Light theme variables
│   ├── _dark.scss        # Dark theme variables
│   └── _index.scss       # Theme management
└── main.scss             # Main entry point
```

### 3.2 Variable Organization in `_tokens.scss`

Structure variables by category:

```scss
// _tokens.scss

// Colors
$theme-colors: (...);
$semantic-colors: (...);
$grayscale: (...);

// Typography
$type-scale: (...);
$font-families: (...);
$font-weights: (...);
$line-heights: (...);

// Spacing
$spacing-scale: (...);
$component-spacing: (...);

// Elevation
$shadow-values: (...);
$component-shadows: (...);

// Breakpoints
$breakpoints: (...);

// Animation
$animation-durations: (...);
$transitions: (...);

// Layout
$z-index: (...);
```

## Phase 4: Implementation Steps

1. Create backup of current SASS files
2. Create new file structure
3. Move and consolidate variables in order:
   - Colors
   - Typography
   - Spacing
   - Breakpoints
   - Animations
   - Layout
4. Update imports in `main.scss`
5. Test compilation
6. Update component styles to use new variable structure
7. Remove deprecated files and variables
8. Run final compilation and testing

## Phase 5: Monitoring and Maintenance

### 5.1 Tools

Maintain and use:

- `find-unused-sass-vars.js`
- `list-sass-vars.js`

### 5.2 Regular Audits

Schedule quarterly audits to:

- Check for unused variables
- Verify variable organization
- Update documentation
- Remove deprecated code

## Success Criteria

- [ ] All design tokens consolidated in `_tokens.scss`
- [ ] No duplicate variable definitions
- [ ] Removed all unused variables
- [ ] Clear variable organization
- [ ] All files compile without errors
- [ ] Updated documentation
- [ ] Established monitoring process

## Rollback Plan

1. Keep backup of original SASS files
2. Document all changes
3. Test thoroughly before committing
4. Maintain ability to revert to previous version

## Timeline

1. Phase 1: 1-2 days
2. Phase 2: 1-2 days
3. Phase 3: 1 day
4. Phase 4: 2-3 days
5. Phase 5: Ongoing

Total estimated time: 5-8 days

## Notes

- This plan focuses on variable organization and cleanup
- Some variables marked as "unused" may be false positives
- Consider impact on build process and development workflow
- Document all decisions and changes
- Regular communication with team members about changes
