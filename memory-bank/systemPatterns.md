# System Patterns: Personal Website

## Architecture Overview
The personal website is built using a modern React architecture with a focus on component-based design, responsive layouts, and interactive tools. The system uses a comprehensive SASS architecture for styling, with a focus on maintainability, reusability, and performance.

## Key Components

### Core Website
- **Header**: Main navigation and branding
- **Footer**: Site information and secondary navigation
- **ThemeSwitch**: Controls for switching between light, dark, and cosmic themes
- **Content**: Main content sections of the website

### Tools Section
- **ToolsSection**: Container for all interactive tools
- **ToolSelector**: Navigation for selecting different tools
- **ToolContainer**: Wrapper for individual tools with shared styling
- **Individual Tools**:
  - **EmotionWheel**: Interactive tool for identifying emotions
  - **ConflictMediation**: Step-by-step conflict resolution guide
  - **Bingo**: Custom bingo game creator and player
  - **Snake**: Classic snake game with modern visuals

## Design Patterns

### Component Composition
- Components are composed of smaller, reusable components
- Higher-order components are used for shared functionality
- Container/presentation pattern for separating logic and UI

### State Management
- React Context for global state (theme, preferences)
- Local component state for UI-specific state
- Local storage for persistence of user preferences and tool data

### Styling Architecture
- 7-1 SASS Architecture pattern (adapted)
- Component-specific styles with global variables and mixins
- Responsive design using mixins and breakpoints
- Theme switching using CSS custom properties
- Proper nesting with `& {}` blocks for declarations after nested rules
- Keyframes in dedicated files
- Proper namespacing for SASS imports

### Responsive Design
- Mobile-first approach
- Breakpoint mixins for consistent media queries
- Fluid typography and spacing
- Adaptive layouts based on screen size
- Touch-friendly controls for mobile devices

## Data Flow
1. User interacts with the website or tools
2. Component state is updated based on user actions
3. UI renders based on updated state
4. Data is persisted to local storage when needed
5. Global state (theme, preferences) is shared across components

## Technical Decisions

### SASS Architecture
- **Decision**: Use a modified 7-1 SASS Architecture
- **Rationale**: Provides a clear structure for organizing styles, makes maintenance easier, and promotes reusability

### Component-Based Design
- **Decision**: Use a component-based architecture with React
- **Rationale**: Promotes reusability, maintainability, and a clear separation of concerns

### Theme Switching
- **Decision**: Use CSS custom properties for theme switching
- **Rationale**: Allows for dynamic theme changes without page reload, reduces CSS duplication

### Local Storage for Persistence
- **Decision**: Use local storage for persisting user preferences and tool data
- **Rationale**: Provides a simple way to persist data without requiring a backend

### Modern SASS Practices
- **Decision**: Adopt modern SASS practices (e.g., `@use` instead of `@import`, proper namespacing)
- **Rationale**: Follows best practices, improves maintainability, and prepares for future SASS versions

## SASS Architecture Details

### Directory Structure
```
src/
├── sass/
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   ├── _functions.scss
│   │   ├── _mixins.scss
│   │   └── _placeholders.scss
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── _base.scss
│   ├── components/
│   │   ├── _buttons.scss
│   │   ├── _carousel.scss
│   │   └── _slider.scss
│   ├── layout/
│   │   ├── _navigation.scss
│   │   ├── _grid.scss
│   │   ├── _header.scss
│   │   └── _footer.scss
│   ├── pages/
│   │   ├── _home.scss
│   │   └── _contact.scss
│   ├── themes/
│   │   ├── _theme-switch.scss
│   │   ├── _light.scss
│   │   └── _dark.scss
│   ├── vendors/
│   │   └── _normalize.scss
│   └── main.scss
└── components/
    ├── Header/
    │   ├── Header.js
    │   └── header.scss
    ├── Footer/
    │   ├── Footer.js
    │   └── footer.scss
    └── Tools/
        ├── styles/
        │   └── index.scss
        ├── shared/
        │   └── styles/
        │       └── index.scss
        └── components/
            ├── EmotionWheel/
            │   ├── EmotionWheel.js
            │   └── styles.scss
            └── ConflictMediation/
                ├── ConflictMediation.js
                └── styles.scss
```

### Key SASS Files

#### _breakpoints.scss
Contains breakpoint definitions and mixins for responsive design:
```scss
@use "sass:map";

$breakpoints: (
  "phone": 25em,       // 400px
  "mobile": 30em,      // 480px
  "tablet-sm": 37.5em, // 600px
  "tablet": 48em,      // 768px
  "desktop-sm": 56em,  // 896px
  "desktop": 64em,     // 1024px
  "desktop-lg": 85.375em, // 1366px
  "small": 25em,       // 400px
  "medium": 48em       // 768px
);

// JavaScript usage
:export {
  phoneWidth: map.get($breakpoints, "phone");
  mobileWidth: map.get($breakpoints, "mobile");
  tabletSmWidth: map.get($breakpoints, "tablet-sm");
  tabletWidth: map.get($breakpoints, "tablet");
  desktopSmWidth: map.get($breakpoints, "desktop-sm");
  desktopWidth: map.get($breakpoints, "desktop");
  desktopLgWidth: map.get($breakpoints, "desktop-lg");
  smallWidth: map.get($breakpoints, "small");
  mediumWidth: map.get($breakpoints, "medium");
}
```

#### _mixins.scss
Contains reusable mixins for common patterns:
```scss
@use "sass:map";
@use "breakpoints" as bp;

// Responsive breakpoint mixin
@mixin respond($breakpoint) {
  @if map.has-key(bp.$breakpoints, $breakpoint) {
    @media (max-width: map.get(bp.$breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @error "Unknown breakpoint: #{$breakpoint}";
  }
}

// Container mixin
@mixin container {
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
  padding: 0 2rem;
  
  @include respond("tablet") {
    & {
      padding: 0 1.5rem;
    }
  }
  
  @include respond("mobile") {
    & {
      padding: 0 1rem;
    }
  }
}

// Reduced motion mixin
@mixin reduced-motion {
  @media (prefers-reduced-motion: reduce) {
    & {
      animation: none !important;
      transition: none !important;
    }
  }
}
```

### Recent Improvements

#### Fixed SASS Deprecation Warnings
- Wrapped declarations after nested rules in `& {}` blocks
- Removed `&` selectors from keyframes
- Ensured proper nesting in media queries
- Added proper namespacing to SASS imports

#### Improved Integration
- Standardized breakpoint usage
- Integrated Tools styles with main SASS architecture
- Replaced hardcoded values with global variables
- Leveraged existing mixins instead of redefining them

#### Enhanced Maintainability
- Improved component scoping
- Added comments for complex sections
- Organized styles more logically
- Moved keyframes to dedicated files

## File References
- `src/sass/_breakpoints.scss`: Breakpoint definitions and mixins
- `src/sass/_mixins.scss`: Reusable mixins for common patterns
- `src/sass/_base.scss`: Base styles and global CSS variables
- `src/sass/theme/_theme-switch.scss`: Theme switching functionality
- `src/components/Tools/shared/styles/index.scss`: Shared styles for tools
- `src/components/Tools/styles/index.scss`: Main styles for tools section
- `src/components/content/Header/text.scss`: Typography styles for header
