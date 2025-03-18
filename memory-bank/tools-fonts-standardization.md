# Tools Font Standardization Plan

## Current State Analysis

Current font size usage across card components shows inconsistency:

1. **ToolsSection Cards**:
   - Card title: `1.2rem` (direct value)
   - Card description: `0.9rem` (direct value)

2. **Project Cards**:
   - Card titles: `2rem` (direct value)
   - Mixed font size declarations with no token usage

3. **Work Section**:
   - Uses a mix of direct values and variables
   - No consistent pattern for typography

4. **Bingo Game**:
   - Various font sizes declared directly
   - Responsive adjustments based on breakpoints

5. **Conflict Mediation**:
   - Some button font sizes use tokens: `tokens.font-size('md')`
   - Inconsistent usage across other elements

## Standardization Approach

We've implemented a new system for consistent typography across all card components:

1. **New Card Typography Mixin**:

   ```scss
   @mixin card-typography {
     // Card Title
     h2, .card-title {
       font-size: tokens.font-size('lg'); // 1.25rem (20px)
       font-weight: tokens.font-weight('semibold');
       margin-bottom: tokens.spacing('sm');
     }
     
     h3, .card-subtitle {
       font-size: tokens.font-size('md'); // 1rem (16px)
       font-weight: tokens.font-weight('medium');
       margin-bottom: tokens.spacing('xs');
     }
     
     // Card Description
     p, .card-text {
       font-size: tokens.font-size('md'); // 1rem (16px)
       line-height: 1.5;
     }
     
     // Card Metadata
     .metadata, .card-info, .card-meta {
       font-size: tokens.font-size('sm'); // 0.8rem (13px)
       color: var(--color-text-light);
     }
     
     // Responsive adjustments
     @include respond('small') {
       h2, .card-title {
         font-size: tokens.font-size('md'); // 1rem (16px)
       }
       
       h3, .card-subtitle {
         font-size: tokens.font-size('sm'); // 0.8rem (13px)
       }
       
       p, .card-text {
         font-size: tokens.font-size('sm'); // 0.8rem (13px)
       }
     }
   }
   ```

2. **New Card Container Mixin**:

   ```scss
   @mixin card-container {
     @include glass-effect(12px, 0.15);
     @include clickable;
     @include card-typography;
     
     padding: tokens.spacing('lg');
     border-radius: tokens.radius('md');
     transition: all tokens.transition-duration('normal') tokens.transition-timing('default');
     
     &:hover {
       transform: translateY(-4px);
       box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
     }
   }
   ```

## Implementation Status

1. **Completed**:
   - Created card-typography and card-container mixins in _mixins.scss
   - Implemented in ToolsSection/styles/index.scss
   - Removed styled-components from ToolsSection.js
   - Added comprehensive responsive adjustments

2. **To Be Implemented**:
   - Project Cards
   - Work Items
   - Bingo Game cards
   - Conflict Mediation cards
   - Other card components throughout the site

## Implementation Plan

1. **Phase 1: Primary Components** (Current)
   - Update ToolsSection cards
   - Document typography patterns

2. **Phase 2: Project Specific Components**
   - Update Project cards
   - Update Work items
   - Verify consistent appearance

3. **Phase 3: Tool-Specific Components**
   - Update Bingo Game
   - Update Conflict Mediation
   - Update Snake Game

4. **Phase 4: Testing & Review**
   - Validate responsive behavior
   - Ensure consistent appearance across devices
   - Document final patterns

## Token System Reference

Our typography is built on a modular scale with a ratio of 1.25:

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

$font-sizes: (
  'xxs': map.get($type-scale, '1'),  // 0.64rem / ~10px
  'xs': map.get($type-scale, '2'),   // 0.8rem / ~13px
  'sm': map.get($type-scale, '2'),   // 0.8rem / ~13px
  'md': map.get($type-scale, '3'),   // 1rem / 16px
  'lg': map.get($type-scale, '4'),   // 1.25rem / 20px
  'xl': map.get($type-scale, '5'),   // 1.563rem / ~25px
  'xxl': map.get($type-scale, '6'),  // 1.953rem / ~31px
  'xxxl': map.get($type-scale, '7'), // 2.441rem / ~39px
  'display': map.get($type-scale, '9') // 3.815rem / ~61px
);
```

## Typography Mapping Reference

| UI Element | Token | Size (rem) | Size (px) |
|------------|-------|------------|-----------|
| Card Title (h2) | lg | 1.25rem | 20px |
| Card Subtitle (h3) | md | 1rem | 16px |
| Card Text (p) | md | 1rem | 16px |
| Card Meta | sm | 0.8rem | 13px |
| Button Text | md | 1rem | 16px |
| Large Title | xxl | 1.953rem | 31px |
| Section Title | xl | 1.563rem | 25px |

## Success Criteria

1. All card components use the unified `card-typography` mixin
2. No hardcoded font sizes in card components
3. All components respond consistently to screen size changes
4. Typography has clear hierarchy and readability
5. Documentation is updated with new pattern
