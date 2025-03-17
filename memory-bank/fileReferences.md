# File References: Personal Website

This document serves as an index mapping implementation files to their corresponding documentation in the Memory Bank.

## Core Application Files

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/App.js` | Main application component with routing | systemPatterns.md, techContext.md |
| `src/sass/main.scss` | Main stylesheet | techContext.md |

## Tool Components

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/components/Tools/ToolsSection/ToolsSection.js` | Container for all tools | systemPatterns.md, progress.md, Tools-Reorganization-Progress.md |
| `src/components/Tools/ToolsSection/FullscreenWrapper.js` | Wrapper for fullscreen tool views | systemPatterns.md, Tools-Reorganization-Progress.md |
| `src/components/Tools/ToolsSection/styles/index.scss` | Styles for the ToolsSection component | Tools-Reorganization-Progress.md |
| `src/components/Tools/styles/index.scss` | Main styles file that forwards all tool styles | Tools-Reorganization-Progress.md |

### ConflictMediation Tool

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/components/Tools/ConflictMediation/ConflictMediation.js` | Main ConflictMediation component | activeContext.md, progress.md, Tools-Reorganization-Progress.md |
| `src/components/Tools/ConflictMediation/EmotionSelector.js` | Emotion selection component | Tools-Reorganization-Progress.md |
| `src/components/Tools/ConflictMediation/ReflectionPrompts.js` | Self-reflection prompts component | Tools-Reorganization-Progress.md |
| `src/components/Tools/ConflictMediation/ProgressTracker.js` | Progress tracking component | Tools-Reorganization-Progress.md |
| `src/components/Tools/ConflictMediation/NeedsAssessment.js` | Needs assessment component (integrated from Needs tool) | Tools-Reorganization-Progress.md |
| `src/components/Tools/ConflictMediation/styles/index.scss` | Imports for ConflictMediation styles | Tools-Reorganization-Progress.md |
| `src/components/Tools/ConflictMediation/styles/conflict-mediation.scss` | Styles for ConflictMediation components | Tools-Reorganization-Progress.md |
| `src/components/Tools/ConflictMediation/styles/needs.scss` | Styles for NeedsAssessment component | Tools-Reorganization-Progress.md |

### Bingo Tool

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/components/Tools/Bingo/BingoGame.js` | Bingo game implementation | productContext.md, progress.md, Tools-Reorganization-Progress.md |
| `src/components/Tools/Bingo/styles/index.scss` | Imports for Bingo styles | Tools-Reorganization-Progress.md |
| `src/components/Tools/Bingo/styles/bingo.scss` | Styles for the Bingo component | Tools-Reorganization-Progress.md |

### Snake Tool

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/components/Tools/Snake/SnakeGame.js` | Snake game implementation | productContext.md, progress.md, Tools-Reorganization-Progress.md, Tools-Testing-Plan.md |
| `src/components/Tools/Snake/GameBoard.js` | Canvas component for the Snake game | Tools-Reorganization-Progress.md |
| `src/components/Tools/Snake/Controls.js` | Control components for the Snake game | Tools-Reorganization-Progress.md |
| `src/components/Tools/Snake/styles/index.scss` | Imports for Snake styles | Tools-Reorganization-Progress.md |
| `src/components/Tools/Snake/styles/snake.scss` | Styles for the Snake components | Tools-Reorganization-Progress.md |

### Shared Components

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/components/Tools/shared/hooks.js` | Shared hooks for tool components | Tools-Reorganization-Progress.md |
| `src/components/Tools/shared/index.ts` | Exports for shared components | Tools-Reorganization-Progress.md |

