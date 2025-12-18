# Development Notes

Reference documentation for troubleshooting and future improvements.

## Known Issues & Fixes

### TypeScript Event Listener Error

- **Error**: `TS2769: No overload matches this call` for `addEventListener` with `handleScroll`
- **Root Cause**: Throttle function returned function without proper event parameter typing
- **Fix**: Added event parameter to throttled handlers
- **File**: `src/components/effects/Moire/Moire.js`

### Node.js Version Conflicts

- **Error**: Deprecated Node.js 18.x warning in deployments
- **Root Cause**: Duplicate `engines` specifications with conflicting versions
- **Fix**: Removed duplicate, kept single engines block with Node 22.x
- **File**: `package.json`

## Refactoring Opportunities

### 1. Centralize Google Sheets Data Normalization

Components (`About`, `Projects`, `Work`) each implement similar data mapping logic.

- **Suggestion**: Create `normalizeSheetRows(sheetName, mapper)` utility or `useSheetData` hook
- **Benefits**: Eliminate duplicate mapping boilerplate, consistent defaults
- **Files**: `src/components/content/*/*.js`

### 2. Unify Navigation Bar Dragging

`NavBar` has separate touch and mouse event handlers doing identical work.

- **Suggestion**: Use pointer events or `createDragHandlers(ref, options)` utility
- **Benefits**: Reduce function count, prevent recreated callbacks on each render
- **Files**: `src/components/content/NavBar/NavBar.js`

### 3. Extract Expandable Card Pattern

Both Projects and Work sections implement similar expandable card logic.

- **Suggestion**: Create shared `useExpandableCards` hook or `ExpandableCard` component
- **Benefits**: Encapsulate toggling logic, animation classes, accessibility
- **Files**: `src/components/content/Projects/Projects.js`, `src/components/content/Work/Work.js`

### 4. Externalize Filter Button Styling

Project filters rebuild inline style objects on every render.

- **Suggestion**: Use SCSS modifiers (e.g., `.tag--active`) or `getTagStyles()` helper
- **Benefits**: Cleaner JSX, prevent inline style churn, easier to maintain
- **Files**: `src/components/content/Projects/Projects.js`

## Notes

- These improvements are optional optimizations
- Current implementation works well
- Prioritize based on development needs
