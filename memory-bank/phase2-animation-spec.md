# Enhanced Animation System Specification

## Overview

This document outlines the specifications for the enhanced animation system to be implemented as part of Phase 2 of the SASS Variable Standardization project. The goal is to create a comprehensive, consistent, and performant animation system that can be used across all components.

## Core Principles

1. **Consistency**: Provide a consistent approach to animations throughout the UI
2. **Performance**: Ensure animations are performant and don't cause layout thrashing
3. **Accessibility**: Respect user preferences for reduced motion
4. **Flexibility**: Allow for different animation needs in different contexts
5. **Maintainability**: Make it easy to update and maintain animations

## Animation Duration Scale

The animation duration scale provides a range of standardized durations for different types of animations:

```scss
$animation-durations: (
  'instant': 0ms,
  'ultra-fast': 100ms,
  'fast': 200ms,
  'normal': 300ms,
  'slow': 500ms,
  'slower': 700ms,
  'slowest': 1000ms
);
```

## Animation Easing Functions

The animation easing functions provide a range of standardized easing curves for different types of animations:

```scss
$animation-easings: (
  'linear': linear,
  'ease': ease,
  'ease-in': ease-in,
  'ease-out': ease-out,
  'ease-in-out': ease-in-out,
  'standard': cubic-bezier(0.4, 0.0, 0.2, 1), // Material Design standard
  'decelerate': cubic-bezier(0.0, 0.0, 0.2, 1), // Exiting elements, entering elements
  'accelerate': cubic-bezier(0.4, 0.0, 1, 1),   // Exiting elements
  'sharp': cubic-bezier(0.4, 0.0, 0.6, 1),      // Elements that may return to the screen
  'bounce': cubic-bezier(0.34, 1.56, 0.64, 1)   // Emphasis animations
);
```

## Animation Types

### Transition Animations

Simple animations for state changes:

```scss
$transition-animations: (
  'fade': (
    'property': opacity,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'scale': (
    'property': transform,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'slide-up': (
    'property': transform,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'slide-down': (
    'property': transform,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'slide-left': (
    'property': transform,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'slide-right': (
    'property': transform,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'color': (
    'property': color,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'background': (
    'property': background-color,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'shadow': (
    'property': box-shadow,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  ),
  'border': (
    'property': border-color,
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard')
  )
);
```

### Keyframe Animations

Complex animations for more elaborate effects:

```scss
$keyframe-animations: (
  'fade-in': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard'),
    'keyframes': (
      '0%': (
        'opacity': 0
      ),
      '100%': (
        'opacity': 1
      )
    )
  ),
  'fade-out': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'standard'),
    'keyframes': (
      '0%': (
        'opacity': 1
      ),
      '100%': (
        'opacity': 0
      )
    )
  ),
  'slide-in-up': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'decelerate'),
    'keyframes': (
      '0%': (
        'transform': 'translateY(20px)',
        'opacity': 0
      ),
      '100%': (
        'transform': 'translateY(0)',
        'opacity': 1
      )
    )
  ),
  'slide-in-down': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'decelerate'),
    'keyframes': (
      '0%': (
        'transform': 'translateY(-20px)',
        'opacity': 0
      ),
      '100%': (
        'transform': 'translateY(0)',
        'opacity': 1
      )
    )
  ),
  'slide-in-left': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'decelerate'),
    'keyframes': (
      '0%': (
        'transform': 'translateX(-20px)',
        'opacity': 0
      ),
      '100%': (
        'transform': 'translateX(0)',
        'opacity': 1
      )
    )
  ),
  'slide-in-right': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'decelerate'),
    'keyframes': (
      '0%': (
        'transform': 'translateX(20px)',
        'opacity': 0
      ),
      '100%': (
        'transform': 'translateX(0)',
        'opacity': 1
      )
    )
  ),
  'scale-in': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'bounce'),
    'keyframes': (
      '0%': (
        'transform': 'scale(0.8)',
        'opacity': 0
      ),
      '100%': (
        'transform': 'scale(1)',
        'opacity': 1
      )
    )
  ),
  'scale-out': (
    'duration': map.get($animation-durations, 'normal'),
    'easing': map.get($animation-easings, 'accelerate'),
    'keyframes': (
      '0%': (
        'transform': 'scale(1)',
        'opacity': 1
      ),
      '100%': (
        'transform': 'scale(0.8)',
        'opacity': 0
      )
    )
  ),
  'pulse': (
    'duration': map.get($animation-durations, 'slow'),
    'easing': map.get($animation-easings, 'ease-in-out'),
    'keyframes': (
      '0%': (
        'transform': 'scale(1)'
      ),
      '50%': (
        'transform': 'scale(1.05)'
      ),
      '100%': (
        'transform': 'scale(1)'
      )
    )
  ),
  'bounce': (
    'duration': map.get($animation-durations, 'slow'),
    'easing': map.get($animation-easings, 'bounce'),
    'keyframes': (
      '0%, 20%, 50%, 80%, 100%': (
        'transform': 'translateY(0)'
      ),
      '40%': (
        'transform': 'translateY(-20px)'
      ),
      '60%': (
        'transform': 'translateY(-10px)'
      )
    )
  ),
  'spin': (
    'duration': map.get($animation-durations, 'slow'),
    'easing': map.get($animation-easings, 'linear'),
    'keyframes': (
      '0%': (
        'transform': 'rotate(0deg)'
      ),
      '100%': (
        'transform': 'rotate(360deg)'
      )
    )
  )
);
```

