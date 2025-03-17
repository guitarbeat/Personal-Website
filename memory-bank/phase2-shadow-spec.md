# Enhanced Shadow System Specification

## Overview
This document outlines the specifications for the enhanced shadow system to be implemented as part of Phase 2 of the SASS Variable Standardization project. The goal is to create a consistent, flexible, and theme-aware shadow system that can be used across all components.

## Core Principles
1. **Elevation**: Use shadows to convey elevation and hierarchy
2. **Consistency**: Provide a consistent approach to shadows throughout the UI
3. **Theme Awareness**: Adapt shadows based on light or dark theme
4. **Flexibility**: Allow for different shadow needs in different contexts
5. **Performance**: Optimize shadows for performance

## Elevation System

### Elevation Levels
We'll define 5 elevation levels (0-4) to represent different heights above the surface:

```scss
$elevation-levels: (
  '0': 0,  // Surface level (no elevation)
  '1': 1,  // Low elevation (cards, buttons)
  '2': 2,  // Medium elevation (dropdowns, popovers)
  '3': 3,  // High elevation (dialogs, modals)
  '4': 4,  // Highest elevation (toasts, notifications)
);
```

### Shadow Values
Each elevation level will have corresponding shadow values for light and dark themes:

```scss
$shadow-values: (
  'light': (
    '0': none,
    '1': (
      0 2px 4px rgba(0, 0, 0, 0.1),
    ),
    '2': (
      0 4px 8px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.05),
    ),
    '3': (
      0 8px 16px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.05),
    ),
    '4': (
      0 16px 24px rgba(0, 0, 0, 0.1),
      0 6px 12px rgba(0, 0, 0, 0.05),
    ),
  ),
  'dark': (
    '0': none,
    '1': (
      0 2px 4px rgba(0, 0, 0, 0.2),
    ),
    '2': (
      0 4px 8px rgba(0, 0, 0, 0.25),
      0 2px 4px rgba(0, 0, 0, 0.15),
    ),
    '3': (
      0 8px 16px rgba(0, 0, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.2),
    ),
    '4': (
      0 16px 24px rgba(0, 0, 0, 0.35),
      0 6px 12px rgba(0, 0, 0, 0.25),
    ),
  ),
);
```

### UI State Shadows
In addition to elevation shadows, we'll define shadows for different UI states:

```scss
$state-shadows: (
  'light': (
    'hover': (
      0 4px 8px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.05),
    ),
    'active': (
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.05),
    ),
    'focus': (
      0 0 0 2px rgba(var(--color-primary-rgb), 0.2),
    ),
  ),
  'dark': (
    'hover': (
      0 4px 8px rgba(0, 0, 0, 0.25),
      0 2px 4px rgba(0, 0, 0, 0.15),
    ),
    'active': (
      0 2px 4px rgba(0, 0, 0, 0.25),
      0 1px 2px rgba(0, 0, 0, 0.15),
    ),
    'focus': (
      0 0 0 2px rgba(var(--color-primary-rgb), 0.4),
    ),
  ),
);
```

### Component-Specific Shadows
We'll define shadows for specific UI components:

```scss
$component-shadows: (
  'light': (
    'card': map.get(map.get($shadow-values, 'light'), '1'),
    'dropdown': map.get(map.get($shadow-values, 'light'), '2'),
    'modal': map.get(map.get($shadow-values, 'light'), '3'),
    'toast': map.get(map.get($shadow-values, 'light'), '4'),
    'button': (
      0 2px 4px rgba(0, 0, 0, 0.1),
    ),
    'button-hover': (
      0 4px 8px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.05),
    ),
    'input-focus': (
      0 0 0 2px rgba(var(--color-primary-rgb), 0.2),
    ),
  ),
  'dark': (
    'card': map.get(map.get($shadow-values, 'dark'), '1'),
    'dropdown': map.get(map.get($shadow-values, 'dark'), '2'),
    'modal': map.get(map.get($shadow-values, 'dark'), '3'),
    'toast': map.get(map.get($shadow-values, 'dark'), '4'),
    'button': (
      0 2px 4px rgba(0, 0, 0, 0.2),
    ),
    'button-hover': (
      0 4px 8px rgba(0, 0, 0, 0.25),
      0 2px 4px rgba(0, 0, 0, 0.15),
    ),
    'input-focus': (
      0 0 0 2px rgba(var(--color-primary-rgb), 0.4),
    ),
  ),
);
```

### Inner Shadows
We'll also define inner shadows for inset effects:

