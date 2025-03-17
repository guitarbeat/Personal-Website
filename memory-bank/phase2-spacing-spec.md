# Enhanced Spacing System Specification

## Overview
This document outlines the specifications for the enhanced spacing system to be implemented as part of Phase 2 of the SASS Variable Standardization project. The goal is to create a more structured, consistent, and flexible spacing system that can be used across all components.

## Core Principles
1. **Consistency**: Provide a consistent approach to spacing throughout the UI
2. **Flexibility**: Allow for different spacing needs in different contexts
3. **Responsiveness**: Adapt spacing based on viewport size
4. **Maintainability**: Make it easy to update and maintain spacing values
5. **Usability**: Provide clear guidelines for when to use different spacing values

## Spacing Scale

### Base Scale
The base spacing scale will use a non-linear progression to provide more precision at smaller sizes and more flexibility at larger sizes. The scale will be based on a 4px unit (0.25rem) and follow a modified power-of-two progression.

```scss
$spacing-scale: (
  '0': 0,                // 0px
  '1': 0.25rem,          // 4px
  '2': 0.5rem,           // 8px
  '3': 0.75rem,          // 12px
  '4': 1rem,             // 16px
  '5': 1.5rem,           // 24px
  '6': 2rem,             // 32px
  '7': 2.5rem,           // 40px
  '8': 3rem,             // 48px
  '9': 4rem,             // 64px
  '10': 5rem,            // 80px
  '11': 6rem,            // 96px
  '12': 8rem,            // 128px
);
```

### Semantic Spacing
In addition to the numeric scale, we'll define semantic spacing tokens for common UI patterns:

```scss
$semantic-spacing: (
  'none': map.get($spacing-scale, '0'),
  'xs': map.get($spacing-scale, '1'),
  'sm': map.get($spacing-scale, '2'),
  'md': map.get($spacing-scale, '4'),
  'lg': map.get($spacing-scale, '6'),
  'xl': map.get($spacing-scale, '8'),
  'xxl': map.get($spacing-scale, '10'),
);
```

### Component-Specific Spacing
We'll define spacing tokens for specific UI components to ensure consistency across similar elements:

```scss
$component-spacing: (
  'card': (
    'padding': map.get($spacing-scale, '5'),
    'gap': map.get($spacing-scale, '4'),
    'margin': map.get($spacing-scale, '5'),
  ),
  'form': (
    'field-gap': map.get($spacing-scale, '4'),
    'label-gap': map.get($spacing-scale, '2'),
    'group-gap': map.get($spacing-scale, '6'),
  ),
  'button': (
    'padding-x': map.get($spacing-scale, '4'),
    'padding-y': map.get($spacing-scale, '2'),
    'gap': map.get($spacing-scale, '2'),
  ),
  'section': (
    'padding': map.get($spacing-scale, '6'),
    'margin': map.get($spacing-scale, '8'),
    'gap': map.get($spacing-scale, '6'),
  ),
  'container': (
    'padding-x': map.get($spacing-scale, '4'),
    'padding-y': map.get($spacing-scale, '6'),
  ),
  'tool': (
    'padding': map.get($spacing-scale, '6'),
    'gap': map.get($spacing-scale, '5'),
    'section-gap': map.get($spacing-scale, '8'),
  ),
);
```

### Responsive Spacing
We'll define responsive spacing that adjusts based on viewport size:

```scss
$responsive-spacing: (
  'container-padding': (
    'mobile': map.get($spacing-scale, '3'),
    'tablet': map.get($spacing-scale, '4'),
    'desktop': map.get($spacing-scale, '5'),
  ),
  'section-gap': (
    'mobile': map.get($spacing-scale, '6'),
    'tablet': map.get($spacing-scale, '8'),
    'desktop': map.get($spacing-scale, '10'),
  ),
  'card-padding': (
    'mobile': map.get($spacing-scale, '4'),
    'tablet': map.get($spacing-scale, '5'),
    'desktop': map.get($spacing-scale, '5'),
  ),
);
```

## Functions and Mixins

### Spacing Function
```scss
// Get a value from the spacing scale
@function spacing($size) {
  @return map.get($spacing-scale, $size);
}

// Get a semantic spacing value
@function semantic-spacing($size) {
  @return map.get($semantic-spacing, $size);
}

// Get a component-specific spacing value
@function component-spacing($component, $property) {
  @return map.get(map.get($component-spacing, $component), $property);
}

// Get a responsive spacing value
@function responsive-spacing($property, $breakpoint) {
  @return map.get(map.get($responsive-spacing, $property), $breakpoint);
}
```

