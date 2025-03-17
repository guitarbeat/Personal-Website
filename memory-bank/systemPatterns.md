# System Patterns: Personal Website

## Architecture Overview
The website is built as a single-page application (SPA) using React.js with a component-based architecture. It employs client-side routing for navigation between different sections and tools. The design follows a modular approach where components are organized by functionality and reused throughout the application.

## Key Components
- **App**: The root component that manages routing and global state
- **Layout**: Handles the overall page structure and common elements
- **NavBar**: Navigation component for moving between sections
- **Section Components**: Modular components for different content areas (About, Projects, Work)
- **Tool Components**: Interactive utilities like ConflictMediation, Bingo, Needs, and Snake
- **Effect Components**: Visual effects like Matrix, Blur, and Loading animations

## Design Patterns
- **Component Composition**: Building complex UIs from smaller, reusable components
- **Container/Presentational Pattern**: Separating logic from presentation
- **Hooks Pattern**: Using React hooks (useState, useEffect, useCallback) for state management and side effects
- **Memoization**: Using React.memo and useCallback to optimize performance
- **Context API**: For global state management (e.g., AuthProvider)
- **Render Props**: For sharing component logic (e.g., FrameEffect)

## Data Flow
- Component state is managed locally using React hooks
- Global state is handled through Context API
- User interactions trigger state changes which cause re-renders
- Data persistence is handled through localStorage for tools like ConflictMediation
- External data may be fetched from Google Sheets via the GoogleSheetsProvider

## Technical Decisions
- **React.js**: Chosen for its component-based architecture and efficient rendering
- **SCSS**: Used for styling with nested selectors and variables for maintainability
- **Client-side Routing**: Implemented with react-router-dom for seamless navigation
- **Responsive Design**: Media queries and flexible layouts for cross-device compatibility
- **Component Naming**: Components should be named according to their functionality (e.g., renaming Meditation to ConflictMediation for clarity)
- **File Organization**: Structured by feature/component with related files grouped together 