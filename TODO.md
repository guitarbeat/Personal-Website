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
- **Status**: ✅ FIXED
- **Files**:
  - `src/components/effects/Matrix/Matrix.js`
  - `src/components/effects/Matrix/PasscodeInput.jsx`
- **Resolution**: Removed password-based authentication entirely; Matrix hack progress now drives access and PasscodeInput reports status only.

### 5. Duplicate Hint Level State Management
- **Status**: ✅ FIXED (Refined)
- **Files**:
  - `src/components/content/Header/Header.js`
- **Resolution**: Matrix console no longer manages hint levels, leaving hint logic centralized within the header experience. Header avatars now rely on a shared configuration list, ensuring consistent rotation and fallback handling without duplicating markup.

### 6. Duplicate Error State Management
- **Status**: 🟢 LOW - FIXED
- **Files**:
  - `src/utils/printfulHelpers.js`
- **Resolution**: PasscodeInput no longer maintains its own error state, eliminating the duplication concern.

## 🟡 Medium Priority Issues

### 7. AuthContext State Management Optimization
- **Status**: 🟡 MEDIUM - REVIEW NEEDED
- **Files**: `src/components/effects/Matrix/AuthContext.js`
- **Current Notes**:
  - Audio handling and password validation logic have been removed, simplifying the provider
  - Remaining opportunities include reviewing unlock state duplication and memoization scopes
- **Recommended Fix**:
  - Evaluate whether `isUnlocked`/`isMobileUnlocked` can merge safely
  - Consider exposing a lighter-weight selector hook if additional consumers are added

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

**Last Updated**: 2025-10-20
**Status**: 6/6 critical issues fixed, 0 remaining
