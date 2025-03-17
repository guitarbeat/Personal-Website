# Technical Context: Personal Website

## Technology Stack

- **Frontend**: React, TypeScript, JavaScript
- **Styling**: Styled Components, SCSS
- **Animation**: Framer Motion
- **State Management**: React Hooks, Context API
- **Build Tools**: Webpack, npm
- **Version Control**: Git

## Development Environment

- **Node.js**: Latest LTS version
- **Package Manager**: npm
- **Code Editor**: Cursor
- **Browser DevTools**: Chrome/Firefox for debugging
- **OS**: macOS (darwin 24.4.0)

## Dependencies

- **react**: ^18.x - Core React library
- **react-router-dom**: ^6.x - Routing
- **styled-components**: ^5.x - Styled components
- **framer-motion**: ^10.x - Animations
- **tone**: ^14.x - Audio synthesis
- **@types/react**: ^18.x - TypeScript definitions

## Technical Constraints

- **Must maintain clean code practices**
- **Must handle component lifecycle properly**
- **Must clean up resources (event listeners, audio, etc.)**
- **Must follow React best practices**
- **Must maintain TypeScript type safety**

## Build & Deployment

- **Development**: `npm start` for local development server
- **Build**: `npm run build` for production build
- **Testing**: Jest and React Testing Library
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier

## Code Organization

- **/src**
  - **/components**
    - **/Tools**
      - **/ToolsSection**
      - **/Snake**
      - **/Bingo**
      - **/ConflictMediation**
    - **/effects**
    - **/shared**
  - **/styles**
  - **/utils**

## Resource Management

- **Audio resources cleaned up on unmount**
- **Event listeners properly removed**
- **Memory leaks prevented through proper cleanup**
- **Fullscreen mode handled gracefully**
- **Component state managed efficiently**

## Performance Considerations

- **Code splitting for tools**
- **Lazy loading of components**
- **Optimized animations**
- **Efficient resource cleanup**
- **Proper error boundaries**
- **Responsive design patterns**
