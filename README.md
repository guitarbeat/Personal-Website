# Personal Website

This is a personal website designed to showcase my work and experience. The live site currently highlights four core sections:

- **Header** – a hero section featuring my name, role, and quick links.
- **About** – background information and a short personal narrative.
- **Projects** – a curated list of projects with concise descriptions.
- **Work** – professional roles and responsibilities from my career history.

The website is built with React, JavaScript, HTML, and Sass. The design emphasizes clarity and quick access to the most relevant information. I hope you enjoy exploring the available sections and learning more about my work.

## Features

- Responsive layout that adapts to mobile and desktop screens
- Navigation bar with quick links to the Header, About, Projects, and Work sections
- Animated hero section with interactive visual effects
- Projects and Work sections populated through Google Sheets content
- Back to top button for easy navigation

## How to Use

To view the website, simply visit the link provided. The website is mobile-friendly and can be accessed on any device. Use the navigation bar at the top of the page to jump between the Header, About, Projects, and Work sections. The Projects and Work sections are sourced from Google Sheets, so updates there automatically appear on the site. Click the back to top button in the bottom right corner to quickly return to the top of the page.

## Future Plans

Future enhancements may include additional content sections—such as a blog, publications archive, and contact form—once the supporting features are implemented. Stay tuned for updates and new additions to the website.
This is a personal website designed to highlight my work and experience. The site currently focuses on four primary sections—Header, About, Projects, and Work—that present a concise overview of who I am, what I build, and how I work.

The website is built with React, Sass, and modern JavaScript. Its layout emphasizes clarity and polish so visitors can quickly explore the featured sections and learn more about my background.

## Features

- Responsive layout optimized for both mobile and desktop viewing
- Hero-style header with social links, a theme toggle, and quick navigation
- About section with a concise biography and supplemental media embeds
- Projects grid that spotlights selected work with dynamic tag styling
- Work timeline outlining professional experience and key achievements
- Back to top button and sticky navigation for smooth browsing

## How to Use

Visit the live site on any device to explore the content. The navigation bar and in-page anchor links let you jump directly to the Header, About, Projects, and Work sections. Use the theme toggle in the header to switch between light and dark modes, and the floating back-to-top button to quickly return to the top of the page.

## Future Plans

Upcoming improvements include expanding the showcased projects, refining the work timeline with additional context, and introducing new interactive elements that complement the existing sections.

## Development Notes

