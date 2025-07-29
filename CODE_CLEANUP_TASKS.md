# Code Cleanup Tasks - Duplicate Code Detection Results

## Summary
JavaScript Copy-Paste Detector (JSCPD) analysis found **20 code clones** across the codebase, affecting **116 lines (1.54%)** and **1013 tokens (1.65%)**. The analysis focused on JavaScript and TypeScript files with a minimum threshold of 25 tokens and 3 lines.

## High Priority Duplications

### 1. Matrix.js Character Initialization (9.37% duplication)
- **Files**: `src/components/effects/Matrix/Matrix.js`
- **Lines**: 120-125 and 151-156 (5 lines, 65 tokens)
- **Issue**: Duplicated character speed, fontSize, and opacity initialization logic
- **Impact**: High - Core animation logic

### 2. Shop Error Handling (11.05% and 6.64% duplication)
- **Files**: `src/components/content/Shop/Shop.js` and `src/components/content/Shop/Checkout.js`
- **Lines**: Shop.js (63-76), Checkout.js (87-100) - 13 lines, 79 tokens
- **Issue**: Duplicated CORS error handling and loading state management
- **Impact**: High - User experience and error handling

### 3. Printful Product Parsing
- **Files**: `src/components/content/Shop/Shop.js` and `src/components/content/Shop/Checkout.js`
- **Lines**: Shop.js (120-123), Checkout.js (100-103) - 3 lines, 50 tokens
- **Issue**: Duplicated sync_product/sync_variants/price extraction logic
- **Impact**: Medium - Data parsing consistency

### 4. Header/Matrix Hint Sections (8.16% and 11.13% duplication)
- **Files**: `src/components/content/Header/Header.js` and `src/components/effects/Matrix/Matrix.js`
- **Multiple duplicated blocks**:
  - Lines 82-86 and 285-289 (4 lines, 39 tokens)
  - Lines 86-93 and 289-296 (7 lines, 62 tokens)
  - Lines 94-101 and 299-306 (7 lines, 61 tokens)
  - Lines 101-106 and 308-313 (5 lines, 45 tokens)
- **Issue**: Duplicated hint section JSX structure
- **Impact**: High - UI consistency and maintainability

## Medium Priority Duplications

### 5. Throttle Implementation (37.84% duplication)
- **File**: `src/utils/throttle.js`
- **Lines**: 11-18 and 31-38 (7 lines, 46 tokens)
- **Issue**: Duplicated throttle logic within the same file
- **Impact**: Critical - Utility function integrity

### 6. ConflictMediation Form Components (6.67% and 12.5% duplication)
- **Files**: `src/components/Tools/ConflictMediation/ReflectionPrompts.js`, `ConflictMediation.js`, `EmotionSelector.js`
- **Multiple duplicated form field and emotion selector structures**
- **Issue**: Duplicated form field JSX and emotion selector rendering
- **Impact**: Medium - Component reusability

### 7. Snake Game Drawing/Canvas Logic (2.66% duplication)
- **File**: `src/components/Tools/Snake/SnakeGame.js`
- **Multiple duplicated blocks**:
  - Drawing utilities (lines 592-598 and 607-613)
  - Canvas sizing logic (lines 766-770 and 826-830)
  - Keyboard event handling (lines 864-868)
- **Issue**: Duplicated game rendering and input handling
- **Impact**: Medium - Game performance and maintainability

## Low Priority Duplications

### 8. Fullscreen Icons (2.68% duplication)
- **File**: `src/components/Tools/ToolsSection/FullscreenWrapper.js`
- **Lines**: 86-90 and 95-99 (4 lines, 44 tokens)
- **Issue**: Duplicated SVG icon definitions
- **Impact**: Low - Icon consistency

### 9. Google Apps Script Calls (3.62% duplication)
- **File**: `src/components/Core/googleApps.js`
- **Lines**: 188-192 and 197-201 (4 lines, 42 tokens)
- **Issue**: Duplicated callAppsScript structure
- **Impact**: Low - API call consistency

### 10. State Initialization Patterns
- **Files**: `src/components/Tools/Bingo/BingoGame.js` and `src/components/content/Shop/Shop.js`
- **Issue**: Duplicated useState patterns for loading/error states
- **Impact**: Low - State management consistency

## Cleanup Strategy

### Phase 1: High-Impact Utilities
1. ✅ Extract shared error handling utility for Shop components
2. ✅ Create shared product parsing utility for Printful data
3. ✅ Fix throttle.js implementation
4. ✅ Extract hint section components

### Phase 2: Component Refactoring
1. ✅ Refactor Matrix.js character initialization
2. ✅ Extract form field components for ConflictMediation
3. ✅ Consolidate Snake game utilities
4. ✅ Extract keyboard event handlers

### Phase 3: Minor Optimizations
1. ✅ Extract fullscreen icon components
2. ✅ Consolidate Google Apps Script calls
3. ✅ Create shared state initialization hooks
4. ✅ Clean up scroll animation utilities

### Phase 4: Dead Code Analysis
1. ✅ Analyze unused imports and exports
2. ✅ Identify unused files and components
3. ✅ Remove dead code and update dependencies

## Files with Highest Duplication Rates
1. `src/utils/throttle.js` - 37.84% (Critical)
2. `src/components/Tools/ConflictMediation/EmotionSelector.js` - 12.5%
3. `src/components/content/Shop/Shop.js` - 11.05%
4. `src/components/effects/Matrix/Matrix.js` - 9.37%
5. `src/components/content/Header/Header.js` - 8.16%

## Next Steps
1. Start with the throttle.js fix (highest duplication rate)
2. Extract shared utilities for Shop components
3. Refactor Matrix.js and Header.js hint sections
4. Create reusable form components
5. Analyze and remove dead code

---
*Generated from JSCPD analysis on 2025-07-29*