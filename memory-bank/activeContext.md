# Active Context: Personal Website

## Current Focus

- Eliminating code duplication in SASS variables
- Standardizing SASS architecture to follow modern best practices
- Creating a single source of truth for design tokens
- Maintaining backward compatibility while cleaning up the codebase
- Modernizing the SASS architecture by migrating from the deprecated `_variables.scss` to a more structured token-based system

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
- Updated `main.scss` with a new structured architecture featuring clear section organization:
  - Core (design tokens & core imports)
  - Utilities (reusable patterns)
  - Base styles (global foundations)
  - Theming (visual presentation)
  - Components (UI elements)
- Fixed compilation error in `header.scss` related to missing `sass:map` module import
- Transformed `_breakpoints.scss` into a comprehensive responsive utility library
- Updated `header.scss` to use the new token-based system and breakpoint mixins
- **SASS Migration (2023-06-30)**: Created update-component.sh script to automate migration from _variables.scss to tokens
- **SASS Migration (2023-06-30)**: Updated core SASS files to use tokens directly (_typography.scss,_mixins.scss, _base.scss,_utilities.scss, _typography-custom.scss)
- **SASS Migration (2023-06-30)**: Successfully migrated Work component to use tokens directly using the migration script
- **SASS Documentation (2023-06-30)**: Updated techContext.md and .projectrules with detailed guidelines for SASS architecture
- **SASS Migration (2023-07-01)**: Updated _mixins-custom.scss to use tokens directly
- **SASS Migration (2023-07-01)**: Updated theme/_theme-switch.scss to use tokens directly
- [April 2024] - Migration from _variables.scss to tokens completed with all files updated
- [April 2024] - Successfully migrated all Tool component files (Bingo, Snake, ConflictMediation) to use tokens directly
- [April 2024] - Successfully migrated the tools-section.scss file to use tokens directly
- [April 2024] - Removed _variables.scss completely as it's no longer needed
- [April 2024] - Updated documentation to reflect the new SASS architecture
- [April 2024] - Fixed missing migration for Work component and _mixins-custom.scss
- [April 2024] - Fixed theme/_theme-switch.scss to remove variables import

## Next Steps

1. Address remaining deprecation warnings related to color functions
2. Set up _tokens.scss as the single source of truth for design values (completed)
3. Address "Direct use of breakpoint variables is deprecated" warnings
4. Consider replacing color.red/green/blue functions with color.channel for better forward compatibility

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

- **SASS Architecture**: Using a token-based system as the single source of truth for design tokens
- **Migration Strategy**: Phased approach with backward compatibility via forwarding module, followed by complete removal

## Open Questions

- Should we migrate to a fully CSS Custom Property-based system or maintain SASS variables as the primary definition?
- How should we handle tool-specific variables that are currently defined in `_variables.scss`?
- What's the best approach for handling theme transitions that currently use duplicated properties?
- How should we handle backward compatibility for components that might be using old variable naming conventions?
- Are there any component-specific variables in _variables.scss that need to be moved to component files?
- Should any legacy color functions be updated to use the newer color.channel() function as suggested by deprecation warnings?

## SASS Architecture Simplification Plan

To simplify our SASS architecture and eliminate unnecessary duplication, we'll implement the following approach:

### Phase 1: Consolidation (Current Sprint) ✅

1. **Token Consolidation** ✅
   - Move all remaining unique variables from `_variables.scss` to `_tokens.scss`
   - Ensure all token variables follow consistent naming pattern (kebab-case)
   - Add comprehensive documentation to all token groups
   - Create proper token maps for all remaining tool-specific variables

2. **Update Direct Imports in Primary Files** ✅
   - Update `_base.scss` to import tokens directly and remove variables import
   - Update `_mixins.scss` to import tokens directly and remove variables import
   - Update `_typography.scss` to import tokens directly and remove variables import
   - Update `_utilities.scss` to import tokens directly and remove variables import

3. **Create Deprecation Strategy** ✅
   - Add compiler warnings to forwarding files
   - Create migration guide for each forwarding file
   - Document timeline for removal

### Phase 2: Convert Forwarding to Utilities (In Progress - 50% Complete)

1. **Transform `_breakpoints.scss`** ✅
   - Convert from simple forwarding to a responsive utility library
   - Create comprehensive responsive mixins that use token values
   - Maintain existing exports but mark as deprecated
   - Add new, more powerful responsive utilities

2. **Enhance `_shadows.scss`** (Planned)
   - Ensure all functions use tokens directly
   - Add additional shadow utility mixins
   - Create a component-specific shadow system
   - Add theme-aware shadow utilities

3. **Update Main Entry Point** ✅
   - Reorganize `main.scss` with clear import hierarchy:
     1. Core (tokens, functions)
     2. Utilities (mixins, breakpoints, shadows)
     3. Base styles (typography, spacing, layout)
     4. Components

