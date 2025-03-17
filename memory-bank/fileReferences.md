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
| `src/components/Tools/ConflictMediation.js` | Conflict resolution tool (renamed from Meditation) | activeContext.md, progress.md |
| `src/sass/components/conflictMediation.scss` | Styles for the ConflictMediation component | activeContext.md, progress.md |
| `src/components/Tools/bingo.js` | Bingo game implementation | productContext.md, progress.md |
| `src/components/Tools/needs.js` | Needs assessment tool | productContext.md, progress.md |
| `src/components/Tools/snake.js` | Snake game implementation | productContext.md, progress.md |
| `src/components/Tools/ToolsSection.js` | Container for all tools | systemPatterns.md, progress.md |

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

| Change | Files Affected | Memory Bank References |
|--------|----------------|------------------------|
| Renamed Meditation to ConflictMediation | `src/components/Tools/Meditation.js` → `ConflictMediation.js`<br>`src/sass/components/meditation.scss` → `conflictMediation.scss`<br>`src/App.js` (imports and routes) | activeContext.md, progress.md | 