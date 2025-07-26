# Code Duplication Analysis Report

## 📊 Summary

- **Total files analyzed**: 57
- **Total code blocks**: 3,847
- **Exact duplicates found**: 62
- **Similar blocks found**: 62
- **Total duplicate instances**: 124

## 🔍 Key Findings

### 1. **Most Duplicated Patterns**

#### **Error Handling Patterns** (High Priority)
**Files affected**: `src/components/content/Shop/Checkout.js`, `src/components/content/Shop/Shop.js`

```javascript
// Pattern found in multiple locations:
try {
    // API call logic
} catch (err) {
    let errorMessage = `Failed to create order: ${err.response?.data?.error?.message || err.message}`;
    
    // Handle CORS errors specifically
    if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        errorMessage = 'CORS Error: Unable to connect to Printful API...';
    }
    
    setError(errorMessage);
    setLoading(false);
}
```

**Recommendation**: Create a shared error handling utility:
```javascript
// utils/apiErrorHandler.js
export const handleApiError = (error, context = '') => {
    let errorMessage = `${context} ${error.response?.data?.error?.message || error.message}`;
    
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        errorMessage = 'CORS Error: Unable to connect to API. Please check your connection.';
    }
    
    return errorMessage;
};
```

#### **useEffect Scroll Handlers** (Medium Priority)
**Files affected**: `src/components/content/NavBar/NavBar.js`, `src/components/content/Projects/Projects.js`

```javascript
// Repeated pattern:
useEffect(() => {
    const checkScroll = () => {
        setShowScrollTop(window.scrollY > 300);
    };
    // ... rest of implementation
}, []);
```

**Recommendation**: Create a custom hook:
```javascript
// hooks/useScrollThreshold.js
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

#### **Throttle Function** (Medium Priority)
**Files affected**: `src/components/effects/Blur/scrollSpeed.ts`, `src/components/effects/Moiree/Moiree.js`

```javascript
// Identical throttle implementation:
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};
```

**Recommendation**: Create a shared utility:
```javascript
// utils/throttle.js
export const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};
```

### 2. **UI Component Duplication**

#### **Hint Section Components** (High Priority)
**Files affected**: `src/components/content/Header/Header.js`, `src/components/effects/Matrix/Matrix.js`

Multiple identical hint section structures with conditional visibility.

**Recommendation**: Create a reusable component:
```javascript
// components/shared/HintSection.js
export const HintSection = ({ level, currentLevel, children }) => (
    <div className={`hint-section ${level} ${currentLevel >= level ? "visible" : ""}`}>
        <span className="hint-text">{children}</span>
        <div className="hint-divider" />
    </div>
);
```

### 3. **Data Processing Patterns**

#### **Color Generation Logic** (Medium Priority)
**Files affected**: `src/components/content/Projects/Projects.js`

```javascript
// Repeated color processing:
const adjustedColors = colorValues.map((color) => {
    return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
});

const generatedTagColors = uniqueKeywords.reduce((acc, keyword, index) => {
    acc[keyword] = adjustedColors[index % adjustedColors.length];
    return acc;
}, {});
```

**Recommendation**: Create a color utility:
```javascript
// utils/colorUtils.js
export const generateTagColors = (keywords, baseColors) => {
    const adjustedColors = baseColors.map(color => 
        `hsl(${color.h}, ${color.s}%, ${color.l}%)`
    );
    
    return keywords.reduce((acc, keyword, index) => {
        acc[keyword] = adjustedColors[index % adjustedColors.length];
        return acc;
    }, {});
};
```

## 🎯 Refactoring Priority Matrix

### **High Priority** (Immediate Action Required)
1. **Error handling patterns** - Affects user experience and maintainability
2. **Hint section components** - UI consistency and DRY principle
3. **API error handling** - Critical for production stability

### **Medium Priority** (Next Sprint)
1. **Scroll handlers** - Improves code organization
2. **Throttle functions** - Reduces bundle size
3. **Color generation logic** - Improves maintainability

### **Low Priority** (Future Enhancement)
1. **Import statements** - Minor optimization
2. **Small code blocks** - Less impactful

## 🛠️ Implementation Plan

### Phase 1: Create Shared Utilities
1. Create `src/utils/apiErrorHandler.js`
2. Create `src/utils/throttle.js`
3. Create `src/hooks/useScrollThreshold.js`

### Phase 2: Create Reusable Components
1. Create `src/components/shared/HintSection.js`
2. Create `src/components/shared/ErrorBoundary.js` (if not exists)
3. Create `src/utils/colorUtils.js`

### Phase 3: Refactor Existing Code
1. Replace error handling patterns with utility functions
2. Replace scroll handlers with custom hooks
3. Replace hint sections with reusable components

### Phase 4: Testing & Validation
1. Run the duplicate detector again
2. Ensure all functionality works correctly
3. Update tests if necessary

## 📈 Expected Benefits

- **Reduced bundle size**: ~5-10% reduction through shared utilities
- **Improved maintainability**: Single source of truth for common patterns
- **Better consistency**: Unified error handling and UI components
- **Faster development**: Reusable components and utilities
- **Reduced bugs**: Centralized logic reduces inconsistencies

## 🔧 Tools & Commands

```bash
# Run duplicate detection
npm run detect-duplicates

# Run with custom options
node copy-paste-detector.js ./src --minLines 5 --similarityThreshold 0.9

# Check specific directories
node copy-paste-detector.js ./src/components/content
```

## 📝 Next Steps

1. **Review this report** with your team
2. **Prioritize refactoring** based on impact and effort
3. **Create shared utilities** for high-priority patterns
4. **Refactor components** to use shared utilities
5. **Run duplicate detection** again to measure improvement
6. **Document new patterns** to prevent future duplication

---

*Report generated by Copy-Paste Detector v1.0*
*Date: $(date)*