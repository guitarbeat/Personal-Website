# Active Context: Personal Website Tools

## Current Focus
Improving SASS architecture integration between the Tools section and the main site's SASS structure, with a focus on fixing bug-prone patterns and deprecated approaches.

## Recent Changes
- Fixed SASS compilation errors in ConflictMediation styles
- Fixed non-functional tools in ConflictMediation.js:
  - Fixed EmotionAxes component to handle emotionAxes object properly
  - Updated ReflectionPrompts to handle different emotion formats
  - Added proper state handling for emotionAxesValues
- Improved contrast in tool selector for light mode
- Integrated Tools styles with main SASS architecture:
  - Updated import statements to use global SASS files
  - Replaced hardcoded values with global variables
  - Leveraged existing mixins instead of redefining them
  - Updated transition timing and durations to use global variables
- Fixed SASS compilation errors in ToolsSection styles:
  - Updated bp.respond to mix.respond to use the correct mixin
  - Removed incorrect @forward directive in index.scss
  - Fixed import structure to properly handle the breakpoints module
- Improved SASS code quality and performance:
  - Replaced `transition: all` with specific property transitions
  - Added missing CSS variable definitions for Bingo component
  - Updated Snake component to use SASS architecture properly
  - Replaced hardcoded media queries with mixins
  - Optimized will-change usage
  - Added comprehensive reduced motion support for accessibility
- Fixed critical SASS compilation errors in Bingo component:
  - Fixed order of @use statements in index.scss
  - Added missing SASS architecture imports in bingo.scss
  - Replaced remaining hardcoded media queries with mixins
  - Replaced remaining `transition: all` with specific properties
- [2024-03-21] - Fixed Sass variable compilation errors by converting module variables to CSS custom properties:
  - Changed `var.$font-size-sm` to `var(--font-size-sm)`
  - Changed `var.$font-weight-bold` to `var(--font-weight-bold)`
  - Changed `var.$spacing-xl` to `var(--spacing-xl)`
  - Files affected:
    - `src/components/Tools/ConflictMediation/styles/progress-tracker.scss`
    - `src/components/Tools/styles/index.scss`
- [2024-03-22] - Fixed Sass deprecation warnings related to declarations after nested rules:
  - Wrapped declarations that appear after nested rules in `& {}` blocks
  - Moved keyframes to dedicated files to avoid `&` selector issues
  - Updated media queries to ensure proper nesting
  - Files affected:
    - `src/sass/_base.scss`
    - `src/sass/theme/_theme-switch.scss`
    - `src/sass/theme/_keyframes.scss`
    - `src/components/Tools/styles/index.scss`
- [2024-03-23] - Fixed additional Sass deprecation warnings:
  - Wrapped declarations after nested rules in `& {}` blocks in `src/sass/_base.scss`
  - Added proper namespacing to imports in `src/components/content/Header/text.scss`
  - Wrapped all declarations in `& {}` blocks in `src/components/content/Header/text.scss`
  - Files affected:
    - `src/sass/_base.scss`
    - `src/components/content/Header/text.scss`

## Next Steps
1. Continue SASS integration improvements:
   - Update remaining tool components to use global variables
   - Standardize CSS variable usage across all tools
   - Implement consistent theme handling for light/dark modes
   - Refactor remaining component styles to use shared patterns
2. Enhance mobile responsiveness:
   - Improve EmotionWheel mobile interaction
   - Optimize NeedsAssessment layout for small screens
   - Add touch-friendly controls
3. Add animation transitions between steps
4. Implement performance optimizations:
   - Optimize remaining will-change usage
   - Implement code splitting for tools
5. Review other SCSS files for similar variable usage patterns that might need updating
6. Consider creating a documentation guide for CSS custom property usage in the project
7. Update any remaining Sass module variables to CSS custom properties where appropriate
8. Audit codebase for any remaining Sass deprecation warnings

## Active Decisions
- SASS Architecture: Using modern @use syntax with proper namespacing
- Styling System: Leveraging global mixins and variables for consistency
- Component Scoping: Keeping component styles properly scoped
- State Management: Using localStorage for persistence
- Mobile Design: Implementing stacked layout for smaller screens
- Theme Integration: Aligning Tools section with main site's theming system
- Mixin Usage: Using mix.respond instead of bp.respond for breakpoint handling
- Performance: Specifying exact properties in transitions instead of using `all`
- Accessibility: Added reduced motion support for animations
- SASS Import Order: Ensuring @use statements come before any CSS rules
- [In Progress] - Migration from Sass module variables to CSS custom properties for better maintainability and browser compatibility
- [Completed] - Using CSS custom properties for theme-related values (fonts, spacing, colors)
- [Completed] - Using `& {}` wrapper for declarations after nested rules to opt into new Sass behavior
- [Completed] - Proper namespacing of imports to avoid conflicts and improve code clarity

## Open Questions
- Should we create a separate mixin for scrollbar styling?
- How can we improve the emotion wheel's mobile interaction?
- Should we implement a dark mode variant of the glass effect?
- Would adding haptic feedback improve mobile interaction?
- Should we add a progress autosave indicator?
- Should we consolidate all breakpoint handling to use a single approach?
- Should we create a central animation system with consistent timing functions?
- Should we create a comprehensive audit of all Sass variables to ensure consistent usage of CSS custom properties?
- Are there any cases where we should keep using Sass variables instead of CSS custom properties?
- Should we create a linting rule to enforce the new Sass nesting behavior?
- Should we implement a systematic approach to check for and fix all Sass deprecation warnings across the codebase?