## Component-Specific Animations

```scss
$component-animations: (
  'button': (
    'hover': (
      'transform': 'scale(1.05)',
      'duration': map.get($animation-durations, 'fast'),
      'easing': map.get($animation-easings, 'bounce')
    ),
    'active': (
      'transform': 'scale(0.98)',
      'duration': map.get($animation-durations, 'ultra-fast'),
      'easing': map.get($animation-easings, 'standard')
    )
  ),
  'card': (
    'hover': (
      'transform': 'translateY(-5px)',
      'duration': map.get($animation-durations, 'normal'),
      'easing': map.get($animation-easings, 'standard')
    )
  ),
  'modal': (
    'enter': 'scale-in',
    'exit': 'scale-out'
  ),
  'dropdown': (
    'enter': 'slide-in-down',
    'exit': 'fade-out'
  ),
  'tooltip': (
    'enter': 'fade-in',
    'exit': 'fade-out'
  ),
  'page-transition': (
    'enter': 'fade-in',
    'exit': 'fade-out'
  )
);
```

## Functions and Mixins

### Animation Functions

```scss
// Get animation duration
@function animation-duration($duration) {
  @return map.get($animation-durations, $duration);
}

// Get animation easing
@function animation-easing($easing) {
  @return map.get($animation-easings, $easing);
}

// Get transition animation
@function transition-animation($animation) {
  @return map.get($transition-animations, $animation);
}

// Get keyframe animation
@function keyframe-animation($animation) {
  @return map.get($keyframe-animations, $animation);
}

// Get component animation
@function component-animation($component, $state) {
  @return map.get(map.get($component-animations, $component), $state);
}
```

### Animation Mixins

```scss
// Apply transition
@mixin transition($property, $duration, $easing) {
  transition: $property animation-duration($duration) animation-easing($easing);
}

// Apply multiple transitions
@mixin transitions($transitions...) {
  $result: ();
  
  @each $transition in $transitions {
    $property: nth($transition, 1);
    $duration: nth($transition, 2);
    $easing: nth($transition, 3);
    
    $result: append($result, $property animation-duration($duration) animation-easing($easing), comma);
  }
  
  transition: $result;
}

// Apply animation
@mixin animation($name, $duration, $easing, $delay: 0s, $iteration-count: 1, $direction: normal, $fill-mode: forwards) {
  animation: $name animation-duration($duration) animation-easing($easing) $delay $iteration-count $direction $fill-mode;
}

// Apply component animation
@mixin component-animation($component, $state) {
  $animation: component-animation($component, $state);
  
  @if map.has-key($animation, 'transform') {
    transform: map.get($animation, 'transform');
    transition: transform animation-duration(map.get($animation, 'duration')) animation-easing(map.get($animation, 'easing'));
  } @else {
    $keyframe-animation: keyframe-animation(map.get($animation, 'animation'));
    @include animation(
      map.get($animation, 'animation'),
      map.get($keyframe-animation, 'duration'),
      map.get($keyframe-animation, 'easing')
    );
  }
}

// Generate keyframes
@mixin generate-keyframes($name, $keyframes) {
  @keyframes #{$name} {
    @each $position, $styles in $keyframes {
      #{$position} {
        @each $property, $value in $styles {
          #{$property}: $value;
        }
      }
    }
  }
}
```

## Utility Classes

