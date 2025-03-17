# Technical Context: Personal Website Tools

## Technology Stack
- Frontend:
  - React 18.2.0
  - SASS 1.69.5
  - TypeScript 5.0.4
  - Next.js 13.4.19
  - Framer Motion 10.16.4
- State Management:
  - React Context API
  - localStorage for persistence
- Testing:
  - Jest 29.5.0
  - React Testing Library 14.0.0
- Build Tools:
  - Craco 7.1.0
  - Webpack 5.88.2
- Infrastructure:
  - Vercel (deployment)
  - GitHub Actions (CI/CD)

## Development Environment
- Node.js: v18.17.0
- npm: 9.6.7
- VSCode Extensions:
  - SASS
  - ESLint
  - Prettier
  - TypeScript
  - Jest Runner

## Dependencies
- @craco/craco: ^7.1.0 - Build configuration override
- sass: ^1.69.5 - SASS preprocessing
- framer-motion: ^10.16.4 - Animation library
- @types/react: ^18.2.0 - React type definitions
- @testing-library/react: ^14.0.0 - Testing utilities
- eslint: ^8.45.0 - Code linting
- prettier: ^2.8.8 - Code formatting

## Technical Constraints
- SASS Architecture:
  - Must use @use syntax for imports
  - @use statements must come before any CSS rules
  - Global variables and mixins must be used where available
  - Component styles must be properly scoped
  - Media queries must use mix.respond mixin
  - Transitions must specify exact properties
  - Must support reduced motion preferences
  - Declarations after nested rules must be wrapped in `& {}` blocks
  - Keyframes must be defined without `&` selectors
  - Keyframes should be organized in dedicated files

## SASS Best Practices
- Use CSS custom properties for theme-related values
- Avoid using `transition: all` for performance reasons
- Use will-change property sparingly
- Provide reduced motion alternatives
- Namespace imports with meaningful aliases
- Keep component styles properly scoped
- Use mixins for repeated patterns
- Use the `& {}` wrapper for declarations after nested rules
- Move keyframes to dedicated files
- Ensure proper nesting in media queries

## SASS Deprecation Warnings
The project has addressed several Sass deprecation warnings:

1. **Declarations After Nested Rules**:
   - Problem: Sass's behavior for declarations that appear after nested rules will be changing to match CSS behavior.
   - Solution: Wrap declarations in `& {}` blocks to opt into the new behavior.
   - Example:
     ```scss
     .selector {
       .nested {
         color: blue;
       }
       
       & {
         color: red; // Wrapped in & {} to opt into new behavior
       }
     }
     ```

2. **Keyframe Animations**:
   - Problem: `&` selectors are not allowed in keyframe blocks.
   - Solution: Define keyframes without `&` selectors and move them to dedicated files.
   - Example:
     ```scss
     // Correct
     @keyframes fadeIn {
       0% { opacity: 0; }
       100% { opacity: 1; }
     }
     
     // Incorrect
     @keyframes fadeIn {
       0% { & { opacity: 0; } }
       100% { & { opacity: 1; } }
     }
     ```

3. **Media Queries**:
   - Problem: Declarations in media queries after nested rules need proper nesting.
   - Solution: Ensure proper nesting with `& {}` blocks in media queries.
   - Example:
     ```scss
     @media (max-width: 768px) {
       .selector {
         & {
           padding: 1rem;
         }
       }
     }
     ```

## Build Process
- Development: npm start
- Production Build: npm run build
- Testing: npm test
- Linting: npm run lint
- Formatting: npm run format

## Deployment
- Continuous Deployment via Vercel
- Production URL: https://www.example.com
- Staging URL: https://staging.example.com

## Performance Considerations
- Code Splitting: Lazy load tool components
- Image Optimization: Use Next.js Image component
- Animation Performance: Use hardware-accelerated properties
- Reduced Motion: Support prefers-reduced-motion
- Bundle Size: Monitor with webpack-bundle-analyzer

## Accessibility Requirements
- WCAG 2.1 AA Compliance
- Keyboard Navigation
- Screen Reader Support
- Reduced Motion Support
- Sufficient Color Contrast
- Proper ARIA Attributes