## SASS Integration Issues
1. **Inconsistent Variable Usage**: ✅ Partially addressed
   - Replaced hardcoded transition values with global variables
   - Still need to replace more hardcoded colors and values

2. **Separate Styling Approach**: ✅ Partially addressed
   - Updated import statements to use global SASS files
   - Still need to update more components

3. **Inconsistent Light/Dark Mode Handling**: ⏳ In progress
   - Improved contrast in tool selector for light mode
   - Need to implement consistent theme handling

4. **Redundant Style Definitions**: ✅ Partially addressed
   - Leveraged existing mixins for common patterns
   - Still need to replace more redundant definitions

5. **Lack of Integration with Global Theme Variables**: ⏳ In progress
   - Started using global variables
   - Need to standardize CSS variable usage

6. **Inconsistent Breakpoint Handling**: ✅ Addressed
   - Updated bp.respond to mix.respond for consistent breakpoint handling
   - Removed incorrect @forward directive in index.scss
   - Replaced hardcoded media queries with mixins

7. **Performance Issues**: ✅ Addressed
   - Replaced `transition: all` with specific property transitions
   - Optimized will-change usage
   - Added reduced motion support for accessibility

8. **SASS Import Order Issues**: ✅ Addressed
   - Fixed order of @use statements in Bingo component
   - Ensured all @use statements come before any CSS rules

9. **Sass Deprecation Warnings**: ✅ Addressed
   - Wrapped declarations after nested rules in `& {}` blocks
   - Moved keyframes to dedicated files
   - Updated media queries to ensure proper nesting
   - Added proper namespacing to imports
   - Fixed remaining warnings in Header components

## Files Updated
1. Tools/styles/index.scss:
   - Added imports from main SASS architecture
   - Replaced custom implementations with global mixins
   - Updated transition values to use global variables
   - Fixed bp.respond to use mix.respond for breakpoint handling
   - Replaced `transition: all` with specific property transitions
   - Added comprehensive reduced motion support

2. Tools/ConflictMediation/styles/conflict-mediation.scss:
   - Added imports from main SASS architecture
   - Updated button-base mixin to use global mixins
   - Replaced hardcoded values with global variables
   - Replaced hardcoded media queries with mixins
   - Added button style with specific transitions

3. Tools/ToolsSection/styles/tools-section.scss:
   - Added imports from main SASS architecture
   - Replaced flex utilities with global mixins
   - Updated media queries to use breakpoint mixins
   - Replaced hardcoded values with global variables
   - Fixed bp.respond to use mix.respond for breakpoint handling
   - Replaced `transition: all` with specific property transitions

4. Tools/ToolsSection/styles/index.scss:
   - Removed incorrect @forward directive
   - Fixed import structure to properly handle the breakpoints module

5. Tools/Snake/styles/snake.scss:
   - Added imports from main SASS architecture
   - Replaced flex utilities with global mixins
   - Updated media queries to use breakpoint mixins
   - Replaced hardcoded values with global variables
   - Replaced `transition: all` with specific property transitions

6. Tools/Bingo/styles/index.scss:
   - Added imports from main SASS architecture
   - Added missing CSS variable definitions
   - Fixed variable references
   - Fixed order of @use statements to prevent compilation errors

7. Tools/Bingo/styles/bingo.scss:
   - Added imports from main SASS architecture
   - Replaced hardcoded media queries with mixins
   - Replaced `transition: all` with specific property transitions
   - Fixed will-change usage

8. ConflictMediation.js:
   - Fixed EmotionAxes component to handle emotionAxes object
   - Updated ReflectionPrompts to handle different emotion formats
   - Added proper state handling for emotionAxesValues

9. ReflectionPrompts.js:
   - Updated to handle both string and object emotions

10. src/sass/_base.scss:
    - Wrapped declarations after nested rules in `& {}` blocks
    - Removed duplicate keyframes that exist in _animations.scss
    - Updated mixins to use proper nesting
    - Fixed scrollbar styling with proper `& {}` wrappers

11. src/sass/theme/_theme-switch.scss:
    - Removed keyframes and moved them to _keyframes.scss
    - Wrapped declarations in `& {}` blocks
    - Ensured proper nesting in media queries

12. src/sass/theme/_keyframes.scss:
    - Created/updated with all animation keyframes
    - Ensured proper keyframe syntax without `&` selectors

13. src/components/content/Header/text.scss:
    - Added proper namespacing to imports
    - Wrapped all declarations in `& {}` blocks
    - Fixed nested rule declarations

## Progress Tracking
- [x] Fixed SASS compilation errors
- [x] Updated shared style patterns
- [x] Improved component scoping
- [x] Modernized import syntax
- [x] Fixed non-functional tools in ConflictMediation
- [x] Improved contrast in tool selector for light mode
- [x] Added imports from main SASS architecture
- [x] Replaced some hardcoded values with global variables
- [x] Leveraged some existing mixins from main architecture
- [x] Fixed breakpoint handling in ToolsSection styles
- [x] Replaced `transition: all` with specific property transitions
- [x] Added missing CSS variable definitions
- [x] Updated Snake component to use SASS architecture properly
- [x] Replaced hardcoded media queries with mixins
- [x] Added reduced motion support
- [x] Fixed SASS import order issues
- [x] Fixed Sass deprecation warnings for declarations after nested rules
- [x] Moved keyframes to dedicated files
- [x] Added proper namespacing to imports
- [x] Fixed remaining warnings in Header components
- [ ] Complete replacement of hardcoded values
- [ ] Implement consistent theme handling
- [ ] Refactor remaining component styles
- [ ] Standardize CSS variable usage
