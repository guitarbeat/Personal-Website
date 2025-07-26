# Code Refactoring Task List

## 🎯 Overview
Based on copy-paste detection analysis, this task list consolidates 124 duplicate instances into actionable refactoring tasks.

**Total Duplicates Found**: 124 instances across 57 files  
**Priority**: High (62), Medium (62)  
**Estimated Impact**: 5-10% bundle size reduction, improved maintainability

---

## 🚨 HIGH PRIORITY TASKS

### Task 1: Create API Error Handler Utility
**Files Affected**: `src/components/content/Shop/Checkout.js`, `src/components/content/Shop/Shop.js`  
**Duplicates**: 8 instances  
**Effort**: 2 hours  

**Action Items**:
- [ ] Create `src/utils/apiErrorHandler.js`
- [ ] Implement `handleApiError(error, context)` function
- [ ] Add CORS error detection logic
- [ ] Replace error handling in Checkout.js
- [ ] Replace error handling in Shop.js
- [ ] Test error scenarios

**Code Template**:
```javascript
export const handleApiError = (error, context = '') => {
    let errorMessage = `${context} ${error.response?.data?.error?.message || error.message}`;
    
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        errorMessage = 'CORS Error: Unable to connect to API. Please check your connection.';
    }
    
    return errorMessage;
};
```

### Task 2: Create Reusable Hint Section Component
**Files Affected**: `src/components/content/Header/Header.js`, `src/components/effects/Matrix/Matrix.js`  
**Duplicates**: 6 instances  
**Effort**: 1.5 hours  

**Action Items**:
- [ ] Create `src/components/shared/HintSection.js`
- [ ] Implement `HintSection` component with level props
- [ ] Add PropTypes validation
- [ ] Replace hint sections in Header.js
- [ ] Replace hint sections in Matrix.js
- [ ] Update CSS classes if needed

**Code Template**:
```javascript
export const HintSection = ({ level, currentLevel, children }) => (
    <div className={`hint-section ${level} ${currentLevel >= level ? "visible" : ""}`}>
        <span className="hint-text">{children}</span>
        <div className="hint-divider" />
    </div>
);
```

### Task 3: Create Scroll Threshold Hook
**Files Affected**: `src/components/content/NavBar/NavBar.js`, `src/components/content/Projects/Projects.js`  
**Duplicates**: 4 instances  
**Effort**: 1 hour  

**Action Items**:
- [ ] Create `src/hooks/useScrollThreshold.js`
- [ ] Implement `useScrollThreshold(threshold)` hook
- [ ] Add cleanup and event handling
- [ ] Replace scroll logic in NavBar.js
- [ ] Replace scroll logic in Projects.js
- [ ] Test scroll behavior

**Code Template**:
```javascript
export const useScrollThreshold = (threshold = 300) => {
    const [isAboveThreshold, setIsAboveThreshold] = useState(false);
    
    useEffect(() => {
        const checkScroll = () => {
            setIsAboveThreshold(window.scrollY > threshold);
        };
        
        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, [threshold]);
    
    return isAboveThreshold;
};
```

---

## ⚡ MEDIUM PRIORITY TASKS

### Task 4: Create Throttle Utility
**Files Affected**: `src/components/effects/Blur/scrollSpeed.ts`, `src/components/effects/Moiree/Moiree.js`  
**Duplicates**: 2 instances  
**Effort**: 30 minutes  

**Action Items**:
- [ ] Create `src/utils/throttle.js`
- [ ] Implement `throttle(func, limit)` function
- [ ] Replace throttle in scrollSpeed.ts
- [ ] Replace throttle in Moiree.js
- [ ] Test performance impact

### Task 5: Create Color Generation Utility
**Files Affected**: `src/components/content/Projects/Projects.js`  
**Duplicates**: 3 instances  
**Effort**: 45 minutes  

**Action Items**:
- [ ] Create `src/utils/colorUtils.js`
- [ ] Implement `generateTagColors(keywords, baseColors)` function
- [ ] Add HSL color processing logic
- [ ] Replace color generation in Projects.js
- [ ] Test color consistency

### Task 6: Consolidate Import Statements
**Files Affected**: Multiple files  
**Duplicates**: 12 instances  
**Effort**: 1 hour  

**Action Items**:
- [ ] Identify common import patterns
- [ ] Create shared import utilities if needed
- [ ] Standardize import ordering
- [ ] Update ESLint/Prettier config if needed

---

## 🔧 LOW PRIORITY TASKS

### Task 7: Optimize Small Code Blocks
**Files Affected**: Various  
**Duplicates**: 15 instances  
**Effort**: 2 hours  

**Action Items**:
- [ ] Review small duplicate blocks (< 5 lines)
- [ ] Extract common patterns where beneficial
- [ ] Create micro-utilities if needed
- [ ] Document patterns to prevent future duplication

### Task 8: Create Component Templates
**Files Affected**: Various  
**Duplicates**: 8 instances  
**Effort**: 1.5 hours  

**Action Items**:
- [ ] Create component templates for common patterns
- [ ] Document component creation guidelines
- [ ] Add ESLint rules to prevent duplication
- [ ] Create code snippets for IDE

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1)
- [ ] Set up shared utilities directory structure
- [ ] Create base utility functions
- [ ] Set up testing framework for utilities
- [ ] Document utility usage patterns

### Phase 2: High Priority Refactoring (Week 2)
- [ ] Complete Task 1 (API Error Handler)
- [ ] Complete Task 2 (Hint Section Component)
- [ ] Complete Task 3 (Scroll Threshold Hook)
- [ ] Test all changes thoroughly

### Phase 3: Medium Priority Refactoring (Week 3)
- [ ] Complete Task 4 (Throttle Utility)
- [ ] Complete Task 5 (Color Generation Utility)
- [ ] Complete Task 6 (Import Consolidation)
- [ ] Update documentation

### Phase 4: Optimization (Week 4)
- [ ] Complete Task 7 (Small Code Blocks)
- [ ] Complete Task 8 (Component Templates)
- [ ] Run duplicate detection again
- [ ] Measure improvements

---

## 🎯 SUCCESS METRICS

### Before Refactoring
- **Total Duplicates**: 124 instances
- **Bundle Size**: Current baseline
- **Maintainability**: Current baseline

### After Refactoring (Target)
- **Total Duplicates**: < 20 instances (85% reduction)
- **Bundle Size**: 5-10% reduction
- **Maintainability**: Improved code organization
- **Development Speed**: Faster component creation

---

## 🛠️ TOOLS & COMMANDS

```bash
# Run duplicate detection
npm run detect-duplicates

# Check specific task areas
node copy-paste-detector.js ./src/components/content/Shop
node copy-paste-detector.js ./src/components/content/Header
node copy-paste-detector.js ./src/components/effects

# Measure progress
node copy-paste-detector.js ./src --minLines 3 --similarityThreshold 0.8
```

---

## 📝 NOTES

- **Testing**: Each refactoring should include unit tests
- **Documentation**: Update component documentation after changes
- **Backward Compatibility**: Ensure no breaking changes
- **Performance**: Monitor bundle size and runtime performance
- **Code Review**: All changes should be reviewed by team

---

*Task List Generated: $(date)*  
*Total Tasks: 8*  
*Estimated Total Effort: 10.5 hours*