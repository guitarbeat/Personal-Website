# Enhanced Typography System Specification

## Overview

This document outlines the specifications for the enhanced typography system to be implemented as part of Phase 2 of the SASS Variable Standardization project. The goal is to create a comprehensive, consistent, and responsive typography system that can be used across all components.

## Core Principles

1. **Hierarchy**: Establish clear typographic hierarchy for better visual organization
2. **Consistency**: Provide a consistent approach to typography throughout the UI
3. **Responsiveness**: Adapt typography based on viewport size
4. **Readability**: Ensure text is readable across all devices and contexts
5. **Flexibility**: Allow for different typography needs in different contexts

## Type Scale

### Base Scale

The type scale will use a modular ratio of 1.25 (major third) to create a harmonious progression of sizes. The base size will be 1rem (16px).

```scss
$type-scale: (
  '1': 0.64rem,    // 10.24px (1rem / 1.25^2)
  '2': 0.8rem,     // 12.8px (1rem / 1.25)
  '3': 1rem,       // 16px (base)
  '4': 1.25rem,    // 20px (1rem * 1.25)
  '5': 1.563rem,   // 25px (1rem * 1.25^2)
  '6': 1.953rem,   // 31.25px (1rem * 1.25^3)
  '7': 2.441rem,   // 39.06px (1rem * 1.25^4)
  '8': 3.052rem,   // 48.83px (1rem * 1.25^5)
  '9': 3.815rem,   // 61.04px (1rem * 1.25^6)
);
```

### Semantic Type Scale

In addition to the numeric scale, we'll define semantic type sizes for common UI patterns:

```scss
$semantic-type-scale: (
  'xs': map.get($type-scale, '1'),
  'sm': map.get($type-scale, '2'),
  'base': map.get($type-scale, '3'),
  'md': map.get($type-scale, '4'),
  'lg': map.get($type-scale, '5'),
  'xl': map.get($type-scale, '6'),
  'xxl': map.get($type-scale, '7'),
  'xxxl': map.get($type-scale, '8'),
  'display': map.get($type-scale, '9'),
);
```

## Typography Roles

### Heading Styles

```scss
$heading-styles: (
  'h1': (
    'font-size': map.get($type-scale, '8'),
    'font-weight': map.get($font-weights, 'bold'),
    'line-height': 1.2,
    'letter-spacing': -0.02em,
    'margin-top': map.get($spacing-scale, '6'),
    'margin-bottom': map.get($spacing-scale, '4'),
  ),
  'h2': (
    'font-size': map.get($type-scale, '7'),
    'font-weight': map.get($font-weights, 'bold'),
    'line-height': 1.2,
    'letter-spacing': -0.01em,
    'margin-top': map.get($spacing-scale, '6'),
    'margin-bottom': map.get($spacing-scale, '3'),
  ),
  'h3': (
    'font-size': map.get($type-scale, '6'),
    'font-weight': map.get($font-weights, 'semibold'),
    'line-height': 1.3,
    'letter-spacing': 0,
    'margin-top': map.get($spacing-scale, '5'),
    'margin-bottom': map.get($spacing-scale, '3'),
  ),
  'h4': (
    'font-size': map.get($type-scale, '5'),
    'font-weight': map.get($font-weights, 'semibold'),
    'line-height': 1.4,
    'letter-spacing': 0,
    'margin-top': map.get($spacing-scale, '4'),
    'margin-bottom': map.get($spacing-scale, '2'),
  ),
  'h5': (
    'font-size': map.get($type-scale, '4'),
    'font-weight': map.get($font-weights, 'semibold'),
    'line-height': 1.4,
    'letter-spacing': 0,
    'margin-top': map.get($spacing-scale, '4'),
    'margin-bottom': map.get($spacing-scale, '2'),
  ),
  'h6': (
    'font-size': map.get($type-scale, '3'),
    'font-weight': map.get($font-weights, 'semibold'),
    'line-height': 1.4,
    'letter-spacing': 0,
    'margin-top': map.get($spacing-scale, '4'),
    'margin-bottom': map.get($spacing-scale, '2'),
  ),
);
```

### Text Styles

