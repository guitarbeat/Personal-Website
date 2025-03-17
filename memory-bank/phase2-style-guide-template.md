# Design Token System Style Guide

## Introduction
This style guide documents the design token system implemented in Phase 2 of the SASS Variable Standardization project. It serves as a reference for developers working on the Personal Website project, ensuring consistent application of spacing, typography, and shadows across all components.

## Table of Contents
1. [Spacing System](#spacing-system)
2. [Typography System](#typography-system)
3. [Shadow System](#shadow-system)
4. [Utility Classes](#utility-classes)
5. [Usage Guidelines](#usage-guidelines)

## Spacing System

### Base Scale
The spacing scale uses a non-linear progression based on a 4px (0.25rem) unit:

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `0` | 0 | 0px | No spacing |
| `1` | 0.25rem | 4px | Micro spacing (icons, tight UI elements) |
| `2` | 0.5rem | 8px | Small spacing (between related items) |
| `3` | 1rem | 16px | Base spacing (general purpose) |
| `4` | 1.5rem | 24px | Medium spacing (between sections) |
| `5` | 2rem | 32px | Large spacing (major sections) |
| `6` | 3rem | 48px | Extra large spacing (page sections) |
| `7` | 4rem | 64px | Huge spacing (page margins) |
| `8` | 6rem | 96px | Giant spacing (hero sections) |

### Semantic Spacing
Semantic tokens map common UI patterns to the base scale:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | spacing('1') | Extra small spacing |
| `sm` | spacing('2') | Small spacing |
| `md` | spacing('3') | Medium spacing |
| `lg` | spacing('4') | Large spacing |
| `xl` | spacing('6') | Extra large spacing |
| `xxl` | spacing('8') | Double extra large spacing |

### Component-Specific Spacing
Component tokens ensure consistent spacing within specific components:

| Component | Property | Value |
|-----------|----------|-------|
| `card` | padding | spacing('4') |
| `card` | gap | spacing('3') |
| `form` | field-gap | spacing('3') |
| `button` | padding-x | spacing('4') |
| `button` | padding-y | spacing('2') |
| `section` | padding | spacing('6') |
| `container` | padding-x | spacing('4') |
| `tool` | padding | spacing('4') |

### Usage Examples

```scss
// Using the spacing function
.element {
  padding: spacing('3');
  margin-bottom: spacing('4');
}

// Using semantic spacing
.element {
  padding: semantic-spacing('md');
  margin-bottom: semantic-spacing('lg');
}

// Using component spacing
.card {
  padding: component-spacing('card', 'padding');
  gap: component-spacing('card', 'gap');
}

// Using spacing mixins
.element {
  @include padding('3');
  @include margin-y('4');
}

// Using utility classes
<div class="p-3 mb-4 gap-2"></div>
```

## Typography System

### Type Scale
The type scale uses a modular ratio of 1.25 (major third):

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 0.64rem | Micro text (10px) |
| `2` | 0.8rem | Small text (13px) |
| `3` | 1rem | Base text (16px) |
| `4` | 1.25rem | Large text (20px) |
| `5` | 1.563rem | Heading text (25px) |
| `6` | 1.953rem | Subheading text (31px) |
| `7` | 2.441rem | Title text (39px) |
| `8` | 3.052rem | Display text (49px) |
| `9` | 3.815rem | Hero text (61px) |

### Semantic Type Scale
Semantic tokens map common UI patterns to the type scale:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | type-scale('1') | Extra small text |
| `sm` | type-scale('2') | Small text |
| `md` | type-scale('3') | Medium text |
| `lg` | type-scale('4') | Large text |
| `xl` | type-scale('6') | Extra large text |
| `xxl` | type-scale('7') | Double extra large text |
| `xxxl` | type-scale('8') | Triple extra large text |
| `display` | type-scale('9') | Display text |

### Typography Roles
Typography roles define consistent styles for common text elements:

#### Headings
| Role | Properties |
|------|------------|
| `h1` | font-size: type-scale('8'), font-weight: 700, line-height: 1.2 |
| `h2` | font-size: type-scale('7'), font-weight: 700, line-height: 1.2 |
| `h3` | font-size: type-scale('6'), font-weight: 600, line-height: 1.3 |
| `h4` | font-size: type-scale('5'), font-weight: 600, line-height: 1.4 |
| `h5` | font-size: type-scale('4'), font-weight: 600, line-height: 1.4 |
| `h6` | font-size: type-scale('3'), font-weight: 600, line-height: 1.4 |

#### Text Styles
| Role | Properties |
|------|------------|
| `body` | font-size: type-scale('3'), font-weight: 400, line-height: 1.5 |
| `body-large` | font-size: type-scale('4'), font-weight: 400, line-height: 1.5 |
| `body-small` | font-size: type-scale('2'), font-weight: 400, line-height: 1.5 |
| `caption` | font-size: type-scale('1'), font-weight: 400, line-height: 1.5 |
| `label` | font-size: type-scale('2'), font-weight: 500, line-height: 1.4 |
| `button` | font-size: type-scale('3'), font-weight: 600, line-height: 1.4 |
| `overline` | font-size: type-scale('2'), font-weight: 500, line-height: 1.4, text-transform: uppercase |

### Usage Examples

```scss
// Using the type scale function
.element {
  font-size: type-scale('3');
}

// Using semantic type
.element {
  font-size: semantic-type('md');
}

// Using typography mixins
.heading {
  @include heading('h2');
}

.text {
  @include text('body');
}

// Using fluid typography
.responsive-heading {
  @include fluid-type('h1');
}

// Using utility classes
<h2 class="h2 text-center font-bold"></h2>
<p class="body-large mb-4"></p>
```

## Shadow System

### Elevation Shadows
Elevation shadows create consistent depth across the UI:

| Level | Light Theme | Dark Theme | Usage |
|-------|-------------|------------|-------|
| `0` | none | none | Flat elements |
| `1` | 0 1px 3px rgba(0,0,0,0.12) | 0 1px 3px rgba(0,0,0,0.3) | Subtle elevation |
| `2` | 0 3px 6px rgba(0,0,0,0.15) | 0 3px 6px rgba(0,0,0,0.4) | Cards, buttons |
| `3` | 0 10px 20px rgba(0,0,0,0.15) | 0 10px 20px rgba(0,0,0,0.4) | Dropdowns, popovers |
| `4` | 0 14px 28px rgba(0,0,0,0.2) | 0 14px 28px rgba(0,0,0,0.5) | Modals, dialogs |
| `5` | 0 19px 38px rgba(0,0,0,0.25) | 0 19px 38px rgba(0,0,0,0.6) | Highest elevation |

### Component Shadows
Component-specific shadows ensure consistent styling:

| Component | Light Theme | Dark Theme |
|-----------|-------------|------------|
| `card` | elevation-shadow('2') | elevation-shadow('2') |
| `dropdown` | elevation-shadow('3') | elevation-shadow('3') |
| `modal` | elevation-shadow('4') | elevation-shadow('4') |
| `toast` | elevation-shadow('3') | elevation-shadow('3') |
| `button` | elevation-shadow('1') | elevation-shadow('1') |
| `button-hover` | elevation-shadow('2') | elevation-shadow('2') |

### Interactive Shadows
Shadows for interactive states:

| State | Light Theme | Dark Theme |
|-------|-------------|------------|
| `hover` | 0 5px 15px rgba(0,0,0,0.1) | 0 5px 15px rgba(0,0,0,0.3) |
| `active` | 0 2px 5px rgba(0,0,0,0.1) | 0 2px 5px rgba(0,0,0,0.3) |
| `focus` | 0 0 0 2px rgba(var(--color-primary-rgb), 0.2) | 0 0 0 2px rgba(var(--color-primary-rgb), 0.4) |

### Usage Examples

```scss
// Using shadow functions
.element {
  box-shadow: shadow-value('2');
}

// Using shadow mixins
.card {
  @include elevation-shadow('2');
}

.button {
  @include component-shadow('button');
  
  &:hover {
    @include state-shadow('hover');
  }
  
  &:active {
    @include state-shadow('active');
  }
}

// Using interactive shadows
.interactive-element {
  @include interactive-shadow('1');
}

// Using utility classes
<div class="shadow-2 hover-shadow"></div>
<button class="shadow-button interactive-shadow"></button>
```

## Utility Classes

### Spacing Utilities
| Class | Property | Example |
|-------|----------|---------|
| `p-{0-6}` | padding | `p-3` |
| `px-{0-6}` | padding-left, padding-right | `px-3` |
| `py-{0-6}` | padding-top, padding-bottom | `py-2` |
| `pt-{0-6}` | padding-top | `pt-4` |
| `pr-{0-6}` | padding-right | `pr-2` |
| `pb-{0-6}` | padding-bottom | `pb-3` |
| `pl-{0-6}` | padding-left | `pl-2` |
| `m-{0-6}` | margin | `m-3` |
| `mx-{0-6}` | margin-left, margin-right | `mx-3` |
| `my-{0-6}` | margin-top, margin-bottom | `my-2` |
| `mt-{0-6}` | margin-top | `mt-4` |
| `mr-{0-6}` | margin-right | `mr-2` |
| `mb-{0-6}` | margin-bottom | `mb-3` |
| `ml-{0-6}` | margin-left | `ml-2` |
| `gap-{0-6}` | gap | `gap-2` |

### Typography Utilities
| Class | Property | Example |
|-------|----------|---------|
| `h1` - `h6` | heading styles | `h2` |
| `body`, `body-large`, `body-small` | text styles | `body` |
| `caption`, `label`, `button-text`, `overline` | text styles | `caption` |
| `font-light`, `font-regular`, `font-medium`, `font-semibold`, `font-bold` | font-weight | `font-medium` |
| `text-left`, `text-center`, `text-right`, `text-justify` | text-align | `text-center` |
| `text-uppercase`, `text-lowercase`, `text-capitalize` | text-transform | `text-uppercase` |

### Shadow Utilities
| Class | Property | Example |
|-------|----------|---------|
| `shadow-{0-5}` | elevation shadow | `shadow-2` |
| `shadow-card`, `shadow-dropdown`, `shadow-modal` | component shadow | `shadow-card` |
| `hover-shadow`, `active-shadow` | interactive shadow | `hover-shadow` |
| `interactive-shadow` | combined interactive shadows | `interactive-shadow` |

## Usage Guidelines

### When to Use Tokens vs. Utility Classes

#### Use Tokens in SCSS When:
- Building complex components with many related styles
- Creating variations of components
- Implementing custom styling that doesn't fit utility classes
- Needing fine-grained control over styles

```scss
.custom-card {
  padding: spacing('4');
  margin-bottom: spacing('5');
  
  .card-title {
    @include heading('h3');
    margin-bottom: spacing('2');
  }
  
  .card-content {
    @include text('body');
  }
  
  &:hover {
    @include elevation-shadow('3');
  }
}
```

#### Use Utility Classes in HTML When:
- Making small adjustments to spacing or typography
- Creating one-off styling needs
- Prototyping layouts quickly
- Avoiding writing custom CSS for simple styling

```html
<div class="p-4 mb-5 shadow-2 hover-shadow">
  <h3 class="h3 mb-2">Card Title</h3>
  <p class="body">Card content goes here...</p>
</div>
```

### Responsive Design
- Use the responsive utilities for adapting to different screen sizes
- Consider fluid typography for headings and important text
- Use responsive spacing for layout adjustments

```scss
// In SCSS
.responsive-element {
  @include responsive-type('h1');
  
  @include bp.respond('tablet') {
    padding: spacing('4');
  }
  
  @include bp.respond('mobile') {
    padding: spacing('3');
  }
}

// In HTML with utility classes
<div class="p-3 p-tablet-4 p-desktop-5">
  <h1 class="fluid-h1">Responsive Heading</h1>
</div>
```

### Accessibility Considerations
- Ensure sufficient color contrast using the theme color system
- Maintain readable font sizes (minimum 16px for body text)
- Use appropriate line heights for readability
- Implement proper spacing for touch targets (minimum 44px) 