### Spacing Mixins
```scss
// Apply padding to an element
@mixin padding($size) {
  padding: spacing($size);
}

// Apply horizontal padding to an element
@mixin padding-x($size) {
  padding-left: spacing($size);
  padding-right: spacing($size);
}

// Apply vertical padding to an element
@mixin padding-y($size) {
  padding-top: spacing($size);
  padding-bottom: spacing($size);
}

// Apply margin to an element
@mixin margin($size) {
  margin: spacing($size);
}

// Apply horizontal margin to an element
@mixin margin-x($size) {
  margin-left: spacing($size);
  margin-right: spacing($size);
}

// Apply vertical margin to an element
@mixin margin-y($size) {
  margin-top: spacing($size);
  margin-bottom: spacing($size);
}

// Apply gap to a flex or grid container
@mixin gap($size) {
  gap: spacing($size);
}
```

## Utility Classes
We'll create utility classes for common spacing needs:

```scss
// Padding utilities
.p-0 { padding: spacing('0'); }
.p-1 { padding: spacing('1'); }
.p-2 { padding: spacing('2'); }
.p-3 { padding: spacing('3'); }
.p-4 { padding: spacing('4'); }
.p-5 { padding: spacing('5'); }
.p-6 { padding: spacing('6'); }

// Margin utilities
.m-0 { margin: spacing('0'); }
.m-1 { margin: spacing('1'); }
.m-2 { margin: spacing('2'); }
.m-3 { margin: spacing('3'); }
.m-4 { margin: spacing('4'); }
.m-5 { margin: spacing('5'); }
.m-6 { margin: spacing('6'); }

// Gap utilities
.gap-0 { gap: spacing('0'); }
.gap-1 { gap: spacing('1'); }
.gap-2 { gap: spacing('2'); }
.gap-3 { gap: spacing('3'); }
.gap-4 { gap: spacing('4'); }
.gap-5 { gap: spacing('5'); }
.gap-6 { gap: spacing('6'); }
```

## Usage Guidelines

### When to Use Different Spacing Values

#### Micro Spacing (0-2)
- Use for tight spacing between related elements
- Examples: icon and text in a button, items in a dense list

#### Small Spacing (3-4)
- Use for standard spacing between related elements
- Examples: form fields, items in a standard list

#### Medium Spacing (5-6)
- Use for spacing between distinct but related sections
- Examples: card padding, section padding

#### Large Spacing (7-8)
- Use for significant separation between sections
- Examples: section margins, page padding

#### Extra Large Spacing (9-12)
- Use for major layout divisions
- Examples: hero sections, large gaps between major page sections

### Component-Specific Guidelines

#### Cards
- Use `component-spacing('card', 'padding')` for card padding
- Use `component-spacing('card', 'gap')` for spacing between card elements
- Use `component-spacing('card', 'margin')` for spacing between cards

#### Forms
- Use `component-spacing('form', 'field-gap')` for spacing between form fields
- Use `component-spacing('form', 'label-gap')` for spacing between labels and inputs
- Use `component-spacing('form', 'group-gap')` for spacing between form groups

#### Buttons
- Use `component-spacing('button', 'padding-x')` for horizontal button padding
- Use `component-spacing('button', 'padding-y')` for vertical button padding
- Use `component-spacing('button', 'gap')` for spacing between button elements

#### Sections
- Use `component-spacing('section', 'padding')` for section padding
- Use `component-spacing('section', 'margin')` for spacing between sections
- Use `component-spacing('section', 'gap')` for spacing between section elements

### Responsive Spacing Guidelines
- Use responsive spacing for container padding, section gaps, and other layout-related spacing
- Use the appropriate breakpoint value based on the current viewport size

## Implementation Plan

### Phase 1: Core System
1. Update `_tokens.scss` with the new spacing scale, semantic spacing, and component-specific spacing
2. Create functions for accessing spacing values
3. Create mixins for applying spacing

### Phase 2: Utility Classes
1. Create utility classes for common spacing needs
2. Document usage guidelines

### Phase 3: Component Updates
1. Update component styles to use the new spacing system
2. Ensure consistency across similar components

### Phase 4: Documentation
1. Create comprehensive documentation for the spacing system
2. Provide examples and usage guidelines 