## Layout and Navigation

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/components/Core/constants.js` | Constants including navigation items | systemPatterns.md |
| `src/components/index.js` | Exports for main components | systemPatterns.md |

## Effect Components

| File | Description | Memory Bank References |
|------|-------------|------------------------|
| `src/components/effects/Blur/index.js` | Blur effect component | systemPatterns.md |
| `src/components/effects/Loading/LoadingSequence.js` | Loading animation | systemPatterns.md |
| `src/components/effects/Matrix/Matrix.js` | Matrix visual effect | systemPatterns.md |
| `src/components/effects/Matrix/AuthContext.js` | Authentication context | systemPatterns.md |

## Recent Changes

### Tools Section Reorganization

- **Changes Made**:
  - Created consistent directory structure for all tools
  - Standardized file naming conventions
  - Separated styles into dedicated files
  - Improved component modularity
  - Fixed runtime errors in Snake game
  - Removed duplicate style files
  - Removed old snake.js file and empty directories
  - Integrated Needs tool into ConflictMediation
- **Memory Bank References**: Tools-Reorganization-Plan.md, Tools-Reorganization-Progress.md, Tools-Testing-Plan.md

### Renamed Meditation to ConflictMediation

- **Files Affected**:
  - `src/components/Tools/Meditation.js` → `src/components/Tools/ConflictMediation/ConflictMediation.js`
  - `src/sass/components/meditation.scss` → `src/components/Tools/ConflictMediation/styles/conflict-mediation.scss`
  - `src/App.js` (imports and routes)
- **Memory Bank References**: activeContext.md, progress.md

### Integrated Needs into ConflictMediation

- **Files Affected**:
  - `src/components/Tools/Needs/NeedsAssessment.js` → `src/components/Tools/ConflictMediation/NeedsAssessment.js`
  - `src/components/Tools/Needs/styles/needs.scss` → `src/components/Tools/ConflictMediation/styles/needs.scss`
  - `src/components/Tools/ConflictMediation/ConflictMediation.js` (updated to include NeedsAssessment)
  - `src/components/Tools/ConflictMediation/ReflectionPrompts.js` (updated to display needs data)
  - `src/components/Tools/index.ts` (updated exports)
- **Memory Bank References**: Tools-Reorganization-Progress.md

### Completed Needs Integration

- **Files Affected**:
  - `src/components/Tools/ToolsSection/ToolsSection.js` (removed Needs tool)
  - `src/App.js` (removed Needs import and route)
  - Deleted `src/components/Tools/Needs` directory and its contents
- **Changes Made**:
  - Removed Needs as a standalone tool
  - Ensured NeedsAssessment is properly integrated into ConflictMediation
  - Updated documentation to reflect the changes
- **Memory Bank References**: Tools-Reorganization-Progress.md

### Fixed Compilation Issues

- **Files Affected**:
  - `src/components/Tools/styles/index.scss` (removed reference to Needs styles)
  - `src/components/Tools/ToolsSection/ToolsSection.js` (updated preloadTools function)
- **Changes Made**:
  - Removed reference to Needs styles in the main styles file
  - Updated the preloadTools function to remove the preload hint for the Needs component
  - Successfully built the project with the updated structure
- **Memory Bank References**: Tools-Reorganization-Progress.md

### Code Style Improvements

- **Files Affected**:
  - `src/components/Tools/ConflictMediation/ConflictMediation.js`
- **Changes Made**:
  - Added block braces to all if statements
  - Fixed Sourcery linting warnings
- **Memory Bank References**: activeContext.md, .projectrules

### Fixed Runtime Errors

- **Files Affected**:
  - `src/components/Tools/Snake/SnakeGame.js`
- **Changes Made**:
  - Added start method to SnakeScene class
  - Added cleanup method to SoundManager class
  - Ensured proper resource cleanup
- **Memory Bank References**: Tools-Reorganization-Progress.md, Tools-Testing-Plan.md, progress.md

### Final Cleanup

- **Files Affected**:
  - Removed `src/components/Tools/Snake/snake.js`
  - Removed empty `src/components/Tools/shared/styles` directory
- **Changes Made**:
  - Removed duplicate and unused files
  - Ensured directory structure matches reorganization plan
- **Memory Bank References**: Tools-Reorganization-Progress.md

# File References: Personal Website Tools

## Component Files
- `src/components/Tools/ConflictMediation/ConflictMediation.js`
  - Main container component
  - Referenced in: systemPatterns.md, techContext.md
  - Implements patterns from: productContext.md

- `src/components/Tools/ConflictMediation/ProgressTracker.js`
  - Progress tracking component
  - Referenced in: activeContext.md, progress.md
  - Implements patterns from: systemPatterns.md

- `src/components/Tools/ConflictMediation/EmotionSelector.js`
  - Emotion selection interface
  - Referenced in: productContext.md, progress.md
  - Implements patterns from: systemPatterns.md

## Style Files
- `src/components/Tools/ConflictMediation/styles/progress-tracker.scss`
  - ProgressTracker component styles
  - Referenced in: activeContext.md, techContext.md
  - Implements patterns from: systemPatterns.md

- `src/components/Tools/ConflictMediation/styles/index.scss`
  - Main tool styles
  - Referenced in: techContext.md
  - Implements patterns from: systemPatterns.md

- `src/components/Tools/shared/styles/index.scss`
  - Shared styling patterns
  - Referenced in: systemPatterns.md, techContext.md
  - Implements patterns from: projectbrief.md

## Documentation Map
- projectbrief.md → All implementation files
- productContext.md → ConflictMediation.js, EmotionSelector.js
- systemPatterns.md → All style files, component architecture
- techContext.md → Build configuration, dependency management
- activeContext.md → ProgressTracker.js, current development
- progress.md → Feature implementation status