```scss
// Duration utilities
.duration-ultra-fast { transition-duration: animation-duration('ultra-fast'); }
.duration-fast { transition-duration: animation-duration('fast'); }
.duration-normal { transition-duration: animation-duration('normal'); }
.duration-slow { transition-duration: animation-duration('slow'); }
.duration-slower { transition-duration: animation-duration('slower'); }
.duration-slowest { transition-duration: animation-duration('slowest'); }

// Easing utilities
.easing-linear { transition-timing-function: animation-easing('linear'); }
.easing-standard { transition-timing-function: animation-easing('standard'); }
.easing-decelerate { transition-timing-function: animation-easing('decelerate'); }
.easing-accelerate { transition-timing-function: animation-easing('accelerate'); }
.easing-sharp { transition-timing-function: animation-easing('sharp'); }
.easing-bounce { transition-timing-function: animation-easing('bounce'); }

// Animation utilities
.animate-fade-in { animation: fade-in animation-duration('normal') animation-easing('standard') forwards; }
.animate-fade-out { animation: fade-out animation-duration('normal') animation-easing('standard') forwards; }
.animate-slide-in-up { animation: slide-in-up animation-duration('normal') animation-easing('decelerate') forwards; }
.animate-slide-in-down { animation: slide-in-down animation-duration('normal') animation-easing('decelerate') forwards; }
.animate-slide-in-left { animation: slide-in-left animation-duration('normal') animation-easing('decelerate') forwards; }
.animate-slide-in-right { animation: slide-in-right animation-duration('normal') animation-easing('decelerate') forwards; }
.animate-scale-in { animation: scale-in animation-duration('normal') animation-easing('bounce') forwards; }
.animate-scale-out { animation: scale-out animation-duration('normal') animation-easing('accelerate') forwards; }
.animate-pulse { animation: pulse animation-duration('slow') animation-easing('ease-in-out') infinite; }
.animate-bounce { animation: bounce animation-duration('slow') animation-easing('bounce') infinite; }
.animate-spin { animation: spin animation-duration('slow') animation-easing('linear') infinite; }

// Transition utilities
.transition-transform { transition: transform animation-duration('normal') animation-easing('standard'); }
.transition-opacity { transition: opacity animation-duration('normal') animation-easing('standard'); }
.transition-colors { 
  transition: 
    color animation-duration('normal') animation-easing('standard'),
    background-color animation-duration('normal') animation-easing('standard'),
    border-color animation-duration('normal') animation-easing('standard');
}
.transition-shadow { transition: box-shadow animation-duration('normal') animation-easing('standard'); }
.transition-all { transition: all animation-duration('normal') animation-easing('standard'); }

// Hover effect utilities
.hover-scale {
  @include transition(transform, 'fast', 'bounce');
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.hover-lift {
  @include transition(transform, 'normal', 'standard');
  
  &:hover {
    transform: translateY(-5px);
  }
}

.hover-glow {
  @include transitions(
    (box-shadow, 'normal', 'standard'),
    (transform, 'fast', 'standard')
  );
  
  &:hover {
    box-shadow: 0 0 15px rgba(var(--color-primary-rgb), 0.5);
    transform: translateY(-2px);
  }
}
```

## Accessibility Considerations

### Respecting Reduced Motion Preferences

```scss
// Reduced motion mixin
@mixin reduced-motion {
  @media (prefers-reduced-motion: reduce) {
    @content;
  }
}

// Apply reduced motion to animations
@mixin safe-animation($name, $duration, $easing, $delay: 0s, $iteration-count: 1, $direction: normal, $fill-mode: forwards) {
  animation: $name animation-duration($duration) animation-easing($easing) $delay $iteration-count $direction $fill-mode;
  
  @include reduced-motion {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

// Apply reduced motion to transitions
@mixin safe-transition($property, $duration, $easing) {
  transition: $property animation-duration($duration) animation-easing($easing);
  
  @include reduced-motion {
    transition-duration: 0.001ms !important;
  }
}
```

## Implementation Plan

### Phase 1: Core Animation System

1. Create `_animations.scss` file with durations, easings, and basic functions
2. Implement transition and animation mixins
3. Create accessibility utilities for reduced motion

### Phase 2: Keyframe Animations

1. Define standard keyframe animations
2. Create mixins for generating keyframes
3. Implement animation utility classes

### Phase 3: Component-Specific Animations

1. Define component-specific animations
2. Create mixins for applying component animations
3. Update component styles to use animation system

### Phase 4: Documentation and Examples

1. Document animation system
2. Create examples of animations
3. Provide guidelines for creating custom animations

## Usage Guidelines

### When to Use Animations

- Use animations to provide feedback for user interactions
- Use animations to guide user attention
- Use animations to create a more engaging user experience
- Use animations to communicate state changes

### When Not to Use Animations

- Avoid animations that are purely decorative
- Avoid animations that slow down the user
- Avoid animations that are distracting
- Avoid animations that cause motion sickness

### Performance Considerations

- Animate only transform and opacity properties when possible
- Avoid animating properties that cause layout recalculation
- Use will-change property sparingly
- Test animations on lower-end devices

### Accessibility Considerations

- Always provide reduced motion alternatives
- Avoid animations that flash or flicker
- Ensure animations don't interfere with screen readers
- Allow users to disable animations