```scss
$text-styles: (
  'body': (
    'font-size': map.get($type-scale, '3'),
    'font-weight': map.get($font-weights, 'regular'),
    'line-height': 1.5,
    'letter-spacing': 0,
    'margin-bottom': map.get($spacing-scale, '4'),
  ),
  'body-large': (
    'font-size': map.get($type-scale, '4'),
    'font-weight': map.get($font-weights, 'regular'),
    'line-height': 1.5,
    'letter-spacing': 0,
    'margin-bottom': map.get($spacing-scale, '4'),
  ),
  'body-small': (
    'font-size': map.get($type-scale, '2'),
    'font-weight': map.get($font-weights, 'regular'),
    'line-height': 1.5,
    'letter-spacing': 0,
    'margin-bottom': map.get($spacing-scale, '3'),
  ),
  'caption': (
    'font-size': map.get($type-scale, '1'),
    'font-weight': map.get($font-weights, 'regular'),
    'line-height': 1.5,
    'letter-spacing': 0.01em,
    'margin-bottom': map.get($spacing-scale, '2'),
  ),
  'label': (
    'font-size': map.get($type-scale, '2'),
    'font-weight': map.get($font-weights, 'medium'),
    'line-height': 1.4,
    'letter-spacing': 0.01em,
    'margin-bottom': map.get($spacing-scale, '1'),
  ),
  'button': (
    'font-size': map.get($type-scale, '3'),
    'font-weight': map.get($font-weights, 'semibold'),
    'line-height': 1.4,
    'letter-spacing': 0.01em,
  ),
  'overline': (
    'font-size': map.get($type-scale, '1'),
    'font-weight': map.get($font-weights, 'medium'),
    'line-height': 1.4,
    'letter-spacing': 0.05em,
    'text-transform': uppercase,
    'margin-bottom': map.get($spacing-scale, '1'),
  ),
);
```

## Responsive Typography

### Fluid Typography

We'll implement fluid typography that scales based on viewport size using the `clamp()` function:

```scss
$fluid-typography: (
  'h1': (
    'min': map.get($type-scale, '6'),
    'max': map.get($type-scale, '8'),
  ),
  'h2': (
    'min': map.get($type-scale, '5'),
    'max': map.get($type-scale, '7'),
  ),
  'h3': (
    'min': map.get($type-scale, '4'),
    'max': map.get($type-scale, '6'),
  ),
  'h4': (
    'min': map.get($type-scale, '3'),
    'max': map.get($type-scale, '5'),
  ),
  'body': (
    'min': map.get($type-scale, '2'),
    'max': map.get($type-scale, '3'),
  ),
  'body-large': (
    'min': map.get($type-scale, '3'),
    'max': map.get($type-scale, '4'),
  ),
);
```

### Breakpoint-Based Typography

For cases where fluid typography isn't appropriate, we'll define breakpoint-based typography:

```scss
$responsive-typography: (
  'h1': (
    'mobile': map.get($type-scale, '6'),
    'tablet': map.get($type-scale, '7'),
    'desktop': map.get($type-scale, '8'),
  ),
  'h2': (
    'mobile': map.get($type-scale, '5'),
    'tablet': map.get($type-scale, '6'),
    'desktop': map.get($type-scale, '7'),
  ),
  'h3': (
    'mobile': map.get($type-scale, '4'),
    'tablet': map.get($type-scale, '5'),
    'desktop': map.get($type-scale, '6'),
  ),
);
```

## Vertical Rhythm

### Base Line Height

The base line height will be 1.5, which provides good readability for body text.

### Vertical Spacing

We'll use a consistent approach to vertical spacing based on the base line height:

```scss
$vertical-rhythm: (
  'base': 1.5rem,  // Base line height (1.5 * 1rem)
  'half': 0.75rem, // Half line height
  'double': 3rem,  // Double line height
);
```

## Functions and Mixins

### Typography Functions

```scss
// Get a value from the type scale
@function type-scale($size) {
  @return map.get($type-scale, $size);
}

// Get a semantic type size
@function semantic-type($size) {
  @return map.get($semantic-type-scale, $size);
}

// Get a heading style property
@function heading-style($level, $property) {
  @return map.get(map.get($heading-styles, $level), $property);
}

// Get a text style property
@function text-style($style, $property) {
  @return map.get(map.get($text-styles, $style), $property);
}

// Get a fluid typography value
@function fluid-type($style, $property) {
  @return map.get(map.get($fluid-typography, $style), $property);
}

// Get a responsive typography value
@function responsive-type($style, $breakpoint) {
  @return map.get(map.get($responsive-typography, $style), $breakpoint);
}

// Get a vertical rhythm value
@function vertical-rhythm($size) {
  @return map.get($vertical-rhythm, $size);
}
```

