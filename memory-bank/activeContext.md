# Active Context: Personal Website

## Current Focus

- Eliminating code duplication in SASS variables
- Standardizing SASS architecture to follow modern best practices
- Creating a single source of truth for design tokens
- Maintaining backward compatibility while cleaning up the codebase

## Recent Changes

- Analyzed SASS variable duplication with `find-unused-sass-vars.js` and `list-sass-vars.js` scripts
- Identified 34 potentially unused variables
- Found duplicate breakpoint definitions in `_tokens.scss` and `_breakpoints.scss`
- Discovered shadow variables defined in multiple files (`_tokens.scss`, `_variables.scss`, `_shadows.scss`)
- Found inconsistent variable naming patterns and forwarding mechanisms
- Updated `.projectrules` file with comprehensive guidelines for SASS variable management
- Implemented improved documentation in core SASS files:
  - Added clear deprecation notices in `_variables.scss`
  - Enhanced documentation in `_breakpoints.scss` to clarify forwarding patterns
  - Improved documentation in `_shadows.scss` to clarify relationship with tokens
  - Added comprehensive JSDoc comments to `_css-variables.scss`
  - Clarified single source of truth pattern throughout all files

## Next Steps

1. Complete SASS variable consolidation:
   - ~~Update `_shadows.scss` with clear documentation about its relationship to `_tokens.scss`~~ ✅
   - ~~Update `_breakpoints.scss` to clarify it only forwards variables~~ ✅
   - ~~Add clear deprecation notices to `_variables.scss`~~ ✅
   - ~~Document the CSS variable generation process in `_css-variables.scss`~~ ✅
   - Delete unused variables after comprehensive testing
   - Update any remaining component files using legacy variable patterns

2. Delete utility scripts when all changes are implemented:
   - Look for `find-unused-sass-vars.js` and `list-sass-vars.js` in the project
   - Delete if found after implementing all the variable consolidation

3. Standardize variable naming conventions:
   - ~~Document best practices for variable naming in `.projectrules`~~ ✅
   - Ensure consistent kebab-case for all variable names
   - Group related variables in maps with descriptive names
   - Apply consistent prefixes for related variables

4. Complete comprehensive documentation:
   - Update Memory Bank technical documentation with final SASS architecture
   - Create migration guides for any legacy code
   - Document design token access patterns for new code

## Active Decisions

- **SASS Architecture**: Decision to maintain `_tokens.scss` as the single source of truth for all design tokens while using forwarding modules for backward compatibility.
  - Status: Implementing
  - Context: Need to eliminate duplication while maintaining backward compatibility.

- **Unused Variables**: Decision to remove confirmed unused variables and document those kept for backward compatibility.
  - Status: Planning
  - Context: 34 potentially unused variables identified, need to verify actual usage before removal.

- **Shadow System**: Decision to refactor shadow system to use consistent access patterns.
  - Status: Planning
  - Context: Shadow variables are currently defined in multiple files with inconsistent access patterns.

- **Breakpoint System**: Decision to maintain breakpoint definitions only in `_tokens.scss` and use `_breakpoints.scss` as a forwarding module.
  - Status: Implementing
  - Context: Breakpoint variables are currently defined in two places.

## Open Questions

- Should we migrate to a fully CSS Custom Property-based system or maintain SASS variables as the primary definition?
- How should we handle tool-specific variables that are currently defined in `_variables.scss`?
- What's the best approach for handling theme transitions that currently use duplicated properties?
- How should we handle backward compatibility for components that might be using old variable naming conventions?

## SASS Architecture Simplification Plan

To simplify our SASS architecture and eliminate unnecessary duplication, we'll implement the following approach:

### Phase 1: Consolidation (Current Sprint)

1. **Token Consolidation**
   - Move all remaining unique variables from `_variables.scss` to `_tokens.scss`
   - Ensure all token variables follow consistent naming pattern (kebab-case)
   - Add comprehensive documentation to all token groups
   - Create proper token maps for all remaining tool-specific variables

2. **Update Direct Imports in Primary Files**
   - Update `_base.scss` to import tokens directly and remove variables import
   - Update `_mixins.scss` to import tokens directly and remove variables import
   - Update `_typography.scss` to import tokens directly and remove variables import
   - Update `_utilities.scss` to import tokens directly and remove variables import

3. **Create Deprecation Strategy**
   - Add compiler warnings to forwarding files
   - Create migration guide for each forwarding file
   - Document timeline for removal

### Phase 2: Convert Forwarding to Utilities (Next Sprint)

1. **Transform `_breakpoints.scss`**
   - Convert from simple forwarding to a responsive utility library
   - Create comprehensive responsive mixins that use token values
   - Maintain existing exports but mark as deprecated
   - Add new, more powerful responsive utilities

2. **Enhance `_shadows.scss`**
   - Ensure all functions use tokens directly
   - Add additional shadow utility mixins
   - Create a component-specific shadow system
   - Add theme-aware shadow utilities

3. **Update Main Entry Point**
   - Reorganize `main.scss` with clear import hierarchy:
     1. Core (tokens, functions)
     2. Utilities (mixins, breakpoints, shadows)
     3. Base styles (typography, spacing, layout)
     4. Components

### Phase 3: Component Migration (Future Sprint)

1. **Update Component Files**
   - Gradually update all component files to use tokens directly
   - Add tokens import to each component file
   - Remove any dependencies on forwarding files
   - Standardize usage patterns across components

2. **Create Component Token System**
   - Create component-specific token maps in tokens.scss
   - Use semantic naming for component tokens
   - Ensure all components follow the same pattern

3. **Final Cleanup**
   - Remove all forwarding files
   - Finalize documentation for the simplified system
   - Create comprehensive examples for new patterns
