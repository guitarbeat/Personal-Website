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

## Next Steps

1. Implement SASS variable consolidation strategy:
   - Maintain `_tokens.scss` as the single source of truth for all design tokens
   - Update `_breakpoints.scss` to only forward variables from `_tokens.scss`
   - Refactor shadow system to use consistent access patterns
   - Remove redundant variable declarations from `_variables.scss`
   - Update imports to use proper namespacing
   - Add clear documentation to all variable groups

2. Clean up unused variables:
   - Remove confirmed unused variables
   - Document variables kept for future use or backward compatibility
   - Update CSS variable generation to reflect cleaned variable set

3. Standardize variable naming conventions:
   - Ensure consistent kebab-case for all variable names
   - Group related variables in maps with descriptive names
   - Use consistent prefixes for related variables

4. Document the design token system:
   - Add comprehensive comments to `_tokens.scss`
   - Create documentation for the design system
   - Update memory bank with design token architecture

5. Delete utility scripts after implementation:
   - Remove `find-unused-sass-vars.js` and `list-sass-vars.js` after cleanup

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
