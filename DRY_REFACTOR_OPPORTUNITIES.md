# DRY Refactor Opportunities

## Overview
This document highlights places where the current implementation repeats logic or markup and suggests concrete refactors to make the codebase more DRY (Don't Repeat Yourself). Each recommendation references the files and code paths where duplication appears so future work can focus on the highest-impact wins first.

## 1. Centralize Google Sheets row normalization
Components that rely on `withGoogleSheets` (`About`, `Projects`, and `Work`) each map the raw sheet rows into local objects before rendering. The transformation logic is nearly identical across components and could live in a shared helper or hook.

- `About` builds `{ category, description }` pairs before rendering buttons. 【F:src/components/content/About/About.js†L24-L52】
- `Projects` maps rows to project card props and repeats set-up of derived state like filters and tag colors. 【F:src/components/content/Projects/Projects.js†L64-L126】
- `Work` normalizes the sheet data, enriches it with derived dates, and then calculates timeline metadata in-place. 【F:src/components/content/Work/Work.js†L154-L186】

Creating a small utility (e.g., `normalizeSheetRows(sheetName, mapper)` or a `useSheetData` hook) would eliminate the copy-pasted mapping boilerplate, give every consumer consistent defaults, and make it easier to test the data massaging in isolation.

## 2. Unify pointer-based dragging in the navigation bar
`NavBar` declares three pairs of handlers (`handleTouchStart`/`handleMouseDown`, `handleTouchMove`/`handleMouseMove`, `handleTouchEnd`/`handleMouseUp`) that contain the same state updates and scroll math with only minor differences in the event API. 【F:src/components/content/NavBar/NavBar.js†L48-L124】

Switching to pointer events or a shared `createDragHandlers(ref, options)` utility would remove half of the functions, reduce the number of callbacks recreated on every render, and make it easier to keep the drag experience in sync across input types.

## 3. Extract a reusable “expandable card” pattern
Both the `Projects` and `Work` sections implement click-to-expand cards that toggle CSS classes like `show-text`/`active` to reveal additional content, and they each manage a small piece of state to remember which card has been expanded.

- `ProjectCard` stores `isClicked` to prevent immediate navigation and to reveal the project description. 【F:src/components/content/Projects/Projects.js†L16-L59】
- The work history list uses a `Set` of active card slugs and hover state to drive the same visual reveal. 【F:src/components/content/Work/Work.js†L188-L253】

A shared `useExpandableCards` hook or an `ExpandableCard` component could encapsulate the toggling logic, animation classes, and accessibility attributes so each section only supplies its specific content.

## 4. Move filter button styling out of inline objects
Project tag filters rebuild an identical inline style object on every render to express different selected/unselected states. 【F:src/components/content/Projects/Projects.js†L133-L159】

Extracting the style differences into SCSS modifiers (e.g., `.tag--active`) or a small helper such as `getTagStyles(isActive, color)` would keep the JSX clean, prevent inline style churn, and make the hover/transition rules easier to tweak without editing JavaScript.

## 5. ✅ Generate avatar images programmatically in the header
`Header` now renders avatars by iterating over a shared `PROFILE_IMAGES` array, consolidating duplicate markup and centralizing the fallback selection. 【F:src/components/content/Header/Header.js†L215-L273】
