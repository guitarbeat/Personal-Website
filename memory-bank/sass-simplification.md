# SASS Architecture Simplification

This document provides examples and demonstrations of how we'll simplify the SASS architecture.

## Simplified Import Structure

### Current `main.scss`

```scss
// Core
@use "functions" as f;
@use "./tokens" as tokens;
@use "./base";
@use "sass:map";
@use "sass:color";
@use "sass:math";
@use "./breakpoints";
@use "variables" as *;
@use "mixins";
@use "mixins-custom"; // Custom mixins with heading mixin
@use "./spacing";
@use "./typography";
@use "./typography-custom"; // Custom typography styling
@use "./shadows";

// Theme
@use "./theme/theme-switch";
@use "./theme/vignette";

// Utilities
@use "./utilities";
@use "./layout";
@use "./tooltip";

// Components (sorted alphabetically)
@use "../components/content/About/about";
@use "../components/content/Header/header";
@use "../components/content/NavBar/navbar";
@use "../components/content/Projects/projects";
@use "../components/Tools/styles";
@use "../components/content/Work/work";
```

### Simplified `main.scss`

```scss
////////////////////////////////////////////
// Core - Design Tokens & Core Imports
////////////////////////////////////////////
@use "sass:map";
@use "sass:color";
@use "sass:math";
@use "./tokens" as tokens;  // Single source of truth
@use "functions" as f;      // Pure functions

////////////////////////////////////////////
// Utilities - Reusable Patterns
////////////////////////////////////////////
@use "mixins" as mix;       // Core mixins
@use "shadows" as shadows;  // Shadow utilities
@use "breakpoints" as bp;   // Responsive utilities
@use "mixins-custom" as mc; // Project-specific mixins

////////////////////////////////////////////
// Base Styles - Global Foundations
////////////////////////////////////////////
@use "./base";             // Reset & base styles
@use "./typography";       // Typography system
@use "./typography-custom"; // Project-specific typography
@use "./spacing";          // Spacing system
@use "./layout";           // Layout utilities

////////////////////////////////////////////
// Theming - Visual Presentation
////////////////////////////////////////////
@use "./theme/theme-switch";
@use "./theme/vignette";
@use "./utilities";        // Utility classes
@use "./tooltip";          // Tooltip styling

////////////////////////////////////////////
// Components - UI Elements
////////////////////////////////////////////
// Content
@use "../components/content/About/about";
@use "../components/content/Header/header";
@use "../components/content/NavBar/navbar";
@use "../components/content/Projects/projects";
@use "../components/content/Work/work";

// Tools
@use "../components/Tools/styles";
```

## Example Component File Migration

### Current Component

```scss
// src/components/content/Header/header.scss
@use "../../../sass/variables" as *;
@use "../../../sass/mixins" as mix;

.header {
  padding: $spacing-lg;
  
  &__title {
    color: $theme-primary;
    margin-bottom: $spacing-md;
    @include mix.responsive-font(2rem, 3rem);
  }
  
  &__subtitle {
    color: $theme-secondary;
    @include mix.text-shadow;
  }
}
```

### Simplified Component

```scss
// src/components/content/Header/header.scss
@use "../../../sass/tokens" as tokens;
@use "../../../sass/mixins" as mix;

.header {
  padding: tokens.spacing('lg');
  
  &__title {
    color: tokens.theme-color('sage');
    margin-bottom: tokens.spacing('md');
    @include mix.responsive-font(2rem, 3rem);
  }
  
  &__subtitle {
    color: tokens.theme-color('coral');
    @include mix.text-shadow;
  }
}
```

## Utility Functions Evolution

### Current Breakpoint Usage

```scss
// Using breakpoints.scss variables
@media (max-width: $bp-medium) {
  .element {
    width: 100%;
  }
}
```

### Improved Breakpoint Utilities

```scss
// Using new breakpoint utility mixins
@include bp.down('medium') {
  .element {
    width: 100%;
  }
}

// Or with custom value
@include bp.between('small', 'medium') {
  .element {
    width: 90%;
  }
}

// Or with additional options
@include bp.responsive(
  (small: 100%, medium: 90%, large: 80%)
) {
  .element {
    width: var(--value);
  }
}
```

## Component Token System

In `_tokens.scss`, we'll organize component tokens like this:

```scss
////////////////////////////////////
// COMPONENT TOKENS
////////////////////////////////////

// Organized by component type
$component-tokens: (
  // Header component
  'header': (
    'padding': map.get($spacing-scale, '6'),
    'background': map.get(map.get($theme-colors, 'sage'), 'light'),
    'title': (
      'color': map.get(map.get($theme-colors, 'sage'), 'base'),
      'font-size': map.get($type-scale, '7'),
      'margin-bottom': map.get($spacing-scale, '4'),
    ),
    'subtitle': (
      'color': map.get(map.get($theme-colors, 'coral'), 'base'),
      'font-size': map.get($type-scale, '5'),
    )
  ),
  
  // Card component
  'card': (
    'padding': map.get($spacing-scale, '5'),
    'background': #ffffff,
    'border-radius': map.get($border-radius, 'lg'),
    'shadow': map.get($shadows, 'md'),
  ),
  
  // Button component
  'button': (
    'padding-x': map.get($spacing-scale, '4'),
    'padding-y': map.get($spacing-scale, '2'),
    'border-radius': map.get($border-radius, 'md'),
    'primary': (
      'background': map.get(map.get($theme-colors, 'sage'), 'base'),
      'color': #ffffff,
      'hover-background': map.get(map.get($theme-colors, 'sage'), 'dark'),
    ),
    'secondary': (
      'background': map.get(map.get($theme-colors, 'coral'), 'base'),
      'color': #ffffff,
      'hover-background': map.get(map.get($theme-colors, 'coral'), 'dark'),
    )
  )
);

// Component token access function
@function component($component, $property, $variant: null) {
  @if $variant == null {
    @return map.get(map.get($component-tokens, $component), $property);
  } @else {
    @return map.get(map.get(map.get($component-tokens, $component), $property), $variant);
  }
}
```

Then components would use this system:

```scss
// src/components/content/Header/header.scss
@use "../../../sass/tokens" as tokens;
@use "../../../sass/mixins" as mix;

.header {
  padding: tokens.component('header', 'padding');
  background-color: tokens.component('header', 'background');
  
  &__title {
    color: tokens.component('header', 'title', 'color');
    font-size: tokens.component('header', 'title', 'font-size');
    margin-bottom: tokens.component('header', 'title', 'margin-bottom');
  }
  
  &__subtitle {
    color: tokens.component('header', 'subtitle', 'color');
    font-size: tokens.component('header', 'subtitle', 'font-size');
  }
}
```

This approach would dramatically simplify component styling while maintaining design consistency.
