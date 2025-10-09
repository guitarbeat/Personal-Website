# TODO: Duplicate State Management & Code Quality Issues

## 🔴 Critical Issues - Duplicate State Management

### 1. Duplicate Mobile Detection Logic
- **Status**: ✅ FIXED
- **Files**: `src/components/content/NavBar/NavBar.js`
- **Issue**: NavBar had its own mobile detection logic instead of using the existing `useMobileDetection` hook
- **Solution**: Replaced custom mobile detection with `useMobileDetection` hook

### 2. Duplicate Scroll Detection Logic
- **Status**: ✅ FIXED
- **Files**: `src/hooks/useScrollThreshold.js`, `src/hooks/useScrollPosition.js`
- **Issue**: Both hooks had nearly identical throttling logic
- **Solution**: Created `src/hooks/useScrollUtils.js` with shared throttling utility and refactored both hooks

### 3. Duplicate Mobile Detection in Matrix Rain
- **Status**: ✅ FIXED
- **Files**: `src/components/effects/Matrix/useMatrixRain.js`
- **Issue**: Had its own mobile detection logic conflicting with `useMobileDetection` hook
- **Solution**: Replaced with `useMobileDetection` hook

### 4. Duplicate Password/Passcode State Management
- **Status**: 🔴 CRITICAL - NEEDS FIXING
- **Files**: 
  - `src/components/effects/Matrix/Matrix.js` (password state)
  - `src/components/effects/Matrix/PasscodeInput.jsx` (passcode state)
- **Issue**: Two different components managing similar authentication input state
- **Impact**: Potential state synchronization issues, duplicate logic
- **Recommended Fix**: Consolidate into shared state management or clear separation of concerns

### 5. Duplicate Hint Level State Management
- **Status**: 🔴 CRITICAL - NEEDS FIXING
- **Files**:
  - `src/components/content/Header/Header.js` (hintLevel state)
  - `src/components/effects/Matrix/Matrix.js` (hintLevel state)
- **Issue**: Same hint system logic duplicated across components
- **Impact**: Inconsistent hint behavior, maintenance overhead
- **Recommended Fix**: Extract hint system into shared hook or context

### 6. Duplicate Error State Management
- **Status**: 🟡 MEDIUM - REVIEW NEEDED
- **Files**:
  - `src/utils/printfulHelpers.js` (error state)
  - `src/components/effects/Matrix/PasscodeInput.jsx` (error state)
- **Issue**: Similar error handling patterns across different contexts
- **Impact**: Inconsistent error UX, potential code duplication
- **Recommended Fix**: Consider shared error handling utility or context

## 🟡 Medium Priority Issues

### 7. AuthContext State Management Optimization
- **Status**: 🟡 MEDIUM - REVIEW NEEDED
- **Files**: `src/components/effects/Matrix/AuthContext.js`
- **Issues**:
  - Large dependency array in useMemo (lines 407-426) causing potential unnecessary re-renders
  - Multiple audio-related state variables that could be grouped
  - Redundant `isUnlocked` and `isMobileUnlocked` states could potentially be consolidated
- **Impact**: Performance issues, complex state management
- **Recommended Fix**: 
  - Split context into smaller, focused contexts
  - Group related state variables
  - Optimize dependency arrays

### 8. Unused State Variables Audit
- **Status**: 🟡 MEDIUM - REVIEW NEEDED
- **Files**: Multiple components
- **Issue**: Several state variables may be declared but not fully utilized
- **Examples**:
  - `themeClicks` in NavBar.js (used but complex logic)
  - `isClicked` in Projects.js (simple boolean state)
  - `hoveredCard` in Work.js (may be redundant)
- **Recommended Fix**: Audit each state variable for actual usage and necessity

## 🟢 Low Priority Issues

### 9. State Initialization Patterns
- **Status**: 🟢 LOW - OPTIMIZATION
- **Files**: Multiple components
- **Issue**: Inconsistent state initialization patterns
- **Examples**:
  - Some useState calls use function initializers, others don't
  - Mixed patterns for complex initial state
- **Recommended Fix**: Standardize initialization patterns across codebase

### 10. State Update Patterns
- **Status**: 🟢 LOW - OPTIMIZATION
- **Files**: Multiple components
- **Issue**: Inconsistent state update patterns
- **Examples**:
  - Some components use functional updates, others don't
  - Mixed patterns for state batching
- **Recommended Fix**: Establish consistent state update patterns

## 📋 Implementation Priority

### Phase 1: Critical Fixes (Immediate)
1. Fix duplicate password/passcode state management
2. Fix duplicate hint level state management

### Phase 2: Medium Priority (Next Sprint)
3. Optimize AuthContext state management
4. Audit and clean up unused state variables
5. Review duplicate error state management

### Phase 3: Low Priority (Future)
6. Standardize state initialization patterns
7. Standardize state update patterns

## 🔍 Code Quality Metrics

### Before Cleanup
- **Duplicate State Logic**: 6 instances
- **Unused State Variables**: 3+ potential instances
- **Large Context Dependencies**: 1 instance (20+ dependencies)
- **Inconsistent Patterns**: Multiple instances

### After Cleanup (Target)
- **Duplicate State Logic**: 0 instances
- **Unused State Variables**: 0 instances
- **Large Context Dependencies**: 0 instances
- **Inconsistent Patterns**: Minimal instances

## 📝 Notes

- All fixes should maintain backward compatibility
- Consider adding unit tests for refactored state management
- Document any breaking changes in CHANGELOG.md
- Consider adding ESLint rules to prevent future duplicate state management

---

**Last Updated**: $(date)
**Status**: 3/6 critical issues fixed, 3 remaining