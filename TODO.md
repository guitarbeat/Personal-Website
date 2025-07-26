# Personal Website - TODO List

## 🎯 **Priority 1: Code Duplication Cleanup (Critical)**

### JavaScript Duplication

- [ ] **Create shared ErrorDisplay component**
  - Extract duplicate error message JSX from `Shop.js` and `Checkout.js`
  - Create `src/components/shared/ErrorDisplay.js`
  - Replace duplicate error display code in both components
  - **Impact**: Eliminates 1 JavaScript clone (21 lines)

### SCSS Duplication

- [ ] **Consolidate typography styles**
  - Merge duplicate styles between `src/sass/_typography.scss` and `src/sass/_typography-custom.scss`
  - Remove duplicate typography patterns (22 lines, 111 tokens)
  - **Impact**: Reduces SCSS duplication significantly

- [ ] **Clean up CSS variables duplication**
  - Remove duplicate patterns in `src/sass/_css-variables.scss` (26 lines total)
  - Consolidate similar variable definitions
  - **Impact**: Eliminates 3 SCSS clones

- [ ] **Consolidate component-specific styles**
  - Merge duplicate styles in `src/components/Tools/shared/styles/`
  - Consolidate duplicate styles in `src/components/Tools/ToolsSection/styles/`
  - **Impact**: Eliminates 2 SCSS clones

## 🚀 **Priority 2: Code Quality & Architecture**

### Shared Utilities

- [ ] **Create Printful API utilities**
  - Create `src/utils/printfulApi.js`
  - Extract common API call patterns from Shop.js and Checkout.js
  - Create reusable functions for product fetching, order creation
  - **Impact**: Reduces code duplication and improves maintainability

- [ ] **Create environment validation utilities**
  - Create `src/utils/printfulConfig.js`
  - Extract duplicate environment variable validation logic
  - Create reusable validation functions
  - **Impact**: Eliminates duplicate validation code

- [ ] **Create shared constants**
  - Create `src/constants/printful.js`
  - Extract hardcoded strings, URLs, and API endpoints
  - **Impact**: Centralizes configuration and reduces magic strings

### Component Refactoring

- [ ] **Create reusable form components**
  - Extract duplicate form input patterns from Checkout.js
  - Create `src/components/shared/FormInput.js`
  - Create `src/components/shared/AddressForm.js`
  - **Impact**: Reduces form duplication and improves reusability

- [ ] **Create shared validation logic**
  - Extract duplicate validation patterns
  - Create `src/utils/validation.js`
  - **Impact**: Centralizes validation logic

## 🎨 **Priority 3: UI/UX Improvements**

### Shop Component

- [ ] **Improve product card design**
  - Add loading states for product images
  - Improve error handling for missing product data
  - Add product filtering/sorting options
  - **Impact**: Better user experience

- [ ] **Enhance checkout flow**
  - Add order confirmation page
  - Improve form validation feedback
  - Add progress indicators
  - **Impact**: Smoother checkout experience

### General UI

- [ ] **Add loading states**
  - Implement loading spinners for API calls
  - Add skeleton loaders for product cards
  - **Impact**: Better perceived performance

- [ ] **Improve error handling**
  - Add retry mechanisms for failed API calls
  - Implement better error messages
  - **Impact**: Better user experience during errors

## 🔧 **Priority 4: Technical Debt**

### Performance

- [ ] **Optimize API calls**
  - Implement caching for product data
  - Add request debouncing
  - **Impact**: Faster loading times

- [ ] **Code splitting**
  - Lazy load shop components
  - Split large components into smaller chunks
  - **Impact**: Better initial load performance

### Testing

- [ ] **Add unit tests**
  - Test utility functions
  - Test component logic
  - **Impact**: Better code reliability

- [ ] **Add integration tests**
  - Test API integration
  - Test checkout flow
  - **Impact**: Ensures features work correctly

## 📦 **Priority 5: Features & Enhancements**

### Shop Features

- [ ] **Add product search**
  - Implement search functionality
  - Add filters (price, category, etc.)
  - **Impact**: Better product discovery

- [ ] **Add shopping cart**
  - Implement cart functionality
  - Allow multiple items per order
  - **Impact**: Better shopping experience

- [ ] **Add product reviews/ratings**
  - Display product reviews
  - Allow customers to leave reviews
  - **Impact**: Better product information

### Analytics & Monitoring

- [ ] **Add analytics**
  - Track shop interactions
  - Monitor conversion rates
  - **Impact**: Better insights into user behavior

- [ ] **Add error monitoring**
  - Implement error tracking
  - Monitor API failures
  - **Impact**: Better debugging and maintenance

## 🧹 **Priority 6: Cleanup & Maintenance**

### Code Organization

- [ ] **Reorganize file structure**
  - Move shared components to appropriate directories
  - Consolidate utility functions
  - **Impact**: Better code organization

- [ ] **Update documentation**
  - Document API integration
  - Update README with setup instructions
  - **Impact**: Better developer experience

### Dependencies

- [ ] **Update dependencies**
  - Update React and related packages
  - Remove unused dependencies
  - **Impact**: Security and performance improvements

## 📊 **Progress Tracking**

### Completed ✅

- [x] **Remove backup SCSS files** - Eliminated 92% of code duplication
- [x] **Fix Printful API integration** - Resolved CORS and product ID issues
- [x] **Implement proxy configuration** - Fixed API connectivity
- [x] **Add comprehensive error handling** - Better user feedback
- [x] **Create shared ErrorDisplay component** - Eliminated JavaScript duplication (21 lines)
- [x] **Create shared Printful configuration utilities** - Centralized env var validation and API headers
- [x] **Create shared constants** - Eliminated magic strings and centralized configuration

### In Progress 🔄

- [ ] Code duplication cleanup
- [ ] Shared component creation

### Next Up 📋

- [ ] Consolidate typography styles (remaining SCSS duplication)
- [ ] Clean up CSS variables duplication
- [ ] Consolidate component-specific styles

---

## 📈 **Metrics & Goals**

### Code Quality Goals

- **Target**: < 0.5% code duplication (currently 1.07% - 10% improvement!)
- **Target**: 100% component test coverage
- **Target**: < 3 second initial load time

### Feature Goals

- **Target**: Complete checkout flow
- **Target**: Add product search
- **Target**: Implement shopping cart

### Performance Goals

- **Target**: < 1 second API response time
- **Target**: 100% uptime for shop functionality
- **Target**: Mobile-first responsive design

---

*Last updated: $(date)*
*Total tasks: 25*
*Completed: 7*
*Remaining: 18*