```scss
$inner-shadows: (
  'light': (
    'subtle': inset 0 1px 2px rgba(0, 0, 0, 0.05),
    'medium': inset 0 2px 4px rgba(0, 0, 0, 0.1),
    'strong': inset 0 4px 8px rgba(0, 0, 0, 0.15),
  ),
  'dark': (
    'subtle': inset 0 1px 2px rgba(0, 0, 0, 0.15),
    'medium': inset 0 2px 4px rgba(0, 0, 0, 0.2),
    'strong': inset 0 4px 8px rgba(0, 0, 0, 0.25),
  ),
);
```

## CSS Variables
We'll define CSS variables for shadows to allow for theme switching:

```scss
:root {
  // Elevation shadows
  --shadow-0: none;
  --shadow-1: #{map.get(map.get($shadow-values, 'light'), '1')};
  --shadow-2: #{map.get(map.get($shadow-values, 'light'), '2')};
  --shadow-3: #{map.get(map.get($shadow-values, 'light'), '3')};
  --shadow-4: #{map.get(map.get($shadow-values, 'light'), '4')};
  
  // State shadows
  --shadow-hover: #{map.get(map.get($state-shadows, 'light'), 'hover')};
  --shadow-active: #{map.get(map.get($state-shadows, 'light'), 'active')};
  --shadow-focus: #{map.get(map.get($state-shadows, 'light'), 'focus')};
  
  // Component shadows
  --shadow-card: #{map.get(map.get($component-shadows, 'light'), 'card')};
  --shadow-dropdown: #{map.get(map.get($component-shadows, 'light'), 'dropdown')};
  --shadow-modal: #{map.get(map.get($component-shadows, 'light'), 'modal')};
  --shadow-toast: #{map.get(map.get($component-shadows, 'light'), 'toast')};
  --shadow-button: #{map.get(map.get($component-shadows, 'light'), 'button')};
  --shadow-button-hover: #{map.get(map.get($component-shadows, 'light'), 'button-hover')};
  --shadow-input-focus: #{map.get(map.get($component-shadows, 'light'), 'input-focus')};
  
  // Inner shadows
  --inner-shadow-subtle: #{map.get(map.get($inner-shadows, 'light'), 'subtle')};
  --inner-shadow-medium: #{map.get(map.get($inner-shadows, 'light'), 'medium')};
  --inner-shadow-strong: #{map.get(map.get($inner-shadows, 'light'), 'strong')};
}

.dark-theme {
  // Elevation shadows
  --shadow-0: none;
  --shadow-1: #{map.get(map.get($shadow-values, 'dark'), '1')};
  --shadow-2: #{map.get(map.get($shadow-values, 'dark'), '2')};
  --shadow-3: #{map.get(map.get($shadow-values, 'dark'), '3')};
  --shadow-4: #{map.get(map.get($shadow-values, 'dark'), '4')};
  
  // State shadows
  --shadow-hover: #{map.get(map.get($state-shadows, 'dark'), 'hover')};
  --shadow-active: #{map.get(map.get($state-shadows, 'dark'), 'active')};
  --shadow-focus: #{map.get(map.get($state-shadows, 'dark'), 'focus')};
  
  // Component shadows
  --shadow-card: #{map.get(map.get($component-shadows, 'dark'), 'card')};
  --shadow-dropdown: #{map.get(map.get($component-shadows, 'dark'), 'dropdown')};
  --shadow-modal: #{map.get(map.get($component-shadows, 'dark'), 'modal')};
  --shadow-toast: #{map.get(map.get($component-shadows, 'dark'), 'toast')};
  --shadow-button: #{map.get(map.get($component-shadows, 'dark'), 'button')};
  --shadow-button-hover: #{map.get(map.get($component-shadows, 'dark'), 'button-hover')};
  --shadow-input-focus: #{map.get(map.get($component-shadows, 'dark'), 'input-focus')};
  
  // Inner shadows
  --inner-shadow-subtle: #{map.get(map.get($inner-shadows, 'dark'), 'subtle')};
  --inner-shadow-medium: #{map.get(map.get($inner-shadows, 'dark'), 'medium')};
  --inner-shadow-strong: #{map.get(map.get($inner-shadows, 'dark'), 'strong')};
}
```

## Functions and Mixins