### Typography Mixins

```scss
// Apply heading styles
@mixin heading($level) {
  font-size: heading-style($level, 'font-size');
  font-weight: heading-style($level, 'font-weight');
  line-height: heading-style($level, 'line-height');
  letter-spacing: heading-style($level, 'letter-spacing');
  margin-top: heading-style($level, 'margin-top');
  margin-bottom: heading-style($level, 'margin-bottom');
}

// Apply text styles
@mixin text($style) {
  font-size: text-style($style, 'font-size');
  font-weight: text-style($style, 'font-weight');
  line-height: text-style($style, 'line-height');
  letter-spacing: text-style($style, 'letter-spacing');
  
  @if map.has-key(map.get($text-styles, $style), 'margin-bottom') {
    margin-bottom: text-style($style, 'margin-bottom');
  }
  
  @if map.has-key(map.get($text-styles, $style), 'text-transform') {
    text-transform: text-style($style, 'text-transform');
  }
}

// Apply fluid typography
@mixin fluid-type($style) {
  font-size: clamp(
    fluid-type($style, 'min'),
    calc(1rem + 2vw),
    fluid-type($style, 'max')
  );
}

// Apply responsive typography
@mixin responsive-type($style) {
  font-size: responsive-type($style, 'mobile');
  
  @include bp.respond('tablet') {
    font-size: responsive-type($style, 'tablet');
  }
  
  @include bp.respond('desktop') {
    font-size: responsive-type($style, 'desktop');
  }
}
```

## Utility Classes

We'll create utility classes for common typography needs:

```scss
// Heading utilities
.h1 { @include heading('h1'); }
.h2 { @include heading('h2'); }
.h3 { @include heading('h3'); }
.h4 { @include heading('h4'); }
.h5 { @include heading('h5'); }
.h6 { @include heading('h6'); }

// Text utilities
.body { @include text('body'); }
.body-large { @include text('body-large'); }
.body-small { @include text('body-small'); }
.caption { @include text('caption'); }
.label { @include text('label'); }
.button-text { @include text('button'); }
.overline { @include text('overline'); }

// Font weight utilities
.font-light { font-weight: map.get($font-weights, 'light'); }
.font-regular { font-weight: map.get($font-weights, 'regular'); }
.font-medium { font-weight: map.get($font-weights, 'medium'); }
.font-semibold { font-weight: map.get($font-weights, 'semibold'); }
.font-bold { font-weight: map.get($font-weights, 'bold'); }

// Text alignment utilities
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

## Usage Guidelines

### When to Use Different Typography Roles

#### Headings

- Use `h1` for page titles
- Use `h2` for major section headings
- Use `h3` for subsection headings
- Use `h4`, `h5`, and `h6` for lower-level headings

#### Body Text

- Use `body` for standard paragraph text
- Use `body-large` for emphasized text or introductory paragraphs
- Use `body-small` for secondary text or notes

#### Special Text

- Use `caption` for image captions or supplementary text
- Use `label` for form labels or small headers
- Use `button` for button text
- Use `overline` for category labels or small uppercase text

### Responsive Typography Guidelines

- Use fluid typography for headings and large text that should scale smoothly with viewport size
- Use breakpoint-based typography for text that should change at specific breakpoints
- Ensure text remains readable at all viewport sizes (minimum 16px for body text)

### Vertical Rhythm Guidelines

- Maintain consistent spacing between text elements based on the base line height
- Use margin-bottom rather than margin-top for spacing between text elements (except for headings)
- Align text to the baseline grid where possible

## Implementation Plan

### Phase 1: Core System

1. Update `_tokens.scss` with the new type scale, typography roles, and responsive typography
2. Create functions for accessing typography values
3. Create mixins for applying typography styles

### Phase 2: Utility Classes

1. Create utility classes for common typography needs
2. Document usage guidelines

### Phase 3: Component Updates

1. Update component styles to use the new typography system
2. Ensure consistency across similar components

### Phase 4: Documentation

1. Create comprehensive documentation for the typography system
2. Provide examples and usage guidelines