- Run `./setup.sh` after cloning to install dependencies.
- Run `npm run compress-images` to write optimized copies to `src/assets/images/optimized`.
- The same command also converts JPEG/PNG files to `.avif` using `imagemin-avif` (requires Node.js 18 or later).
- A pre-commit hook runs this command automatically.
- Consider using Git LFS for large image files.
- Optional [Vercel Analytics](https://vercel.com/docs/analytics/quickstart) support is gated behind the `REACT_APP_ENABLE_VERCEL_ANALYTICS` environment variable. Set it to `true` when your deployment has Web Analytics enabled.

## Project Structure

### Directory Overview

| Directory | Description | Key Files | Status |
|-----------|-------------|-----------|--------|
| `/src` | Main source code directory | `App.js`, `index.js` | ✅ Active |
| `/src/components` | React components organized by type | `content/`, `Core/`, `effects/`, `shared/` | ✅ Active |
| `/src/components/content` | Main page content components | `About/`, `Header/`, `NavBar/`, `Projects/`, `Work/` | ✅ Active |
| `/src/components/effects` | Visual effects and animations | `Blur/`, `Loading/`, `Matrix/`, `Moiree/` | ✅ Active |
| `/src/sass` | Styling and SCSS files | `main.scss`, theme files, utilities | ✅ Active |
| `/src/assets` | Static assets (images, audio, documents) | `images/`, `audio/`, `documents/` | ✅ Active |
| `/src/hooks` | Custom React hooks | `useMobileDetection.js`, `useScrollThreshold.js` | ✅ Active |
| `/src/utils` | Utility functions | `audioUtils.js`, `colorUtils.js`, `throttle.js` | ✅ Active |
| `/public` | Public static files | `index.html`, `favicon.ico` | ✅ Active |

### Project Structure Diagram

```
personal-website/
├── 📁 public/
│   ├── 📁 assets/audio/
│   ├── 📄 favicon.ico
│   └── 📄 index.html
├── 📁 src/
│   ├── 📄 App.js
│   ├── 📄 index.js
│   ├── 📁 assets/
│   │   ├── 📁 audio/
│   │   ├── 📁 documents/
│   │   └── 📁 images/
│   ├── 📁 components/
│   │   ├── 📁 content/
│   │   │   ├── 📁 About/
│   │   │   ├── 📁 Header/
│   │   │   ├── 📁 NavBar/
│   │   │   ├── 📁 Projects/
│   │   │   └── 📁 Work/
│   │   ├── 📁 Core/
│   │   │   ├── 📄 constants.js
│   │   │   └── 📄 ErrorBoundary.js
│   │   ├── 📁 effects/
│   │   │   ├── 📁 Blur/
│   │   │   ├── 📁 Loading/
│   │   │   ├── 📁 Matrix/
│   │   │   └── 📁 Moiree/
│   │   ├── 📁 shared/
│   │   │   └── 📄 ErrorDisplay.js
│   │   └── 📄 index.js
│   ├── 📁 hooks/
│   │   ├── 📄 useMobileDetection.js
│   │   └── 📄 useScrollThreshold.js
│   ├── 📁 sass/
│   │   ├── 📄 main.scss
│   │   ├── 📁 theme/
│   │   ├── 📁 utilities/
│   │   └── 📄 _*.scss (various SCSS modules)
│   ├── 📁 types/
│   │   └── 📄 declarations.d.ts
│   └── 📁 utils/
│       ├── 📄 audioUtils.js
│       ├── 📄 colorUtils.js
│       ├── 📄 printfulConfig.js
│       ├── 📄 printfulHelpers.js
│       └── 📄 throttle.js
├── 📄 package.json
├── 📄 README.md
├── 📄 setup.sh
└── 📄 *.config.js (various config files)
```

### Complete File Structure

#### Core Application Files

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `App.js` | React Component | Main application component with routing, authentication, and layout management | React Router, Google Sheets, Matrix effects | ✅ Active |
| `index.js` | Entry Point | Application entry point with error boundaries and lazy loading | React, React DOM | ✅ Active |

#### Custom Hooks

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `hooks/useMobileDetection.js` | React Hook | Responsive breakpoint detection and mobile device utilities | React | ✅ Active |
| `hooks/useScrollThreshold.js` | React Hook | Scroll position detection with throttling for performance | React | ✅ Active |

#### Utility Functions

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `utils/audioUtils.js` | Utility Class | Audio management with Knight Rider theme, Web Audio API, and fade effects | Web Audio API | ✅ Active |
| `utils/colorUtils.js` | Utility Functions | Color generation and HSL color management for dynamic theming | None | ✅ Active |
| `utils/throttle.js` | Utility Functions | Function throttling with advanced options for performance optimization | None | ✅ Active |
| `utils/printfulConfig.js` | Configuration | Printful API configuration and settings | None | ✅ Active |
| `utils/printfulHelpers.js` | Utility Functions | Printful API helper functions and utilities | None | ✅ Active |

#### Type Definitions

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `types/declarations.d.ts` | TypeScript | Type declarations for external modules and file types | TypeScript | ✅ Active |

#### Core Components

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `components/Core/constants.js` | Configuration | Application constants including Google Sheets config and navigation items | None | ✅ Active |
| `components/Core/ErrorBoundary.js` | React Component | Error boundary for catching and handling React errors | React | ✅ Active |
| `components/index.js` | Barrel Export | Centralized exports for all main components | React Components | ✅ Active |
| `components/shared/ErrorDisplay.js` | React Component | Reusable error display component | React | ✅ Active |

#### Content Components

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `components/content/About/About.js` | React Component | About section with expandable content and Google Sheets integration | React, Google Sheets | ✅ Active |
| `components/content/About/about.scss` | Styles | About component styling | SCSS | ✅ Active |
| `components/content/Header/Header.js` | React Component | Main header with profile images, social links, and scramble effect | React, Custom Hook | ✅ Active |
| `components/content/Header/header.scss` | Styles | Header component styling | SCSS | ✅ Active |
| `components/content/Header/text.scss` | Styles | Header text styling and animations | SCSS | ✅ Active |
| `components/content/Header/useScrambleEffect.js` | React Hook | Text scrambling animation effect for header | React | ✅ Active |
| `components/content/NavBar/NavBar.js` | React Component | Navigation bar with matrix and scroll activation | React | ✅ Active |
| `components/content/NavBar/navbar.scss` | Styles | Navigation bar styling | SCSS | ✅ Active |
| `components/content/Projects/Projects.js` | React Component | Projects showcase section | React | ✅ Active |
| `components/content/Projects/projects.scss` | Styles | Projects component styling | SCSS | ✅ Active |
| `components/content/Work/Work.js` | React Component | Work experience section | React | ✅ Active |
| `components/content/Work/work.scss` | Styles | Work component styling | SCSS | ✅ Active |

#### Visual Effects Components

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `components/effects/Blur/BlurSection.js` | React Component | Motion blur effect wrapper component | React | ✅ Active |
| `components/effects/Blur/bodyScroll.ts` | TypeScript | Body scroll management utilities | TypeScript | ✅ Active |
| `components/effects/Blur/domUtils.ts` | TypeScript | DOM manipulation utilities for blur effects | TypeScript | ✅ Active |
| `components/effects/Blur/id.ts` | TypeScript | ID generation utilities | TypeScript | ✅ Active |
| `components/effects/Blur/index.ts` | TypeScript | Blur effects barrel export | TypeScript | ✅ Active |
| `components/effects/Blur/point.ts` | TypeScript | Point calculation utilities | TypeScript | ✅ Active |
| `components/effects/Blur/scrollSpeed.ts` | TypeScript | Scroll speed calculation | TypeScript | ✅ Active |
| `components/effects/Blur/spring.ts` | TypeScript | Spring animation utilities | TypeScript | ✅ Active |
| `components/effects/Blur/svg.ts` | TypeScript | SVG manipulation for blur effects | TypeScript | ✅ Active |
| `components/effects/InfiniteScrollEffect.jsx` | React Component | Infinite scroll effect wrapper | React | ✅ Active |
| `components/effects/Loading/FrameEffect.js` | React Component | Frame-based loading effect | React | ✅ Active |
| `components/effects/Loading/LoadingSequence.js` | React Component | Loading sequence component | React | ✅ Active |
| `components/effects/Matrix/AuthContext.js` | React Context | Authentication context for Matrix effect | React | ✅ Active |
| `components/effects/Matrix/constants.js` | Configuration | Matrix effect constants and configuration | None | ✅ Active |
| `components/effects/Matrix/Drop.js` | React Component | Matrix rain drop component | React | ✅ Active |
| `components/effects/Matrix/FeedbackSystem.js` | React Component | User feedback system for Matrix | React | ✅ Active |
| `components/effects/Matrix/HintSystem.js` | React Component | Hint system for Matrix authentication | React | ✅ Active |
| `components/effects/Matrix/Matrix.js` | React Component | Main Matrix rain effect with authentication | React, Canvas API | ✅ Active |
| `components/effects/Matrix/matrix.scss` | Styles | Matrix effect styling | SCSS | ✅ Active |
| `components/effects/Matrix/PasscodeInput.jsx` | React Component | Passcode input for Matrix authentication | React | ✅ Active |
| `components/effects/Matrix/ScrollToTopButton.jsx` | React Component | Scroll to top button | React | ✅ Active |
| `components/effects/Matrix/useMatrixRain.js` | React Hook | Matrix rain animation hook | React | ✅ Active |
| `components/effects/Moiree/Moiree.js` | React Component | Moiré pattern effect component | React | ✅ Active |
| `components/effects/Moiree/Moiree.css` | Styles | Moiré effect styling | CSS | ✅ Active |

#### Styling System

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `sass/main.scss` | SCSS | Main stylesheet entry point | SCSS | ✅ Active |
| `sass/_animations.scss` | SCSS | Animation definitions and keyframes | SCSS | ✅ Active |
| `sass/_base.scss` | SCSS | Base styles and resets | SCSS | ✅ Active |
| `sass/_breakpoints.scss` | SCSS | Responsive breakpoint definitions | SCSS | ✅ Active |
| `sass/_css-variables.scss` | SCSS | CSS custom properties | SCSS | ✅ Active |
| `sass/_enhanced-accessibility.scss` | SCSS | Enhanced accessibility styles | SCSS | ✅ Active |
| `sass/_enhanced-advanced-effects.scss` | SCSS | Advanced visual effects | SCSS | ✅ Active |
| `sass/_enhanced-components.scss` | SCSS | Enhanced component styles | SCSS | ✅ Active |
| `sass/_enhanced-css-variables.scss` | SCSS | Enhanced CSS variables | SCSS | ✅ Active |
| `sass/_enhanced-micro-interactions.scss` | SCSS | Micro-interaction styles | SCSS | ✅ Active |
| `sass/_enhanced-navigation.scss` | SCSS | Enhanced navigation styles | SCSS | ✅ Active |
| `sass/_enhanced-tokens.scss` | SCSS | Design token definitions | SCSS | ✅ Active |
| `sass/_enhanced-typography.scss` | SCSS | Enhanced typography styles | SCSS | ✅ Active |
| `sass/_functions.scss` | SCSS | SCSS functions and utilities | SCSS | ✅ Active |
| `sass/_layout.scss` | SCSS | Layout and grid systems | SCSS | ✅ Active |
| `sass/_mixins.scss` | SCSS | SCSS mixins | SCSS | ✅ Active |
| `sass/_mixins-custom.scss` | SCSS | Custom SCSS mixins | SCSS | ✅ Active |
| `sass/_shadows.scss` | SCSS | Shadow definitions | SCSS | ✅ Active |
| `sass/_spacing.scss` | SCSS | Spacing utilities | SCSS | ✅ Active |
| `sass/_tokens.scss` | SCSS | Design tokens | SCSS | ✅ Active |
| `sass/_tooltip.scss` | SCSS | Tooltip styles | SCSS | ✅ Active |
| `sass/_typography.scss` | SCSS | Typography definitions | SCSS | ✅ Active |
| `sass/_typography-custom.scss` | SCSS | Custom typography styles | SCSS | ✅ Active |
| `sass/_utilities.scss` | SCSS | Utility classes | SCSS | ✅ Active |
| `sass/theme/_keyframes.scss` | SCSS | Theme-specific animations | SCSS | ✅ Active |
| `sass/theme/_theme-switch.scss` | SCSS | Theme switching styles | SCSS | ✅ Active |
| `sass/theme/_vignette.scss` | SCSS | Vignette effect styles | SCSS | ✅ Active |
| `sass/utilities/_index.scss` | SCSS | Utilities barrel export | SCSS | ✅ Active |
| `sass/utilities/_shadows.scss` | SCSS | Shadow utilities | SCSS | ✅ Active |
| `sass/utilities/_spacing.scss` | SCSS | Spacing utilities | SCSS | ✅ Active |
| `sass/utilities/_typography.scss` | SCSS | Typography utilities | SCSS | ✅ Active |

#### Static Assets

| File | Type | Purpose | Dependencies | Status |
|------|------|---------|--------------|--------|
| `assets/audio/didn't-say-the-magic-word.mp3` | Audio | Audio file for Matrix effect | None | ✅ Active |
| `assets/documents/cv.pdf` | Document | CV/Resume document | None | ✅ Active |
| `assets/images/bluesky.svg` | Image | Bluesky social media icon | None | ✅ Active |
| `assets/images/nu-uh-uh.webp` | Image | WebP image asset | None | ✅ Active |
| `assets/images/profile1-nbg.png` | Image | Profile image 1 (no background) | None | ✅ Active |
| `assets/images/profile2-nbg.png` | Image | Profile image 2 (no background) | None | ✅ Active |
| `assets/images/profile3-nbg.png` | Image | Profile image 3 (no background) | None | ✅ Active |
| `assets/images/profile4.png` | Image | Profile image 4 | None | ✅ Active |
| `assets/images/profile5.png` | Image | Profile image 5 | None | ✅ Active |
| `assets/images/shell.png` | Image | Shell/terminal image | None | ✅ Active |

## Analysis Tools

- **Motion Blur Analysis**: Run `./check-motion-blur.sh [commit-sha]` to analyze if a commit added motion blur functionality. See [check-motion-blur.README.md](check-motion-blur.README.md) for detailed usage.

---

## Component Documentation

### Matrix Component

A sophisticated Matrix-style authentication system with enhanced visual effects and security features. This component has been refactored to eliminate incongruencies and improve maintainability.

#### Recent Improvements

##### 🔧 **Code Quality Enhancements**
- **Consolidated Color System**: Single source of truth for all color definitions
- **Standardized Animations**: Consistent timing using CSS custom properties
- **Organized CSS**: Removed duplicate rules and improved structure
- **Consistent Z-Index Scale**: Proper layering system (1000s for overlays, 2000s for modals)
- **Extracted Constants**: All magic numbers moved to centralized constants file
- **Standardized Error Handling**: Consistent error patterns across all functions
- **Improved Cleanup**: Proper cleanup of all event listeners and animations
- **Aligned Performance Detection**: Consistent breakpoints between CSS and JavaScript

#### Features

##### 🎨 Visual Enhancements

- **Enhanced Matrix Rain Effect**: Improved character trails, better gradients, and smoother animations
- **Performance Optimized**: Frame rate limiting and efficient rendering
- **Accessibility**: ARIA labels, keyboard navigation, and high contrast support
- **Responsive Design**: Optimized for mobile and desktop devices

##### 🔐 Security Features

- **Session Management**: Secure session persistence with automatic expiration
- **Interactive Unlock Flow**: Authentication gated behind sustained input momentum
- **Progress Decay**: Idle sessions automatically roll back hack progress

##### ⌨️ User Experience

- **Keyboard Shortcuts**:
  - `ESC`: Exit Matrix
  - `ENTER`: Exit once the channel stabilizes
- **Visual Feedback**: Enhanced success animations
- **Logout Functionality**: Secure logout with session cleanup

##### 🎯 Easter Egg Activation

- **Theme Click Sequence**: Click the theme toggle 5 times within 2 seconds to activate
- **Session Persistence**: Stays unlocked for 24 hours

#### Configuration

##### Environment Variables

No authentication password environment variable is required for the Matrix console.

##### Constants File

All configuration is now centralized in `constants.js`:

```javascript
// Colors, animations, performance settings, etc.
import { MATRIX_COLORS, ANIMATION_TIMING, PERFORMANCE } from './constants';
```

##### Rate Limiting Settings

- **Max Attempts**: 5 attempts per window
- **Window Duration**: 15 minutes
- **Lockout Duration**: 30 minutes

##### Session Settings

- **Session Duration**: 24 hours
- **Storage**: Session storage (cleared on browser close)

#### Usage

##### Basic Implementation

```jsx
import Matrix from './components/effects/Matrix/Matrix';
import { AuthProvider } from './components/effects/Matrix/AuthContext';

function App() {
  const [showMatrix, setShowMatrix] = useState(false);
  
  return (
    <AuthProvider>
      <Matrix 
        isVisible={showMatrix} 
        onSuccess={() => setShowMatrix(false)} 
      />
    </AuthProvider>
  );
}
```

##### Authentication Hook

```jsx
import { useAuth } from './components/effects/Matrix/AuthContext';

function MyComponent() {
  const { isUnlocked, logout } = useAuth();

  return (
    <div>
      {isUnlocked ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <p>Authenticate through the Matrix console.</p>
      )}
    </div>
  );
}
```

#### Accessibility

- **Screen Reader Support**: Proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Enhanced visibility for accessibility
- **Reduced Motion**: Respects user motion preferences

#### Performance

- **Optimized Rendering**: 60 FPS target with frame limiting
- **Memory Management**: Proper cleanup of event listeners and animations
- **Efficient Updates**: Minimal re-renders with useCallback optimization

#### Security Considerations

- **No Password Logging**: Passwords are never logged or stored in plain text
- **Session Security**: Secure session storage with automatic expiration
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: Proper input validation and trimming

#### Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Canvas Support**: Required for Matrix rain effect
- **Session Storage**: Required for session management
- **ES6+ Features**: Required for React hooks and modern JavaScript

### Loading Sequence Variants

This directory contains different loading sequence animations for the application.

#### Available Variants

##### 1. Spiral Reveal (Default)
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant1`
- **Description**: A colorful spiral that rotates and scales to reveal the content
- **Duration**: 2 seconds
- **Style**: Smooth, elegant transition

##### 2. Particle Burst
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant2`
- **Description**: Multiple colored particles that burst outward from the center
- **Duration**: 2 seconds
- **Style**: Dynamic, energetic effect

##### 3. Wave Ripple
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant3`
- **Description**: Concentric wave ripples expanding outward
- **Duration**: 3 seconds
- **Style**: Calm, water-like effect

##### 4. Typewriter
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant4`
- **Description**: Text that types out "INITIALIZING..." with a blinking cursor
- **Duration**: 4 seconds
- **Style**: Retro, terminal-like effect

##### 5. Matrix Rain
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant5`
- **Description**: Falling green lines reminiscent of The Matrix
- **Duration**: 2.5 seconds
- **Style**: Cyberpunk, digital effect

##### 6. Glitch Effect
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant6`
- **Description**: Glitchy text with color shifts and movement
- **Duration**: 2 seconds
- **Style**: Distorted, digital glitch effect

#### Usage

The loading sequence can be controlled via the `variant` prop:

```jsx
<LoadingSequence 
  variant={1} // 1-6, default is 1
  onComplete={handleComplete}
  showMatrix={showMatrix}
  onMatrixReady={handleMatrixReady}
/>
```

#### Variant Selector

A debug component `LoadingVariantSelector` is available in development mode to easily switch between variants. It appears in the top-right corner of the screen.

#### Customization

Each variant can be customized by modifying the styled components and keyframes in `LoadingSequenceVariants.js`. The variants use:

- **Colors**: Green (#00ff88), Blue (#0088ff), Pink (#ff0088), Orange (#ff8800)
- **Timing**: Various easing functions and durations
- **Effects**: CSS animations, transforms, and transitions

#### Original Implementation

The original loading sequence used simple mask animations and is preserved in `LoadingSequence.js` for reference.