# Breakpoints Utility Example

This document shows how we would transform the current `_breakpoints.scss` forwarding file into a more useful utility library.

## Current `_breakpoints.scss`

```scss
/**
 * Breakpoints Forwarding Module
 *
 * This file forwards breakpoint variables from _tokens.scss for backward compatibility.
 * For new code, it's recommended to import the tokens module directly and use the
 * breakpoint map with the breakpoint() function.
 *
 * IMPORTANT: This file does NOT define any breakpoint values - it only forwards
 * values from _tokens.scss to maintain backward compatibility with existing code.
 * All new code should use tokens directly to maintain a single source of truth.
 *
 * @deprecated Consider importing directly from tokens for new components
 */

@use "tokens";

// Re-export breakpoint variables for backward compatibility
// These variables are maintained for existing code but should not be used in new components
$bp-largest: tokens.$bp-largest;
$bp-large: tokens.$bp-large;
$bp-medium: tokens.$bp-medium;
$bp-small: tokens.$bp-small;
$bp-smallest: tokens.$bp-smallest;
$breakpoints: tokens.$breakpoints;
```

## Improved `_breakpoints.scss` Utility Library

```scss
/**
 * Responsive Design Utilities
 *
 * This module provides utility mixins and functions for responsive design,
 * building on top of breakpoint values defined in _tokens.scss.
 *
 * It maintains backward compatibility with legacy variables but provides
 * enhanced functionality through mixins that make responsive design easier.
 *
 * @example
 * ```scss
 * @use "breakpoints" as bp;
 * 
 * // Media query for specific breakpoint and below
 * @include bp.down('medium') {
 *   // Styles for medium breakpoint and below
 * }
 * 
 * // Media query between two breakpoints
 * @include bp.between('small', 'large') {
 *   // Styles for between small and large
 * }
 * 
 * // Responsive property values
 * @include bp.responsive((
 *   'base': 1rem,
 *   'small': 1.25rem,
 *   'medium': 1.5rem,
 *   'large': 2rem
 * )) using ($value) {
 *   font-size: $value;
 * }
 * ```
 */

@use "sass:map";
@use "sass:meta";
@use "tokens" as tokens;

//----------------------------------
// Legacy Variable Forwarding
//----------------------------------

// Re-export breakpoint variables for backward compatibility
// These variables are maintained for existing code but should not be used in new components
$bp-largest: tokens.$bp-largest;
$bp-large: tokens.$bp-large;
$bp-medium: tokens.$bp-medium;
$bp-small: tokens.$bp-small;
$bp-smallest: tokens.$bp-smallest;
$breakpoints: tokens.$breakpoints;

//----------------------------------
// Media Query Mixins
//----------------------------------

/**
 * Generate a media query for screens with width less than or equal to the specified breakpoint
 * @param {String} $breakpoint - The breakpoint name (smallest, small, medium, large, largest)
 */
@mixin down($breakpoint) {
  @if not map.has-key(tokens.$breakpoints, $breakpoint) {
    @error "Breakpoint #{$breakpoint} not found in tokens.$breakpoints";
  }
  
  @media (max-width: map.get(tokens.$breakpoints, $breakpoint)) {
    @content;
  }
}

/**
 * Generate a media query for screens with width greater than the specified breakpoint
 * @param {String} $breakpoint - The breakpoint name (smallest, small, medium, large, largest)
 */
@mixin up($breakpoint) {
  @if not map.has-key(tokens.$breakpoints, $breakpoint) {
    @error "Breakpoint #{$breakpoint} not found in tokens.$breakpoints";
  }
  
  // Add 0.01em to ensure it doesn't overlap with down() at the exact pixel
  @media (min-width: calc(map.get(tokens.$breakpoints, $breakpoint) + 0.01em)) {
    @content;
  }
}

/**
 * Generate a media query for screens with width between two breakpoints
 * @param {String} $min - The minimum breakpoint name
 * @param {String} $max - The maximum breakpoint name
 */
@mixin between($min, $max) {
  @if not map.has-key(tokens.$breakpoints, $min) {
    @error "Minimum breakpoint #{$min} not found in tokens.$breakpoints";
  }
  
  @if not map.has-key(tokens.$breakpoints, $max) {
    @error "Maximum breakpoint #{$max} not found in tokens.$breakpoints";
  }
  
  // Add 0.01em to ensure it doesn't overlap
  @media (min-width: calc(map.get(tokens.$breakpoints, $min) + 0.01em)) and (max-width: map.get(tokens.$breakpoints, $max)) {
    @content;
  }
}

/**
 * Generate a media query for a specific breakpoint only
 * @param {String} $breakpoint - The breakpoint name
 */
@mixin only($breakpoint) {
  @if not map.has-key(tokens.$breakpoints, $breakpoint) {
    @error "Breakpoint #{$breakpoint} not found in tokens.$breakpoints";
  }
  
  $keys: map.keys(tokens.$breakpoints);
  $index: list.index($keys, $breakpoint);
  
  @if $index == 1 {
    // First breakpoint
    @media (max-width: map.get(tokens.$breakpoints, $breakpoint)) {
      @content;
    }
  } @else if $index == length($keys) {
    // Last breakpoint
    @media (min-width: calc(map.get(tokens.$breakpoints, list.nth($keys, $index - 1)) + 0.01em)) {
      @content;
    }
  } @else {
    // Middle breakpoint
    $prev-breakpoint: list.nth($keys, $index - 1);
    @media (min-width: calc(map.get(tokens.$breakpoints, $prev-breakpoint) + 0.01em)) and (max-width: map.get(tokens.$breakpoints, $breakpoint)) {
      @content;
    }
  }
}

//----------------------------------
// Advanced Responsive Utilities
//----------------------------------

/**
 * Apply different styles at different breakpoints
 * @param {Map} $values - Map of breakpoint names to values
 */
@mixin responsive($values) {
  $base-value: map.get($values, 'base');
  
  @if meta.type-of($base-value) == 'null' {
    @error "A base value is required in the responsive map";
  }
  
  // Apply base value without a media query
  @content($base-value);
  
  // Apply breakpoint-specific values with media queries
  @each $breakpoint, $value in $values {
    @if $breakpoint != 'base' {
      @if map.has-key(tokens.$breakpoints, $breakpoint) {
        @include up($breakpoint) {
          @content($value);
        }
      }
    }
  }
}

/**
 * Generate a container that is full width until it reaches a breakpoint
 * @param {String} $breakpoint - The breakpoint at which to constrain width
 * @param {Number} $padding - The padding to apply at smaller screens
 */
@mixin container($breakpoint: 'large', $padding: 1rem) {
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: $padding;
  padding-right: $padding;
  
  @include up($breakpoint) {
    max-width: map.get(tokens.$breakpoints, $breakpoint);
    padding-left: $padding * 2;
    padding-right: $padding * 2;
  }
}

/**
 * Generate a fluid value that scales between two sizes based on viewport width
 * @param {Number} $min-value - The minimum value
 * @param {Number} $max-value - The maximum value
 * @param {String} $min-breakpoint - The minimum breakpoint name
 * @param {String} $max-breakpoint - The maximum breakpoint name
 * @param {String} $property - The CSS property to apply the fluid value to
 */
@mixin fluid-value($min-value, $max-value, $min-breakpoint: 'small', $max-breakpoint: 'large', $property: 'font-size') {
  $min-width: map.get(tokens.$breakpoints, $min-breakpoint);
  $max-width: map.get(tokens.$breakpoints, $max-breakpoint);
  
  // Set the base value
  #{$property}: $min-value;
  
  // Calculate the fluid value using calc and viewport width
  @media (min-width: $min-width) {
    #{$property}: calc(#{$min-value} + #{strip-unit($max-value - $min-value)} * ((100vw - #{$min-width}) / #{strip-unit($max-width - $min-width)}));
  }
  
  // Set the max value
  @media (min-width: $max-width) {
    #{$property}: $max-value;
  }
}

/**
 * Remove the unit from a number
 * @param {Number} $number - The number with a unit
 * @return {Number} The number without a unit
 */
@function strip-unit($number) {
  @if type-of($number) == 'number' and not unitless($number) {
    @return $number / ($number * 0 + 1);
  }
  @return $number;
}
```

This improved version offers significant advantages:

1. **Enhanced Functionality** - Goes beyond simple variable forwarding to provide useful mixins
2. **Backward Compatibility** - Maintains the legacy variables while encouraging new patterns
3. **Error Handling** - Includes proper error messages when breakpoints don't exist
4. **Advanced Features** - Provides fluid scaling, container queries, and responsive value maps
5. **Comprehensive Documentation** - Clear examples show how to use the new utilities

This approach would simplify responsive design across the entire application while maintaining a clear development path from the old system to the new one.
