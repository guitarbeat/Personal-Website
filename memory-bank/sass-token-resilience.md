# SASS Token System Resilience

This document outlines the approach to creating a resilient token system in our SASS architecture that can gracefully handle token resolution failures.

## Problem

We encountered issues with component-specific tokens not resolving correctly during SASS compilation. Specifically:

1. Component-specific tokens were defined locally in component files
2. No error handling or fallbacks were in place when token resolution failed
3. Missing SASS module imports could cause token functions to fail
4. Inconsistent token access patterns across the codebase

## Solution: A Resilient Token System

We've implemented a comprehensive solution with these key features:

1. **Centralized Component Tokens**: All component-specific tokens now live in `_tokens.scss`
2. **Error-Resilient Functions**: New token accessor functions with built-in error handling
3. **Fallback Mechanism**: All token functions accept fallback values as parameters
4. **Standardized Access Pattern**: Consistent approach for accessing tokens across all components

## Implementation

### 1. Centralized Component Token Map

All component-specific tokens are now defined in a dedicated section of `_tokens.scss`:

```scss
// In _tokens.scss
$component-tokens: (
  'header': (
    'title': (
      'font-size': 5rem,
      'font-size-medium': 4rem,
      // ...more tokens
    ),
    // ...more categories
  ),
  // ...more components
);
```

### 2. Error-Resilient Token Access Functions

New accessor functions that gracefully handle missing tokens with fallbacks:

```scss
@function component-token($component, $category, $token, $fallback: null) {
  // Check if component-tokens map exists
  @if not variable-exists(component-tokens) {
    @warn "component-tokens map not found, using fallback value";
    @return $fallback;
  }
  
  // Check if component exists in map
  @if not map.has-key($component-tokens, $component) {
    @warn "Component '#{$component}' not found, using fallback value";
    @return $fallback;
  }
  
  // ...more checks
  
  @return map.get($category-map, $token);
}
```

### 3. Component Usage Patterns

We have two implementation patterns depending on component complexity:

#### Pattern A: Full Centralization (For Simple Components)

Components follow this pattern:

1. Remove local token definitions
2. Use centralized token functions with fallbacks
3. Include required SASS module imports

```scss
// In component SCSS file
@use "sass:map";  // Required module import
@use "../../../sass/tokens" as tokens;

.component {
  // Use component token with fallback
  font-size: tokens.component-token('component-name', 'category', 'token', 5rem);
}
```

#### Pattern B: Hybrid Approach (For Complex Components or Special Styling)

Some components with complex styling (like the avatar component) benefit from keeping local token definitions while still following resilient patterns:

1. Keep local token definitions for component-specific styling
2. Ensure all required SASS module imports are present
3. Use direct map access with proper error handling

```scss
// In component SCSS file
@use "sass:map";  // Required module import
@use "../../../sass/tokens" as tokens;

// Local component tokens for complex styling needs
$component-tokens: (
  'property': 5rem,
  'border-thickness': 5%
);

.component {
  // Use local tokens
  property: map.get($component-tokens, 'property');
  
  .complex-element {
    // Use string interpolation for CSS variables
    --border-thickness: #{map.get($component-tokens, 'border-thickness')};
  }
}
```

## Benefits

1. **Fail-safe Compilation**: Issues with token resolution won't break the build
2. **Self-Documented Fallbacks**: Default values are explicit in the code
3. **Centralized Management**: All tokens in one place for easier maintenance
4. **Consistent Access Pattern**: Standardized approach throughout the codebase
5. **Clear Error Messages**: Helpful warnings when tokens aren't found

## Migration Guide

To update existing components:

1. **Move Component Tokens**: Relocate component-specific tokens to `_tokens.scss`
2. **Update Imports**: Ensure all necessary SASS module imports are present
3. **Replace Direct References**: Use the new resilient token functions with fallbacks
4. **Test Compilation**: Verify the component compiles without errors
5. **Visual Testing**: Ensure the component looks the same after the migration

## Code Examples

### Before

```scss
// In component.scss
$component-tokens: (
  'property': 5rem
);

.component {
  property: map.get($component-tokens, 'property');
}
```

### After (Pattern A - Full Centralization)

```scss
// In _tokens.scss
$component-tokens: (
  'component-name': (
    'category': (
      'property': 5rem
    )
  )
);

// In component.scss
@use "sass:map";
@use "../../../sass/tokens" as tokens;

.component {
  property: tokens.component-token('component-name', 'category', 'property', 5rem);
}
```

### After (Pattern B - Hybrid Approach)

```scss
// In _tokens.scss
$component-tokens: (
  'component-name': (
    'category': (
      'property': 5rem
    )
  )
);

// In component.scss
@use "sass:map";
@use "../../../sass/tokens" as tokens;

// Local tokens for complex styling
$local-tokens: (
  'property': 5rem,
  'special-value': 10%
);

.component {
  property: map.get($local-tokens, 'property');
  
  // For CSS variables that need string interpolation
  --special-property: #{map.get($local-tokens, 'special-value')};
}
```

## Best Practices

1. **Always Include Fallbacks**: Provide sensible defaults for all token accesses
2. **Add Required Module Imports**: Include `@use "sass:map"` in files that access maps
3. **Use Descriptive Token Names**: Make token names self-explanatory
4. **Organize Tokens Hierarchically**: Follow the component/category/token structure
5. **Maintain Documentation**: Update this document when adding new token categories
6. **Complex Styling Considerations**: For components with complex CSS calculations or string interpolation (like the avatar component), consider using the hybrid approach to maintain visual fidelity

## Future Improvements

1. **Type Checking**: Enhance functions to validate token value types
2. **Default Token Maps**: Provide global defaults for common token categories
3. **Token Validation**: Add a validation step during build to verify token existence
4. **IDE Tooling**: Create IDE extensions for token auto-completion
5. **Interactive Documentation**: Generate visual documentation from the token system

## Related Files

- `src/sass/_tokens.scss`: Contains all token definitions and accessor functions
- `src/components/content/Header/header.scss`: Example of updated component using resilient tokens