### Phase 3: Component Migration (Started - 10% Complete)

1. **Update Component Files** (In Progress)
   - ✅ Updated `header.scss` as first component to use tokens directly
   - ✅ Fixed SASS module imports in component files
   - Gradually update all component files to use tokens directly
   - Add tokens import to each component file
   - Remove any dependencies on forwarding files
   - Standardize usage patterns across components

2. **Create Component Token System** (Planned)
   - Create component-specific token maps in tokens.scss
   - Use semantic naming for component tokens
   - Ensure all components follow the same pattern

3. **Final Cleanup** (Planned)
   - Remove all forwarding files
   - Finalize documentation for the simplified system
   - Create comprehensive examples for new patterns

## Lessons Learned

- **SASS Module Imports**: Always ensure appropriate SASS module imports (`@use "sass:map"`, etc.) are included in files that use those functions
- **Comprehensive Testing**: Test compilation after each major change to catch errors early
- **Incremental Updates**: Updating one component at a time allows for better verification of changes
- **Deprecation Warnings**: Using compiler warnings for deprecated patterns helps identify and update legacy code

## Plan for Removing _variables.scss

The `_variables.scss` file is currently marked as deprecated but still used throughout the codebase. To safely remove it, we'll follow this phased approach:

### Phase 1: Analysis and Documentation

1. **Identify All Imports** ✅
   - Found imports in core SASS files: `_base.scss`, `_typography.scss`, `_mixins.scss`, `_utilities.scss`
   - Found imports in tool components: Various files in the `Tools` directory
   - Note that `main.scss` already has the import commented out

2. **Categorize Variables** ✅
   - Re-exports from tokens for backward compatibility (already duplicated)
   - CSS custom properties (now handled by `_css-variables.scss`)
   - Tool-specific variables (need to be migrated to tokens)
   - JavaScript exports (needed for JS interop)

3. **Document Migration Path** ✅
   - Update Memory Bank with the removal plan
   - Create a checklist for all files that need to be updated

### Phase 2: Migration (Current)

1. **Update Core SASS Files**
   - Modify `_base.scss`, `_typography.scss`, `_mixins.scss`, and `_utilities.scss` to:
     - Import tokens directly
     - Use token functions instead of variable references
     - Remove `_variables.scss` imports

2. **Extract JavaScript Exports**
   - Move the `:export` block from `_variables.scss` to `_tokens.scss` to maintain JS interop

3. **Update Tool Components**
   - Systematically update Tool component SCSS files:
     - Update imports to use tokens directly
     - Replace variable references with token functions
     - Verify compilation after each update

4. **Create Token Maps for Tool-Specific Variables**
   - Identify any unique tool-specific variables
   - Create dedicated token maps in `_tokens.scss`
   - Update references in tool components

### Phase 3: Verification and Removal

1. **Comprehensive Testing**
   - Verify compilation after all updates
   - Check visual appearance of all components
   - Test theme switching functionality
   - Verify JavaScript interactions that rely on exported variables

2. **Create Temporary Forwarding Module**
   - Create a temporary forwarding module if needed for backward compatibility
   - Add explicit deprecation warnings
   - Document timeline for removal

3. **Final Removal**
   - Remove `_variables.scss` file
   - Update documentation to reflect new architecture
   - Verify final build compiles and runs correctly

### Files to Update

#### Core SASS Files

- `_base.scss`: Update token imports and variable references
- `_typography.scss`: Update token imports and variable references
- `_mixins.scss`: Update token imports and variable references
- `_utilities.scss`: Update token imports and variable references
- `theme/_theme-switch.scss`: Update token imports and variable references

#### Tool Component Files

- `Tools/ToolsSection/styles/index.scss`: Update imports and variable references
- `Tools/shared/styles/index.scss`: Update imports and variable references
- `Tools/Bingo/styles/bingo.scss`: Update imports and variable references
- `Tools/Snake/styles/index.scss`: Update imports and variable references
- `Tools/Snake/styles/snake.scss`: Update imports and variable references
- `Tools/ConflictMediation/styles/index.scss`: Update imports and variable references
- `Tools/ConflictMediation/styles/conflict-mediation.scss`: Update imports and variable references
- `Tools/ConflictMediation/styles/needs.scss`: Update imports and variable references
- `Tools/ConflictMediation/styles/progress-tracker.scss`: Update imports and variable references
- `Tools/styles/index.scss`: Update imports and variable references

### Next Steps

1. Begin with updating the core SASS files one by one
2. Verify compilation after each file update
3. Then update tool component files systematically
4. Perform comprehensive testing after all updates
5. Create a temporary forwarding module if needed
6. Remove `_variables.scss` once all references are updated

1. Update remaining files that still import _variables.scss (tools-section.scss)
2. Remove _variables.scss once all imports have been migrated
3. Set up _tokens.scss as the single source of truth for design values
4. Update documentation to reflect the new SASS architecture