### Shadow Functions
```scss
// Get a shadow value for a specific elevation level and theme
@function shadow-value($level, $theme: 'light') {
  @return map.get(map.get($shadow-values, $theme), $level);
}

// Get a shadow value for a specific UI state and theme
@function state-shadow($state, $theme: 'light') {
  @return map.get(map.get($state-shadows, $theme), $state);
}

// Get a shadow value for a specific component and theme
@function component-shadow($component, $theme: 'light') {
  @return map.get(map.get($component-shadows, $theme), $component);
}

// Get an inner shadow value for a specific intensity and theme
@function inner-shadow($intensity, $theme: 'light') {
  @return map.get(map.get($inner-shadows, $theme), $intensity);
}
```

### Shadow Mixins
```scss
// Apply an elevation shadow
@mixin elevation-shadow($level) {
  box-shadow: var(--shadow-#{$level}, #{shadow-value($level)});
}

// Apply a state shadow
@mixin state-shadow($state) {
  box-shadow: var(--shadow-#{$state}, #{state-shadow($state)});
}

// Apply a component shadow
@mixin component-shadow($component) {
  box-shadow: var(--shadow-#{$component}, #{component-shadow($component)});
}

// Apply an inner shadow
@mixin inner-shadow($intensity) {
  box-shadow: var(--inner-shadow-#{$intensity}, #{inner-shadow($intensity)});
}

// Apply a combined shadow (elevation + inner)
@mixin combined-shadow($elevation, $inner: null) {
  @if $inner {
    box-shadow: var(--shadow-#{$elevation}, #{shadow-value($elevation)}),
                var(--inner-shadow-#{$inner}, #{inner-shadow($inner)});
  } @else {
    box-shadow: var(--shadow-#{$elevation}, #{shadow-value($elevation)});
  }
}

// Apply a focus shadow
@mixin focus-shadow($color: 'primary') {
  box-shadow: var(--shadow-focus, 0 0 0 2px rgba(var(--color-#{$color}-rgb), 0.2));
}
```

## Utility Classes
We'll create utility classes for common shadow needs:

```scss
// Elevation shadow utilities
.shadow-0 { @include elevation-shadow('0'); }
.shadow-1 { @include elevation-shadow('1'); }
.shadow-2 { @include elevation-shadow('2'); }
.shadow-3 { @include elevation-shadow('3'); }
.shadow-4 { @include elevation-shadow('4'); }

// Component shadow utilities
.shadow-card { @include component-shadow('card'); }
.shadow-dropdown { @include component-shadow('dropdown'); }
.shadow-modal { @include component-shadow('modal'); }
.shadow-toast { @include component-shadow('toast'); }
.shadow-button { @include component-shadow('button'); }

// Inner shadow utilities
.inner-shadow-subtle { @include inner-shadow('subtle'); }
.inner-shadow-medium { @include inner-shadow('medium'); }
.inner-shadow-strong { @include inner-shadow('strong'); }

// Focus shadow utilities
.focus-shadow { @include focus-shadow(); }
.focus-shadow-primary { @include focus-shadow('primary'); }
.focus-shadow-secondary { @include focus-shadow('secondary'); }
```

## Usage Guidelines

### When to Use Different Elevation Levels

#### Elevation 0
- Use for elements that are at the same level as their parent
- Examples: dividers, disabled buttons

#### Elevation 1
- Use for elements that are slightly raised above their parent
- Examples: cards, buttons, inputs

#### Elevation 2
- Use for elements that are moderately raised above their parent
- Examples: dropdowns, popovers, active buttons

#### Elevation 3
- Use for elements that are significantly raised above their parent
- Examples: dialogs, modals

#### Elevation 4
- Use for elements that are at the highest elevation
- Examples: toasts, notifications

### Component-Specific Guidelines

#### Cards
- Use `component-shadow('card')` for standard cards
- Use `elevation-shadow('2')` for highlighted or interactive cards

#### Buttons
- Use `component-shadow('button')` for standard buttons
- Use `component-shadow('button-hover')` for hover state

#### Inputs
- Use `component-shadow('input-focus')` for focus state

#### Modals and Dialogs
- Use `component-shadow('modal')` for modals and dialogs

### Theme-Aware Shadows
- Use CSS variables for shadows to ensure they adapt to the current theme
- Test shadows in both light and dark themes to ensure proper contrast

## Implementation Plan

### Phase 1: Core System
1. Update `_tokens.scss` with the new shadow values and CSS variables
2. Create functions for accessing shadow values
3. Create mixins for applying shadows

### Phase 2: Utility Classes
1. Create utility classes for common shadow needs
2. Document usage guidelines

### Phase 3: Component Updates
1. Update component styles to use the new shadow system
2. Ensure consistency across similar components

### Phase 4: Documentation
1. Create comprehensive documentation for the shadow system
2. Provide examples and usage guidelines 